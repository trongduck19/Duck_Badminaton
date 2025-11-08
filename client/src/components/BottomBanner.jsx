import { assets } from '../assets/assets'; // nơi chứa icon

const BottomBanner = () => {
  const features = [
    {
      icon: assets.truck_icon, // 👉 thay icon của bạn
      title: 'Worldwide Shipping',
      desc: 'Pay on delivery at your doorstep.',
    },
    {
      icon: assets.quality_icon,
      title: 'Quality Guarantee',
      desc: 'We ensure top-quality products for all customers.',
    },
    {
      icon: assets.replace_icon,
      title: 'Free Replacement',
      desc: 'Easily replace defective items at no cost.',
    },
    {
      icon: assets.payment_icon,
      title: 'Secure Payment',
      desc: 'Checkout safely with multiple payment options.',
    },
  ];

  return (
    <div className="w-full mt-20 bg-white py-10">
      {/* Title */}
      <h2 className="text-center text-3xl md:text-4xl font-semibold text-gray-800 mb-10">
        Why we are the best?
      </h2>

      {/* Features grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 px-4">
        {features.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center bg-white border border-primary/20 rounded-xl p-6"
          >
            <div className="w-12 h-12 flex items-center justify-center bg-primary/10 rounded-full mb-4">
              <img src={item.icon} alt={item.title} className="w-6 h-6 object-contain" />
            </div>

            <h3 className="text-primary font-semibold text-lg mb-1">{item.title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BottomBanner;
