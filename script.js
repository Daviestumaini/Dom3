// A simple e-commerce SPA built with vanilla JavaScript, demonstrating state management, dynamic rendering, and user interaction handling without any external libraries or frameworks. The application allows users to browse products, manage their shopping cart, and proceed through a checkout process with multiple payment options.
const PRODUCTS = Object.freeze([
    { id: 1, name: "iPhone 15 Pro", price: 299, category: "phone", desc: "A17 Pro chip, premium Titanium build with stunning action button integrations.", img: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&q=80" },
    { id: 2, name: "Galaxy S24 Ultra", price: 199, category: "phone", desc: "Integrated S-Pen, dynamic Galaxy AI tools, and an elite 200MP camera system.", img: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&q=80" },
    { id: 3, name: "MacBook Pro 14\"", price: 599, category: "laptop", desc: "Apple M3 Framework, beautiful Liquid Retina XDR screen display, ultimate battery runtime.", img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80" },
    { id: 4, name: "Dell XPS 13", price: 1299, category: "laptop", desc: "Intel Core Ultra processors matching seamless InfinityEdge premium glass monitors.", img: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&q=80" },
    { id: 5, name: "Google Pixel 8 Pro", price: 599, category: "phone", desc: "Google Tensor G3 chip, advanced AI features, and a pro-grade camera system.", img: "https://images.unsplash.com/photo-1682687226319-1a2b4c3d4e5f?w=500&q=80" },
    { id: 6, name: "HP Spectre x360", price: 699, category: "laptop", desc: "Convertible design with powerful performance and stunning OLED display.", img: "https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?w=500&q=80" },
    { id: 7, name: "OnePlus 11 Pro", price: 199, category: "phone", desc: "Snapdragon 8 Gen 2, Hasselblad Camera for Mobile, and ultra-fast charging.", img: "https://images.unsplash.com/photo-1679875816599-1a2b3c4d5e6f?w=500&q=80" },
    { id: 8, name: "Lenovo ThinkPad X1 Carbon", price: 299, category: "laptop", desc: "Business-class performance with a lightweight design and robust security features.", img: "https://images.unsplash.com/photo-1587825140708-1a2b3c4d5e6f?w=500&q=80" },
    { id: 9, name: "Sony Xperia 1 IV", price: 500, category: "phone", desc: "4K HDR OLED display, pro-grade camera system, and high-fidelity audio.", img: "https://images.unsplash.com/photo-1682687226319-1a2b4c3d4e5f?w=500&q=80" },
    { id: 10, name: "Asus ROG Zephyrus G14", price: 700, category: "laptop", desc: "Gaming powerhouse with AMD Ryzen processors and a stunning AniMe Matrix display.", img: "https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?w=500&q=80"
    }
]);

const INITIAL_STATE = Object.freeze({
    cart: [],
    currentCategory: 'all',
    view: 'shop', // Allowed view options: 'shop' | 'cart' | 'checkout'
    selectedPayment: 'mobile_money' // 'mobile_money' | 'bank'
});

let appState = { ...INITIAL_STATE };



const addToCartAction = (cart, id) => {
    const matched = cart.find(i => i.id === id);
    return matched 
        ? cart.map(i => i.id === id ? { ...i, quantity: i.quantity + 1 } : i)
        : [...cart, { ...PRODUCTS.find(p => p.id === id), quantity: 1 }];
};

const updateQuantityAction = (cart, id, amt) => 
    cart.map(i => i.id === id ? { ...i, quantity: i.quantity + amt } : i).filter(i => i.quantity > 0);

const getTotals = (cart) => cart.reduce((acc, i) => ({
    count: acc.count + i.quantity,
    cost: acc.cost + (i.price * i.quantity)
}), { count: 0, cost: 0 });



// Shop Template View
// This view provides users with an intuitive interface to browse and filter products by category, allowing them to easily explore the available tech catalog and add items to their cart with a single click.
const ShopView = (state) => {
    const items = state.currentCategory === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.category === state.currentCategory);
    return `
        <h2 class="view-title">Explore Tech Catalog</h2>
        <section class="filters" aria-label="Product Filtering">
            <button class="filter-btn ${state.currentCategory === 'all' ? 'active' : ''}" data-cat="all">All Items</button>
            <button class="filter-btn ${state.currentCategory === 'phone' ? 'active' : ''}" data-cat="phone">Phones</button>
            <button class="filter-btn ${state.currentCategory === 'laptop' ? 'active' : ''}" data-cat="laptop">Laptops</button>
        </section>
        <section class="product-grid" aria-label="Products">
            ${items.map(p => `
                <article class="product-card">
                    <img src="${p.img}" alt="${p.name} - ${p.desc}">
                    <h3>${p.name}</h3>
                    <p>${p.desc}</p>
                    <div class="price" aria-label="Price">$${p.price}</div>
                    <button class="btn-primary add-to-cart" data-id="${p.id}">Add to Cart</button>
                </article>
            `).join('')}
        </section>
    `;
};

// Cart Template View
// This view provides users with a clear and organized layout to review their selected items, adjust quantities, and proceed to checkout, enhancing the overall shopping experience by allowing easy modifications before finalizing the purchase.
const CartView = (state) => {
    const { cost } = getTotals(state.cart);
    if (state.cart.length === 0) {
        return `<h2>Your Cart is Empty</h2><button class="btn-primary" id="back-to-shop" style="margin-top:1rem; max-width:200px;">Return to Shop</button>`;
    }
    return `
        <h2 class="view-title">Review Shopping Cart</h2>
        <div class="cart-layout">
            <section class="cart-list" aria-label="Items in Cart">
                ${state.cart.map(item => `
                    <div class="cart-item">
                        <img src="${item.img}" alt="${item.name}">
                        <div style="flex-grow:1;">
                            <h3>${item.name}</h3>
                            <p class="price">$${item.price}</p>
                            <div style="display:flex; gap:0.5rem; align-items:center;">
                                <button class="filter-btn qty-change" data-id="${item.id}" data-amt="-1" aria-label="Decrease quantity">-</button>
                                <span aria-label="Quantity">${item.quantity}</span>
                                <button class="filter-btn qty-change" data-id="${item.id}" data-amt="1" aria-label="Increase quantity">+</button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </section>
            <aside class="summary-box" aria-label="Order Checkout Target">
                <h3>Total Cost: $${cost.toFixed(2)}</h3>
                <button class="btn-primary" id="go-to-checkout" style="margin-top: 1rem;">Proceed to Checkout</button>
            </aside>
        </div>
    `;
};

// Checkout View Template
// This view dynamically renders the appropriate payment fields based on the user's selection of payment method, providing a tailored checkout experience while maintaining a clean and organized layout.
const CheckoutView = (state) => {
    const { cost } = getTotals(state.cart);
    const isMobileMoney = state.selectedPayment === 'mobile_money';
    
    return `
        <h2 class="view-title">Secure Checkout Gateway</h2>
        <div class="cart-layout">
            <form class="checkout-card" id="payment-form" aria-label="Billing Details">
                <h3>1. Select Payment System</h3>
                <div class="payment-options">
                    <label class="radio-label">
                        <input type="radio" name="paymentType" value="mobile_money" ${isMobileMoney ? 'checked' : ''}>
                        <span>Mobile Money Transfer</span>
                    </label>
                    <label class="radio-label">
                        <input type="radio" name="paymentType" value="bank" ${!isMobileMoney ? 'checked' : ''}>
                        <span>Direct Bank Wire Settlement</span>
                    </label>
                </div>

                <h3>2. Payment Authentication</h3>
                <div style="margin-top:1rem;">
                    ${isMobileMoney ? `
                        <div class="form-group">
                            <label for="phone-no">Registered Mobile Number</label>
                            <input type="tel" id="phone-no" required placeholder="e.g., +1 (555) 019-2834">
                        </div>
                        <div class="form-group">
                            <label for="provider">Carrier Network Provider</label>
                            <input type="text" id="provider" required placeholder="e.g., M-Pesa, Orange, MTN">
                        </div>
                    ` : `
                        <div class="form-group">
                            <label for="bank-acc">Account Routing Identification (IBAN/No)</label>
                            <input type="text" id="bank-acc" required placeholder="Ex: US9394029304910394">
                        </div>
                        <div class="form-group">
                            <label for="bank-name">Financial Institution Name</label>
                            <input type="text" id="bank-name" required placeholder="Ex: Chase, Barclays Bank">
                        </div>
                    `}
                </div>
                <button type="submit" class="btn-primary" style="margin-top:1.5rem;">Authorize Payment of $${cost.toFixed(2)}</button>
            </form>
            
            <aside class="summary-box" aria-label="Final Overview Box">
                <h3>Order Outline</h3>
                <p style="margin: 1rem 0;">Total Due: <strong>$${cost.toFixed(2)}</strong></p>
                <button type="button" class="filter-btn" id="cancel-checkout" style="width:100%;">Change Items/Go Back</button>
            </aside>
        </div>
    `;
};



const updateState = (deltaState) => {
    appState = { ...appState, ...deltaState };
    renderApp(appState);
};

const renderApp = (state) => {
    // Top bar cart badge rendering
    const { count } = getTotals(state.cart);
    document.getElementById('cart-count').textContent = count;

    // Direct Viewport Mounting Strategy
    const viewport = document.getElementById('app-viewport');
    if (state.view === 'shop') viewport.innerHTML = ShopView(state);
    if (state.view === 'cart') viewport.innerHTML = CartView(state);
    if (state.view === 'checkout') viewport.innerHTML = CheckoutView(state);
};


document.addEventListener('click', (e) => {
    const tgt = e.target;

    // View Navigation Switches
    // This allows users to navigate between the shop, cart, and checkout views seamlessly without needing to reload the page, providing a smooth user experience.
    if (tgt.id === 'nav-home' || tgt.id === 'back-to-shop') { e.preventDefault(); updateState({ view: 'shop' }); }
    if (tgt.id === 'nav-cart' || tgt.id === 'cancel-checkout') updateState({ view: 'cart' });
    if (tgt.id === 'go-to-checkout') updateState({ view: 'checkout' });

    // Category Filtering Action
    // This allows users to filter products by category without needing to reload the page or navigate away, providing a seamless browsing experience.
    if (tgt.classList.contains('filter-btn') && tgt.hasAttribute('data-cat')) {
        updateState({ currentCategory: tgt.getAttribute('data-cat') });
    }

    // Add Item Action
    // This allows users to add products to their cart directly from the product listing, updating the cart state immutably and re-rendering the cart badge count in the header for immediate feedback.
    if (tgt.classList.contains('add-to-cart')) {
        const id = parseInt(tgt.getAttribute('data-id'), 10);
        updateState({ cart: addToCartAction(appState.cart, id) });
    }

    // Cart Quantity Step Operators
    // This allows users to increment or decrement item quantities directly from the cart view, providing a seamless shopping experience without needing to navigate back to the product listing.
    if (tgt.classList.contains('qty-change')) {
        const id = parseInt(tgt.getAttribute('data-id'), 10);
        const amt = parseInt(tgt.getAttribute('data-amt'), 10);
        updateState({ cart: updateQuantityAction(appState.cart, id, amt) });
    }
});

// Capture Changes on Inputs Form dynamically to alternate Radio choices smoothly
// This allows us to update the payment method selection in the state without needing to directly manipulate the DOM elements, keeping our state management clean and consistent.
document.addEventListener('change', (e) => {
    if (e.target.name === 'paymentType') {
        updateState({ selectedPayment: e.target.value });
    }
});

// Intercept Form Submission processing to isolate native side effects smoothly
// In a real-world scenario, this is where you'd integrate with payment APIs and handle responses accordingly.
document.addEventListener('submit', (e) => {
    if (e.target.id === 'payment-form') {
        e.preventDefault();
        alert(`Transaction Processing Successful via ${appState.selectedPayment === 'mobile_money' ? 'Mobile Money Gateway' : 'Bank Direct Wire Routing'}! Your purchase has been confirmed.`);
        updateState({ ...INITIAL_STATE }); // Dynamic safe app baseline loop reset
    }
});

// Initial Render Call to populate the app on page load
renderApp(appState);