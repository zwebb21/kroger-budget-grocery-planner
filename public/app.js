const zipInput = document.getElementById("zip-input");
const storeButton = document.getElementById("store-btn");
const storeSelect = document.getElementById("store-select");
const productInput = document.getElementById("product-input");
const productButton = document.getElementById("product-btn");
const outputDiv = document.getElementById("output");
const selectedListDiv = document.getElementById("selected-list");
const emptyListDiv = document.getElementById("empty-list");
const listTotalDiv = document.getElementById("list-total");
const budgetInput = document.getElementById("budget-input");
const budgetDisplay = document.getElementById("budget-display");
const cartTotalDisplay = document.getElementById("cart-total-display");
const remainingDisplay = document.getElementById("remaining-display");
const remainingRow = document.getElementById("remaining-row");

const STORAGE_KEY = "kroger-grocery-list";
const BUDGET_STORAGE_KEY = "kroger-grocery-budget";
let selectedItems = [];

function formatPrice(price) {
  return typeof price === "number" ? `$${price.toFixed(2)}` : price;
}

function getNumericPrice(price) {
  const parsedPrice = Number(price);
  return Number.isFinite(parsedPrice) ? parsedPrice : 0;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function saveSelectedItems() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedItems));
}

function getCartTotal() {
  return selectedItems.reduce((sum, item) => sum + getNumericPrice(item.price), 0);
}

function loadSelectedItems() {
  const savedItems = localStorage.getItem(STORAGE_KEY);

  if (!savedItems) {
    return;
  }

  try {
    const parsedItems = JSON.parse(savedItems);
    selectedItems = Array.isArray(parsedItems) ? parsedItems : [];
  } catch (error) {
    console.error("Failed to load saved grocery list:", error);
    selectedItems = [];
  }
}

function saveBudget() {
  localStorage.setItem(BUDGET_STORAGE_KEY, budgetInput.value);
}

function loadBudget() {
  budgetInput.value = localStorage.getItem(BUDGET_STORAGE_KEY) || "";
}

function renderBudget(total) {
  const budget = getNumericPrice(budgetInput.value);
  const remaining = budget - total;
  const hasBudget = budgetInput.value !== "";
  const remainingLabel = remaining < 0 ? "Over Budget" : "Remaining";

  budgetDisplay.textContent = hasBudget ? `$${budget.toFixed(2)}` : "$0.00";
  cartTotalDisplay.textContent = `$${total.toFixed(2)}`;
  remainingRow.querySelector("span").textContent = remainingLabel;
  remainingDisplay.textContent = hasBudget
    ? `$${Math.abs(remaining).toFixed(2)}`
    : "$0.00";
  remainingRow.classList.toggle("over-budget", hasBudget && remaining < 0);
}

function renderSelectedItems() {
  const total = getCartTotal();

  listTotalDiv.textContent = `$${total.toFixed(2)}`;
  renderBudget(total);
  selectedListDiv.innerHTML = "";
  emptyListDiv.hidden = selectedItems.length > 0;

  selectedItems.forEach((item) => {
    const row = document.createElement("div");
    row.className = "selected-item";
    row.innerHTML = `
      <div>
        <h3>${escapeHtml(item.name)}</h3>
        <p>${escapeHtml(item.brand || "Brand not listed")} · ${escapeHtml(item.size)}</p>
      </div>
      <div class="selected-item-actions">
        <strong>${escapeHtml(formatPrice(item.price))}</strong>
        <button class="btn btn-sm btn-outline-danger" type="button" data-remove-id="${escapeHtml(item.cartId)}">
          Remove
        </button>
      </div>
    `;

    selectedListDiv.appendChild(row);
  });
}

function addToList(product) {
  selectedItems.push({
    ...product,
    cartId: `${product.productId}-${Date.now()}-${Math.random()}`,
  });

  saveSelectedItems();
  renderSelectedItems();
}

async function getStores() {
  const zip = zipInput.value.trim();

  outputDiv.className = "status-box";
  outputDiv.textContent = "Loading stores...";

  try {
    const response = await fetch(`/locations?zip=${zip}`);
    const data = await response.json();

    console.log("Stores:", data);

    storeSelect.innerHTML = "";

    if (!data.data?.length) {
      storeSelect.innerHTML = `<option value="">No stores found</option>`;
      outputDiv.textContent = "No stores found for that ZIP code.";
      return;
    }

    data.data.forEach((store) => {
      const option = document.createElement("option");
      option.value = store.locationId;
      option.textContent = `${store.name} - ${store.address.addressLine1}`;
      storeSelect.appendChild(option);
    });

    outputDiv.textContent = `${data.data.length} stores loaded. Choose a store, then search a product.`;
  } catch (error) {
    console.error(error);
    outputDiv.textContent = "Failed to load stores.";
  }
}

async function getProducts() {
  const term = productInput.value.trim();
  const locationId = storeSelect.value;

  if (!locationId) {
    outputDiv.className = "status-box";
    outputDiv.textContent = "Please find and select a store first.";
    return;
  }

  outputDiv.className = "status-box";
  outputDiv.textContent = "Loading products...";

  try {
    const response = await fetch(
      `/products-simple?term=${term}&locationId=${locationId}`
    );

    const data = await response.json();

    console.log("Products:", data);

    outputDiv.innerHTML = "";
    outputDiv.className = "products-grid";

    if (!data.products?.length) {
      outputDiv.className = "status-box";
      outputDiv.textContent = "No products found. Try a different search term.";
      return;
    }

    data.products.forEach((product) => {
      const card = document.createElement("div");
      const hasImage = product.image && product.image !== "No image listed";
      const price = formatPrice(product.price);

      card.className = "product-card";
      card.innerHTML = `
        <div class="product-image-wrap">
          ${
            hasImage
              ? `<img class="product-image" src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" />`
              : `<span class="text-secondary">No image</span>`
          }
        </div>
        <div class="product-body">
          <h3 class="product-name">${escapeHtml(product.name)}</h3>
          <div class="product-brand">${escapeHtml(product.brand || "Brand not listed")}</div>
          <div class="price-pill">${escapeHtml(price)}</div>
          <div class="product-meta">
            <div class="meta-row"><span>Size</span><strong>${escapeHtml(product.size)}</strong></div>
            <div class="meta-row"><span>Aisle</span><strong>${escapeHtml(product.aisle)}</strong></div>
          </div>
          <button class="btn btn-primary add-item-btn" type="button">Add to List</button>
        </div>
      `;

      card.querySelector(".add-item-btn").addEventListener("click", () => {
        addToList(product);
      });

      outputDiv.appendChild(card);
    });
  } catch (error) {
    console.error(error);
    outputDiv.textContent = "Failed to load products.";
  }
}

storeButton.addEventListener("click", getStores);
productButton.addEventListener("click", getProducts);
budgetInput.addEventListener("input", () => {
  saveBudget();
  renderSelectedItems();
});
selectedListDiv.addEventListener("click", (event) => {
  const removeButton = event.target.closest("[data-remove-id]");

  if (!removeButton) {
    return;
  }

  selectedItems = selectedItems.filter(
    (item) => item.cartId !== removeButton.dataset.removeId
  );
  saveSelectedItems();
  renderSelectedItems();
});

loadSelectedItems();
loadBudget();
renderSelectedItems();
