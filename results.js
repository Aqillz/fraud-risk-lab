"use strict";

const historyValues = Array.from(document.querySelectorAll("#score-table td"),
  (cell) => Number(cell.textContent));
const last = historyValues.length - 1;
const canvas = document.getElementById("score-chart");

function drawScores() {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.round(width * ratio);
  canvas.height = Math.round(height * ratio);
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.scale(ratio, ratio);

  const style = getComputedStyle(canvas);
  const color = (name) => style.getPropertyValue(name).trim();
  const left = 47, right = width - 15, top = 14, bottom = height - 25;
  const x = (i) => left + (right - left) * i / last;
  const y = (v) => bottom - (bottom - top) * (v - .943) / .006;

  ctx.font = `11px ${color("--mono")}`;
  ctx.fillStyle = color("--muted");
  ctx.strokeStyle = color("--line");
  for (const tick of [.943, .945, .947, .949]) {
    ctx.fillText(tick.toFixed(3), 0, y(tick) + 3);
    ctx.beginPath();
    ctx.moveTo(left, y(tick));
    ctx.lineTo(right, y(tick));
    ctx.stroke();
  }
  ctx.textAlign = "center";
  for (const i of [0, 2, 4, 6, last]) ctx.fillText(String(i + 1), x(i), bottom + 18);

  ctx.strokeStyle = color("--ink");
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x(0), y(historyValues[0]));
  for (let i = 1; i <= last; i += 1) ctx.lineTo(x(i), y(historyValues[i]));
  ctx.stroke();

  historyValues.forEach((value, i) => {
    const final = i === last;
    ctx.strokeStyle = color(final ? "--accent" : "--ink");
    ctx.fillStyle = color(final ? "--accent" : "--paper");
    ctx.beginPath();
    ctx.arc(x(i), y(value), final ? 5 : 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  });
}

new ResizeObserver(drawScores).observe(canvas);
