# Simulator model

The simulator uses a logistic regression trained on 16,000 generated transactions. A fixed-seed, stratified split assigns 12,000 examples to training and 4,000 to the holdout set. The holdout ROC-AUC is **0.759** and average precision is **0.045**. These results describe how the model ranks generated examples. [Exported parameters and metrics](demo-model.json)

## Reading a score

The model standardizes each input with its saved training mean and scale, multiplies it by its coefficient, and adds it to the intercept. A sigmoid maps the resulting log-odds to a probability. The four largest absolute contributions appear beside the score. A positive contribution raises the log-odds relative to the training mean and a negative contribution lowers them. Each bar shows the contribution’s magnitude relative to the largest contribution for that transaction.

The routine preset scores **0.09%** and the unusual preset scores **74.32%** with the current export. These are example outputs for the simulator. Use fictional inputs and treat the results as an explanation of model behavior.

## Scope

The generator defines relationships between transaction inputs and synthetic labels. The model’s holdout scores and example probabilities therefore apply to that generated data. Evaluating a model for use in payment decisions would require representative data, calibration, and an independently measured operating threshold. The site displays the LightGBM competition results separately from the simulator. [Kaggle experiment results](https://aqillz.github.io/fraud-risk-lab/#results)
