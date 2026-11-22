"use strict";
const fields = [
  ["amount_usd", "Amount (USD)", 0.01, 0.01],
  ["time_of_day_hour", "Hour of day (0–23)", 1, 0, 23],
  ["distance_from_home_km", "Distance from home (km)", 0.01, 0],
  ["txn_count_last_24h", "Transactions in 24 hours", 1, 0],
  ["hours_since_last_txn", "Hours since last transaction", 0.01, 0],
  ["cvv_retry_count", "CVV retries", 1, 0],
  ["used_vpn", "VPN used"],
  ["ip_country_mismatch", "IP country mismatch"],
  ["is_foreign_transaction", "Foreign transaction"],
];
const presets = {
  routine: [42.50, 14, 8, 3, 5, 0, 0, 0, 0],
  unusual: [690, 2, 150, 13, 0.1, 3, 1, 1, 1],
};
const byId = (id) => document.getElementById(id);

function validateModel(candidate) {
  const size = fields.length;
  const vectors = ["mean", "fill", "scale", "coefficients"];
  if (candidate?.version !== 1 || !Array.isArray(candidate.features) ||
      candidate.features.length !== size ||
      !fields.every(([name], i) => name === candidate.features[i]) ||
      !Number.isFinite(candidate.intercept) ||
      !vectors.every((key) => Array.isArray(candidate[key]) &&
        candidate[key].length === size && candidate[key].every(Number.isFinite)) ||
      candidate.scale.some((scale) => scale <= 0)) {
    throw new Error("Choose a compatible browser-model.json export.");
  }
  return candidate;
}

function predict(model, values) {
  const contributions = values.map((value, i) =>
    model.coefficients[i] * (((value ?? model.fill[i]) - model.mean[i]) / model.scale[i]));
  const logit = contributions.reduce((total, value) => total + value, model.intercept);
  if (!Number.isFinite(logit)) throw new Error("The entered values exceed the model’s numeric range.");
  return { probability: 1 / (1 + Math.exp(-logit)), contributions };
}

if (typeof module !== "undefined") module.exports = { predict, validateModel, presets };

if (typeof document !== "undefined") {
  let activeModel;
  const form = byId("transaction");

  for (const [name, title, step, min, max] of fields) {
    const label = document.createElement("label");
    label.textContent = title;
    const input = document.createElement(step == null ? "select" : "input");
    input.id = name;
    if (step == null) {
      input.add(new Option("No", "0"));
      input.add(new Option("Yes", "1"));
    } else {
      input.type = "number";
      input.required = true;
      input.step = step;
      input.min = min;
      if (max != null) input.max = max;
    }
    label.append(input);
    byId("fields").append(label);
  }

  function render() {
    if (!activeModel || !form.reportValidity()) return;
    try {
      const values = fields.map(([name]) => Number(byId(name).value));
      const { probability, contributions } = predict(activeModel, values);
      byId("score").textContent = probability.toLocaleString(undefined, {
        style: "percent", maximumFractionDigits: 2,
      });
      byId("meter").value = probability;
      byId("summary").textContent = "Estimated fraud probability for this example.";
      const items = contributions.map((value, i) => ({ value, label: fields[i][1] }))
        .sort((a, b) => Math.abs(b.value) - Math.abs(a.value)).slice(0, 4);
      byId("contributions").replaceChildren(...items.map(({ value, label }) => {
        const row = document.createElement("li");
        const delta = document.createElement("span");
        delta.className = "delta";
        delta.textContent = ` ${value >= 0 ? "+" : ""}${value.toFixed(2)}`;
        row.append(label, delta);
        return row;
      }));
    } catch (error) {
      byId("score").textContent = "—";
      byId("meter").value = 0;
      byId("summary").textContent = error.message;
      byId("contributions").replaceChildren();
    }
  }

  function useModel(model, label) {
    activeModel = model;
    byId("source").textContent = label;
    const result = model.metrics;
    const valid = (v) => Number.isFinite(v) && v >= 0 && v <= 1;
    byId("metrics").textContent = valid(result?.roc_auc) && valid(result?.average_precision)
      ? `Holdout ROC-AUC ${result.roc_auc.toFixed(3)} · Average precision ${result.average_precision.toFixed(3)}`
      : "Holdout metrics unavailable for this export.";
    byId("submit").disabled = false;
    render();
  }

  function setPreset(name) {
    fields.forEach(([field], i) => { byId(field).value = presets[name][i]; });
    render();
  }
  for (const button of document.querySelectorAll("[data-preset]")) {
    button.addEventListener("click", () => setPreset(button.dataset.preset));
  }
  form.addEventListener("submit", (event) => { event.preventDefault(); render(); });
  setPreset("routine");
  fetch("demo-model.json").then((response) => {
    if (!response.ok) throw new Error("Cannot load model.");
    return response.json();
  }).then((candidate) => {
    const model = validateModel(candidate);
    useModel(model, model.source);
  }).catch(() => {
    if (!activeModel) byId("source").textContent = "Demo model unavailable. Try refreshing the page.";
  });
}
