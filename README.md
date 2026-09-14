

# RetinaAI 

### AI-Assisted Diabetic Retinopathy Screening

RetinaAI is an AI-assisted retinal screening system designed to analyze fundus images and estimate the severity of **Diabetic Retinopathy (DR)** using a deep-learning model based on **EfficientNet-B0**.

The system goes beyond a simple disease classification workflow by combining **retinal image enhancement, 5-class DR classification, referable DR risk estimation, confidence reporting, image comparison, screening history, and automated PDF reporting** into a single web-based interface.

>  **Medical Disclaimer:** RetinaAI is a research and demonstration project. It is **not a medical diagnostic device** and should not be used as a substitute for examination by a qualified healthcare professional.

---

##  Why RetinaAI?

Many beginner DR projects follow a simple pipeline:

```text
Fundus Image
     ↓
AI Model
     ↓
DR Prediction
```

RetinaAI is designed as a broader **screening-assistance workflow**:

```text
             Retinal Image
                   │
                   ▼
          Image Enhancement
                   │
                   ▼
           EfficientNet-B0
                   │
          ┌────────┴────────┐
          ▼                 ▼
     DR Grade          DR Risk
       0–4              Grade 2–4
          │                 │
          └────────┬────────┘
                   ▼
          Confidence Score
                   │
                   ▼
          Screening Result
                   │
          ┌────────┴─────────┐
          ▼                  ▼
     PDF Report        Local History
```

---

##  Key Features

###  5-Class Diabetic Retinopathy Classification

The model predicts five DR severity levels:

| Grade | Description             |
| ----- | ----------------------- |
| **0** | No Diabetic Retinopathy |
| **1** | Mild DR                 |
| **2** | Moderate DR             |
| **3** | Severe DR               |
| **4** | Proliferative DR        |

---

###  Referable DR Risk

Instead of displaying only the predicted class, RetinaAI calculates the combined probability of the more severe classes:

```text
Referable Risk =
P(Grade 2) + P(Grade 3) + P(Grade 4)
```

A configurable threshold is used to determine whether the result should be considered **referable**.

This makes the output more relevant to a screening workflow than a simple class label.

---

### Retinal Image Enhancement

Before analysis, users can optionally enhance the uploaded image using image-processing techniques including:

* Contrast enhancement
* Color enhancement
* Sharpness enhancement

Users can visually compare:

```text
Original Image  ↔  Enhanced Image
```

The enhanced image can then be passed through the AI model for analysis.

> Enhancement is provided as a preprocessing/demo feature; it is not claimed to improve diagnostic accuracy without separate validation.

---

###  AI Confidence

The application displays the model's confidence in its predicted class.

Example:

```text
AI Confidence
      82.4%
████████████████░░░░
```

This helps users understand that an AI prediction is probabilistic rather than absolute.

---

###  Original vs Enhanced Analysis

RetinaAI allows users to compare the original retinal image with the enhanced version before running inference.

This creates a simple **human-in-the-loop screening workflow** rather than hiding preprocessing from the user.

---

###  Automated PDF Reports

After analysis, users can generate a PDF report containing information such as:

* Patient name
* Patient ID
* DR grade
* Diagnosis
* AI confidence
* Referable DR risk
* Model information
* Screening timestamp

---

###  Local Screening History

Recent screening results can be stored locally in the browser so users can review previous analyses during a session.

No claim is made that this local history constitutes a clinical medical-record system.

---

##  System Architecture

```text
┌─────────────────────────────┐
│          Frontend           │
│      HTML / CSS / JS        │
└──────────────┬──────────────┘
               │
               │ HTTP
               ▼
┌─────────────────────────────┐
│        Flask Backend        │
│                             │
│  /predict     /enhance      │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│       Image Processing      │
│                             │
│ Resize → Tensor → Normalize │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│       EfficientNet-B0       │
│                             │
│       5-Class Output        │
│        Grade 0–4            │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│       Result Processing     │
│                             │
│ • Predicted Grade           │
│ • Confidence                │
│ • Referable Risk            │
│ • Screening Decision        │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│       RetinaAI Dashboard    │
│                             │
│ Result + History + PDF      │
└─────────────────────────────┘
```

---

##  Machine Learning Model

RetinaAI currently uses:

**Model:** EfficientNet-B0

**Task:** 5-class diabetic retinopathy classification

**Dataset:** APTOS 2019 Blindness Detection

**Input Size:** `224 × 224`

**Normalization:** ImageNet normalization

```text
Mean = [0.485, 0.456, 0.406]

Std  = [0.229, 0.224, 0.225]
```

The trained model is loaded from a PyTorch checkpoint:

```text
model/
└── efficientnet_b0_aptos_final_best.pth
```

---

##  Project Structure

```text
retinaai/
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── backend/
│   ├── app.py
│   ├── model.py
│   └── inference.py
│
├── model/
│   └── efficientnet_b0_aptos_final_best.pth
│
├── uploads/
├── reports/
│
├── requirements.txt
└── README.md
```

---

##  Tech Stack

### Frontend

* HTML5
* CSS3
* JavaScript
* jsPDF

### Backend

* Python
* Flask
* Flask-CORS

### AI / Computer Vision

* PyTorch
* Torchvision
* EfficientNet-B0
* Pillow
* NumPy

### Machine Learning

* APTOS 2019 dataset
* 5-class DR classification

---

# Installation

## 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/retinaai.git

cd retinaai
```

---

## 2. Create Virtual Environment

### Windows

```bash
python -m venv venv
```

Activate it:

```bash
venv\Scripts\activate
```

### Linux / macOS

```bash
python3 -m venv venv
```

```bash
source venv/bin/activate
```

---

## 3. Install Dependencies

```bash
pip install -r requirements.txt
```

---

## 4. Add the Model

Place the trained PyTorch checkpoint inside:

```text
model/
```

Expected file:

```text
efficientnet_b0_aptos_final_best.pth
```

> **Important:** Large model checkpoints may exceed GitHub's normal file-size limits. For a public repository, consider using Git LFS or a model-hosting service rather than committing a large `.pth` file directly.

---

## 5. Start the Backend

```bash
cd backend
python app.py
```

The Flask server should start at:

```text
http://127.0.0.1:5000
```

---

## 6. Start the Frontend

Open:

```text
frontend/index.html
```

in your browser.

For a smoother local development experience, you can also use VS Code Live Server.

---

# 🔌 API Endpoints

## `GET /`

Checks whether the backend is running.

Example response:

```json
{
  "status": "success",
  "message": "RetinaAI backend is running!"
}
```

---

## `POST /enhance`

Accepts a retinal image and returns an enhanced image encoded as Base64.

### Request

```text
multipart/form-data
image=<retinal_image>
```

---

## `POST /predict`

Runs the trained EfficientNet-B0 model.

### Request

```text
multipart/form-data
image=<retinal_image>
```

### Example Response

```json
{
  "success": true,
  "grade": 0,
  "confidence": 58.69,
  "referable_probability": 40.44,
  "referable": false,
  "diagnosis": "Non-referable DR"
}
```

---

#  Example Workflow

### Step 1 — Patient Information

Enter:

```text
Patient Name
Patient ID
```

### Step 2 — Upload

Upload a retinal fundus image.

### Step 3 — Optional Enhancement

Choose:

```text
Enhance Image
```

### Step 4 — Compare

Review:

```text
Original ↔ Enhanced
```

### Step 5 — AI Analysis

Run:

```text
Analyse Image
```

or:

```text
Analyse Enhanced Image
```

### Step 6 — Review

The system displays:

```text
DR Grade
AI Confidence
Referable DR Risk
Diagnosis
```

### Step 7 — Report

Generate a downloadable PDF report.

---

# 🎯 Current Innovation

RetinaAI's main contribution is not claiming a new neural-network architecture.

Instead, the project focuses on creating an integrated **AI-assisted screening workflow** around an existing deep-learning classifier.

The current differentiating elements are:

* Optional retinal image enhancement
* Original vs enhanced image comparison
* 5-class DR severity prediction
* Referable DR probability calculation
* Separate AI confidence reporting
* Human-in-the-loop screening concept
* Local browser-based screening history
* Automated screening reports

These components combine model inference and user-facing screening assistance into a single workflow.

---

# 🔮 Future Improvements

Several features can further strengthen RetinaAI:

### 1. 🔬 Explainable AI

Add **Grad-CAM** to visualize which retinal regions influenced the model's prediction.

```text
Fundus Image
      ↓
EfficientNet-B0
      ↓
Grad-CAM
      ↓
Attention Heatmap
```

---

### 2. 📸 Image Quality Assessment

Automatically detect:

* Blur
* Poor illumination
* Low contrast
* Incorrect image positioning

and request a better image before inference.

---

### 3. 🧠 Uncertainty-Aware Screening

Introduce confidence thresholds such as:

```text
High confidence
       ↓
Standard screening result

Medium confidence
       ↓
Review recommended

Low confidence
       ↓
Manual assessment required
```

---

### 4. 📊 Model Evaluation Dashboard

Add:

* Accuracy
* Precision
* Recall
* F1-score
* Confusion matrix
* ROC-AUC
* Per-class performance

---

### 5.  Privacy-Focused Deployment

Future versions could support local/edge inference so sensitive retinal images do not need to leave the screening device.

---

#  Limitations

RetinaAI is currently a **research/demo prototype**.

Important limitations include:

* The model has not been clinically validated by this project.
* Performance can vary across datasets and imaging devices.
* The APTOS dataset may not represent every real-world population or camera setup.
* Image enhancement does not guarantee improved model accuracy.
* Model confidence should not be interpreted as clinical certainty.
* The system should not be used to independently diagnose or treat patients.

---

#  Dataset

This project uses the **APTOS 2019 Blindness Detection** dataset for model development.

The dataset contains retinal fundus photographs labeled according to diabetic retinopathy severity.

Dataset source:

**APTOS 2019 Blindness Detection — Kaggle**

---

#  Contributing

Contributions are welcome.

Possible areas include:

* Explainable AI
* Image quality detection
* Model optimization
* Better preprocessing
* UI/UX improvements
* Evaluation tools
* Privacy-preserving inference
* Documentation

### Contribution workflow

```bash
git checkout -b feature/your-feature

git add .

git commit -m "Add your feature"

git push origin feature/your-feature
```

Then open a Pull Request.

---

# 📜 License

This project is intended for educational, research, and demonstration purposes.

Add an appropriate open-source license before distributing the project publicly.

---

#  Project

**RetinaAI**

> AI-assisted retinal screening using deep learning and computer vision.

Built with:

**Python · Flask · PyTorch · EfficientNet-B0 · JavaScript**

---

### 

**RetinaAI does not provide medical advice, diagnosis, or treatment recommendations.**

Always consult a qualified healthcare professional for medical evaluation.
