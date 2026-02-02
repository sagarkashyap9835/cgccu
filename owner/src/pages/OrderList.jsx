import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AdminContext } from "../context/AdminContext";
import { toast } from "react-toastify";

const OrderList = () => {
  const { token, backendUrl } = useContext(AdminContext);
  const [orders, setOrders] = useState([]);
  const fetchOrders = async () => {
    try {
      if (!token) return;

      const res = await axios.get(
        `${backendUrl}/api/order/admin/all`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrders(res.data || []);

    } catch (err) {
      console.error("Error fetching orders:", err);
      toast.error("Failed to fetch orders");
    }
  };

  // 🔹 Update delivery status
  const updateDeliveryStatus = async (orderId, newStatus) => {
    try {
      await axios.put(
        `${backendUrl}/api/order/admin/${orderId}/status`,
        { deliveryStatus: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Status updated ✅");

      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, deliveryStatus: newStatus } : o
        )
      );
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error("Status update failed ❌");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Order / Booking Requests</h1>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-sm">
              <th className="p-3 text-left">User</th>
              <th className="p-3 text-left">Contact</th>
              <th className="p-3 text-left">Address</th>
              <th className="p-3 text-left">Items</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Payment</th>
              <th className="p-3 text-left">Delivery Status</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-t text-sm">
                <td className="p-3">{order.userId?.name || "Guest"}</td>
                <td className="p-3">{order.userId?.phone || "N/A"}</td>
                <td className="p-3">
                  {order.address ? (
                    <>
                      {order.address.street}, {order.address.city}, {order.address.state}
                    </>
                  ) : (
                    "N/A"
                  )}
                </td>
                <td className="p-3">
                  {order.items.map((item, i) => (
                    <div key={i}>{item.name} x {item.quantity}</div>
                  ))}
                </td>
                <td className="p-3">₹{order.amount}</td>
                <td className="p-3">{order.paymentMethod || "COD"}</td>

                <td className="p-3">
                  <select
                    value={order.deliveryStatus || "Pending"}
                    onChange={(e) =>
                      updateDeliveryStatus(order._id, e.target.value)
                    }
                    className="border rounded px-2 py-1"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="border rounded-lg p-4 shadow bg-white">
            <div className="flex justify-between mb-2">
              <span className="font-bold">{order.userId?.name}</span>
              <span className="font-bold text-green-600">₹{order.amount}</span>
            </div>
            <div className="text-sm text-gray-600 mb-2">
              {order.items.map(i => i.name).join(", ")}
            </div>
            <select
              value={order.deliveryStatus || "Pending"}
              onChange={(e) =>
                updateDeliveryStatus(order._id, e.target.value)
              }
              className="border rounded p-1 w-full text-sm"
            >
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderList;
