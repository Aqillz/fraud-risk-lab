# Fraud Risk Lab

An interactive simulator for scoring fictional card transactions, alongside the results of Danial Aqil’s Kaggle credit card fraud experiment. Choose **Routine purchase** or **Unusual activity**, or edit the inputs and select **Score transaction**. Each result shows the estimated fraud probability and the four inputs with the largest effects on that score. [Try the live simulator](https://aqillz.github.io/fraud-risk-lab/)

## Models and results

| Evaluation | ROC-AUC |
| --- | ---: |
| LightGBM best recorded Kaggle public leaderboard score, submission 10 | **0.94856** |
| LightGBM archived mean across three validation folds | 0.946537 |
| Synthetic browser model on generated holdout examples | 0.759 |

The website reports ten recorded Kaggle submissions. The interactive score comes from a separate logistic regression trained on generated examples. Scoring runs in the browser and entered values stay there. [Kaggle competition](https://www.kaggle.com/competitions/playground-series-s6e11) · [Model notes and limitations](MODEL.md)

## Run locally

Clone this repository and use Python 3 to serve it. The JSON model loads over HTTP, so open the local URL after starting the server.

```bash
git clone https://github.com/Aqillz/fraud-risk-lab.git
cd fraud-risk-lab
python -m http.server 8000 --bind 127.0.0.1
```

Open `http://127.0.0.1:8000`. A modern browser with JavaScript is sufficient for scoring.

## Files and deployment

| File | Purpose |
| --- | --- |
| [`index.html`](index.html) | Simulator, competition results, and accessible submission table |
| [`style.css`](style.css) | Responsive layout and styles |
| [`app.js`](app.js) | Form validation, presets, scoring, and contribution display |
| [`results.js`](results.js) | Chart drawn from the submission table |
| [`demo-model.json`](demo-model.json) | Synthetic model parameters and holdout metrics |
| [`.nojekyll`](.nojekyll) | Serves the assets directly through GitHub Pages |

GitHub Pages publishes the repository root from `main`. After updating the site, confirm that the deployment succeeds, both presets score, and all ten results appear in the table. [GitHub Pages deployment history](https://github.com/Aqillz/fraud-risk-lab/deployments)
