function getInputValue() {
	const inputElement = document.getElementById("emailInput");
	const inputValue = inputElement.value;
	document.getElementById(
		"displayTest"
	).innerText = `input value: ${inputValue}`;
}

function toggleIpadList() {
	const ipadList = document.getElementById("ipadList");
	if (ipadList.style.display === "none") {
		ipadList.style.display = "grid";
	} else {
		ipadList.style.display = "none";
	}
}

const canvas = document.getElementById("signature-pad");
const ctx = canvas.getContext("2d");
const clearButton = document.getElementById("clear");
const submitButton = document.getElementById("submit");

let isDrawing = false;
let lastX = 0;
let lastY = 0;

canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", drawLine);
canvas.addEventListener("mouseup", stopDrawing);

clearButton.addEventListener("click", clearCanvas);
submitButton.addEventListener("click", submitSignature);

function startDrawing(e) {
	isDrawing = true;
	[lastX, lastY] = [e.offsetX, e.offsetY];
}

function drawLine(e) {
	if (!isDrawing) return;
	ctx.beginPath();
	ctx.moveTo(lastX, lastY);
	ctx.lineTo(e.offsetX, e.offsetY);
	ctx.stroke();
	[lastX, lastY] = [e.offsetX, e.offsetY];
}

function stopDrawing() {
	isDrawing = false;
}

function clearCanvas() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function submitSignature() {
	// Here you can implement logic to save the signature as an image or send it to a server
	// For example, you could use canvas.toDataURL() to get the signature as a data URL
	console.log("Signature submitted!");
	const canvas = document.getElementById("signature-pad");
	const image = canvas.toDataURL("image/png");
	const link = document.createElement("a");
	link.download = "myDrawing.png";
	link.href = image;
	link.click();
}
