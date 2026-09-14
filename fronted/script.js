
const API_URL = "http://127.0.0.1:5000/predict";


// =====================================================
// GET ELEMENTS
// =====================================================

const patientName = document.getElementById("patientName");
const patientId = document.getElementById("patientId");

const imageInput = document.getElementById("imageInput");

const browseButton = document.getElementById("browseButton");
const changeImageButton =
    document.getElementById("changeImageButton");

const dropZone = document.getElementById("dropZone");
const uploadContent =
    document.getElementById("uploadContent");

const previewWrapper =
    document.getElementById("previewWrapper");

const preview =
    document.getElementById("preview");

const analyseButton =
    document.getElementById("analyseButton");

const loading =
    document.getElementById("loading");

const emptyResult =
    document.getElementById("emptyResult");

const resultCard =
    document.getElementById("resultCard");

const resultPatient =
    document.getElementById("resultPatient");

const resultPatientId =
    document.getElementById("resultPatientId");

const resultGrade =
    document.getElementById("resultGrade");

const resultDiagnosis =
    document.getElementById("resultDiagnosis");

const resultConfidence =
    document.getElementById("resultConfidence");

const resultRisk =
    document.getElementById("resultRisk");

const resultDecision =
    document.getElementById("resultDecision");

const diagnosisBanner =
    document.getElementById("diagnosisBanner");

const confidenceBar =
    document.getElementById("confidenceBar");

const riskBar =
    document.getElementById("riskBar");

const downloadReport =
    document.getElementById("downloadReport");

const newAnalysisButton =
    document.getElementById("newAnalysisButton");

const historyList =
    document.getElementById("historyList");

const clearHistoryButton =
    document.getElementById("clearHistoryButton");

const enhanceButton =
    document.getElementById("enhanceButton");

const comparisonSection =
    document.getElementById("comparisonSection");

const comparisonOriginal =
    document.getElementById("comparisonOriginal");

const enhancedPreview =
    document.getElementById("enhancedPreview");

const analyseEnhancedButton =
    document.getElementById("analyseEnhancedButton");


// =====================================================
// CURRENT RESULT
// =====================================================

let currentResult = null;
let enhancedImageFile = null;


// =====================================================
// CHECK REQUIRED ELEMENTS
// =====================================================

console.log("RetinaAI frontend loaded");

if (!imageInput) {
    console.error("ERROR: imageInput not found");
}

if (!browseButton) {
    console.error("ERROR: browseButton not found");
}

if (!analyseButton) {
    console.error("ERROR: analyseButton not found");
}


// =====================================================
// BROWSE IMAGE
// =====================================================

if (browseButton) {

    browseButton.addEventListener("click", function (event) {

        event.preventDefault();
        event.stopPropagation();

        console.log("Browse button clicked");

        imageInput.click();

    });

}


// =====================================================
// CHANGE IMAGE
// =====================================================

if (changeImageButton) {

    changeImageButton.addEventListener(
        "click",
        function (event) {

            event.preventDefault();
            event.stopPropagation();

            imageInput.click();

        }
    );

}


// =====================================================
// CLICK UPLOAD AREA
// =====================================================

if (dropZone) {

    dropZone.addEventListener(
        "click",
        function (event) {

            /*
             Don't trigger file picker again
             if user clicked the change button.
            */

            if (
                event.target === changeImageButton ||
                event.target.closest("#changeImageButton")
            ) {
                return;
            }


            /*
             Don't trigger when clicking
             the Browse button itself.
            */

            if (
                event.target === browseButton ||
                event.target.closest("#browseButton")
            ) {
                return;
            }


            imageInput.click();

        }
    );

}


// =====================================================
// FILE SELECTED
// =====================================================

if (imageInput) {

    imageInput.addEventListener(
        "change",
        function () {

            console.log(
                "File selected:",
                imageInput.files
            );


            const file =
                imageInput.files[0];


            if (!file) {
                return;
            }


            handleImage(file);

        }
    );

}


// =====================================================
// HANDLE IMAGE
// =====================================================

function handleImage(file) {

    console.log(
        "Handling image:",
        file.name
    );


    // Check file type

    if (
        !file.type.includes("jpeg") &&
        !file.type.includes("png") &&
        !file.type.includes("jpg")
    ) {

        alert(
            "Please upload a JPG or PNG image."
        );

        imageInput.value = "";

        return;
    }


    // Check file size

    const maxSize =
        15 * 1024 * 1024;


    if (file.size > maxSize) {

        alert(
            "Image is too large. Maximum size is 15 MB."
        );

        imageInput.value = "";

        return;
    }


    // Create preview

    const imageURL =
        URL.createObjectURL(file);

    enhancedImageFile = null;

    if (comparisonSection) {
        comparisonSection.style.display = "none";
    }


    preview.src =
        imageURL;


    preview.onload = function () {

        URL.revokeObjectURL(imageURL);

    };


    // Hide upload content

    uploadContent.style.display =
        "none";


    // Show preview

    previewWrapper.style.display =
        "block";


    // Reset previous result

    emptyResult.style.display =
        "flex";

    resultCard.style.display =
        "none";


    console.log(
        "Image preview displayed"
    );

}


// =====================================================
// ENHANCE IMAGE
// =====================================================

if (enhanceButton) {

    enhanceButton.addEventListener(
        "click",
        enhanceImage
    );

}

if (analyseEnhancedButton) {

    analyseEnhancedButton.addEventListener(
        "click",
        analyseImage
    );

}

async function enhanceImage() {

    const file = imageInput.files[0];

    if (!file) {
        alert("Please upload a fundus image first.");
        return;
    }

    enhanceButton.disabled = true;
    enhanceButton.textContent = "Enhancing...";

    try {

        const imageURL = URL.createObjectURL(file);
        const image = new Image();

        image.src = imageURL;

        await new Promise(function (resolve, reject) {
            image.onload = resolve;
            image.onerror = reject;
        });

        const canvas = document.createElement("canvas");
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;

        const context = canvas.getContext("2d");

        if (!context) {
            throw new Error("Canvas processing is unavailable in this browser.");
        }

        context.filter = "contrast(1.18) saturate(1.12) brightness(1.04)";
        context.drawImage(image, 0, 0);
        URL.revokeObjectURL(imageURL);

        const enhancedBlob = await new Promise(function (resolve) {
            canvas.toBlob(resolve, "image/jpeg", 0.94);
        });

        if (!enhancedBlob) {
            throw new Error("The enhanced image could not be created.");
        }

        enhancedImageFile = new File(
            [enhancedBlob],
            file.name.replace(/\.[^.]+$/, "") + "_enhanced.jpg",
            { type: "image/jpeg" }
        );

        const enhancedURL = URL.createObjectURL(enhancedImageFile);
        const originalURL = URL.createObjectURL(file);

        comparisonOriginal.src = originalURL;
        comparisonOriginal.onload = function () {
            URL.revokeObjectURL(originalURL);
        };

        enhancedPreview.src = enhancedURL;
        comparisonSection.style.display = "block";

        comparisonSection.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    } catch (error) {

        console.error("Enhancement error:", error);
        alert("Could not enhance this image. Please try another JPG or PNG file.");

    } finally {

        enhanceButton.disabled = false;
        enhanceButton.innerHTML = "<span>✦</span> Enhance Image";

    }

}


// =====================================================
// DRAG OVER
// =====================================================

if (dropZone) {

    dropZone.addEventListener(
        "dragover",
        function (event) {

            event.preventDefault();

            dropZone.classList.add(
                "dragover"
            );

        }
    );


    // =================================================
    // DRAG LEAVE
    // =================================================

    dropZone.addEventListener(
        "dragleave",
        function () {

            dropZone.classList.remove(
                "dragover"
            );

        }
    );


    // =================================================
    // DROP
    // =================================================

    dropZone.addEventListener(
        "drop",
        function (event) {

            event.preventDefault();

            dropZone.classList.remove(
                "dragover"
            );


            const file =
                event.dataTransfer.files[0];


            if (!file) {
                return;
            }


            /*
             * Put dropped file into
             * file input.
             */

            try {

                const dataTransfer =
                    new DataTransfer();

                dataTransfer.items.add(
                    file
                );

                imageInput.files =
                    dataTransfer.files;

            } catch (error) {

                console.log(
                    "Could not set file input:",
                    error
                );

            }


            handleImage(file);

        }
    );

}


// =====================================================
// ANALYSE BUTTON
// =====================================================

if (analyseButton) {

    analyseButton.addEventListener(
        "click",
        analyseImage
    );

}


// =====================================================
// ANALYSE IMAGE
// =====================================================

async function analyseImage() {

    console.log(
        "Analyse button clicked"
    );


    const name =
        patientName.value.trim();


    const id =
        patientId.value.trim();


    const file =
        enhancedImageFile || imageInput.files[0];


    // =================================================
    // VALIDATION
    // =================================================

    if (!name) {

        alert(
            "Please enter patient name."
        );

        patientName.focus();

        return;

    }


    if (!file) {

        alert(
            "Please upload a fundus image."
        );

        return;

    }


    // =================================================
    // LOADING UI
    // =================================================

    analyseButton.disabled =
        true;


    loading.style.display =
        "flex";


    emptyResult.style.display =
        "none";


    resultCard.style.display =
        "none";


    // =================================================
    // FORM DATA
    // =================================================

    const formData =
        new FormData();


    formData.append(
        "image",
        file
    );


    try {

        console.log(
            "Sending image to backend..."
        );


        // =================================================
        // API REQUEST
        // =================================================

        const response =
            await fetch(
                API_URL,
                {
                    method: "POST",
                    body: formData
                }
            );


        console.log(
            "Backend status:",
            response.status
        );


        const data =
            await response.json();


        console.log(
            "Backend response:",
            data
        );


        // =================================================
        // CHECK RESPONSE
        // =================================================

        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.error ||
                "Prediction failed."
            );

        }


        // =================================================
        // CREATE RESULT
        // =================================================

        currentResult = {

            patientName:
                name,

            patientId:
                id || "N/A",

            grade:
                data.grade,

            diagnosis:
                data.diagnosis,

            confidence:
                Number(data.confidence),

            referableProbability:
                Number(
                    data.referable_probability
                ),

            referable:
                Boolean(data.referable),

            date:
                new Date()
                    .toLocaleDateString(),

            time:
                new Date()
                    .toLocaleTimeString()

        };


        // =================================================
        // DISPLAY RESULT
        // =================================================

        displayResult(
            currentResult
        );


        // =================================================
        // SAVE HISTORY
        // =================================================

        saveHistory(
            currentResult
        );


        // =================================================
        // FINISH
        // =================================================

        loading.style.display =
            "none";


        analyseButton.disabled =
            false;


        resultCard.style.display =
            "block";


        resultCard.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });


    } catch (error) {

        console.error(
            "Prediction error:",
            error
        );


        loading.style.display =
            "none";


        analyseButton.disabled =
            false;


        emptyResult.style.display =
            "flex";


        alert(
            "Could not connect to RetinaAI backend.\n\n" +
            error.message +
            "\n\n" +
            "Make sure this is running:\n" +
            "python backend/app.py"
        );

    }

}


// =====================================================
// DISPLAY RESULT
// =====================================================

function displayResult(result) {

    resultPatient.textContent =
        result.patientName;


    resultPatientId.textContent =
        result.patientId;


    resultGrade.textContent =
        "Grade " +
        result.grade;


    resultDiagnosis.textContent =
        result.diagnosis;


    resultConfidence.textContent =
        result.confidence +
        "%";


    resultRisk.textContent =
        result.referableProbability +
        "%";


    // =================================================
    // PROGRESS BARS
    // =================================================

    setTimeout(
        function () {

            confidenceBar.style.width =
                Math.min(
                    result.confidence,
                    100
                ) + "%";


            riskBar.style.width =
                Math.min(
                    result.referableProbability,
                    100
                ) + "%";

        },
        100
    );


    // =================================================
    // REFERABLE
    // =================================================

    if (result.referable) {

        resultDecision.textContent =
            "REFERABLE DR";


        diagnosisBanner.style.background =
            "rgba(239, 68, 68, 0.07)";


        diagnosisBanner.style.borderColor =
            "rgba(239, 68, 68, 0.15)";


        resultDecision.style.background =
            "rgba(239, 68, 68, 0.12)";


        resultDecision.style.color =
            "#fca5a5";

    }

    else {

        resultDecision.textContent =
            "NON-REFERABLE";


        diagnosisBanner.style.background =
            "rgba(34, 197, 94, 0.07)";


        diagnosisBanner.style.borderColor =
            "rgba(34, 197, 94, 0.14)";


        resultDecision.style.background =
            "rgba(34, 197, 94, 0.12)";


        resultDecision.style.color =
            "#86efac";

    }

}


// =====================================================
// HISTORY
// =====================================================

function getHistory() {

    try {

        return JSON.parse(
            localStorage.getItem(
                "retinaAI_history"
            )
        ) || [];

    }

    catch (error) {

        console.error(
            "History error:",
            error
        );

        return [];

    }

}


// =====================================================
// SAVE HISTORY
// =====================================================

function saveHistory(result) {

    const history =
        getHistory();


    history.unshift(
        result
    );


    /*
     * Keep only latest 10
     */

    const limitedHistory =
        history.slice(
            0,
            10
        );


    localStorage.setItem(
        "retinaAI_history",
        JSON.stringify(
            limitedHistory
        )
    );


    renderHistory();

}


// =====================================================
// RENDER HISTORY
// =====================================================

function renderHistory() {

    const history =
        getHistory();


    if (
        !history ||
        history.length === 0
    ) {

        historyList.innerHTML = `
            <div class="history-empty">
                No previous analyses yet.
            </div>
        `;

        return;

    }


    historyList.innerHTML =
        history.map(
            function (item) {

                return `

                <div class="history-item">

                    <div class="history-patient">

                        <strong>
                            ${escapeHTML(
                                item.patientName
                            )}
                        </strong>

                        <span>
                            ${escapeHTML(
                                item.patientId
                            )}
                        </span>

                    </div>


                    <div class="history-grade">

                        Grade ${item.grade}

                    </div>


                    <div class="history-diagnosis">

                        ${escapeHTML(
                            item.diagnosis
                        )}

                    </div>


                    <div class="history-confidence">

                        ${item.confidence}%
                        confidence

                    </div>


                    <div class="history-time">

                        <small>
                            ${escapeHTML(
                                item.date
                            )}
                        </small>

                        <small>
                            ${escapeHTML(
                                item.time
                            )}
                        </small>

                    </div>

                </div>

                `;

            }
        ).join("");

}


// =====================================================
// CLEAR HISTORY
// =====================================================

if (clearHistoryButton) {

    clearHistoryButton.addEventListener(
        "click",
        function () {

            const history =
                getHistory();


            if (
                history.length === 0
            ) {

                return;

            }


            const confirmed =
                confirm(
                    "Clear all screening history?"
                );


            if (!confirmed) {

                return;

            }


            localStorage.removeItem(
                "retinaAI_history"
            );


            renderHistory();

        }
    );

}


// =====================================================
// NEW ANALYSIS
// =====================================================

if (newAnalysisButton) {

    newAnalysisButton.addEventListener(
        "click",
        function () {

            patientName.value =
                "";

            patientId.value =
                "";

            imageInput.value =
                "";

            enhancedImageFile =
                null;

            if (comparisonSection) {
                comparisonSection.style.display =
                    "none";
            }

            preview.src =
                "";


            uploadContent.style.display =
                "flex";


            previewWrapper.style.display =
                "none";


            resultCard.style.display =
                "none";


            emptyResult.style.display =
                "flex";


            confidenceBar.style.width =
                "0%";


            riskBar.style.width =
                "0%";


            currentResult =
                null;


            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );

}


// =====================================================
// PDF REPORT
// =====================================================

if (downloadReport) {

    downloadReport.addEventListener(
        "click",
        generatePDF
    );

}


function generatePDF() {

    if (!currentResult) {

        alert(
            "Please analyse an image first."
        );

        return;

    }


    if (!window.jspdf) {

        alert(
            "PDF library is not loaded.\n" +
            "Please check your internet connection."
        );

        return;

    }


    const {
        jsPDF
    } = window.jspdf;


    const doc =
        new jsPDF();


    // =================================================
    // HEADER
    // =================================================

    doc.setFillColor(
        8,
        17,
        31
    );


    doc.rect(
        0,
        0,
        210,
        40,
        "F"
    );


    doc.setTextColor(
        255,
        255,
        255
    );


    doc.setFontSize(
        24
    );


    doc.setFont(
        "helvetica",
        "bold"
    );


    doc.text(
        "RetinaAI",
        20,
        23
    );


    doc.setFontSize(
        10
    );


    doc.setFont(
        "helvetica",
        "normal"
    );


    doc.text(
        "AI-Assisted Diabetic Retinopathy Screening",
        20,
        31
    );


    // =================================================
    // TEXT COLOR
    // =================================================

    doc.setTextColor(
        20,
        30,
        45
    );


    // =================================================
    // PATIENT INFORMATION
    // =================================================

    doc.setFontSize(
        16
    );


    doc.setFont(
        "helvetica",
        "bold"
    );


    doc.text(
        "Patient Information",
        20,
        58
    );


    doc.setFontSize(
        11
    );


    doc.setFont(
        "helvetica",
        "normal"
    );


    doc.text(
        "Patient Name: " +
        currentResult.patientName,
        20,
        71
    );


    doc.text(
        "Patient ID: " +
        currentResult.patientId,
        20,
        81
    );


    doc.text(
        "Date: " +
        currentResult.date,
        20,
        91
    );


    doc.text(
        "Time: " +
        currentResult.time,
        20,
        101
    );


    // =================================================
    // SCREENING RESULT
    // =================================================

    doc.setFontSize(
        16
    );


    doc.setFont(
        "helvetica",
        "bold"
    );


    doc.text(
        "AI Screening Result",
        20,
        121
    );


    doc.setFontSize(
        11
    );


    doc.setFont(
        "helvetica",
        "normal"
    );


    doc.text(
        "DR Grade: Grade " +
        currentResult.grade,
        20,
        135
    );


    doc.text(
        "Diagnosis: " +
        currentResult.diagnosis,
        20,
        145
    );


    doc.text(
        "AI Confidence: " +
        currentResult.confidence +
        "%",
        20,
        155
    );


    doc.text(
        "Referable DR Probability: " +
        currentResult.referableProbability +
        "%",
        20,
        165
    );


    doc.text(
        "Final Decision: " +
        (
            currentResult.referable
                ? "REFERABLE DR"
                : "NON-REFERABLE"
        ),
        20,
        175
    );


    doc.text(
        "Model: EfficientNet-B0",
        20,
        185
    );


    // =================================================
    // NOTICE
    // =================================================

    doc.setFontSize(
        15
    );


    doc.setFont(
        "helvetica",
        "bold"
    );


    doc.text(
        "Important Notice",
        20,
        208
    );


    doc.setFontSize(
        9
    );


    doc.setFont(
        "helvetica",
        "normal"
    );


    const disclaimer =
        "This report is generated by an AI-assisted " +
        "screening system for research and demonstration " +
        "purposes. It is not a medical diagnosis and " +
        "should not replace evaluation by a qualified " +
        "ophthalmologist or healthcare professional.";


    const lines =
        doc.splitTextToSize(
            disclaimer,
            170
        );


    doc.text(
        lines,
        20,
        220
    );


    // =================================================
    // FOOTER
    // =================================================

    doc.setFontSize(
        8
    );


    doc.setTextColor(
        100,
        116,
        139
    );


    doc.text(
        "Generated by RetinaAI",
        20,
        285
    );


    doc.text(
        "AI-assisted screening demonstration",
        20,
        291
    );


    // =================================================
    // DOWNLOAD
    // =================================================

    const safeName =
        currentResult.patientName
            .replace(
                /[^a-z0-9]/gi,
                "_"
            )
            .toLowerCase();


    doc.save(
        "RetinaAI_Report_" +
        safeName +
        ".pdf"
    );

}


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHTML(value) {

    return String(value)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}


// =====================================================
// INITIALIZE
// =====================================================

renderHistory();

console.log(
    "RetinaAI initialized successfully"
);

