import { toast } from 'react-hot-toast';
import { useAppContext } from '../../context/AppContext';

const ProductList = () => {
  const { products, currency, axios, fetchProducts } = useAppContext();

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
    }
  };

  return (
    <div className="no-scrollbar flex-1 overflow-y-scroll flex flex-col justify-between bg-gray-50">
      <div className="w-full md:p-10 p-4">
        <h2 className="pb-4 text-lg md:text-2xl font-semibold text-gray-800">All Products</h2>

        {/* Responsive Table Wrapper */}
        <div className="w-full overflow-x-auto overflow-y-hidden rounded-lg bg-white border border-gray-200 shadow-sm">
          <table className="min-w-[650px] w-full text-xs sm:text-sm md:text-base">
            <thead className="text-gray-700 bg-gray-100">
              <tr>
                <th className="px-4 py-3 font-semibold text-left">Product</th>
                <th className="px-4 py-3 font-semibold text-left">Category</th>
                <th className="px-4 py-3 font-semibold text-left hidden sm:table-cell">
                  Selling Price
                </th>
                <th className="px-4 py-3 font-semibold text-center">In Stock</th>
              </tr>
            </thead>

            <tbody className="text-gray-600">
              {products.map((product) => (
                <tr
                  key={product._id}
                  className="border-t border-gray-200 hover:bg-gray-50 transition-colors"
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
                    <span className="truncate">{product.name}</span>
                  </td>

                  {/* Category */}
                  <td className="px-4 py-3">{product.category}</td>

                  {/* Price */}
                  <td className="px-4 py-3 hidden sm:table-cell whitespace-nowrap">
                    {currency}
                    {product.offerPrice}
                  </td>

                  {/* In Stock Toggle */}
                  <td className="px-4 py-3 text-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        onClick={() => toggleStock(product._id, !product.inStock)}
                        type="checkbox"
                        className="sr-only peer"
                        checked={product.inStock}
                      />
                      <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-primary transition-colors duration-300"></div>
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-5"></div>
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer spacing */}
        <div className="mt-10"></div>
      </div>
    </div>
  );
};

export default ProductList;
