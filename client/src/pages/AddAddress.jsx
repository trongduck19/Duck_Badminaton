import { Mail, MapPin, Phone, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAppContext } from '../context/AppContext';

const InputField = ({ label, type, placeholder, name, handleChange, address }) => (
  <div className="flex flex-col">
    <label className="text-gray-700 text-sm font-medium mb-1">{label}</label>
    <input
      className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none text-gray-700 focus:border-primary focus:ring-1 focus:ring-primary transition placeholder:text-gray-400"
      type={type}
      placeholder={placeholder}
      name={name}
      onChange={handleChange}
      value={address[name]}
      required
    />
  </div>
);

const AddAddress = () => {
  const { user, axios, navigate } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
    console.log(address);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post('/api/address/add', { userId: user._id, address });

      if (data.success) {
        toast.success(data.message);
        navigate('/cart');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/cart');
    }
  }, [user, navigate]);

  return (
    <div className="mt-24 pb-16">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
        Add Shipping <span className="text-primary">Address</span>
      </h2>

      <div className="flex flex-col md:flex-row gap-10 mt-10">
        {/* Left Form */}
        <form
          onSubmit={onSubmitHandler}
          className="space-y-5 w-full md:w-1/2 bg-white p-8 rounded-2xl shadow-md border border-gray-200"
        >
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="First Name"
              type="text"
              placeholder="First Name"
              name="firstName"
              handleChange={handleChange}
              address={address}
            />
            <InputField
              label="Last Name"
              type="text"
              placeholder="Last Name"
              name="lastName"
              handleChange={handleChange}
              address={address}
            />
          </div>

          <InputField
            label="Email"
            type="email"
            placeholder="Email"
            name="email"
            handleChange={handleChange}
            address={address}
          />

          <InputField
            label="Street Address"
            type="text"
            placeholder="Street Address"
            name="street"
            handleChange={handleChange}
            address={address}
          />

          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="City"
              type="text"
              placeholder="City"
              name="city"
              handleChange={handleChange}
              address={address}
            />
            <InputField
              label="State"
              type="text"
              placeholder="State"
              name="state"
              handleChange={handleChange}
              address={address}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Zip Code"
              type="text"
              placeholder="Zip Code"
              name="zipCode"
              handleChange={handleChange}
              address={address}
            />
            <InputField
              label="Country"
              type="text"
              placeholder="Country"
              name="country"
              handleChange={handleChange}
              address={address}
            />
          </div>

          <InputField
            label="Phone Number"
            type="text"
            placeholder="Phone Number"
            name="phone"
            handleChange={handleChange}
            address={address}
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-primary hover:bg-primary/90 text-white py-2.5 px-6 rounded-lg font-semibold transition w-full shadow-sm disabled:opacity-70"
          >
            {loading ? 'Saving...' : 'Save Address'}
          </button>
        </form>

        {/* Right Preview */}
        <div className="w-full md:w-1/2 bg-white rounded-2xl border border-gray-200 shadow-md p-8 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" /> Shipping Address Preview
            </h3>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-2">
              <p className="flex items-center gap-2 text-gray-700">
                <User className="w-4 h-4 text-primary" />
                <span>
                  {address.firstName || address.lastName
                    ? `${address.firstName} ${address.lastName}`
                    : '—'}
                </span>
              </p>

              <p className="flex items-center gap-2 text-gray-700">
                <Mail className="w-4 h-4 text-primary" />
                <span>{address.email || '—'}</span>
              </p>

              <p className="flex items-center gap-2 text-gray-700">
                <MapPin className="w-4 h-4 text-primary" />
                <span>
                  {address.street ? `${address.street}, ${address.city}, ${address.state}` : '—'}
                </span>
              </p>

              <p className="flex items-center gap-2 text-gray-700">
                <Phone className="w-4 h-4 text-primary" />
                <span>{address.phone || '—'}</span>
              </p>
            </div>
          </div>

          <div className="text-gray-500 text-sm mt-6 text-center italic">
            ✨ Make sure all information is correct before saving.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAddress;
