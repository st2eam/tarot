"use client";

import { useEffect, useRef } from "react";
import { useTarotStore } from "@/store/useTarotStore";
import { getCardStyle } from "@/lib/themes";

interface Particle {
  x: number;
  y: number;
  r: number;
  opacity: number;
  speed: number;
  vx: number;
  vy: number;
  angle?: number;
  angleSpeed?: number;
  color?: string;
}

interface Nebula {
  x: number;
  y: number;
  r: number;
  opacity: number;
  vx: number;
  vy: number;
  color?: string;
}

interface ShootingStar {
  x: number;
  y: number;
  angle: number;
  length: number;
  speed: number;
  opacity: number;
  life: number;
}

export default function MysticalBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { cardStyle } = useTarotStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const style = getCardStyle(cardStyle);
    const { theme } = style;
    let animationId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const starColor = theme.starColor;
    const starColorAlt = theme.starColorAlt;
    const effect = theme.canvasEffect;

    const particles: Particle[] = [];
    const nebulae: Nebula[] = [];
    const shootingStars: ShootingStar[] = [];
    let shootingStarCounter = 0;

    if (effect === "stars" || effect === "sparkle") {
      const nebulaCount = 2 + Math.floor(Math.random() * 2);
      for (let i = 0; i < nebulaCount; i++) {
        nebulae.push({
          x: Math.random() * (canvas.width || 1200),
          y: Math.random() * (canvas.height || 800),
          r: Math.random() * 100 + 100,
          opacity: Math.random() * 0.03 + 0.03,
          vx: (Math.random() * 0.03 + 0.02) * (Math.random() > 0.5 ? 1 : -1),
          vy: (Math.random() * 0.03 + 0.02) * (Math.random() > 0.5 ? 1 : -1),
          color: Math.random() > 0.5 ? "alt" : "main",
        });
      }
    }

    if (effect === "stars" || effect === "sparkle" || effect === "particles") {
      const count = effect === "particles" ? 80 : 120;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * (canvas.width || 1200),
          y: Math.random() * (canvas.height || 800),
          r: Math.random() * 1.5 + 0.3,
          opacity: Math.random() * 0.8 + 0.2,
          speed: Math.random() * 0.003 + 0.001,
          vx: (Math.random() - 0.5) * 0.1,
          vy: (Math.random() - 0.5) * 0.1,
          color: Math.random() > 0.6 ? "alt" : "main",
        });
      }
    } else if (effect === "sakura") {
      for (let i = 0; i < 60; i++) {
        particles.push({
          x: Math.random() * (canvas.width || 1200),
          y: Math.random() * (canvas.height || 800),
          r: Math.random() * 3 + 1,
          opacity: Math.random() * 0.6 + 0.2,
          speed: Math.random() * 0.4 + 0.15,
          vx: (Math.random() - 0.3) * 0.6,
          vy: Math.random() * 0.5 + 0.2,
          angle: Math.random() * Math.PI * 2,
          angleSpeed: (Math.random() - 0.5) * 0.02,
          color: Math.random() > 0.5 ? "alt" : "main",
        });
      }
    } else if (effect === "mist") {
      for (let i = 0; i < 40; i++) {
        particles.push({
          x: Math.random() * (canvas.width || 1200),
          y: Math.random() * (canvas.height || 800),
          r: Math.random() * 80 + 30,
          opacity: Math.random() * 0.06 + 0.02,
          speed: Math.random() * 0.002 + 0.0005,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.08,
          color: Math.random() > 0.5 ? "alt" : "main",
        });
      }
      // Also add tiny stars
      for (let i = 0; i < 80; i++) {
        particles.push({
          x: Math.random() * (canvas.width || 1200),
          y: Math.random() * (canvas.height || 800),
          r: Math.random() * 1 + 0.2,
          opacity: Math.random() * 0.5 + 0.1,
          speed: Math.random() * 0.003 + 0.001,
          vx: 0,
          vy: 0,
          color: "star",
        });
      }
    } else if (effect === "glitch") {
      for (let i = 0; i < 100; i++) {
        particles.push({
          x: Math.random() * (canvas.width || 1200),
          y: Math.random() * (canvas.height || 800),
          r: Math.random() * 1.5 + 0.2,
          opacity: Math.random() * 0.9 + 0.1,
          speed: Math.random() * 0.005 + 0.002,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.15,
          color: Math.random() > 0.5 ? "alt" : "main",
        });
      }
    }

    let glitchTimer = 0;
    let glitchActive = false;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const w = canvas.width;
      const h = canvas.height;

      if (effect === "glitch") {
        glitchTimer++;
        if (glitchTimer % 180 === 0) {
          glitchActive = true;
          setTimeout(() => { glitchActive = false; }, 80);
        }

        if (glitchActive) {
          const sliceH = Math.floor(Math.random() * 4) + 1;
          const sliceY = Math.floor(Math.random() * h);
          const offset = (Math.random() - 0.5) * 20;
          const imageData = ctx.getImageData(0, sliceY, w, sliceH);
          ctx.putImageData(imageData, offset, sliceY);
        }
      }

      if (effect === "stars" || effect === "sparkle") {
        for (const n of nebulae) {
          const colorBase = n.color === "alt" ? starColorAlt : starColor;
          const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);
          grad.addColorStop(0, `${colorBase}${n.opacity})`);
          grad.addColorStop(1, `${colorBase}0)`);
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();

          n.x += n.vx;
          n.y += n.vy;
          if (n.x < -n.r) n.x = w + n.r;
          if (n.x > w + n.r) n.x = -n.r;
          if (n.y < -n.r) n.y = h + n.r;
          if (n.y > h + n.r) n.y = -n.r;
        }
      }

      for (const p of particles) {
        const colorBase = p.color === "alt" ? starColorAlt : p.color === "star" ? "rgba(180,180,200," : starColor;

        if (effect === "mist" && p.r > 5) {
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
          grad.addColorStop(0, `${colorBase}${p.opacity})`);
          grad.addColorStop(1, `${colorBase}0)`);
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
        } else if (effect === "sakura" && p.r > 1.5) {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.angle ?? 0);
          ctx.beginPath();
          const pr = p.r;
          ctx.ellipse(0, 0, pr, pr * 0.6, 0, 0, Math.PI * 2);
          ctx.fillStyle = `${colorBase}${p.opacity})`;
          ctx.fill();
          ctx.restore();
          p.angle = (p.angle ?? 0) + (p.angleSpeed ?? 0);
        } else if (effect === "sparkle" && Math.random() > 0.996) {
          // Occasional sparkle burst
          ctx.beginPath();
          for (let s = 0; s < 4; s++) {
            const angle = (s / 4) * Math.PI * 2;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x + Math.cos(angle) * p.r * 4, p.y + Math.sin(angle) * p.r * 4);
          }
          ctx.strokeStyle = `${colorBase}${p.opacity * 0.8})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `${colorBase}${p.opacity})`;
          ctx.fill();
        }

        // Update
        p.opacity += p.speed;
        if (p.opacity > 0.9 || p.opacity < 0.1) p.speed *= -1;
        if (effect !== "stars") {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < -50) p.x = w + 50;
          if (p.x > w + 50) p.x = -50;
          if (p.y < -50) p.y = h + 50;
          if (p.y > h + 50) p.y = -50;
          if (effect === "sakura" && p.vy !== 0) {
            p.y += p.vy;
            p.x += p.vx;
            if (p.y > h + 20) {
              p.y = -20;
              p.x = Math.random() * w;
            }
          }
        }
      }

      if (effect === "stars") {
        shootingStarCounter++;
        if (shootingStarCounter >= 600) {
          shootingStarCounter = 0;
          shootingStars.push({
            x: Math.random() * w,
            y: Math.random() * h * 0.5,
            angle: Math.PI / 4 + (Math.random() - 0.5) * 0.4,
            length: Math.random() * 40 + 60,
            speed: Math.random() * 2 + 3,
            opacity: 0.7,
            life: 1.0,
          });
        }

        for (let i = shootingStars.length - 1; i >= 0; i--) {
          const s = shootingStars[i];
          const endX = s.x + Math.cos(s.angle) * s.length;
          const endY = s.y + Math.sin(s.angle) * s.length;
          const gradient = ctx.createLinearGradient(s.x, s.y, endX, endY);
          gradient.addColorStop(0, `${starColor}${s.opacity})`);
          gradient.addColorStop(1, `${starColor}0)`);
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(endX, endY);
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 1.5;
          ctx.stroke();

          s.x += Math.cos(s.angle) * s.speed;
          s.y += Math.sin(s.angle) * s.speed;
          s.opacity -= 0.02;
          s.life -= 0.02;

          if (s.life <= 0 || s.opacity <= 0) {
            shootingStars.splice(i, 1);
          }
        }
      }

      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, [cardStyle]);

  const style = getCardStyle(cardStyle);
  const t = style.theme;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10"
      style={{
        background: `linear-gradient(to bottom, ${t.bgPrimary}, ${t.bgGradientVia}, ${t.bgGradientTo})`,
      }}
      aria-hidden="true"
    />
  );
}
