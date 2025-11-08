import { useAppContext } from '../context/AppContext';
import ProductCard from './ProductCard';

const BestSeller = () => {
  const { products } = useAppContext();
  const bestSellerProducts = products
    .filter((product) => product.inStock)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 5);

  return (
    <section className="mt-20">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">
          Best Sellers
        </h2>
        <p className="text-gray-500 mt-2 text-sm md:text-base">
          Top products our customers love the most
        </p>
        <div className="w-16 h-1 bg-primary mx-auto mt-3 rounded-full" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 px-2 sm:px-0">
        {bestSellerProducts.length > 0 ? (
          bestSellerProducts.map((product, index) => (
            <ProductCard key={product._id || index} product={product} />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-400">
            No best seller products available.
          </p>
        )}
      </div>
    </section>
  );
};

export default BestSeller;
