class CartItem {
    constructor(name, img, price) {
        this.name = name;
        this.img = img;
        this.price = price;
        this.quantity = 1;
    }
}

class localCart {
    static key = 'CartItems';

    static getLocalCartItems() {
        const cartMap = new Map();
        const cart = localStorage.getItem(localCart.key);
        
        if (cart === null || cart.length === 0) return cartMap;
        
        return new Map(Object.entries(JSON.parse(cart)));
    }

    static addItemsToCart(id, item) {
        const cart = localCart.getLocalCartItems();
        
        if (cart.has(id)) {
            const mapItem = cart.get(id);
            mapItem.quantity += 1;
            cart.set(id, mapItem);
        } else {
            cart.set(id, item);
        }

        localStorage.setItem(localCart.key, JSON.stringify(Object.fromEntries(cart)));
        // Implement the updatecart UI logic here
    }

    static removeItemFromCart(id) {
        const cart = localCart.getLocalCartItems();

        if (cart.has(id)) {
            const mapItem = cart.get(id);

            if (mapItem.quantity > 1) {
                mapItem.quantity -= 1;
                cart.set(id, mapItem);
            } else {
                cart.delete(id);
            }
        }

        if (cart.size === 0) {
            localStorage.clear();
        } else {
            localStorage.setItem(localCart.key, JSON.stringify(Object.fromEntries(cart)));
        }
    }
}





const cartIcon = document.querySelector('.cart-icon');
const wholeCartWindow = document.querySelector('.whole-Cart-Window');
const addToCartBtns = document.querySelectorAll('.add-to-cart-btn')
addToCartBtns.forEach((btn)=>{
    btn.addEventListener('click', addItemFunction)
})

function addItemFunction(e) {
    const foodCard = e.target.closest('.food-card'); // Find the closest parent with class "food-card"
    const id = foodCard.getAttribute('data-id');
    const img = foodCard.querySelector('.food-card-img').src;
    const name = foodCard.querySelector('h3').textContent;
    const price = foodCard.querySelector('span').textContent.replace('$', '');
    const item = new CartItem(name, img, price);


    localCart.addItemsToCart(id, item);
    updateCartUI(); // Implement this function to update the UI with the new cart contents
}

// Hide the cart window on page load
if (!localStorage.getItem('cartVisible')) {
    wholeCartWindow.classList.add('hide');
}

cartIcon.addEventListener('mouseover', () => {
    if (wholeCartWindow.classList.contains('hide')) {
        wholeCartWindow.classList.remove('hide');
    }
});

cartIcon.addEventListener('mouseleave', () => {
    setTimeout(() => {
        if (wholeCartWindow.inWindow === 0) {
            wholeCartWindow.classList.add('hide');
        }
    }, 500);
});

wholeCartWindow.addEventListener('mouseover', () => {
    wholeCartWindow.inWindow = 1.5;
});

wholeCartWindow.addEventListener('mouseleave', () => {
    wholeCartWindow.inWindow = 0;
    wholeCartWindow.classList.add('hide');
});

// Store cart visibility state in localStorage before reload
window.addEventListener('beforeunload', () => {
    if (!wholeCartWindow.classList.contains('hide')) {
        localStorage.setItem('cartVisible', 'true');
    } else {
        localStorage.removeItem('cartVisible');
    }
});

function updateCartUI() {
    const CartWrapper = document.querySelector('.cart-wrapper');
    CartWrapper.innerHTML = '';

    const items = localCart.getLocalCartItems(); // Get the cart items using the correct method

    if (items.size === 0) return; // Check for size instead of null

    let count = 0;
    let total = 0;

    for (const [key, value] of items.entries()) {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        let price = value.price * value.quantity;
        count += 1;
        total += price;
        cartItem.innerHTML = `
            <img src="${value.img}" alt="">
            <div class="details">
                <h3>${value.name}</h3>
                <p>${value.desc}</p>
                <span class="quantity">Quantity: ${value.quantity}</span>
                <span class="price">Price: $ ${price}</span>
            </div>
            <div class="cancel"><i class="fas fa-window-close"></i></div>
        `;
        
        cartItem.lastElementChild.addEventListener('click', () => {
            localCart.removeItemFromCart(key);
            updateCartUI(); // Update the UI after removing an item
        });

        CartWrapper.append(cartItem); // Use cartItem instead of cartItems
    }

    if (count > 0) { // Corrected the condition to check for count > 0
        cartIcon.classList.add('non-empty');
        let root = document.querySelector(':root');
        root.style.setProperty('--after-content', `"${count}"`);
        const subtotal = document.querySelector('.subtotal');
        subtotal.innerHTML = `Subtotal: $${total}`;
    } else {
        cartIcon.classList.remove('non-empty');
    }
}

// You don't need to add event listeners within the updateCartUI function
// Remove the document.addEventListener('DOMContentLoaded', () => { ... }); from inside the updateCartUI function

// Call the updateCartUI function once on page load
updateCartUI();
 