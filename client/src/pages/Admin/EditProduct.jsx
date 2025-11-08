import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { assets, categories } from '../../assets/assets';
import { useAppContext } from '../../context/AppContext';

const EditProduct = () => {
  const { id } = useParams();
  const { axios, navigate } = useAppContext();

  const [product, setProduct] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data } = await axios.get(`/api/product/${id}`);
      if (data.success) {
        setProduct(data.product);
      } else toast.error(data.message);
    } catch (error) {
      toast.error('Failed to load product');
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const updatedData = {
        name: product.name,
        description: product.description,
        category: product.category,
        price: product.price,
        offerPrice: product.offerPrice,
        inStock: product.inStock,
      };

      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        if (files[i]) formData.append('images', files[i]);
      }
      Object.entries(updatedData).forEach(([key, value]) => formData.append(key, value));

      const { data } = await axios.put(`/api/product/${id}`, formData);

      if (data.success) {
        toast.success('Product updated');
        navigate('/seller/product-list');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Update failed');
    } finally {
      setLoading(false);
    }
  };

  if (!product) return <p className="p-10 text-gray-600">Loading product...</p>;

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-gray-50">
      <form
        onSubmit={onSubmitHandler}
        className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 max-w-3xl mx-auto space-y-6"
      >
        <h2 className="text-3xl font-bold text-gray-800 border-b pb-3 mb-4">Edit Product</h2>

        {/* Upload ảnh */}
        <div>
          <p className="text-base font-medium mb-2 text-gray-700">Product Images</p>
          <div className="flex flex-wrap gap-4">
            {Array(4)
              .fill('')
              .map((_, i) => (
                <label key={i} htmlFor={`img${i}`} className="relative group">
                  <input
                    id={`img${i}`}
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => {
                      const updated = [...files];
                      updated[i] = e.target.files[0];
                      setFiles(updated);
                    }}
                  />
                  <div className="w-[100px] h-[100px] border-2 border-dashed rounded-xl flex items-center justify-center overflow-hidden bg-gray-100 hover:border-primary cursor-pointer transition">
                    {files[i] ? (
                      <img
                        src={URL.createObjectURL(files[i])}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : product.image[i] ? (
                      <img
                        src={product.image[i]}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <img src={assets.upload_area} className="w-8 opacity-50" />
                    )}

                    {/* Hover icon delete ảnh */}
                    {(files[i] || product.image[i]) && (
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...files];
                          updated[i] = null;
                          setFiles(updated);
                          if (product.image[i]) {
                            const newImages = [...product.image];
                            newImages[i] = null;
                            setProduct({ ...product, image: newImages });
                          }
                        }}
                        className="absolute top-1 right-1 bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                      >
                        <span className="text-red-500 font-bold">×</span>
                      </button>
                    )}
                  </div>
                </label>
              ))}
          </div>
        </div>

        {/* Form inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="font-medium text-gray-700 mb-1">Name</label>
            <input
              value={product.name}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
              className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-primary focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="flex flex-col">
            <label className="font-medium text-gray-700 mb-1">Category</label>
            <select
              value={product.category}
              onChange={(e) => setProduct({ ...product, category: e.target.value })}
              className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-primary focus:ring-1 focus:ring-primary"
            >
              {categories.map((c, i) => (
                <option key={i} value={c.path}>
                  {c.name || c.path}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label className="font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={product.description}
              onChange={(e) => setProduct({ ...product, description: e.target.value })}
              className="border border-gray-200 rounded-lg px-3 py-2 h-24 resize-none focus:outline-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1 flex flex-col">
              <label className="font-medium text-gray-700 mb-1">Price</label>
              <input
                type="number"
                value={product.price}
                onChange={(e) => setProduct({ ...product, price: e.target.value })}
                className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="flex-1 flex flex-col">
              <label className="font-medium text-gray-700 mb-1">Offer Price</label>
              <input
                type="number"
                value={product.offerPrice}
                onChange={(e) => setProduct({ ...product, offerPrice: e.target.value })}
                className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={product.inStock || false}
              onChange={(e) => setProduct({ ...product, inStock: e.target.checked })}
              className="w-5 h-5"
            />
            <label className="font-medium text-gray-700">In Stock</label>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:opacity-90 transition"
        >
          {loading ? 'Saving...' : 'Update Product'}
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
