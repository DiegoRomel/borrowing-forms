function getInputValue() {
  const inputElement = document.getElementById("emailInput");
  const inputValue = inputElement.value;
  document.getElementById(
    "displayTest"
  ).innerText = `input value: ${inputValue}`;
}
