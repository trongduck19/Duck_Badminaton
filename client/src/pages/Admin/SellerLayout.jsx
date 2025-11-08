import { List, LogOut, Package, PlusCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { assets } from '../../assets/assets';
import { useAppContext } from '../../context/AppContext';

const SellerLayout = () => {
  const { axios, navigate } = useAppContext();

  const sidebarLinks = [
    { name: 'Add Product', path: '/seller', icon: <PlusCircle className="w-5 h-5" /> },
    { name: 'Product List', path: '/seller/product-list', icon: <List className="w-5 h-5" /> },
    { name: 'Orders', path: '/seller/orders', icon: <Package className="w-5 h-5" /> },
  ];

  const logout = async () => {
    try {
      const { data } = await axios.get('/api/seller/logout');
      if (data.success) {
        toast.success(data.message);
        navigate('/');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navbar */}
      <header className="flex items-center justify-between px-4 md:px-8 border-b border-gray-200 py-3 bg-white shadow-sm sticky top-0 z-20">
        <Link to="/" className="flex items-center gap-2">
          <img src={assets.logo} alt="logo" className="cursor-pointer w-32 md:w-40" />
        </Link>

        <div className="flex items-center gap-5 text-gray-700">
          <p className="hidden sm:block font-medium">
            Hi, <span className="text-primary">Admin</span> 👋
          </p>
          <button
            onClick={logout}
            className="flex items-center gap-2 border border-gray-300 hover:border-primary hover:text-primary px-3 py-1.5 rounded-full text-sm transition-all"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="md:w-64 w-20 bg-white border-r border-gray-200 py-5 flex flex-col shadow-sm">
          <nav className="flex flex-col gap-2">
            {sidebarLinks.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === '/seller'}
                className={({ isActive }) =>
                  `flex items-center gap-3 py-3 px-5 rounded-r-full transition-all
                  ${
                    isActive
                      ? 'bg-primary/10 text-primary font-medium border-r-4 border-primary'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                {item.icon}
                <span className="hidden md:inline">{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SellerLayout;
