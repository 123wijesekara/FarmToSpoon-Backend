import CartProductModel from '../models/cartproduct.model.js';
import UserModel from '../models/user.model.js';
import ProductModel from '../models/product.model.js';
export const addToCartItemController = async (request, response) => {
    try {
        const userId = request.userId;
        const { productId } = request.body;

        if (!productId) {
            return response.status(400).json({
                message: "Provide productId",
                error: true,
                success: false
            });
        }

        // Check if product is already in the cart
        const checkProduct = await CartProductModel.findOne({
            userId: userId,
            productId: productId
        });

        if (checkProduct) {
            return response.status(400).json({
                message: "Item already in cart",
                error: true,
                success: false
            });
        }

        // Find product and check stock
        const product = await ProductModel.findById(productId);
        if (!product) {
            return response.status(404).json({
                message: "Product not found",
                error: true,
                success: false
            });
        }

        if (product.stock < 1) {
            return response.status(400).json({
                message: "Product out of stock",
                error: true,
                success: false
            });
        }

        // Deduct 1 from stock
        product.stock -= 1;
        await product.save();

        // Add new item to cart
        const cartItem = new CartProductModel({
            quantity: 1,
            userId: userId,
            productId: productId
        });

        const save = await cartItem.save();

        // Update user shopping cart
        await UserModel.updateOne({ _id: userId }, {
            $push: { shopping_cart: productId }
        });

        return response.json({
            data: save,
            message: "Item added successfully",
            error: false,
            success: true
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};


export const getCartItemController = async (request, response) => {
    try {
        const userId = request.userId;
        const cartItems = await CartProductModel.find({ userId: userId })
            .populate('productId');

        return response.json({
            data: cartItems,
            message: "Cart items",
            error: false,
            success: true
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};

// export const updateCartItemQtyController = async (request, response) => {
//     try {
//         const userId = request.userId;
//         const { _id, qty } = request.body;

//         if (!_id || !qty) {
//             return response.status(400).json({
//                 message: "Provide _id and qty",
//                 error: true,
//                 success: false
//             });
//         }

//         const updateCartItem = await CartProductModel.updateOne({ 
//             _id: _id 
//         }, {
//             quantity: qty
//         });

//         return response.json({
//             message: "Cart item updated",
//             error: false,
//             success: true,
//             data: updateCartItem
//         });
//     } catch (error) {
//         return response.status(500).json({
//             message: error.message || error,
//             error: true,
//             success: false
//         });
//     }
// };
 

export const updateCartItemQtyController = async (request, response) => {
    try {
        const userId = request.userId;
        const { _id, qty } = request.body;

        if (!_id || qty == null || qty < 1) {
            return response.status(400).json({
                message: "Provide valid _id and qty (min 1)",
                error: true,
                success: false
            });
        }

        const cartItem = await CartProductModel.findById(_id);
        if (!cartItem) {
            return response.status(404).json({
                message: "Cart item not found",
                error: true,
                success: false
            });
        }

        const product = await ProductModel.findById(cartItem.productId);
        if (!product) {
            return response.status(404).json({
                message: "Product not found",
                error: true,
                success: false
            });
        }

        const oldQty = cartItem.quantity;
        const newQty = qty;
        const diff = newQty - oldQty;

        // If increasing quantity, ensure enough stock
        if (diff > 0 && product.stock < diff) {
            return response.status(400).json({
                message: `Only ${product.stock} item(s) available in stock`,
                error: true,
                success: false
            });
        }

        // Update stock based on quantity change
        product.stock -= diff; // If diff < 0, this increases stock
        await product.save();

        // Update cart item
        await CartProductModel.updateOne({ _id }, { quantity: newQty });

        return response.json({
            message: "Cart item updated and stock adjusted",
            success: true,
            error: false,
            data: { updatedQty: newQty, updatedStock: product.stock }
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || "Server error",
            error: true,
            success: false
        });
    }
};


export const deleteCartItemQtyController = async (request, response) => {
    try {
        const userId = request.userId;
        const { _id } = request.body;

        if (!_id) {
            return response.status(400).json({
                message: "Provide _id",
                error: true,
                success: false
            });
        }

        const cartItem = await CartProductModel.findOne({ _id, userId });
        if (!cartItem) {
            return response.status(404).json({
                message: "Cart item not found",
                error: true,
                success: false
            });
        }

        const product = await ProductModel.findById(cartItem.productId);
        if (product) {
            // Restore stock
            product.stock += cartItem.quantity;
            await product.save();
        }

        await CartProductModel.deleteOne({ _id, userId });

        return response.json({
            message: "Item removed and stock restored",
            success: true,
            error: false,
            data: { restoredQty: cartItem.quantity, currentStock: product?.stock }
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || "Server error",
            error: true,
            success: false
        });
    }
};
