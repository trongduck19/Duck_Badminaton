import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const Loading = () => {
  const { navigate } = useAppContext();
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const nextUrl = query.get('next');
  useEffect(() => {
    if (nextUrl) {
      setTimeout(() => {
        navigate(`/${nextUrl}`);
      }, 5000);
    }
  }, [nextUrl]);
  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="relative flex items-center justify-center">
        <div className="absolute w-32 h-32 border-4 border-gray-200 rounded-full"></div>
        <div className="w-32 h-32 border-4 border-t-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
        <span className="absolute text-blue-600 font-semibold text-lg animate-pulse">
          Loading...
        </span>
      </div>
    </div>
  );
};

export default Loading;
