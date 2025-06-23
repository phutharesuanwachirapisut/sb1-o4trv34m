# ml/forecast.py
import numpy as np
import pickle

# โหลดโมเดลที่เทรนไว้
with open("ml/model.pkl", "rb") as f:
    model = pickle.load(f)

def predict_from_input(data):
    X = np.array(data)  # สมมติ input เป็น list of list [[x1, x2, ...], ...]
    y_pred = model.predict(X)
    return y_pred.tolist()
  