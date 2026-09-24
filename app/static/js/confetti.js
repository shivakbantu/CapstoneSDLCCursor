/**
 * Small vanilla confetti helper (canvas particles) — no npm dependency.
 */
(function (global) {
  "use strict";

  function burst(canvas, durationMs) {
    if (!canvas || !canvas.getContext) return;
    const ctx = canvas.getContext("2d");
    const parent = canvas.parentElement;
    const w = (canvas.width = parent ? parent.clientWidth : 400);
    const h = (canvas.height = parent ? parent.clientHeight : 300);
    const colors = ["#0d7377", "#085a5d", "#f59e0b", "#047857", "#38bdf8", "#e11d48"];
    const particles = [];
    const count = 80;

    for (let i = 0; i < count; i += 1) {
      particles.push({
        x: w * 0.5,
        y: h * 0.25,
        vx: (Math.random() - 0.5) * 10,
        vy: Math.random() * -8 - 2,
        g: 0.18 + Math.random() * 0.08,
        size: 4 + Math.random() * 5,
        color: colors[i % colors.length],
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.3,
      });
    }

    const start = performance.now();

    function frame(now) {
      const elapsed = now - start;
      ctx.clearRect(0, 0, w, h);
      particles.forEach(function (p) {
        p.vy += p.g;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      });
      if (elapsed < (durationMs || 2200)) {
        requestAnimationFrame(frame);
      } else {
        ctx.clearRect(0, 0, w, h);
      }
    }

    requestAnimationFrame(frame);
  }

  global.Confetti = { burst: burst };
})(window);
