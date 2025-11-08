import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt, FaRegClock } from 'react-icons/fa';
import { assets } from '../assets/assets';

const Footer = () => {
  return (
    <footer className="bg-white mt-20 border-t border-gray-200 text-gray-700">
      {/* --- Top Section --- */}
      <div className="px-6 md:px-16 lg:px-24 xl:px-32 py-10 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Column 1 - Connect */}
        <div>
          <h3 className="font-semibold text-lg text-gray-900 mb-4">Connect with us</h3>
          <div className="flex items-center gap-4 mb-6">
            {/* Facebook */}
            <img src={assets.icon_fb} alt="icon_fb" className="w-8 h-8" />
            {/* Zalo (dùng ảnh thay icon) */}
            <a href="#">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary/10">
                <img src={assets.icon_zalo} alt="icon_zalo" className="w-8 h-8" />
              </div>
            </a>
          </div>

          <h4 className="font-medium text-gray-900 mb-2">Certification</h4>
          <img src={assets.icon_cn} alt="icon_cn" className="w-28" />
        </div>

        {/* Column 2 - Contact Info */}
        <div>
          <h3 className="font-semibold text-lg text-gray-900 mb-4">Contact Information</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <FaMapMarkerAlt className="text-primary mt-1" />
              <span>Kinh Duong Vuong Street, Binh Tan District, HCMC</span>
            </li>
            <li className="flex items-start gap-2">
              <FaPhoneAlt className="text-primary mt-1" />
              <span>Phone: 0789 198 439</span>
            </li>
            <li className="flex items-start gap-2">
              <FaEnvelope className="text-primary mt-1" />
              <span>Email: duck@badminton.vn</span>
            </li>
            <li className="flex items-start gap-2">
              <FaRegClock className="text-primary mt-1" />
              <span>Working hours: 8:00 AM – 9:00 PM (Mon – Sun)</span>
            </li>
          </ul>
        </div>

        {/* Column 3 - Customer Support */}
        <div>
          <h3 className="font-semibold text-lg text-gray-900 mb-4">Customer Support</h3>
          <ul className="space-y-2 text-sm">
            <li>Shopping Guide</li>
            <li>Return & Refund Policy</li>
            <li>Warranty Policy</li>
            <li>Payment Methods</li>
            <li>Shipping & Delivery</li>
          </ul>
        </div>

        {/* Column 4 - Product Categories */}
        <div>
          <h3 className="font-semibold text-lg text-gray-900 mb-4">Main Product Categories</h3>
          <ul className="space-y-2 text-sm">
            <li>Badminton Rackets</li>
            <li>Badminton Shoes</li>
            <li>Sportswear</li>
            <li>Accessories: shirts, grips, shoes...</li>
          </ul>
        </div>
      </div>

      {/* --- Bottom Section --- */}
      <div className="bg-primary/20 py-6 text-center text-sm text-gray-700">
        <p className="max-w-4xl mx-auto px-4">
          <strong>DUCKBADMINTON</strong> | Address: Kinh Duong Vuong, Binh Tan, HCMC | Business
          Registration No: 0316952580 <br />
          Representative: Hoang Dinh Trung | Phone: 0789198439 | Email: duck@badminton.vn | Working
          hours: 08:00 – 21:00 | Monday – Sunday
        </p>
      </div>
    </footer>
  );
};

export default Footer;
