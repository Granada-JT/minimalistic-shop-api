const Cart = require('../models/Cart');
const Checkout = require('../models/Checkout');

// Checkout Function
module.exports.checkoutOrder = (req, res) => {
    Cart.findOne({
        "cartItems._id": req.body.cartItemId
    }).then(cart => {
    
        // This if statement checks if the product exists in the database.
        console.log(req.body);
        console.log(cart);
        if (!cart) {
            return res.send("Cart not found");
        }
    
        // This if statement checks if the user is an admin or not, if an admin is detected, he/she will not be allowed to create an order.
        if (req.user.isAdmin) {
            return res.send(false);
        }
    
        const cartItem = cart.cartItems.find(item => item._id.toString() === req.body.cartItemId);
    
        if (!cartItem) {
            console.log(cartItem);
            return res.send("CartItem not found");
        }
    
        const checkout = new Checkout({
            userId: req.user.id,
            isPaid: false,
            paymentMethod: req.body.paymentMethod,
            checkoutDate: new Date(),
            checkedOutItems: [{
                orderId: cartItem.orderId,
                productId: cartItem.productId,
            }],
            priceToBePaid: cartItem.subTotal
        });
    
        // This return statement saves the newly created order to the database.
        return checkout.save().then(savedCheckout => {
            console.log(savedCheckout);
            return res.json(true);
        }).catch(error => {
            console.log(error);
            return res.json(false);
        });
    }).catch(err => {
        console.log(err);
        return res.json(false);
    });
    
};
