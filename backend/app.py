
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image, ImageEnhance
import torch
import torch.nn.functional as F
import torchvision.transforms as transforms
import io
import base64

from model import model, device


app = Flask(__name__)
CORS(app)


# =====================================================
# IMAGE TRANSFORM
# =====================================================

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])


# =====================================================
# HOME
# =====================================================

@app.route("/")
def home():
    return jsonify({
        "status": "success",
        "message": "RetinaAI backend is running!"
    })


# =====================================================
# IMAGE ENHANCEMENT
# =====================================================

@app.route("/enhance", methods=["POST"])
def enhance():

    if "image" not in request.files:
        return jsonify({
            "success": False,
            "error": "No image uploaded"
        }), 400

    file = request.files["image"]

    try:

        image = Image.open(file).convert("RGB")

        # Improve contrast
        image = ImageEnhance.Contrast(
            image
        ).enhance(1.35)

        # Slightly improve color
        image = ImageEnhance.Color(
            image
        ).enhance(1.10)

        # Improve sharpness
        image = ImageEnhance.Sharpness(
            image
        ).enhance(1.50)

        # Convert to JPEG
        buffer = io.BytesIO()

        image.save(
            buffer,
            format="JPEG",
            quality=95
        )

        # Convert to Base64
        encoded_image = base64.b64encode(
            buffer.getvalue()
        ).decode("utf-8")

        return jsonify({
            "success": True,
            "image": encoded_image
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


# =====================================================
# PREDICTION
# =====================================================

@app.route("/predict", methods=["POST"])
def predict():

    if "image" not in request.files:
        return jsonify({
            "error": "No image uploaded"
        }), 400

    file = request.files["image"]

    try:

        image = Image.open(
            file
        ).convert("RGB")

        image_tensor = transform(image)

        image_tensor = image_tensor.unsqueeze(0)

        image_tensor = image_tensor.to(device)

        with torch.no_grad():

            output = model(image_tensor)

            probabilities = F.softmax(
                output,
                dim=1
            )

        probabilities = probabilities[0]

        predicted_grade = torch.argmax(
            probabilities
        ).item()

        confidence = probabilities[
            predicted_grade
        ].item()

        # Grade 2 + Grade 3 + Grade 4
        referable_probability = probabilities[
            2:
        ].sum().item()

        if referable_probability >= 0.50:

            referable = True
            diagnosis = "Referable DR"

        else:

            referable = False
            diagnosis = "Non-referable DR"

        return jsonify({

            "success": True,

            "grade": predicted_grade,

            "confidence": round(
                confidence * 100,
                2
            ),

            "referable_probability": round(
                referable_probability * 100,
                2
            ),

            "referable": referable,

            "diagnosis": diagnosis
        })

    except Exception as e:

        return jsonify({

            "success": False,

            "error": str(e)

        }), 500


# =====================================================
# START SERVER
# =====================================================

if __name__ == "__main__":

    print("===================================")
    print("       RetinaAI Backend")
    print("===================================")
    print("Model device:", device)
    print("Server starting...")
    print("URL: http://127.0.0.1:5000")
    print("===================================")

    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )

