document.addEventListener("DOMContentLoaded", () => {
  // Initialize dynamic content
  generateItemList();
  generateIpadList();

  // Canvas signature setup
  setupCanvas();

  // Form submission
  submitData();
});

// Generate dynamic item list
function generateItemList() {
  const itemList = document.getElementById("itemList");
  const items = ["iPad", "Sphero", "Tripod"]; // Example items

  items.forEach((item, index) => {
    const button = document.createElement("button");
    const ipadList = document.getElementById("ipadList");
    button.innerHTML = `<div class="item"><img src="assets/${item.toLowerCase()}.jpg" alt="${item}" /></div>`;
    button.addEventListener("click", () => {
      toggleIpadList(ipadList);
    });
    itemList.appendChild(button);
  });
}

function generateIpadList() {
  const ipadList = document.getElementById("ipadList");

  for (let i = 1; i <= 38; i++) {
    const div = document.createElement("div");
    div.className = "ipad-item";
    div.textContent = `iPad ${i}`;
    ipadList.appendChild(div);
  }
}

// Toggle iPad list visibility
function toggleIpadList(ipadList) {
  ipadList.style.display = ipadList.style.display === "none" ? "grid" : "none";
}

// Canvas signature setup
function setupCanvas() {
  const canvas = document.getElementById("signaturePad");
  const ctx = canvas.getContext("2d");
  const clearButton = document.getElementById("clear-button");
  let isDrawing = false;

  canvas.addEventListener("mousedown", (e) => {
    isDrawing = true;
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
  });

  canvas.addEventListener("mousemove", (e) => {
    if (!isDrawing) return;
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.stroke();
  });

  canvas.addEventListener("mouseup", () => {
    isDrawing = false;
    ctx.closePath();
  });

  canvas.addEventListener("mouseleave", () => {
    isDrawing = false;
  });

  clearButton.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });
}

//generating  form PDF
async function generatePDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Get values from inputs
  const name = document.getElementById("nameInput").value;
  const email = document.getElementById("emailInput").value;

  // Add text to PDF
  doc.setFontSize(14);
  doc.text("User Information", 10, 20);
  doc.setFontSize(12);
  doc.text("Name: " + name, 10, 35);
  doc.text("Email: " + email, 10, 45);

  // Save the PDF
  doc.save("user-info.pdf");
}

// Form submission
function submitData() {
  const submitButton = document.getElementById("submitButton");

  submitButton.addEventListener("click", () => {
    const email = document.getElementById("emailInput").value;
    const name = document.getElementById("nameInput").value;

    // Create data array
    const data = [
      ["Name", "Email"], // header row
      [name, email], // data row
    ];

    // Create worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(data);

    // Create workbook and append worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "2025-1");

    // Export to file
    XLSX.writeFile(workbook, "borrowing_forms.xlsx");
    alert("Data submitted successfully!");
  });
}
