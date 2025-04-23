document.addEventListener("DOMContentLoaded", () => {
  // Initialize dynamic content
  //generateItemList();
  //generateIpadList();

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
    ctx.lineWidth = 3;
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

function getCurrentTime() {
  const now = new Date();

  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const year = now.getFullYear();

  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  const formattedTime = `${day}/${month}/${year} ${hours}:${minutes}`;
  return formattedTime;
}

// Form submission
function submitData() {
  document
    .getElementById("submitButton")
    .addEventListener("click", async () => {
      // Get the values from the inputs
      const email = document.getElementById("emailInput").value.trim();
      const name = document.getElementById("nameInput").value.trim();
      const description = document
        .getElementById("descriptionInput")
        .value.trim();
      const canvas = document.getElementById("signaturePad");
      const borrowDate = document.getElementById("borrowDate").value.trim();
      const returnDate = document.getElementById("returnDate").value.trim();

      // Validate the inputs
      if (!email || !name) {
        alert("Please fill in both the email and name fields.");
        return;
      }

      // Prepare the data to send
      const formData = new FormData();
      formData.append("Email", email);
      formData.append("Name", name);
      formData.append("Description of The Material Borrowed", description);
      formData.append("Signature", canvas.toDataURL("image/png"));
      formData.append("Timestamp", getCurrentTime());
      formData.append("Borrowing Date", convertDate(borrowDate));
      formData.append("Returning Date", convertDate(returnDate));

      try {
        // Send the data to the Google Apps Script endpoint
        const response = await fetch(
          "https://script.google.com/macros/s/AKfycbyhNzjwzyYTo6OSyH9bEiypofIKWwo97wJGKEjMMlSULez48QBGXNvMImnt2HHlIvnk/exec",
          {
            method: "POST",
            body: formData,
          }
        );

        // Handle the response
        const result = await response.json();
        if (result.result === "success") {
          alert("Data submitted successfully!");
        } else {
          alert("Error submitting data: " + result.error);
        }
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while submitting the data.");
      }
    });
}

function convertDate(dateInput) {
  try {
    // Check if a date is selected
    if (!dateInput) {
      console.log("No date selected.");
      return;
    }

    const [year, month, day] = dateInput.split("-"); // Split the input into year, month, and day

    const formattedDate = `${day}/${month}/${year}`;
    return formattedDate;
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred while formatting the borrowing date.");
  }
}
