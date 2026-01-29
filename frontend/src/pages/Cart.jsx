import React, { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/CartContext";
import { assets } from "../assets/assets"; // Assuming trash icon might be here or use react-icons
import { FaTrash, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, decreaseQty, increaseQty } = useContext(CartContext);
    const navigate = useNavigate();
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const t = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
        setTotal(t);
    }, [cart]);

    if (cart.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center pt-20">
                <h2 className="text-3xl font-bold text-gray-300">Your Cart is Empty</h2>
                <button
                    onClick={() => navigate('/findhome')}
                    className="mt-6 bg-black text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest hover:bg-gray-800 transition"
                >
                    Browse Rooms
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-32 px-4 sm:px-10 pb-20">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-4xl font-black text-gray-900 mb-10 tracking-tighter uppercase italic">Shopping <span className="text-blue-600">Cart</span></h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-6">
                        {cart.map((item) => (
                            <div key={item.productId} className="flex gap-4 bg-white p-4 rounded-2xl shadow-sm items-center">
                                <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                </div>

                                <div className="flex-grow">
                                    <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{item.name}</h3>
                                    <p className="text-gray-500 text-sm font-medium">Rent: ₹{item.price}</p>
                                </div>

                                <div className="flex items-center gap-3">
                                    {/* Qty Controls (Optional for rooms, but good for products) */}
                                    {/* For rooms, quantity usually 1, but let's keep it flexible */}
                                    {/* <button onClick={() => decreaseQty(item.productId)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold">-</button>
                   <span>{item.quantity}</span>
                   <button onClick={() => increaseQty(item.productId)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold">+</button> */}
                                </div>

                                <button
                                    onClick={() => removeFromCart(item.productId)}
                                    className="text-red-500 p-2 hover:bg-red-50 rounded-full transition"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Checkout Summary */}
                    <div className="bg-white p-8 rounded-3xl shadow-lg h-fit">
                        <h3 className="text-xl font-bold mb-6 border-b pb-4">Order Summary</h3>

                        <div className="flex justify-between mb-4 text-gray-600">
                            <span>Subtotal</span>
                            <span>₹{total}</span>
                        </div>
                        <div className="flex justify-between mb-4 text-gray-600">
                            <span>Booking Fee</span>
                            <span>₹0</span>
                        </div>

                        <div className="flex justify-between mt-6 text-2xl font-black text-gray-900 border-t pt-4">
                            <span>Total</span>
                            <span>₹{total}</span>
                        </div>

                        <button
                            onClick={() => navigate('/place-order')}
                            className="w-full mt-8 bg-black text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-gray-800 transition active:scale-95 flex items-center justify-center gap-2"
                        >
                            Proceed to Checkout <FaArrowRight />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
