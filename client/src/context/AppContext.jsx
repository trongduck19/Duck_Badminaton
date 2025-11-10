import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
axios.defaults.withCredentials = true;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const currency = import.meta.env.VITE_CURRENCY;

  // ✅ Lấy user từ localStorage khi khởi tạo
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  // ✅ Lưu user vào localStorage khi thay đổi
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // ✅ Gọi API kiểm tra user từ server khi app khởi động
  const fetchUser = async () => {
    try {
      const { data } = await axios.get('/api/user/is-auth');
      if (data.success) {
        setUser(data.user);
        setCartItems(data.user.cartItems || {});
      } else {
        setUser(null);
        localStorage.removeItem('user');
      }
    } catch {
      setUser(null);
      localStorage.removeItem('user');
    }
  };

  // ✅ Kiểm tra seller
  const fetchSeller = async () => {
    try {
      const { data } = await axios.get('/api/seller/is-auth');
      setIsSeller(data.success);
    } catch {
      setIsSeller(false);
    }
  };

  // ✅ Lấy danh sách sản phẩm
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('/api/product/list');
      if (data.success) setProducts(data.products);
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ Cập nhật cart khi thay đổi
  useEffect(() => {
    const updateCart = async () => {
      try {
        await axios.post('/api/user/update', { cartItems });
      } catch (err) {
        console.log(err);
      }
    };
    if (user) updateCart();
  }, [cartItems]);

  // ✅ Khi app load lần đầu
  useEffect(() => {
    fetchUser();
    fetchSeller();
    fetchProducts();
  }, []);

  // ✅ Giỏ hàng
  const addToCart = (id) => {
    const p = products.find((x) => x._id === id);
    if (!p) return toast.error('Sản phẩm không tồn tại');
    const newCart = structuredClone(cartItems || {});
    const newQty = (newCart[id] || 0) + 1;
    if (newQty > p.stockQty) return toast.error(`Chỉ còn ${p.stockQty} sản phẩm`);
    newCart[id] = newQty;
    setCartItems(newCart);
    toast.success('Đã thêm vào giỏ hàng');
  };

  const updateCartItem = (id, qty) => {
    const p = products.find((x) => x._id === id);
    if (!p) return;
    if (qty > p.stockQty) return toast.error(`Chỉ còn ${p.stockQty} sản phẩm`);
    const newCart = structuredClone(cartItems);
    newCart[id] = qty;
    setCartItems(newCart);
  };

  const removeFromCart = (id) => {
    const newCart = structuredClone(cartItems);
    if (newCart[id]) {
      newCart[id] -= 1;
      if (newCart[id] === 0) delete newCart[id];
    }
    setCartItems(newCart);
    toast.success('Đã xóa khỏi giỏ hàng');
  };

  const getCartCount = () => Object.values(cartItems).reduce((a, b) => a + b, 0);
  const getCartAmount = () =>
    Math.floor(
      Object.entries(cartItems).reduce((sum, [id, qty]) => {
        const p = products.find((x) => x._id === id);
        return sum + (p?.offerPrice || 0) * qty;
      }, 0) * 100,
    ) / 100;

  // ✅ Logout
  const logout = async () => {
    try {
      await axios.post('/api/user/logout');
      setUser(null);
      localStorage.removeItem('user');
      toast.success('Đã đăng xuất');
      navigate('/');
    } catch {
      toast.error('Logout failed');
    }
  };

  const value = {
    navigate,
    user,
    setUser,
    isSeller,
    setIsSeller,
    showUserLogin,
    setShowUserLogin,
    products,
    currency,
    addToCart,
    updateCartItem,
    removeFromCart,
    cartItems,
    setCartItems,
    getCartCount,
    getCartAmount,
    fetchProducts,
    axios,
    logout,
    searchQuery,
    setSearchQuery,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
