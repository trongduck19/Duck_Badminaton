import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { assets } from '../../assets/assets';
import { useAppContext } from '../../context/AppContext';

const OrderDetails = () => {
  const { id } = useParams();
  const { axios, currency, navigate } = useAppContext();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch order details
  const fetchOrder = async () => {
    try {
      const { data } = await axios.get(`/api/order/${id}`);
      if (data.success) setOrder(data.order);
      else toast.error(data.message);
    } catch (error) {
      toast.error('Failed to fetch order');
      console.error(error);
    }
  };

  // Update order status
  const handleStatusChange = async (newStatus) => {
    try {
      setLoading(true);
      const { data } = await axios.put(`/api/order/status/${id}`, { status: newStatus });
      if (data.success) {
        toast.success('Order status updated successfully');
        fetchOrder(); // refresh
      } else toast.error(data.message);
    } catch (error) {
      toast.error('Failed to update order status');
    } finally {
      setLoading(false);
    }
  };

  // Delete order
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        const { data } = await axios.delete(`/api/order/${id}`);
        if (data.success) {
          toast.success('Order deleted successfully!');
          navigate('/seller/orders');
        } else toast.error(data.message || 'Failed to delete order');
      } catch (err) {
        console.error(err);
        toast.error('Error deleting order');
      }
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  if (!order) return <p className="p-10 text-gray-600">Loading order details...</p>;

  return (
    <div className="bg-gray-50 min-h-screen py-6 px-4 md:px-10">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-6 space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Order Details</h2>

        {/* Customer Info */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold mb-2">Customer Info</h3>
          <p>
            {order.address?.firstName} {order.address?.lastName}
          </p>
          <p>
            {order.address?.street}, {order.address?.city}
          </p>
          <p>
            {order.address?.state}, {order.address?.zipcode}, {order.address?.country}
          </p>
          <p>Phone: {order.address?.phone}</p>
        </div>

        {/* Product List */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold mb-2">Products</h3>
          <div className="space-y-3">
            {order.items?.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 border rounded p-2">
                <img
                  src={item.product?.image?.[0] || assets.box_icon}
                  alt={item.product?.name}
                  className="w-16 h-16 object-cover rounded-md"
                />
                <div className="flex-1">
                  <p className="font-medium">{item.product?.name || 'Unknown Product'}</p>
                  <p>
                    Price: {currency}
                    {item.product?.offerPrice?.toLocaleString() || 0}
                  </p>
                  <p>Quantity: {item.quantity}</p>
                  <p>
                    Subtotal: {currency}
                    {((item.product?.offerPrice || 0) * item.quantity).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Info */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold mb-2">Order Info</h3>
          <p>
            <span className="font-medium">Order Date:</span>{' '}
            {new Date(order.createdAt).toLocaleString()}
          </p>
          <p>
            <span className="font-medium">Payment Method:</span> {order.paymentType}
          </p>
          <p>
            <span className="font-medium">Payment Status:</span>{' '}
            <span className={order.isPaid ? 'text-green-600' : 'text-amber-500'}>
              {order.isPaid ? 'Paid' : 'Pending'}
            </span>
          </p>
          <p className="font-semibold text-lg mt-2">
            Total: {currency}
            {order.amount.toLocaleString()}
          </p>
        </div>

        {/* Status & Delete */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          {/* Status */}
          <div className="flex items-center gap-4">
            <span className="font-medium">Current Status:</span>
            <select
              value={order.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={loading}
              className="border px-3 py-1 rounded"
            >
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Refunded">Refunded</option>
            </select>
          </div>

          {/* Delete Button */}
          <div className="mt-2 md:mt-0">
            <button
              onClick={handleDelete}
              className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Delete Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
