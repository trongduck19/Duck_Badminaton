import { useParams } from 'react-router-dom';
import { categories } from '../assets/assets'; // ⚡ Thêm dòng này
import ProductCard from '../components/ProductCard';
import { useAppContext } from '../context/AppContext';

const ProductCategory = () => {
  const { products } = useAppContext();
  const { category } = useParams();

  // ✅ Tìm danh mục theo path từ mảng categories
  const searchCategory = categories.filter(
    (item) => item.path.toLowerCase() === category.toLowerCase(),
  );

  // ✅ Lọc sản phẩm theo category (trùng tên trong product.category)
  const filteredProducts = products.filter(
    (product) => product.category.toLowerCase() === category.toLowerCase(),
  );

  return (
    <div className="mt-24 flex flex-col px-4 md:px-8 lg:px-16">
      {/* Tiêu đề danh mục */}
      <div className="flex flex-col items-start mb-10">
        <h2 className="mt-24 text-3xl font-semibold text-primary text-center">
          {searchCategory[0]?.text?.toUpperCase() || category?.toUpperCase() || 'CATEGORY'}
        </h2>
        <div className="w-20 h-1 bg-primary rounded-full mt-2"></div>
      </div>

      {/* Danh sách sản phẩm */}
      <div
        className="
          grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5
          gap-4 sm:gap-6 md:gap-8
        "
      >
        {filteredProducts.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>

      {/* Không có sản phẩm */}
      {filteredProducts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-gray-500">
          <img
            src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
            alt="No products"
            className="w-20 h-20 opacity-60 mb-4"
          />
          <p className="text-lg font-medium">No products found in this category</p>
        </div>
      )}
    </div>
  );
};

export default ProductCategory;
