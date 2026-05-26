const Products = [
    { id: 1, name: "iPhone 15 Pro", price: 999, category: "phone", desc: "A17 Pro chip, Titanium design.", img: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400" },
    { id: 2, name: "Galaxy S24 Ultra", price: 1199, category: "phone", desc: "Galaxy AI, 200MP Camera.", img: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400" },
    { id: 3, name: "MacBook Pro 14\"", price: 1599, category: "laptop", desc: "M3 chip, Liquid Retina XDR.", img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400" },
    { id: 4, name: "Dell XPS 13", price: 1299, category: "laptop", desc: "Intel Core Ultra, InfinityEdge.", img: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400" },
    { id: 5, name: "Google Pixel 8 Pro", price: 999, category: "phone", desc: "Pure Android, Best-in-class AI camera.", img: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400" }
];

let cart = [];

const productContainer = document.getElementById('product-container');
const cartSidebar = document.getElementById('cart-sidebar');
const cartToggle = document.getElementById('cart-toggle');
const closeCart = document.getElementById('close-cart');
const cartItemsContainer = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotalPrice = document.getElementById('cart-total-price');
const filterBtns = document.querySelectorAll('.filter-btn');
const checkoutBtn = document.getElementById('checkout-btn');

function displayProducts(products) {
    productContainer.innerHTML = '';
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.img}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.desc}</p>
            <p>$${product.price.toFixed(2)}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        productContainer.appendChild(productCard);
    });
}

function addToCart(productId) {
    const product = Products.find(p => p.id === productId);
    const cartItem = cart.find(item => item.product.id === productId);
    if (cartItem) {
        cartItem.quantity++;
    } else {
        cart.push({ product, quantity: 1 });
    }
    updateCart();
}

function updateCart() {
    cartItemsContainer.innerHTML = '';
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <span>${item.product.name} x ${item.quantity}</span>
            <span>$${(item.product.price * item.quantity).toFixed(2)}</span>
        `;
        cartItemsContainer.appendChild(cartItem);
    });
    cartCount.textContent = cart.reduce((acc, item) => acc + item.quantity, 0);
    cartTotalPrice.textContent = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0).toFixed(2);
}

cartToggle.addEventListener('click', () => {
    cartSidebar.classList.add('open');
});

closeCart.addEventListener('click', () => {
    cartSidebar.classList.remove('open');
});
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const category = btn.getAttribute('data-category'); 
        if (category === 'all') {
            displayProducts(Products);
        } else {
            const filteredProducts = Products.filter(p => p.category === category);
            displayProducts(filteredProducts);
        }
    });
} 
);
checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    alert('Thank you for your purchase!');
    cart = [];
    updateCart();
});

displayProducts(Products);




