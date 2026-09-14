import requests

IMAGE_PATH = "final_explainability_demo.png"

url = "http://127.0.0.1:5000/predict"

with open(IMAGE_PATH, "rb") as image:
    response = requests.post(
        url,
        files={"image": image}
    )

print("Status Code:", response.status_code)
print("Prediction:")
print(response.json())