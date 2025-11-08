import { Mail, MapPin, Phone } from 'lucide-react';

const Contact = () => {
  return (
    <div className="mt-24 pb-20">
      {/* Banner */}
      <div className="text-center mb-16">
        <h1 className="text-3xl md:text-5xl font-bold text-primary mb-3">Contact Us</h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          Have questions or feedback? We’d love to hear from you. Fill out the form below or reach
          out directly.
        </p>
        <div className="w-16 h-[3px] bg-primary mx-auto mt-4 rounded-full"></div>
      </div>

      {/* Contact Info + Form */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 px-6">
        {/* Contact Info */}
        <div className="flex flex-col gap-6 justify-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">Get in Touch</h2>

          <div className="flex items-start gap-4">
            <Mail className="text-primary w-6 h-6 mt-1" />
            <div>
              <h3 className="font-medium text-gray-800">Email</h3>
              <p className="text-gray-600">support@duckbadminton.com</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Phone className="text-primary w-6 h-6 mt-1" />
            <div>
              <h3 className="font-medium text-gray-800">Phone</h3>
              <p className="text-gray-600">(+84) 912-345-678</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <MapPin className="text-primary w-6 h-6 mt-1" />
            <div>
              <h3 className="font-medium text-gray-800">Address</h3>
              <p className="text-gray-600">123 Hương Lộ 2, Bình Tân, TP. Hồ Chí Minh</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <form className="bg-gray-50 rounded-2xl p-6 shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Send a Message</h2>

          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                placeholder="Your name"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                placeholder="Your email"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                rows="4"
                placeholder="Write your message..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              className="bg-primary text-white py-2 px-6 rounded-lg font-medium hover:bg-primary/90 transition-all"
            >
              Send Message
            </button>
          </div>
        </form>
      </div>

      {/* Map Section */}
      <div className="mt-16">
        <iframe
          title="Duck Badminton Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.0657421685233!2d106.62018097465849!3d10.806125589347675!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752df57f83a541%3A0x32c4e46b1d13aaf9!2zSMawxqFuZyBM4buXIDIsIELDrG5oIFTDom4sIFRQLiBI4buTIEPDoCBNaW5o!5e0!3m2!1svi!2s!4v1712234321645!5m2!1svi!2s"
          width="100%"
          height="400"
          allowFullScreen=""
          loading="lazy"
          className="rounded-2xl border-0"
        ></iframe>
      </div>
    </div>
  );
};

export default Contact;
