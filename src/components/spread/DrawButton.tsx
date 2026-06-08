"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface Props {
  onDraw: () => void;
  disabled?: boolean;
  drawn?: boolean;
}

export default function DrawButton({ onDraw, disabled, drawn }: Props) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      onClick={onDraw}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.03 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative px-8 py-3.5 rounded-2xl font-semibold text-base transition-all duration-300"
      style={
        disabled
          ? { background: "rgba(40,40,40,0.8)", color: "var(--theme-text-muted)", cursor: "not-allowed" }
          : {
              background: `linear-gradient(135deg, var(--theme-accent), color-mix(in srgb, var(--theme-accent) 70%, var(--theme-accent-secondary)))`,
              color: "#fff",
              boxShadow: `0 4px 20px var(--theme-glow)`,
            }
      }
    >
      {/* Glow effect */}
      {!disabled && isHovered && (
        <motion.div
          layoutId="btn-glow"
          className="absolute inset-0 rounded-2xl blur-xl -z-10"
          style={{ background: "var(--theme-glow)" }}
          transition={{ duration: 0.3 }}
        />
      )}

      <span className="flex items-center gap-2">
        <Sparkles className="h-4 w-4" />
        {drawn ? "重新抽牌" : "抽取牌"}
      </span>
    </motion.button>
  );
}
