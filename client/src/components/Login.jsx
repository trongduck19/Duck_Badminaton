import { Eye, EyeOff, LogIn, UserPlus } from 'lucide-react';
import React from 'react';
import { toast } from 'react-hot-toast';
import { useAppContext } from '../context/AppContext';

const Login = () => {
  const { setShowUserLogin, setUser, axios, navigate } = useAppContext();
  const [state, setState] = React.useState('login'); // 'login' hoặc 'register'
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false); // trạng thái show/hide pass

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`/api/user/${state}`, { name, email, password });
      if (data.success) {
        toast.success('Welcome!');
        setUser(data.user);
        setShowUserLogin(false);
        navigate('/');
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div
      onClick={() => setShowUserLogin(false)}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
    >
      <form
        onSubmit={onSubmitHandler}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-xl border border-gray-100 flex flex-col gap-5 animate-fadeIn"
      >
        {/* Header */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary">
            {state === 'login' ? <LogIn size={24} /> : <UserPlus size={24} />}
          </div>
          <h2 className="text-3xl font-semibold text-primary">
            {state === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-gray-500 text-sm">
            {state === 'login'
              ? 'Login to continue exploring amazing deals'
              : 'Join us and start your journey today!'}
          </p>
        </div>

        {/* Name (chỉ khi register) */}
        {state === 'register' && (
          <div className="w-full">
            <label className="text-gray-700 text-sm font-medium">Full Name</label>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              placeholder="Enter your name"
              className="mt-1 w-full p-2.5 rounded-md border border-gray-200 text-gray-700 placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:shadow-primary/10 outline-none transition-all"
              type="text"
              required
            />
          </div>
        )}

        {/* Email */}
        <div className="w-full">
          <label className="text-gray-700 text-sm font-medium">Email</label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="test@gmail.com"
            className="mt-1 w-full p-2.5 rounded-md border border-gray-200 text-gray-700 placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            type="email"
            required
          />
        </div>

        {/* Password */}
        <div className="w-full relative">
          <label className="text-gray-700 text-sm font-medium">Password</label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="••••••••"
            type={showPassword ? 'text' : 'password'}
            className="mt-1 w-full p-2.5 rounded-md border border-gray-200 text-gray-700 placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            required
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 bottom-3 cursor-pointer text-gray-700"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="mt-2 bg-gradient-to-r from-primary to-primary/70 hover:from-primary/90 hover:to-primary/60 text-white w-full py-2.5 rounded-lg font-medium shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
        >
          {state === 'register' ? 'Create Account' : 'Login'}
        </button>

        {/* Switch login/register */}
        <p className="text-center text-gray-600 text-sm mt-3">
          {state === 'register' ? (
            <>
              Already have an account?{' '}
              <span
                onClick={() => setState('login')}
                className="text-primary font-medium cursor-pointer hover:underline"
              >
                Login
              </span>
            </>
          ) : (
            <>
              Don’t have an account?{' '}
              <span
                onClick={() => setState('register')}
                className="text-primary font-medium cursor-pointer hover:underline"
              >
                Sign Up
              </span>
            </>
          )}
        </p>
      </form>
    </div>
  );
};

export default Login;
