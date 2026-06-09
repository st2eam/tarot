"use client";

import { useCallback, useState } from "react";
import { Download, FileImage, FileText, Loader2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  exportRef: React.RefObject<HTMLDivElement | null>;
  disabled?: boolean;
}

async function embedImagesAsBase64(el: HTMLElement): Promise<() => void> {
  const imgs = Array.from(el.querySelectorAll<HTMLImageElement>("img"));
  const restores: Array<() => void> = [];

  await Promise.all(
    imgs.map(async (img) => {
      const originalSrc = img.getAttribute("src") ?? "";
      if (!originalSrc || originalSrc.startsWith("data:")) return;

      try {
        const res = await fetch(originalSrc, { cache: "force-cache" });
        if (!res.ok) return;
        const blob = await res.blob();

        await new Promise<void>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            if (typeof reader.result === "string") {
              img.src = reader.result;
              restores.push(() => { img.src = originalSrc; });
            }
            resolve();
          };
          reader.onerror = () => resolve();
          reader.readAsDataURL(blob);
        });
      } catch {
        // skip silently
      }
    })
  );

  return () => restores.forEach((fn) => fn());
}

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
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<"png" | "pdf" | null>(null);

  const captureElement = useCallback(async () => {
    const el = exportRef.current;
    if (!el) throw new Error("No element");

    const prev = {
      opacity: el.style.opacity,
      zIndex: el.style.zIndex,
      pointerEvents: el.style.pointerEvents,
    };
    el.style.opacity = "1";
    el.style.zIndex = "99999";
    el.style.pointerEvents = "none";

    try {
      await waitForImages(el);
      const restore = await embedImagesAsBase64(el);

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

  const handlePreviewPNG = useCallback(async () => {
    setLoading(true);
    setOpen(false);
    try {
      const dataUrl = await captureElement();
      setPreviewUrl(dataUrl);
      setPreviewMode("png");
    } catch (e) {
      console.error("Preview failed:", e);
    } finally {
      setLoading(false);
    }
  }, [captureElement]);

  const handlePreviewPDF = useCallback(async () => {
    setLoading(true);
    setOpen(false);
    try {
      const dataUrl = await captureElement();
      setPreviewUrl(dataUrl);
      setPreviewMode("pdf");
    } catch (e) {
      console.error("Preview failed:", e);
    } finally {
      setLoading(false);
    }
  }, [captureElement]);

  const handleDownload = useCallback(async () => {
    if (!previewUrl) return;

    if (previewMode === "png") {
      const link = document.createElement("a");
      link.download = `tarot-reading-${new Date().toISOString().slice(0, 10)}.png`;
      link.href = previewUrl;
      link.click();
    } else {
      const { jsPDF } = await import("jspdf");
      const img = new Image();
      img.src = previewUrl;
      await new Promise<void>((resolve) => { img.onload = () => resolve(); });

      const maxWidth = 210;
      const maxHeight = 297;
      const imgRatio = img.width / img.height;
      let w = maxWidth;
      let h = maxWidth / imgRatio;
      if (h > maxHeight) { h = maxHeight; w = maxHeight * imgRatio; }

      const pdf = new jsPDF("p", "mm", "a4");
      pdf.addImage(img, "PNG", (maxWidth - w) / 2, 10, w, h);
      pdf.save(`tarot-reading-${new Date().toISOString().slice(0, 10)}.pdf`);
    }

    setPreviewUrl(null);
    setPreviewMode(null);
  }, [previewUrl, previewMode]);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        disabled={disabled || loading}
        className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold text-sm transition-all duration-300 ${
          disabled
            ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
            : "bg-zinc-800/80 text-zinc-200 hover:bg-zinc-700 border border-zinc-700/50 hover:border-zinc-600"
        }`}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Download className="h-4 w-4" />
        )}
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
              onClick={handlePreviewPNG}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-zinc-200 hover:bg-zinc-700 transition-colors"
            >
              <FileImage className="h-4 w-4 text-purple-400" />
              预览并导出 PNG
            </button>
            <button
              onClick={handlePreviewPDF}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-zinc-200 hover:bg-zinc-700 transition-colors border-t border-zinc-700/50"
            >
              <FileText className="h-4 w-4 text-purple-400" />
              预览并导出 PDF
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview modal */}
      <AnimatePresence>
        {previewUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex flex-col items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
          >
            <div className="w-full max-w-lg max-h-[85vh] flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-zinc-300">
                  导出预览 — {previewMode === "png" ? "PNG" : "PDF"}
                </h3>
                <button
                  onClick={() => { setPreviewUrl(null); setPreviewMode(null); }}
                  className="p-1.5 rounded-full hover:bg-zinc-700 text-zinc-400"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-auto rounded-xl border border-zinc-700 bg-zinc-900">
                <img
                  src={previewUrl}
                  alt="导出预览"
                  className="w-full"
                  style={{ imageRendering: "auto" }}
                />
              </div>
              <button
                onClick={handleDownload}
                className="mt-4 w-full flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-semibold text-white transition-all hover:brightness-110"
                style={{
                  background: "linear-gradient(135deg, var(--theme-accent), var(--theme-accent-secondary))",
                }}
              >
                <Download className="h-4 w-4" />
                下载{previewMode === "png" ? "PNG" : "PDF"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
