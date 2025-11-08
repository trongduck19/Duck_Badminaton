import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { assets } from '../../assets/assets';
import { useAppContext } from '../../context/AppContext';

const Orders = () => {
  const { currency, axios } = useAppContext();
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get('/api/order/seller');
      if (data.success) {
        setOrders(data.orders);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="no-scrollbar flex-1 overflow-y-scroll bg-gray-50 min-h-screen py-6 px-4 md:px-10">
      {/* Tiêu đề */}
      <h2 className="text-2xl font-bold mb-8 text-gray-800 tracking-tight"> Orders List</h2>

      {/* Danh sách đơn hàng */}
      <div className="space-y-6">
        {orders.map((order, index) => (
          <div
            key={index}
            className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 p-5"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              {/* Thông tin sản phẩm */}
              <div className="flex gap-4 flex-1">
                <img
                  className="w-14 h-14 object-cover rounded-md border border-gray-200"
                  src={assets.box_icon}
                  alt="product"
                />
                <div className="space-y-1">
                  {order.items.map((item, i) => (
                    <p key={i} className="text-sm font-medium text-gray-800">
                      {item.product.name}{' '}
                      <span className="text-primary font-semibold">× {item.quantity}</span>
                    </p>
                  ))}
                </div>
              </div>

              {/* Địa chỉ giao hàng */}
              <div className="flex-1 text-sm text-gray-600 space-y-1">
                <p className="font-semibold text-gray-800">
                  {order.address.firstName} {order.address.lastName}
                </p>
                <p>
                  {order.address.street}, {order.address.city}
                </p>
                <p>
                  {order.address.state}, {order.address.zipcode}, {order.address.country}
                </p>
                <p>{order.address.phone}</p>
              </div>

              {/* Tổng tiền */}
              <div className="text-base font-semibold text-gray-900 text-right min-w-[100px]">
                {currency}
                {order.amount.toLocaleString()}
              </div>

              {/* Chi tiết thanh toán */}
              <div className="text-sm text-gray-600 space-y-1 text-right">
                <p>
                  <span className="font-medium">Method:</span> {order.paymentType}
                </p>
                <p>
                  <span className="font-medium">Date:</span>{' '}
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-medium">Payment:</span>{' '}
                  <span
                    className={`font-semibold ${
                      order.isPaid ? 'text-green-600' : 'text-amber-500'
                    }`}
                  >
                    {order.isPaid ? 'Paid' : 'Pending'}
                  </span>
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Nếu không có đơn hàng */}
        {orders.length === 0 && (
          <div className="text-center py-10 text-gray-500">No orders available</div>
        )}
      </div>
    </div>
  );
};

export default Orders;
