import { Toaster } from 'react-hot-toast';
import { Route, Routes, useLocation } from 'react-router-dom';
import SellerLogin from './components/admin/SellerLogin';
import Footer from './components/Footer';
import Loading from './components/Loading';
import Login from './components/Login';
import Navbar from './components/Navbar';
import AddAddress from './pages/AddAddress';
import { useAppContext } from './context/AppContext';
import AddProduct from './pages/Admin/AddProduct';
import Orders from './pages/Admin/Orders';
import ProductList from './pages/Admin/ProductList';
import SellerLayout from './pages/Admin/SellerLayout';
import AllProducts from './pages/AllProducts';
import Cart from './pages/Cart';
import Contact from './pages/Contact';
import Home from './pages/Home';
import MyOrders from './pages/MyOrders';
import ProductCategory from './pages/ProductCategory';
import ProductDetails from './pages/ProductDetails';
import EditProduct from './pages/Admin/EditProduct';
import OrderDetails from './pages/Admin/OrderDetails';
const App = () => {
  const isSellerPath = useLocation().pathname.includes('seller');
  const { showUserLogin, isSeller } = useAppContext();
  return (
    <div className="text-default min-h-screen text-gray-700 bg-white">
      {isSellerPath ? null : <Navbar />}
      {showUserLogin ? <Login /> : null}
      <Toaster />
      <div className={isSellerPath ? '' : 'px-6 md:px-16 lg:px-24 xl:px-32'}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<AllProducts />} />
          <Route path="/products/:category" element={<ProductCategory />} />
          <Route path="/products/:category/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/add-address" element={<AddAddress />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/loader" element={<Loading />} />

          {/* Admin Routes */}
          <Route path="/seller" element={isSeller ? <SellerLayout /> : <SellerLogin />}>
            <Route index element={isSeller ? <AddProduct /> : null} />
            <Route path="product-list" element={<ProductList />} />
            <Route path="orders" element={<Orders />} />
            <Route path="edit/:id" element={<EditProduct />} />
            <Route path="orders/:id" element={<OrderDetails />} />
          </Route>
        </Routes>
      </div>
      {isSellerPath ? null : <Footer />}
    </div>
  );
};

export default App;
