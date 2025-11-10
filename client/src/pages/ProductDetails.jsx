import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { assets } from '../assets/assets';
import ProductCard from '../components/ProductCard';
import { useAppContext } from '../context/AppContext';

const ProductDetails = () => {
  const { products, navigate, currency, addToCart } = useAppContext();
  const { id } = useParams();
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);

  const product = products.find((item) => item._id === id);

  useEffect(() => {
    if (products.length > 0 && product) {
      const related = products
        .filter((item) => item.category === product.category && item._id !== product._id)
        .slice(0, 5);
      setRelatedProducts(related);
    }
  }, [products, product]);

  useEffect(() => {
    setThumbnail(product?.image?.[0] || null);
  }, [product]);

  if (!product) return null;

  return (
    <div className="mt-24 max-w-7xl mx-auto px-6">
      {/* Breadcrumb */}
      <p className="text-gray-500 text-sm">
        <Link to="/" className="hover:text-primary">
          Home
        </Link>{' '}
        /
        <Link to="/products" className="hover:text-primary">
          {' '}
          Products
        </Link>{' '}
        /
        <Link to={`/products/${product.category.toLowerCase()}`} className="hover:text-primary">
          {' '}
          {product.category}
        </Link>{' '}
        /<span className="text-primary font-medium"> {product.name}</span>
      </p>

      {/* Product Info */}
      <div className="flex flex-col md:flex-row gap-12 mt-8">
        {/* Image Section */}
        <div className="flex gap-4 flex-1">
          <div className="flex flex-col gap-3 overflow-y-auto max-h-[400px] scrollbar-hide">
            {product.image.map((img, i) => (
              <div
                key={i}
                onClick={() => setThumbnail(img)}
                className={`border rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition ${
                  thumbnail === img ? 'border-primary' : 'border-gray-200'
                }`}
              >
                <img src={img} alt={`Thumbnail ${i + 1}`} className="w-20 h-20 object-cover" />
              </div>
            ))}
          </div>
          <div className="border border-gray-200 rounded-lg overflow-hidden flex-1">
            <img src={thumbnail} alt="Selected product" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Details Section */}
        <div className="flex-1 text-gray-800">
          <h1 className="text-3xl font-semibold">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-3">
            {Array(5)
              .fill('')
              .map((_, i) => (
                <img
                  key={i}
                  src={
                    i < Math.floor(product.rating || 4) ? assets.star_icon : assets.star_dull_icon
                  }
                  alt="star"
                  className="w-4 h-4"
                />
              ))}
            <span className="ml-2 text-gray-500 text-sm">({product.rating || 4})</span>
          </div>

          {/* Price */}
          <div className="mt-6">
            <p className="text-gray-400 line-through text-sm">
              MRP: {currency}
              {product.price}
            </p>
            <p className="text-3xl font-bold text-primary mt-1">
              {currency}
              {product.offerPrice}
            </p>
            <span className="text-gray-500 text-sm">(Inclusive of all taxes)</span>
          </div>

          {/* Stock Status */}
          <div className="mt-3">
            {product.inStock && product.stockQty > 0 ? (
              <p className="text-green-600 font-semibold">
                In Stock: {product.stockQty} items left
              </p>
            ) : (
              <p className="text-red-600 font-semibold">Sold Out</p>
            )}
          </div>

          {/* Description */}
          <div className="mt-8">
            <p className="font-medium text-lg mb-2">About Product</p>
            <ul className="list-disc ml-5 text-gray-600 leading-relaxed">
              {product.description.map((desc, i) => (
                <li key={i}>{desc}</li>
              ))}
            </ul>
          </div>

          {/* Add to Cart / Buy Now */}
          <div className="flex items-center gap-4 mt-10">
            <button
              onClick={() => addToCart(product._id)}
              disabled={!product.inStock || product.stockQty === 0}
              className={`flex-1 py-3 rounded-lg font-medium border border-gray-300 transition ${
                product.inStock && product.stockQty > 0
                  ? 'bg-gray-50 hover:bg-gray-100'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Add to Cart
            </button>
            <button
              onClick={() => {
                addToCart(product._id);
                navigate('/cart');
              }}
              disabled={!product.inStock || product.stockQty === 0}
              className={`flex-1 py-3 rounded-lg font-medium transition ${
                product.inStock && product.stockQty > 0
                  ? 'bg-primary text-white hover:bg-primary/90'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="flex flex-col items-center mt-20">
        <div className="flex flex-col items-center">
          <p className="text-2xl font-semibold">Related Products</p>
          <div className="w-20 h-1 bg-primary rounded-full mt-2"></div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 mt-8 w-full">
          {relatedProducts
            .filter((item) => item.inStock && item.stockQty > 0)
            .map((item, i) => (
              <ProductCard key={i} product={item} />
            ))}
        </div>

        <button
          onClick={() => {
            navigate('/products');
            scrollTo(0, 0);
          }}
          className="mt-12 px-8 py-2.5 border border-primary text-primary rounded-lg hover:bg-primary/10 transition"
        >
          See More
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
