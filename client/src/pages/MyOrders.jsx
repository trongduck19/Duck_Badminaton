import { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';

const MyOrders = () => {
  const [myOrders, setMyOrders] = useState([]);
  const { currency, axios, user } = useAppContext();

  const fetchMyOrders = async () => {
    try {
      const { data } = await axios.get('/api/order/user');
      if (data.success) {
        setMyOrders(data.orders);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMyOrders();
    }
  }, [user]);

  return (
    <div className="mt-24 pb-16">
      {/* Header */}
      <div className="flex flex-col items-end w-max mb-8 mx-auto">
        <h2 className="text-2xl font-semibold text-primary">My Orders</h2>
        <div className="w-16 h-[3px] bg-primary rounded-full"></div>
      </div>

      {/* Orders */}
      {myOrders.map((order) => (
        <div
          key={order._id}
          className="border border-gray-200 rounded-xl mb-10 p-6 max-w-4xl mx-auto shadow-sm hover:shadow-md transition-all duration-300"
        >
          {/* Order Info */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center text-sm text-gray-600 border-b border-gray-100 pb-3 mb-4">
            <p>
              <span className="font-semibold text-gray-800">Order ID:</span> {order._id}
            </p>
            <p>
              <span className="font-semibold text-gray-800">Payment:</span> {order.paymentType}
            </p>
            <p>
              <span className="font-semibold text-gray-800">Total:</span> {currency} {order.amount}
            </p>
          </div>

          {/* Items */}
          {order.items.map((item) => (
            <div
              key={item._id}
              className="flex flex-col md:flex-row md:items-center justify-between py-4 border-b border-gray-100 last:border-none"
            >
              {/* Product Info */}
              <div className="flex items-center gap-4 mb-3 md:mb-0">
                <img
                  src={item.product.image[0]}
                  alt={item.product.name}
                  className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                />
                <div>
                  <h3 className="font-semibold text-gray-800">{item.product.name}</h3>
                  <p className="text-sm text-gray-500">{item.product.category}</p>
                </div>
              </div>

              {/* Order Details */}
              <div className="text-sm text-gray-600">
                <p>
                  Quantity: <span className="font-medium text-gray-800">{item.quantity}</span>
                </p>
                <p>
                  Status: <span className="font-medium text-primary">{order.status}</span>
                </p>
                <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
              </div>

              {/* Amount */}
              <p className="text-primary text-lg font-semibold mt-2 md:mt-0">
                {currency} {item.product.offerPrice * item.quantity}
              </p>
            </div>
          ))}
        </div>
      ))}

      {/* Empty State */}
      {myOrders.length === 0 && (
        <p className="text-center text-gray-500 mt-10">No orders found yet.</p>
      )}
    </div>
  );
};

export default MyOrders;
