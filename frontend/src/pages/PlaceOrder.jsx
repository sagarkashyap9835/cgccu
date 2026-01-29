import React, { useContext, useState } from "react";
import { AppContext } from "./Appcontext";
import { CartContext } from "../context/CartContext"; // Assuming you have cart items in context
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const PlaceOrder = () => {
    const { backendUrl, token } = useContext(AppContext);
    const { cart, setCart } = useContext(CartContext); // Assuming setCart allows clearing, or we fetch again
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        street: "",
        city: "",
        state: "",
        zipcode: "",
        country: "",
        phone: "",
    });

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setFormData((data) => ({ ...data, [name]: value }));
    };

    const placeOrder = async (event) => {
        event.preventDefault();
        try {
            if (cart.length === 0) return toast.error("Cart is empty");

            let orderItems = cart;
            let orderAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

            let orderData = {
                address: formData,
                items: orderItems,
                amount: orderAmount,
            };

            const response = await axios.post(
                `${backendUrl}/api/order/place`,
                orderData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                toast.success("Order Placed Successfully!");
                // setTimeout(() => {
                navigate("/my-order");
                // }, 2000);
            } else {
                toast.error("Error placing order");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <form
            onSubmit={placeOrder}
            className="flex flex-col sm:flex-row justify-between gap-4 pt-24 sm:pt-32 min-h-screen bg-gray-50 px-4 sm:px-10 pb-20"
        >
            {/* --- Left Side: Delivery Information --- */}
            <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
                <div className="text-xl sm:text-2xl my-3">
                    <h2 className="text-gray-500 uppercase tracking-widest text-sm font-bold mb-2">Checkout</h2>
                    <h1 className="text-3xl font-black text-gray-900">Delivery Information</h1>
                </div>
                <div className="flex gap-3">
                    <input
                        required
                        onChange={onChangeHandler}
                        name="firstName"
                        value={formData.firstName}
                        className="border border-gray-300 rounded py-2.5 px-3.5 w-full focus:outline-none focus:border-black transition-colors"
                        type="text"
                        placeholder="First name"
                    />
                    <input
                        required
                        onChange={onChangeHandler}
                        name="lastName"
                        value={formData.lastName}
                        className="border border-gray-300 rounded py-2.5 px-3.5 w-full focus:outline-none focus:border-black transition-colors"
                        type="text"
                        placeholder="Last name"
                    />
                </div>
                <input
                    required
                    onChange={onChangeHandler}
                    name="email"
                    value={formData.email}
                    className="border border-gray-300 rounded py-2.5 px-3.5 w-full focus:outline-none focus:border-black transition-colors"
                    type="email"
                    placeholder="Email address"
                />
                <input
                    required
                    onChange={onChangeHandler}
                    name="street"
                    value={formData.street}
                    className="border border-gray-300 rounded py-2.5 px-3.5 w-full focus:outline-none focus:border-black transition-colors"
                    type="text"
                    placeholder="Street"
                />
                <div className="flex gap-3">
                    <input
                        required
                        onChange={onChangeHandler}
                        name="city"
                        value={formData.city}
                        className="border border-gray-300 rounded py-2.5 px-3.5 w-full focus:outline-none focus:border-black transition-colors"
                        type="text"
                        placeholder="City"
                    />
                    <input
                        required
                        onChange={onChangeHandler}
                        name="state"
                        value={formData.state}
                        className="border border-gray-300 rounded py-2.5 px-3.5 w-full focus:outline-none focus:border-black transition-colors"
                        type="text"
                        placeholder="State"
                    />
                </div>
                <div className="flex gap-3">
                    <input
                        required
                        onChange={onChangeHandler}
                        name="zipcode"
                        value={formData.zipcode}
                        className="border border-gray-300 rounded py-2.5 px-3.5 w-full focus:outline-none focus:border-black transition-colors"
                        type="number"
                        placeholder="Zipcode"
                    />
                    <input
                        required
                        onChange={onChangeHandler}
                        name="country"
                        value={formData.country}
                        className="border border-gray-300 rounded py-2.5 px-3.5 w-full focus:outline-none focus:border-black transition-colors"
                        type="text"
                        placeholder="Country"
                    />
                </div>
                <input
                    required
                    onChange={onChangeHandler}
                    name="phone"
                    value={formData.phone}
                    className="border border-gray-300 rounded py-2.5 px-3.5 w-full focus:outline-none focus:border-black transition-colors"
                    type="number"
                    placeholder="Phone"
                />
            </div>

            {/* --- Right Side: Cart Totals & Payment --- */}
            <div className="mt-8 sm:mt-0 w-full sm:max-w-md">
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <h2 className="text-2xl font-bold mb-6">Cart Total</h2>
                    <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-bold">₹{cart.reduce((acc, item) => acc + item.price * item.quantity, 0)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Booking Fee</span>
                        <span className="font-bold">Free</span>
                    </div>
                    <div className="flex justify-between py-4 text-xl font-black">
                        <span>Total</span>
                        <span>₹{cart.reduce((acc, item) => acc + item.price * item.quantity, 0)}</span>
                    </div>

                    <div className="mt-8">
                        <h3 className="font-bold mb-4 uppercase text-xs tracking-widest text-gray-400">Payment Method</h3>
                        <div className="flex gap-3 flex-col">
                            <div className="flex items-center gap-3 border p-3 rounded cursor-pointer hover:border-black bg-gray-50">
                                <p className={`min-w-3.5 h-3.5 border rounded-full bg-green-500`}></p>
                                <p className="text-sm font-bold text-gray-700">CASH ON PAYMENT (Standard)</p>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full mt-8 bg-black text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-gray-800 transition active:scale-95"
                        >
                            Confirm Booking
                        </button>
                    </div>
                </div>
            </div>
            <ToastContainer position="bottom-right" theme="dark" />
        </form>
    );
};

export default PlaceOrder;
