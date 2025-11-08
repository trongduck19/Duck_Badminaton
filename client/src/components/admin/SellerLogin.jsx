import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { assets } from '../../assets/assets';
import { useAppContext } from '../../context/AppContext';

const SellerLogin = () => {
  const { isSeller, setIsSeller, navigate, axios } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // trạng thái show/hide password

  const onSubmitHandler = async (event) => {
    try {
      event.preventDefault();
      setLoading(true);
      const { data } = await axios.post('/api/seller/login', { email, password });
      if (data.success) {
        setIsSeller(true);
        navigate('/seller');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSeller) {
      navigate('/seller');
    }
  }, [isSeller]);

  return (
    !isSeller && (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 px-4">
        <form
          onSubmit={onSubmitHandler}
          className="bg-white w-full max-w-sm rounded-2xl shadow-lg p-8 space-y-6 border border-gray-100 hover:shadow-2xl transition-all duration-300"
        >
          {/* Logo + Title */}
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <img src={assets.favicon} alt="favicon" />
            </div>
            <h2 className="text-3xl font-semibold text-gray-800">
              <span className="text-primary">Seller</span> Login
            </h2>
            <p className="text-sm text-gray-500">Welcome back! Manage your store dashboard</p>
          </div>

          {/* Email Input */}
          <div className="space-y-1">
            <label className="text-gray-700 font-medium text-lg">Email</label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-primary transition">
              <Mail className="w-6 h-6 text-gray-400 mr-2" />
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                placeholder="Enter your email"
                className="w-full p-2 outline-none text-gray-700 bg-transparent placeholder:text-gray-400"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1 relative">
            <label className="text-gray-700 font-medium text-lg">Password</label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-primary transition">
              <Lock className="w-6 h-6 text-gray-400 mr-2" />
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                className="w-full p-2 outline-none text-gray-700 bg-transparent placeholder:text-gray-400"
                required
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 cursor-pointer text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold text-white transition-all ${
              loading
                ? 'bg-primary/70 cursor-not-allowed'
                : 'bg-primary hover:bg-primary/90 hover:shadow-md'
            }`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    )
  );
};

export default SellerLogin;
