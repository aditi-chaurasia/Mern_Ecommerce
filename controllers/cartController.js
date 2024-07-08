import Cart from "../models/cartmodel.js";

// add to cart
export const addToCart = async (req, res) => {
    const { productId, title, price, qty, imgSrc } = req.body;
    const userId = req.user;

    let cart = await Cart.findOne({ userId }); // find cart with the help of user id

    if (!cart) {
        cart = new Cart({ userId, items: [] }); // card does not exist, make new cart
    }

    // find the index of the product and increase quantity if it exists
    const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);

    if (itemIndex > -1) {
        cart.items[itemIndex].qty += qty;
        cart.items[itemIndex].price += price * qty;
    } else {
        cart.items.push({ productId, title, price, qty, imgSrc });
    }

    await cart.save();
    res.json({ message: 'Item added to cart', cart });
};

// get user cart
export const userCart = async (req, res) => {
    const userId = req.user;

    let cart = await Cart.findOne({ userId });
    if (!cart) {
        res.json({ message: "Cart not found" });
        return; // Added return statement to prevent further execution
    }

    res.json({ message: "User cart", cart });
};

// remove product from cart
export const removeProductFromCart = async (req, res) => {
    const productId = req.params.productId;
    const userId = req.user;

    let cart = await Cart.findOne({ userId });
    if (!cart) {
        res.json({ message: "Cart not found" });
        return; // Added return statement to prevent further execution
    }

    cart.items = cart.items.filter((item) => item.productId.toString() !== productId);

    await cart.save();

    res.json({ message: "Product removed from cart" });
};

// clear cart
export const clearCart = async (req, res) => {
    const userId = req.user;

    let cart = await Cart.findOne({ userId });
    if (!cart) {
        cart = new Cart({ userId, items: [] });
    } else {
        cart.items = [];
    }

    await cart.save();

    res.json({ message: "Cart cleared" });
};

// decrease quantity from cart
export const decreaseProductQty = async (req, res) => {
    const { productId, qty, imgSrc } = req.body;
    const userId = req.user;

    let cart = await Cart.findOne({ userId }); // find cart with the help of user id

    if (!cart) {
        cart = new Cart({ userId, items: [] }); // cart does not exist, make new cart
    }

    const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);

    if (itemIndex > -1) {
        const item = cart.items[itemIndex];
        if (item.qty > 1) {
            const pricePerUnit = item.price / item.qty;
            item.qty -= qty;
            item.price -= pricePerUnit * qty;
        } else {
            cart.items.splice(itemIndex, 1);
        }
    } else {
        res.json({ message: "Invalid Product Id" });
        return; // Added return statement to prevent further execution
    }

    await cart.save();
    res.json({ message: 'Item quantity decreased', cart });
};
