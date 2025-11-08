import { toast } from 'react-hot-toast';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

const ProductList = () => {
  const { products, currency, axios, fetchProducts } = useAppContext();
  const navigate = useNavigate();

  const toggleStock = async (id, inStock) => {
    try {
      const { data } = await axios.post(`/api/product/stock`, { id, inStock });
      if (data.success) {
        fetchProducts();
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error('Lỗi khi cập nhật trạng thái tồn kho');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const { data } = await axios.delete(`/api/product/${id}`);
      if (data.success) {
        toast.success(data.message);
        fetchProducts();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error('Lỗi khi xóa sản phẩm');
    }
  };

  const handleEdit = (id) => navigate(`/seller/edit/${id}`);

  return (
    <div className="flex-1 overflow-y-scroll bg-gray-50 no-scrollbar">
      <div className="w-full md:p-10 p-4">
        <h2 className="pb-4 text-lg md:text-2xl font-semibold text-gray-800">All Products</h2>

        <div className="w-full overflow-x-auto rounded-lg bg-white border border-gray-200 shadow-md">
          <table className="min-w-[750px] w-full text-xs sm:text-sm md:text-base">
            <thead className="text-gray-700 bg-gray-100">
              <tr>
                <th className="px-4 py-3 font-semibold text-left">Product</th>
                <th className="px-4 py-3 font-semibold text-left">Category</th>
                <th className="px-4 py-3 font-semibold text-left hidden sm:table-cell">
                  Selling Price
                </th>
                <th className="px-4 py-3 font-semibold text-center">In Stock</th>
                <th className="px-4 py-3 font-semibold text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="text-gray-600">
              {products.map((product) => (
                <tr
                  key={product._id}
                  className="border-t border-gray-200 hover:bg-gray-50 transition-colors duration-200"
                >
                  {/* Product */}
                  <td className="px-4 py-3 flex items-center space-x-3 truncate">
                    <div className="border border-gray-200 rounded-md overflow-hidden w-14 h-14 flex-shrink-0">
                      <img
                        src={product.image[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="truncate font-medium text-gray-800">{product.name}</span>
                  </td>

                  {/* Category */}
                  <td className="px-4 py-3">{product.category}</td>

                  {/* Price */}
                  <td className="px-4 py-3 hidden sm:table-cell whitespace-nowrap font-semibold text-gray-700">
                    {currency}
                    {product.offerPrice}
                  </td>

                  {/* In Stock Toggle */}
                  <td className="px-4 py-3 text-center">
                    <div className="flex flex-col items-center space-y-1">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          onChange={() => toggleStock(product._id, !product.inStock)}
                          type="checkbox"
                          className="sr-only peer"
                          checked={product.inStock}
                        />
                        <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-primary transition-colors duration-300"></div>
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-5"></div>
                      </label>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 text-center">
                    <div className="flex flex-col sm:flex-row items-center justify-center sm:space-x-2 space-y-1 sm:space-y-0">
                      <button
                        onClick={() => handleEdit(product._id)}
                        className="flex items-center justify-center px-3 py-1 min-w-[60px] bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                      >
                        <FiEdit className="mr-1" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="flex items-center justify-center px-3 py-1 min-w-[60px] bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                      >
                        <FiTrash2 className="mr-1" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-10"></div>
      </div>
    </div>
  );
};

export default ProductList;
