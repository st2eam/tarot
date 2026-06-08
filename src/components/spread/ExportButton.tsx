"use client";

import { useCallback, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import { Download, FileImage, FileText, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  exportRef: React.RefObject<HTMLDivElement | null>;
  disabled?: boolean;
}

export default function ExportButton({ exportRef, disabled }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<"png" | "pdf" | null>(null);

  const captureElement = useCallback(async () => {
    const el = exportRef.current;
    if (!el) throw new Error("No element");

    // Save original styles and make visible for capture
    const prev = {
      opacity: el.style.opacity,
      zIndex: el.style.zIndex,
      pointerEvents: el.style.pointerEvents,
    };

    el.style.opacity = "1";
    el.style.zIndex = "99999";
    el.style.pointerEvents = "none";

    // Wait for browser to render
    await new Promise((r) => requestAnimationFrame(r));
    await new Promise((r) => setTimeout(r, 100));

    try {
      const dataUrl = await toPng(el, {
        backgroundColor: "#0a0012",
        pixelRatio: 2,
        cacheBust: true,
      });
      return dataUrl;
    } finally {
      // Restore original styles
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
      await new Promise<void>((resolve) => {
        img.onload = () => resolve();
      });

      const maxWidth = 210;
      const maxHeight = 297;
      const imgRatio = img.width / img.height;
      let w = maxWidth;
      let h = maxWidth / imgRatio;
      if (h > maxHeight) {
        h = maxHeight;
        w = maxHeight * imgRatio;
      }

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
