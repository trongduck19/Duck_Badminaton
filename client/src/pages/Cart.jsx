import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { assets } from '../assets/assets';
import { useAppContext } from '../context/AppContext';

const Cart = () => {
  const {
    products,
    currency,
    cartItems,
    removeFromCart,
    getCartCount,
    updateCartItem,
    navigate,
    getCartAmount,
    axios,
    user,
    setCartItems,
    setShowUserLogin,
  } = useAppContext();

  const [cartArray, setCartArray] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [showAddress, setShowAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentOption, setPaymentOption] = useState('COD');

  const getCart = () => {
    let tempArray = [];
    for (const key in cartItems) {
      const product = products.find((item) => item._id === key);
      product.quantity = cartItems[key];
      tempArray.push(product);
    }
    setCartArray(tempArray);
  };

  const getUserAddresses = async () => {
    try {
      const { data } = await axios.get('/api/address/get');
      if (data.success && data.addresses.length > 0) {
        setAddresses(data.addresses);
        setSelectedAddress(data.addresses[0]);
      } else {
        toast.error('No addresses found.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to load addresses.');
    }
  };

  const placeOrder = async () => {
    try {
      if (!user) {
        toast.error('Please login to place your order');
        setShowUserLogin(true);
        return;
      }

      const items = cartArray.map((item) => ({
        product: item._id,
        quantity: item.quantity,
      }));

      if (paymentOption === 'COD') {
        const { data } = await axios.post('/api/order/cod', {
          userId: user._id,
          items,
          address: selectedAddress._id,
        });
        if (data.success) {
          toast.success(data.message);
          setCartItems({});
          navigate('/my-orders');
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post('/api/order/stripe', {
          userId: user._id,
          items,
          address: selectedAddress._id,
        });
        if (data.success) {
          window.location.replace(data.url);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error('Order failed. Please try again.');
    }
  };

  useEffect(() => {
    if (products.length > 0 && cartItems) getCart();
  }, [cartItems, products]);

  useEffect(() => {
    getUserAddresses();
  }, []);

  if (!cartArray.length) {
    return (
      <div className="mt-24 text-center text-gray-600">
        <h2 className="text-2xl font-semibold mb-4">Your cart is empty 🛍️</h2>
        <button
          onClick={() => navigate('/products')}
          className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dull transition"
        >
          Go Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row mt-24 px-4 md:px-8 lg:px-16 gap-10 min-h-screen">
      {/* LEFT - CART LIST */}
      <div className="flex-1 max-w-4xl bg-white rounded-2xl shadow-sm p-6">
        <h1 className="text-3xl font-semibold mb-6">
          Shopping Cart{' '}
          <span className="text-sm text-gray-500 font-normal">({getCartCount()} items)</span>
        </h1>

        <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 font-medium border-b pb-3">
          <p className="text-left">Product</p>
          <p className="text-center">Subtotal</p>
          <p className="text-center">Remove</p>
        </div>

        {cartArray.map((product, index) => (
          <div
            key={index}
            className="grid grid-cols-[2fr_1fr_1fr] items-center py-4 border-b last:border-0"
          >
            <div className="flex items-center gap-4">
              <div
                onClick={() => {
                  navigate(`/product/${product.category.toLowerCase()}/${product._id}`);
                  scrollTo(0, 0);
                }}
                className="cursor-pointer w-24 h-24 flex items-center justify-center border border-gray-200 rounded-xl overflow-hidden hover:shadow transition"
              >
                <img
                  src={product.image?.[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-medium text-gray-800">{product.name}</p>
                <div className="mt-2 text-sm text-gray-500">
                  Qty:{' '}
                  <select
                    onChange={(e) => updateCartItem(product._id, Number(e.target.value))}
                    value={cartItems[product._id]}
                    className="border border-gray-300 rounded-md px-2 py-1 ml-2 outline-none hover:border-primary transition"
                  >
                    {Array.from({ length: 9 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <p className="text-center font-medium text-gray-700">
              {currency}
              {product.offerPrice * product.quantity}
            </p>
            <button
              onClick={() => removeFromCart(product._id)}
              className="cursor-pointer mx-auto hover:scale-110 transition"
            >
              <img
                src={assets.remove_icon}
                alt="remove"
                className="w-6 h-6 opacity-80 hover:opacity-100"
              />
            </button>
          </div>
        ))}

        <button
          onClick={() => {
            navigate('/products');
            scrollTo(0, 0);
          }}
          className="mt-8 text-primary font-medium flex items-center gap-2 hover:gap-3 transition"
        >
          <img src={assets.arrow_right_icon_colored} alt="arrow" className="w-5 h-5 rotate-180" />
          Continue Shopping
        </button>
      </div>

      {/* RIGHT - ORDER SUMMARY */}
      <div className="max-w-[360px] w-full bg-white rounded-2xl shadow-sm p-6 h-fit sticky top-28 border border-gray-100">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <hr className="mb-5" />

        {/* ADDRESS SECTION */}
        <div className="mb-6 relative">
          <p className="text-sm font-medium text-gray-600 uppercase mb-1">Delivery Address</p>
          <div className="flex justify-between items-start">
            <p className="text-gray-700 text-sm leading-relaxed">
              {selectedAddress
                ? `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country}`
                : 'No address found'}
            </p>
            <button
              onClick={() => setShowAddress(!showAddress)}
              className="text-primary font-medium text-sm hover:underline"
            >
              Change
            </button>
          </div>

          {showAddress && (
            <div className="absolute top-16 left-0 bg-white border border-gray-200 shadow rounded-lg z-10 w-full animate-fadeIn">
              {addresses.map((addr, index) => (
                <p
                  key={index}
                  onClick={() => {
                    setSelectedAddress(addr);
                    setShowAddress(false);
                  }}
                  className="p-2 text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  {addr.street}, {addr.city}
                </p>
              ))}
              <p
                onClick={() => {
                  if (!user) {
                    toast.error('Please login to add a new address.');
                    return;
                  }
                  navigate('/add-address');
                }}
                className="text-primary text-center cursor-pointer p-2 hover:bg-primary/10"
              >
                + Add new address
              </p>
            </div>
          )}
        </div>

        {/* PAYMENT METHOD */}
        <div>
          <p className="text-sm font-medium text-gray-600 uppercase mb-2">Payment Method</p>
          <select
            value={paymentOption}
            onChange={(e) => setPaymentOption(e.target.value)}
            className="w-full border border-gray-300 rounded-md bg-white px-3 py-2 text-gray-700 outline-none hover:border-primary transition"
          >
            <option value="COD">Cash On Delivery</option>
            <option value="Online">Online Payment</option>
          </select>
        </div>

        {/* SUMMARY */}
        <hr className="my-6" />
        <div className="text-gray-600 space-y-2 text-sm">
          <p className="flex justify-between">
            <span>Price</span>
            <span>
              {currency}
              {getCartAmount()}
            </span>
          </p>
          <p className="flex justify-between">
            <span>Shipping</span>
            <span className="text-green-600">Free</span>
          </p>
          <p className="flex justify-between">
            <span>Tax (2%)</span>
            <span>
              {currency}
              {(getCartAmount() * 0.02).toFixed(2)}
            </span>
          </p>
          <p className="flex justify-between font-semibold text-gray-800 pt-2 border-t mt-3">
            <span>Total</span>
            <span>
              {currency}
              {(getCartAmount() + getCartAmount() * 0.02).toFixed(2)}
            </span>
          </p>
        </div>

        {/* BUTTON */}
        <button
          onClick={placeOrder}
          className="w-full py-3 mt-6 cursor-pointer font-medium rounded-xl text-gray-900 bg-primary hover:bg-[--color-primary-dull] transition-all"
        >
          {paymentOption === 'COD' ? 'Place Order' : 'Proceed to Payment'}
        </button>
      </div>
    </div>
  );
};

export default Cart;
