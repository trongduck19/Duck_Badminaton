import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';

const MainBanner = () => {
  return (
    <div className="relative w-full overflow-hidden">
      {/* Banner background */}
      <img
        src={assets.main_banner_bg}
        alt="banner"
        className="hidden md:block w-full object-cover"
      />
      <img
        src={assets.main_banner_bg_sm}
        alt="banner-sm"
        className="md:hidden w-full object-cover"
      />

      {/* Buttons container */}
      <div
        className="
    absolute bottom-2 left-1/2 transform -translate-x-1/2
    flex flex-col md:flex-row items-center gap-4 font-medium
    md:left-16 md:translate-x-0 md:bottom-8
    animate-fade-up
  "
      >
        {/* Button 1 */}
        <Link
          to={'/products'}
          className="
      group flex items-center justify-center gap-2 px-6 py-2
      rounded-full bg-linear-to-r from-yellow-400 to-yellow-500
      text-white font-semibold shadow-md hover:shadow-xl
      transition-all duration-300 hover:scale-105 backdrop-blur-sm
    "
        >
          Shop Now
          <img
            src={assets.white_arrow_icon}
            alt="arrow"
            className="md:hidden w-4 transition-transform group-hover:translate-x-1"
          />
        </Link>

        {/* Button 2 */}
        <Link
          to={'/products'}
          className="
      hidden md:flex items-center justify-center gap-2 px-6 py-2
      rounded-full border border-gray-300 bg-white/80 text-gray-700
      hover:bg-white hover:border-gray-400 hover:text-black
      transition-all duration-300 shadow-sm hover:shadow-md
      backdrop-blur-md
    "
        >
          Explore Details
          <img
            src={assets.black_arrow_icon}
            alt="arrow"
            className="w-4 transition-transform group-hover:translate-x-1"
          />
        </Link>
      </div>
    </div>
  );
};

export default MainBanner;
