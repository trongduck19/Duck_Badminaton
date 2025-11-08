import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { assets } from '../../assets/assets';
import { useAppContext } from '../../context/AppContext';

const Orders = () => {
  const { currency, axios, navigate } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [searchCustomer, setSearchCustomer] = useState('');

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get('/api/order/seller');
      if (data.success) setOrders(data.orders);
      else toast.error(data.message);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch orders');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders
    .filter((o) => (filterStatus ? o.status === filterStatus : true))
    .filter((o) =>
      searchCustomer
        ? `${o.address.firstName} ${o.address.lastName}`
            .toLowerCase()
            .includes(searchCustomer.toLowerCase())
        : true,
    );

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const { data } = await axios.put(`/api/order/status/${orderId}`, { status: newStatus });
      if (data.success) {
        toast.success('Order status updated');
        fetchOrders();
      } else toast.error(data.message);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const totalRevenue = orders.reduce((acc, o) => acc + o.amount, 0);
  const totalOrders = orders.length;

  return (
    <div className="bg-gray-50 min-h-screen py-6 px-4 md:px-10">
      {/* --- Dashboard Metrics --- */}
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <div className="bg-white rounded-xl shadow-md p-5 flex-1 text-center hover:shadow-lg transition">
          <p className="text-gray-500 uppercase text-sm tracking-wide">Total Orders</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">{totalOrders}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-5 flex-1 text-center hover:shadow-lg transition">
          <p className="text-gray-500 uppercase text-sm tracking-wide">Total Revenue</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">
            {currency}
            {totalRevenue.toLocaleString()}
          </p>
        </div>
      </div>

      {/* --- Filters --- */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by customer name..."
          value={searchCustomer}
          onChange={(e) => setSearchCustomer(e.target.value)}
          className="border px-4 py-2 rounded-md flex-1 focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Refunded">Refunded</option>
        </select>
      </div>

      {/* --- Orders List --- */}
      <div className="space-y-6">
        {filteredOrders.length === 0 && (
          <div className="text-center py-10 text-gray-400 text-lg">No orders found</div>
        )}

        {filteredOrders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition p-5 flex flex-col md:flex-row gap-4 md:gap-6 items-center justify-between"
          >
            {/* --- Product Preview --- */}
            <div className="flex gap-4 flex-1 min-w-[200px]">
              <img
                className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                src={assets.box_icon}
                alt="product"
              />
              <div className="flex flex-col justify-center">
                {order.items?.map((item, i) => (
                  <p key={i} className="text-sm font-medium text-gray-800">
                    {item.product?.name || 'Unknown'}{' '}
                    <span className="text-primary font-semibold">× {item.quantity}</span>
                  </p>
                ))}
              </div>
            </div>

            {/* --- Customer Info --- */}
            <div className="flex-1 text-sm text-gray-600 space-y-1 min-w-[200px]">
              <p className="font-semibold text-gray-800">
                {order.address?.firstName} {order.address?.lastName}
              </p>
              <p>
                {order.address?.street}, {order.address?.city}
              </p>
              <p>
                {order.address?.state}, {order.address?.zipcode}, {order.address?.country}
              </p>
              <p>{order.address?.phone}</p>
            </div>

            {/* --- Amount --- */}
            <div className="text-lg font-semibold text-gray-900 text-right min-w-[120px]">
              {currency}
              {order.amount?.toLocaleString()}
            </div>

            {/* --- Status & Payment --- */}
            <div className="flex flex-col gap-2 text-right min-w-[150px]">
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                className={`border px-2 py-1 rounded-md ${
                  order.status === 'Pending'
                    ? 'bg-amber-100'
                    : order.status === 'Confirmed'
                    ? 'bg-blue-100'
                    : order.status === 'Shipped'
                    ? 'bg-purple-100'
                    : order.status === 'Delivered'
                    ? 'bg-green-100'
                    : order.status === 'Cancelled'
                    ? 'bg-red-100'
                    : 'bg-gray-200'
                }`}
              >
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Refunded">Refunded</option>
              </select>
              <p className="text-sm">
                <span className="font-medium">Method:</span> {order.paymentType}
              </p>
              <p className="text-sm">
                <span className="font-medium">Date:</span>{' '}
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
              <p className="text-sm">
                <span className="font-medium">Payment:</span>{' '}
                <span
                  className={`font-semibold ${order.isPaid ? 'text-green-600' : 'text-amber-500'}`}
                >
                  {order.isPaid ? 'Paid' : 'Pending'}
                </span>
              </p>
            </div>

            {/* --- View Details Button --- */}
            <div className="mt-2 md:mt-0">
              <button
                onClick={() => navigate(`/seller/orders/${order._id}`)}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
