// DECLARAR Y MUESTRA PRODUCTOS

const products = [
  {
    id: 1,
    name: "Iphone 14",
    img: "img/iphone14.png",
    price: 1500,
    quantity: 0,
  },
  {
    id: 2,
    name: "Silicone Case",
    img: "img/case.png",
    price: 50,
    quantity: 0,
  },
  {
    id: 3,
    name: "Airpods",
    img: "img/airpods.jpeg",
    price: 250,
    quantity: 0,
  },
];

const containerProductos = document.querySelector(".container-products");

function showProducts() {
  products.forEach((prod) => {
    let card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
        <div class="top-card">
          <p>$${prod.price}</p>
          <button class="btn-pointer" id="favorite">
            <i class="fa-solid fa-heart"></i>
          </button>
        </div>
        <div class="img-card">
          <img src="${prod.img}" alt="" />
        </div>
        <div class="bottom-card">
          <p id="item">${prod.name}</p>
          <button class="btn-pointer addProduct" data-prod="${prod.id}">
            <i class="fa-solid fa-cart-plus"></i>
          </button>
        </div>
      `;

    containerProductos.appendChild(card);
  });
}

showProducts();

// ABRIR EL CARRITO

const openCart = document.querySelector(".cart");

function showCart() {
  openCart.addEventListener("click", () => {
    const cartMenu = document.querySelector(".container-menu");
    if (cartMenu.style.display === "none") {
      cartMenu.style.display = "block";
    } else {
      cartMenu.style.display = "none";
    }
  });
}
showCart();

// AGREGAR PRODUCTOS AL CARRITO

const addProduct = document.querySelectorAll(".addProduct");
const menu = document.querySelector(".container-menu");
const containerBtn = document.querySelector(".container-btn");
const cartAmount = document.querySelector("#cartAmount");
const cartTotalPriceElement = document.querySelector("#total");
const clearCartBtn = document.querySelector("#clear-cart");
const confirm = document.querySelector("#confirm");
const cartList = [];
let productCount = 0;
let totalPrice = 0;

function showProductsCart() {
  menu.innerHTML = "";

  const productQuantity = {};

  cartList.forEach((product) => {
    if (product.id in productQuantity) {
      productQuantity[product.id] += 1;
    } else {
      productQuantity[product.id] = 1;
    }
  });

  cartList.forEach((pList) => {
    let list = document.createElement("div");
    list.classList.add("cart-menu");
    list.innerHTML = `
        <div class="cart-img">
          <img src="${pList.img}" alt="" />
        </div>
        <div class="cart-quantity">
        <button class="minus-button" data-prod="${pList.id}"><i class="fa-solid fa-minus"></i></button>
          <p class="quantity" id="quantity-${pList.id}">${pList.quantity}</p>
        <button class="plus-button" data-prod="${pList.id}"><i class="fa-solid fa-plus"></i></button>
        </div>
        <div class="cart-info">
          <p>${pList.name}</p>
          <p>$${pList.price}</p>
        </div>
        <div class="cart-delete">
          <button class="delete-item" data-prod="${pList.id}">
            <i class="fa-solid fa-circle-xmark"></i>
          </button>
        </div>
    `;

    menu.appendChild(list);

    const deleteButtons = list.querySelectorAll(".delete-item");
    deleteButtons.forEach((deleteButton) => {
      deleteButton.addEventListener("click", () => {
        const productId = deleteButton.getAttribute("data-prod");
        removeProduct(productId);

        Toastify({
          text: "Product deleted!",
          className: "info",
          style: {
            background: "linear-gradient(to right, #FF1600, #FF211F)",
          },
          offset: {
            x: 10,
            y: 850,
          },
        }).showToast();
      });
    });

    const minusButton = list.querySelector(".minus-button");
    minusButton.addEventListener("click", () => {
      updateQuantity(pList.id, -1);
    });

    const plusButton = list.querySelector(".plus-button");
    plusButton.addEventListener("click", () => {
      updateQuantity(pList.id, 1);
    });
  });

  // actualiza el precio total
  const totalPriceAllItems = cartList.reduce(
    (total, p) => total + p.price * p.quantity,
    0
  );
  cartTotalPriceElement.textContent = `$${totalPriceAllItems.toFixed(2)}`;
}

function addProducts() {
  addProduct.forEach((p) => {
    p.addEventListener("click", () => {
      const productId = p.getAttribute("data-prod");
      const product = products.find(
        (product) => product.id === parseInt(productId)
      );
      if (product) {
        const existingProduct = cartList.find((p) => p.id === product.id);
        if (existingProduct) {
          existingProduct.quantity++;

          const quantityElement = menu.querySelector(
            `[data-prod="${existingProduct.id}"] .quantity`
          );
          if (quantityElement) {
            quantityElement.textContent = existingProduct.quantity;
          }
        } else {
          product.quantity = 1;
          cartList.push(product);
          productCount++;
          cartAmount.textContent = productCount;

          showProductsCart();
        }
        localStorage.setItem("Cart-List", JSON.stringify(cartList));
        localStorage.setItem(
          "Cart-Amount",
          JSON.stringify(cartAmount.textContent)
        );
        localStorage.setItem("Total", cartTotalPriceElement.textContent);

        Toastify({
          text: "Product added!",
          className: "info",
          style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
          },
          offset: {
            x: 10,
            y: 850,
          },
        }).showToast();
      }
    });
  });
}

addProducts();

function removeProduct(productId) {
  const productIndex = cartList.findIndex(
    (product) => product.id === parseInt(productId)
  );
  if (productIndex !== -1) {
    cartList.splice(productIndex, 1);
    productCount--;
    cartAmount.textContent = productCount;
    showProductsCart();
  }
  localStorage.setItem("Cart-List", JSON.stringify(cartList));
  localStorage.setItem("Cart-Amount", JSON.stringify(cartAmount.textContent));
  localStorage.setItem("Total", cartTotalPriceElement.textContent);
}

function updateQuantity(productId, quantityChange) {
  const product = cartList.find((p) => p.id === productId);
  if (product) {
    const oldQuantity = product.quantity;
    product.quantity += quantityChange;

    if (product.quantity < 0) {
      product.quantity = 0;
    }

    const quantityElement = menu.querySelector(`#quantity-${product.id}`);
    if (quantityElement) {
      quantityElement.textContent = product.quantity;
    }

    localStorage.setItem("Cart-List", JSON.stringify(cartList));
    localStorage.setItem("Cart-Amount", JSON.stringify(cartAmount.textContent));
    localStorage.setItem("Total", cartTotalPriceElement.textContent); // me guarda el precio anterior no me muestra el actual, preguntar

    const priceChange = product.price * (product.quantity - oldQuantity);
    product.totalPrice += priceChange;

    const totalPriceAllItems = cartList.reduce(
      (total, p) => total + p.price * p.quantity,
      0
    );

    cartTotalPriceElement.textContent = `$${totalPriceAllItems.toFixed(2)}`;
  }
}

// VACIAR EL CARRITO

clearCartBtn.addEventListener("click", () => {
  cartList.length = 0;
  productCount = 0;
  cartAmount.textContent = productCount;
  showProductsCart();

  localStorage.setItem("Cart-List", JSON.stringify(cartList));
  localStorage.setItem("Cart-Amount", JSON.stringify(cartAmount.textContent));
  localStorage.setItem("Total", cartTotalPriceElement.textContent);
});

// CONFIRMAR COMPRA

confirm.addEventListener("click", () => {
  Swal.fire({
    title: "Do you want to confirm the purchase?",
    showCancelButton: true,
    confirmButtonColor: "#96c93d",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, I want",
    backdrop: `
    rgba(0,0,2,0.4)
    left top
    no-repeat
  `,
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire("Your purchase has been confirmed!");
      cartList.length = 0;
      productCount = 0;
      cartAmount.textContent = productCount;
      showProductsCart();

      localStorage.setItem("Cart-List", JSON.stringify(cartList));
      localStorage.setItem(
        "Cart-Amount",
        JSON.stringify(cartAmount.textContent)
      );
      localStorage.setItem("Total", cartTotalPriceElement.textContent);
    }
  });
});

// MARCAR COMO FAVORITO

const favorite = document.querySelectorAll("#favorite");

favorite.forEach((fav) => {
  fav.addEventListener("click", () => {
    if (fav.style.color === "red") {
      fav.style.color = "black";
    } else {
      fav.style.color = "red";
    }
  });
});

// Guardar en el almacenamiento local

const cartListJson = localStorage.getItem("Cart-List");
const cartAmountJson = localStorage.getItem("Cart-Amount");
const totalJson = localStorage.getItem("Total");

if (cartListJson) {
  const cartListInLS = JSON.parse(cartListJson);
  cartList.push(...cartListInLS);
  productCount = cartList.length;
  cartAmount.textContent = productCount;
}

if (cartAmountJson) {
  const cartAmountInLS = JSON.parse(cartAmountJson);
  cartAmount.textContent = cartAmountInLS;
}

if (totalJson) {
  const totalInLS = totalJson;
  cartTotalPriceElement.textContent = totalInLS;
}

showProductsCart();

// BARRA DE BUSQUEDA

const searchProduct = document.querySelector("#productInput");

function search() {
  searchProduct.addEventListener("keyup", () => {
    // TERMINAR ESTO
  });
}
search();
