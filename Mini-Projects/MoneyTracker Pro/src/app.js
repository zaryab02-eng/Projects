const amountInput = document.getElementById("amount");
const addButton = document.getElementById("addButton");
const display = document.getElementById("display");

addButton.addEventListener("click", () => {
  const inputAmount = amountInput.value.trim();
  if (inputAmount === "") {
    amountInput.placeholder = "Please enter an amount";
    amountInput.classList.add(
      "placeholder:text-red-400",
      "border-red-400",
      "bg-white"
    );
    setTimeout(() => {
      amountInput.classList.remove(
        "placeholder:text-red-400",
        "border-red-400",
        "bg-white"
      );
      amountInput.classList.add("placeholder:text-black", "bg-white");
      amountInput.placeholder = "Enter Your Amount";
    }, 2000);
    return;
  }

  const li = document.createElement("li");
  li.classList.add(
    "flex",
    "justify-between",
    "items-center",
    "bg-gray-100",
    "rounded",
    "px-2",
    "py-1",
    "mt-1"
  );
  li.innerText = inputAmount;
  display.appendChild(li);
  amountInput.value = "";
});
