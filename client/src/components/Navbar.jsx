import React, { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { NavLink } from 'react-router-dom';
import { assets } from '../assets/assets';
import { useAppContext } from '../context/AppContext';

const Navbar = () => {
  const [open, setOpen] = React.useState(false);
  const {
    user,
    setUser,
    setShowUserLogin,
    navigate,
    searchQuery,
    setSearchQuery,
    getCartCount,
    axios,
  } = useAppContext();

  const logout = async () => {
    try {
      const { data } = await axios.get('/api/user/logout');
      if (data.success) {
        toast.success(data.message);
        setUser(null);
        navigate('/');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (searchQuery && searchQuery.length > 0) {
      navigate('/products');
    }
  }, [searchQuery]);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 transition-all duration-300">
      <div className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4">
        {/* Logo */}
        <NavLink to="/" onClick={() => setOpen(false)} className="flex items-center gap-2">
          <img
            src={assets.logo}
            alt="logo"
            className="h-12 hover:scale-105 transition-transform duration-200"
          />
        </NavLink>

        {/* Desktop Menu */}
        <div className="hidden sm:flex items-center gap-8 font-medium">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `hover:text-primary-dull transition-colors ${
                isActive ? 'text-primary-dull font-semibold' : 'text-gray-700'
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/products"
            className={({ isActive }) =>
              `hover:text-primary-dull transition-colors ${
                isActive ? 'text-primary-dull font-semibold' : 'text-gray-700'
              }`
            }
          >
            All Products
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `hover:text-primary-dull transition-colors ${
                isActive ? 'text-primary-dull font-semibold' : 'text-gray-700'
              }`
            }
          >
            Contact
          </NavLink>

          {/* Search bar */}
          <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full bg-gray-50 focus-within:ring-2 focus-within:ring-primary-dull transition-all">
            <input
              className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
              type="text"
              placeholder="Search products..."
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <img src={assets.search_icon} alt="search" className="w-4 h-4 opacity-70" />
          </div>

          {/* Cart */}
          <div
            className="relative cursor-pointer hover:scale-105 transition-transform"
            onClick={() => navigate('/cart')}
          >
            <img src={assets.nav_cart_icon} alt="cart" className="w-6 h-6 opacity-80" />
            <span className="absolute -top-2 -right-3 text-xs text-white bg-red-500 w-[18px] h-[18px] rounded-full flex items-center justify-center">
              {getCartCount()}
            </span>
          </div>

          {/* User / Login */}
          {!user ? (
            <button
              onClick={() => setShowUserLogin(true)}
              className="cursor-pointer px-8 py-2 bg-primary-dull hover:bg-primary shadow-md transition-all text-white rounded-full text-sm font-medium"
            >
              Login
            </button>
          ) : (
            <div className="relative group">
              <img
                src={assets.profile_icon}
                alt="user"
                className="w-10 h-10 rounded-full border-2 border-transparent group-hover:border-primary-dull transition-all"
              />
              <ul className="hidden group-hover:flex flex-col absolute top-10 right-0 bg-white shadow-lg border border-gray-200 py-2 w-44 rounded-xl text-sm z-20 animate-slideDown">
                <li
                  className="px-4 py-2 hover:bg-primary cursor-pointer text-gray-700"
                  onClick={() => navigate('my-orders')}
                >
                  My Orders
                </li>
                <li
                  className="px-4 py-2 hover:bg-primary cursor-pointer text-gray-700"
                  onClick={logout}
                >
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-6 sm:hidden">
          <div
            className="relative cursor-pointer hover:scale-105 transition-transform"
            onClick={() => navigate('/cart')}
          >
            <img src={assets.nav_cart_icon} alt="cart" className="w-6 h-6 opacity-80" />
            <span className="absolute -top-2 -right-3 text-xs text-white bg-red-500 w-[18px] h-[18px] rounded-full flex items-center justify-center">
              {getCartCount()}
            </span>
          </div>
          <button onClick={() => setOpen(!open)} aria-label="Menu" className="">
            <img src={assets.menu_icon} alt="menu" className="w-7 h-7" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="flex flex-col sm:hidden items-start gap-3 px-6 py-4 bg-white shadow-md border-t border-gray-200 text-gray-700 text-base animate-fadeIn">
          <NavLink to="/" onClick={() => setOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/products" onClick={() => setOpen(false)}>
            All Products
          </NavLink>
          <NavLink to="/contact" onClick={() => setOpen(false)}>
            Contact
          </NavLink>

          {user && (
            <NavLink to="my-orders" onClick={() => setOpen(false)}>
              My Orders
            </NavLink>
          )}

          {!user ? (
            <button
              onClick={() => {
                setOpen(false);
                setShowUserLogin(true);
              }}
              className="cursor-pointer px-6 py-2 mt-2 bg-primary-dull hover:bg-primary transition text-white rounded-full text-sm font-medium shadow-md"
            >
              Login
            </button>
          ) : (
            <button
              onClick={logout}
              className="cursor-pointer px-6 py-2 mt-2 bg-primary-dull hover:bg-primary transition text-white rounded-full text-sm font-medium shadow-md"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
