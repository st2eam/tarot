"use client";

import { useCallback, useState } from "react";
import { Download, FileImage, FileText, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  exportRef: React.RefObject<HTMLDivElement | null>;
  disabled?: boolean;
}

/** Convert all <img> elements inside a container to inline base64 data URLs.
 *  Returns a restore function to revert to original srcs. */
async function embedImagesAsBase64(el: HTMLElement): Promise<() => void> {
  const imgs = Array.from(el.querySelectorAll<HTMLImageElement>("img"));
  const restores: Array<() => void> = [];

  await Promise.all(
    imgs.map(async (img) => {
      const originalSrc = img.getAttribute("src") ?? "";
      if (!originalSrc || originalSrc.startsWith("data:")) return;

      try {
        // Fetch image via the browser (same-origin or CORS-allowed)
        const res = await fetch(originalSrc, { cache: "force-cache" });
        if (!res.ok) return;
        const blob = await res.blob();

        await new Promise<void>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            if (typeof reader.result === "string") {
              img.src = reader.result;
              restores.push(() => {
                img.src = originalSrc;
              });
            }
            resolve();
          };
          reader.onerror = () => resolve();
          reader.readAsDataURL(blob);
        });
      } catch {
        // Image can't be embedded (CORS etc.) — skip silently
      }
    })
  );

  return () => restores.forEach((fn) => fn());
}

/** Wait for all <img> elements in a container to finish loading. */
function waitForImages(el: HTMLElement): Promise<void> {
  const imgs = Array.from(el.querySelectorAll<HTMLImageElement>("img"));
  return Promise.all(
    imgs.map(
      (img) =>
        img.complete
          ? Promise.resolve()
          : new Promise<void>((resolve) => {
              img.onload = () => resolve();
              img.onerror = () => resolve();
            })
    )
  ).then(() => undefined);
}

export default function ExportButton({ exportRef, disabled }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<"png" | "pdf" | null>(null);

  const captureElement = useCallback(async () => {
    const el = exportRef.current;
    if (!el) throw new Error("No element");

    // Make element visible for capture
    const prev = {
      opacity: el.style.opacity,
      zIndex: el.style.zIndex,
      pointerEvents: el.style.pointerEvents,
    };
    el.style.opacity = "1";
    el.style.zIndex = "99999";
    el.style.pointerEvents = "none";

    try {
      // Wait for images to finish loading, then embed as base64
      await waitForImages(el);
      const restore = await embedImagesAsBase64(el);

      // Give browser a frame to settle
      await new Promise((r) => requestAnimationFrame(r));
      await new Promise((r) => setTimeout(r, 80));

      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(el, {
        backgroundColor: "#0a0012",
        pixelRatio: 2,
      });

      restore();
      return dataUrl;
    } finally {
      el.style.opacity = prev.opacity;
      el.style.zIndex = prev.zIndex;
      el.style.pointerEvents = prev.pointerEvents;
    }
  }, [exportRef]);

  const handleExportPNG = useCallback(async () => {
    setLoading("png");
    try {
      const dataUrl = await captureElement();
      const link = document.createElement("a");
      link.download = `tarot-reading-${new Date().toISOString().slice(0, 10)}.png`;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error("PNG export failed:", e);
    } finally {
      setLoading(null);
      setOpen(false);
    }
  }, [captureElement]);

  const handleExportPDF = useCallback(async () => {
    setLoading("pdf");
    try {
      const dataUrl = await captureElement();

      const img = new Image();
      img.src = dataUrl;
      await new Promise<void>((resolve) => { img.onload = () => resolve(); });

      const maxWidth = 210;
      const maxHeight = 297;
      const imgRatio = img.width / img.height;
      let w = maxWidth;
      let h = maxWidth / imgRatio;
      if (h > maxHeight) { h = maxHeight; w = maxHeight * imgRatio; }

      const { jsPDF } = await import("jspdf");
      const pdf = new jsPDF("p", "mm", "a4");
      pdf.addImage(img, "PNG", (maxWidth - w) / 2, 10, w, h);
      pdf.save(`tarot-reading-${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (e) {
      console.error("PDF export failed:", e);
    } finally {
      setLoading(null);
      setOpen(false);
    }
  }, [captureElement]);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        disabled={disabled || loading !== null}
        className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold text-sm transition-all duration-300 ${
          disabled
            ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
            : "bg-zinc-800/80 text-zinc-200 hover:bg-zinc-700 border border-zinc-700/50 hover:border-zinc-600"
        }`}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
        导出
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            className="absolute right-0 mt-2 w-44 bg-zinc-800 border border-zinc-700 rounded-xl shadow-xl overflow-hidden z-50"
          >
            <button
              onClick={handleExportPNG}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-zinc-200 hover:bg-zinc-700 transition-colors"
            >
              <FileImage className="h-4 w-4 text-purple-400" />
              导出为 PNG
            </button>
            <button
              onClick={handleExportPDF}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-zinc-200 hover:bg-zinc-700 transition-colors border-t border-zinc-700/50"
            >
              <FileText className="h-4 w-4 text-purple-400" />
              导出为 PDF
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
