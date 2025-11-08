import { useEffect, useState } from 'react';
import { categories } from '../assets/assets';
import ProductCard from '../components/ProductCard';
import { useAppContext } from '../context/AppContext';

const AllProducts = () => {
  const { products, searchQuery, currency } = useAppContext();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [visibleCount, setVisibleCount] = useState(12);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    let tempProducts = [...products];

    // Search filter
    if (searchQuery.length > 0) {
      tempProducts = tempProducts.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Category filter
    if (categoryFilter) {
      tempProducts = tempProducts.filter((p) => p.category === categoryFilter);
    }

    // Sorting
    if (sortBy === 'priceLow') tempProducts.sort((a, b) => a.price - b.price);
    if (sortBy === 'priceHigh') tempProducts.sort((a, b) => b.price - a.price);
    if (sortBy === 'newest')
      tempProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Only show inStock
    tempProducts = tempProducts.filter((p) => p.inStock);

    setFilteredProducts(tempProducts);
    setVisibleCount(12);
    setLoading(false);
  }, [products, searchQuery, categoryFilter, sortBy]);

  const loadMore = () => setVisibleCount((prev) => prev + 12);

  return (
    <div className="mt-24 flex flex-col px-4 md:px-10">
      {/* Header */}
      <div className="flex flex-col items-end w-max mb-6">
        <h2 className="text-3xl font-semibold text-center text-primary">All Products</h2>
        <div className="w-16 h-0.5 bg-primary rounded-full"></div>
      </div>

      {/* Filters & Sort */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex gap-2 items-center">
          <span>Category:</span>
          <select
            className="border rounded-lg px-2 py-1"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All</option>
            {categories.map((c, i) => (
              <option key={i} value={c.path}>
                {c.name || c.path}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2 items-center">
          <span>Sort by:</span>
          <select
            className="border rounded-lg px-2 py-1"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="">Default</option>
            <option value="priceLow">Price: Low to High</option>
            <option value="priceHigh">Price: High to Low</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>

      {/* Products grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5">
          {Array(12)
            .fill('')
            .map((_, i) => (
              <div key={i} className="w-full h-48 bg-gray-200 animate-pulse rounded-xl"></div>
            ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No products found. Try another search or category.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5">
            {filteredProducts.slice(0, visibleCount).map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </div>

          {/* Load More */}
          {visibleCount < filteredProducts.length && (
            <div className="flex justify-center mt-6">
              <button
                onClick={loadMore}
                className="px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition"
              >
                Load More
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AllProducts;
