const amountInput = document.getElementById("amount");
const addButton = document.getElementById("addButton");
const display = document.getElementById("display");

const expenses = [];

amountInput.addEventListener("keydown", (e) => {
  if (e.key === "-" || e.key === "e") {
    e.preventDefault();
    amountInput.placeholder = "Only positive numb allowed";
    amountInput.classList.add("placeholder:text-red-400", "border-red-400");
    setTimeout(() => {
      amountInput.classList.remove(
        "placeholder:text-red-400",
        "border-red-400"
      );
      amountInput.placeholder = "Please enter an amount";
    }, 3000);
  }
  if (e.key === "Enter") {
    e.preventDefault();
    addButton.click();
  }
});

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
      amountInput.classList.add(
        "placeholder:text-black",
        "bg-white",
        "font-serif",
        "text-[14px]"
      );
      amountInput.placeholder = "Enter Your Amount";
    }, 2000);
    return;
  }
  const amount = parseFloat(inputAmount);
  if (amount <= 0) {
    amountInput.value = ""; // clear the "0"
    amountInput.placeholder = "Please enter a valid number";
    amountInput.classList.add(
      "placeholder:text-red-400",
      "border-red-400",
      "bg-white",
      "font-serif",
      "text-[14px]"
    );
    return;
  }

  expenses.push(amount);
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
