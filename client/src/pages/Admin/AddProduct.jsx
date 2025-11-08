import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { assets, categories } from '../../assets/assets';
import { useAppContext } from '../../context/AppContext';

const AddProduct = () => {
  const [files, setFiles] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [loading, setLoading] = useState(false);

  const { axios } = useAppContext();

  const onSubmitHandler = async (event) => {
    try {
      event.preventDefault();
      setLoading(true);

      const productData = {
        name,
        description: description.split('\n'),
        category,
        price,
        offerPrice,
        inStock: true,
      };

      const formData = new FormData();
      formData.append('productData', JSON.stringify(productData));

      for (let i = 0; i < files.length; i++) {
        if (files[i]) formData.append('images', files[i]);
      }

      const { data } = await axios.post('/api/product/add', formData);

      if (data.success) {
        toast.success(data.message);

        setName('');
        setDescription('');
        setCategory('');
        setPrice('');
        setOfferPrice('');
        setFiles([]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="no-scrollbar flex-1 overflow-y-scroll flex flex-col md:flex-row md:items-start justify-between gap-6 md:p-10 p-4 bg-gray-50">
      {/* --- FORM SECTION --- */}
      <form
        onSubmit={onSubmitHandler}
        className="space-y-6 max-w-lg flex-1 bg-white p-8 rounded-2xl shadow-md border border-gray-100"
      >
        <h2 className="text-2xl font-semibold text-gray-800 border-b pb-3">Add New Product</h2>

        {/* --- IMAGE UPLOAD --- */}
        <div>
          <p className="text-base font-medium mb-2 text-gray-700">Product Images</p>
          <div className="flex flex-wrap items-center gap-3">
            {Array(4)
              .fill('')
              .map((_, index) => (
                <label key={index} htmlFor={`image${index}`} className="relative group">
                  <input
                    type="file"
                    id={`image${index}`}
                    hidden
                    accept="image/*"
                    onChange={(e) => {
                      const updatedFiles = [...files];
                      updatedFiles[index] = e.target.files[0];
                      setFiles(updatedFiles);
                    }}
                  />

                  {files[index] && (
                    <div
                      onClick={() => {
                        const updatedFiles = [...files];
                        updatedFiles[index] = null;
                        setFiles(updatedFiles);
                      }}
                      className="absolute top-1 right-1 bg-black/60 text-white text-xs rounded-full px-1.5 py-0.5 cursor-pointer z-10 hidden group-hover:block"
                    >
                      ✕
                    </div>
                  )}

                  <div className="relative w-[100px] h-[100px] rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-500 flex items-center justify-center bg-gray-50 cursor-pointer transition">
                    {files[index] ? (
                      <img
                        src={URL.createObjectURL(files[index])}
                        alt="preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <img
                        src={assets.upload_area}
                        alt="upload placeholder"
                        className="w-8 h-8 opacity-60"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-sm rounded-xl transition">
                      Upload
                    </div>
                  </div>
                </label>
              ))}
          </div>
        </div>

        {/* --- PRODUCT NAME --- */}
        <div className="flex flex-col gap-1">
          <label className="font-medium text-gray-700">Product Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Enter product name"
            className="outline-none py-2.5 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition"
            required
          />
        </div>

        {/* --- DESCRIPTION --- */}
        <div className="flex flex-col gap-1">
          <label className="font-medium text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Enter product description"
            className="outline-none py-2.5 px-3 rounded-lg border border-gray-300 resize-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition"
          ></textarea>
        </div>

        {/* --- CATEGORY --- */}
        <div className="flex flex-col gap-1">
          <label className="font-medium text-gray-700">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="outline-none py-2.5 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition"
          >
            <option value="">Select category</option>
            {categories.map((item, index) => (
              <option key={index} value={item.path}>
                {item.name || item.path}
              </option>
            ))}
          </select>
        </div>

        {/* --- PRICE --- */}
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 flex flex-col gap-1">
            <label className="font-medium text-gray-700">Price ($)</label>
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              type="number"
              placeholder="0"
              className="outline-none py-2.5 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition"
              required
            />
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <label className="font-medium text-gray-700">Offer Price ($)</label>
            <input
              value={offerPrice}
              onChange={(e) => setOfferPrice(e.target.value)}
              type="number"
              placeholder="0"
              className="outline-none py-2.5 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition"
              required
            />
          </div>
        </div>

        {/* --- SUBMIT --- */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? 'Uploading...' : 'Add Product'}
        </button>
      </form>

      {/* --- PREVIEW SECTION --- */}
      <div className="hidden md:block flex-1 bg-white shadow-md rounded-2xl p-8 border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Preview</h2>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-4 flex flex-col items-center max-w-xs mx-auto">
          {offerPrice && price && (
            <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full shadow-sm">
              -{Math.round(((price - offerPrice) / price) * 100)}%
            </div>
          )}

          <div className="w-full flex justify-center items-center bg-gray-50 rounded-xl mb-3 h-48 overflow-hidden">
            <img
              src={
                files[0]
                  ? URL.createObjectURL(files[0])
                  : 'https://placehold.co/300x200?text=Product+Preview'
              }
              alt="preview"
              className="object-contain max-h-[180px] transition-transform duration-300 hover:scale-105"
            />
          </div>

          <div className="text-center w-full">
            <h3 className="text-gray-800 font-semibold text-base line-clamp-2 h-[42px] leading-tight">
              {name || 'Product Name'}
            </h3>

            <div className="flex items-center justify-center gap-1 mt-1">
              {[...Array(5)].map((_, i) => (
                <img
                  key={i}
                  src={assets.star_dull_icon}
                  alt="rating"
                  className="w-4 h-4 opacity-40"
                />
              ))}
              <span className="text-xs text-gray-400 ml-1">(0)</span>
            </div>

            <div className="mt-3 flex items-center justify-center gap-2">
              <p className="text-primary font-bold text-lg">${offerPrice || price || '0'}</p>
              {offerPrice && price && (
                <p className="text-gray-400 text-sm line-through">${price}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
