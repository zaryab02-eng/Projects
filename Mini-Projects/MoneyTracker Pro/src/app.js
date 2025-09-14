// Get all DOM elements first
const amountInput = document.getElementById("amount");
const addButton = document.getElementById("addButton");
const display = document.getElementById("display");
const inputDescription = document.getElementById("description");
const categories = document.getElementById("Category");

// Store all expenses and track IDs
const expenses = [];
let nextId = 1;

// Delete function - removes expense from array and refreshes display
function deleteExpense(expenseId) {
  const index = expenses.findIndex((expense) => expense.id === expenseId);
  if (index > -1) {
    expenses.splice(index, 1);
  }
  displayAllExpenses();
}

// Display function - shows all expenses with delete buttons
function displayAllExpenses() {
  display.innerHTML = "";
  expenses.forEach((expense) => {
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
    li.innerHTML = `
      <span>${expense.Category} | $${expense.amount.toFixed(2)} | ${
      expense.description
    }</span>
      <button class="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600" onclick="deleteExpense(${
        expense.id
      })">❌</button>
    `;
    display.appendChild(li);
  });
}

// Prevent negative numbers and enable Enter key
amountInput.addEventListener("keydown", (e) => {
  if (e.key === "-" || e.key === "e") {
    e.preventDefault();
    amountInput.placeholder = "Only positive numbers allowed";
    amountInput.classList.add("placeholder:text-red-400", "border-red-400");
    setTimeout(() => {
      amountInput.classList.remove(
        "placeholder:text-red-400",
        "border-red-400"
      );
      amountInput.placeholder = "Enter Your Amount";
    }, 3000);
  }
  if (e.key === "Enter") {
    e.preventDefault();
    addButton.click();
  }
});

// Main add expense functionality
addButton.addEventListener("click", () => {
  const inputAmount = amountInput.value.trim();
  const description = inputDescription.value.trim();
  const category = categories.value;

  // Validate empty amount
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

  // Validate positive number
  const amount = parseFloat(inputAmount);
  if (amount <= 0) {
    amountInput.value = "";
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

  // Create expense object
  const expense = {
    id: nextId++,
    amount: amount,
    description: description || "No Description",
    Category: category,
  };

  // Add to array and refresh display
  expenses.push(expense);
  displayAllExpenses();

  // Clear inputs
  amountInput.value = "";
  inputDescription.value = "";
});
