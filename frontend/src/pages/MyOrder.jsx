

import React, { useEffect, useState, useContext } from "react";
import { CartContext } from "../context/CartContext";
import { AppContext } from "../pages/Appcontext";
import axios from "axios";
import { toast } from "react-toastify";

const MyOrder = () => {
  const { cart, increaseQty, decreaseQty, removeFromCart } = useContext(CartContext);
  const { backendUrl, token } = useContext(AppContext);
  const [orders, setOrders] = useState([]);

  // Fetch user's past orders
  const fetchOrders = async () => {
    if (!token) return;
    try {
      const { data } = await axios.get(`${backendUrl}/api/order/my-orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) setOrders(data.orders);
    } catch (error) {
      toast.error("Failed to fetch orders!");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token]);

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Razorpay Checkout
  const handleCheckout = async () => {
    if (!token) return toast.error("Please login first!");
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/order/create`,
        { items: cart, totalPrice: total },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!data.success) return toast.error("Order creation failed!");

      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "Electrical Shop",
        description: "Order Payment",
        order_id: data.orderId,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              `${backendUrl}/api/order/verify`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (verifyRes.data.success) {
              toast.success("✅ Payment successful!");
              removeFromCart(null, true);
              fetchOrders();
            } else {
              toast.error("❌ Payment verification failed!");
            }
          } catch (error) {
            toast.error("❌ Payment verification error!");
          }
        },
        prefill: {
          name: "Customer Name",
          email: "customer@example.com",
          contact: "9999999999",
        },
        theme: { color: "#0d6efd" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error("❌ Checkout failed!");
    }
  };

  // Cancel order
  const handleCancelOrder = async (orderId) => {
    if (!token) return toast.error("Please login first!");
    try {
      const { data } = await axios.put(
        `${backendUrl}/api/order/cancel/${orderId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        toast.success("✅ Order cancelled successfully!");
        setOrders((prev) =>
          prev.map((order) =>
            order._id === orderId ? { ...order, deliveryStatus: "Cancelled" } : order
          )
        );
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "❌ Cancel failed!");
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-10 relative">
      <h1 className="text-2xl font-bold mb-6 text-center">My Orders</h1>

      {/* CART SECTION */}
      {cart.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mb-4">Current Cart</h2>
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.productId}
                className="flex flex-col sm:flex-row sm:items-center justify-between border rounded-lg shadow-md p-4 gap-4 bg-white"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-contain bg-gray-100 rounded-lg"
                  />
                  <div>
                    <h2 className="text-lg font-semibold">{item.name}</h2>
                    <p className="text-gray-600">₹{item.price}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => decreaseQty(item.productId)}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
                  >
                    -
                  </button>
                  <span className="font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => increaseQty(item.productId)}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
                  >
                    +
                  </button>
                </div>
                <p className="font-bold text-blue-600">
                  ₹{item.price * item.quantity}
                </p>
                <button
                  onClick={() => removeFromCart(item.productId)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg transition"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-gray-100 rounded-lg flex flex-col sm:flex-row justify-between items-center gap-4">
            <h2 className="text-lg font-semibold">Total</h2>
            <p className="text-xl font-bold text-blue-600">₹{total}</p>
            <button
              onClick={handleCheckout}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition"
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}

      {/* PAST ORDERS */}
      <h2 className="text-xl font-semibold mt-10 mb-4">Past Orders</h2>
      {orders.length === 0 ? (
        <p className="text-gray-600">You have no past orders.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border rounded-lg shadow-md p-4 bg-white"
            >
              <p className="font-semibold">Order ID: {order._id}</p>
              <p>Date: {new Date(order.createdAt).toLocaleString()}</p>
              <p>Amount: ₹{order.amount}</p>
              <p>Payment Status: {order.status}</p>
              <p>Delivery Status: {order.deliveryStatus || "Pending"}</p>

              <div className="mt-2">
                <h3 className="font-semibold">Items:</h3>
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 mt-1">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-contain rounded"
                    />
                    <p>
                      {item.name} (x{item.quantity}) - ₹
                      {item.price * item.quantity}
                    </p>
                  </div>
                ))}
              </div>

              {/* Cancel Button */}
              {order.deliveryStatus !== "Cancelled" &&
                order.deliveryStatus !== "Delivered" && (
                  <button
                    onClick={() => handleCancelOrder(order._id)}
                    className="mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg transition"
                  >
                    Cancel Order
                  </button>
                )}
            </div>
          ))}
        </div>
      )}

      {/* ✅ WhatsApp Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <a
          href="https://wa.me/917282089286?text=Hello%20I%20need%20help%20regarding%20my%20order"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-full flex items-center gap-2 shadow-lg transition-transform hover:scale-105"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
            alt="whatsapp"
            className="w-6 h-6"
          />
          Chat on WhatsApp
        </a>
      </div>
    </div>
  );
};

export default MyOrder;


