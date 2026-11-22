"use strict";
const historyValues = [0.94618, 0.94679, 0.94663, 0.94675, 0.94376, 0.94629, 0.94805, 0.94847, 0.94833, 0.94856];
const table = document.getElementById("score-table");
for (const [index, value] of historyValues.entries()) {
  const row = table.insertRow();
  row.insertCell().textContent = index + 1;
  row.insertCell().textContent = value.toFixed(5);
}
const canvas = document.getElementById("score-chart");
function drawScores() {
  const width = canvas.clientWidth;
  const height = 220;
  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.round(width * ratio);
  canvas.height = height * ratio;
  const ctx = canvas.getContext("2d");
  ctx.scale(ratio, ratio);
  const left = 46, right = width - 20, top = 18, bottom = height - 35;
  const x = i => left + (right - left) * i / 9;
  const y = v => bottom - (bottom - top) * (v - .943) / .006;
  ctx.font = "12px system-ui";
  ctx.fillStyle = "#54646b";
  ctx.strokeStyle = "#dce4e4";
  for (const tick of [.943, .945, .947, .949]) {
    ctx.fillText(tick.toFixed(3), 0, y(tick) + 4);
    ctx.beginPath();
    ctx.moveTo(left, y(tick));
    ctx.lineTo(right, y(tick));
    ctx.stroke();
  }
  for (const i of [0, 2, 4, 6, 9]) ctx.fillText(String(i + 1), x(i) - 5, bottom + 22);
  ctx.strokeStyle = "#126b64";
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  historyValues.forEach((v, i) => i ? ctx.lineTo(x(i), y(v)) : ctx.moveTo(x(i), y(v)));
  ctx.stroke();
  historyValues.forEach((v, i) => {
    ctx.fillStyle = i === 9 ? "#126b64" : "#fff";
    ctx.beginPath();
    ctx.arc(x(i), y(v), i === 9 ? 5 : 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  });
}
new ResizeObserver(drawScores).observe(canvas);
