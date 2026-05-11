const form = document.querySelector("#productForm");
const productIdInput = document.querySelector("#productId");
const nameInput = document.querySelector("#name");
const descriptionInput = document.querySelector("#description");
const priceInput = document.querySelector("#price");
const quantityInput = document.querySelector("#quantity");
const submitButton = document.querySelector("#submitButton");
const cancelButton = document.querySelector("#cancelButton");
const refreshButton = document.querySelector("#refreshButton");
const productsBody = document.querySelector("#productsBody");
const emptyState = document.querySelector("#emptyState");
const statusMessage = document.querySelector("#statusMessage");

let products = [];

const moneyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

function setStatus(message, isError = false) {
  statusMessage.textContent = message;
  statusMessage.style.color = isError ? "#b42318" : "#657083";
}

function productPayload() {
  return {
    product: {
      name: nameInput.value.trim(),
      description: descriptionInput.value.trim(),
      price: Number(priceInput.value),
      quantity: Number.parseInt(quantityInput.value, 10)
    }
  };
}

async function request(path, options = {}) {
  const response = await fetch(path, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    ...options
  });

  if (response.status === 204) return null;

  const body = await response.json();

  if (!response.ok) {
    const message = body.errors?.join(", ") || body.error || "Request failed";
    throw new Error(message);
  }

  return body;
}

function resetForm() {
  form.reset();
  productIdInput.value = "";
  submitButton.textContent = "Add product";
  cancelButton.hidden = true;
  nameInput.focus();
}

function editProduct(product) {
  productIdInput.value = product.id;
  nameInput.value = product.name;
  descriptionInput.value = product.description || "";
  priceInput.value = product.price;
  quantityInput.value = product.quantity;
  submitButton.textContent = "Save changes";
  cancelButton.hidden = false;
  nameInput.focus();
}

function renderProducts() {
  productsBody.innerHTML = "";
  emptyState.hidden = products.length > 0;

  for (const product of products) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><strong>${escapeHtml(product.name)}</strong></td>
      <td class="description-cell">${escapeHtml(product.description || "No description")}</td>
      <td class="money-cell">${moneyFormatter.format(Number(product.price))}</td>
      <td class="quantity-cell">${product.quantity}</td>
      <td>
        <div class="row-actions">
          <button class="secondary-button" type="button" data-action="edit" data-id="${product.id}">Edit</button>
          <button class="danger-button" type="button" data-action="delete" data-id="${product.id}">Delete</button>
        </div>
      </td>
    `;
    productsBody.appendChild(row);
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function loadProducts() {
  setStatus("Loading products...");
  try {
    products = await request("/products");
    renderProducts();
    setStatus(`${products.length} product${products.length === 1 ? "" : "s"} loaded.`);
  } catch (error) {
    setStatus(error.message, true);
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const productId = productIdInput.value;
  const isEditing = Boolean(productId);

  submitButton.disabled = true;
  setStatus(isEditing ? "Saving changes..." : "Adding product...");

  try {
    await request(isEditing ? `/products/${productId}` : "/products", {
      method: isEditing ? "PATCH" : "POST",
      body: JSON.stringify(productPayload())
    });

    resetForm();
    await loadProducts();
    setStatus(isEditing ? "Product updated." : "Product added.");
  } catch (error) {
    setStatus(error.message, true);
  } finally {
    submitButton.disabled = false;
  }
});

productsBody.addEventListener("click", async (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const product = products.find((item) => String(item.id) === button.dataset.id);
  if (!product) return;

  if (button.dataset.action === "edit") {
    editProduct(product);
    return;
  }

  const confirmed = window.confirm(`Delete ${product.name}?`);
  if (!confirmed) return;

  setStatus("Deleting product...");
  try {
    await request(`/products/${product.id}`, { method: "DELETE" });
    await loadProducts();
    setStatus("Product deleted.");
  } catch (error) {
    setStatus(error.message, true);
  }
});

cancelButton.addEventListener("click", resetForm);
refreshButton.addEventListener("click", loadProducts);

loadProducts();
