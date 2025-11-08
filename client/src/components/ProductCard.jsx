import { assets } from '../assets/assets';
import { useAppContext } from '../context/AppContext';

const ProductCard = ({ product }) => {
  const { currency, addToCart, removeFromCart, cartItems, navigate } = useAppContext();

  if (!product) return null;

  const handleNavigate = () => {
    navigate(`/products/${product.category.toLowerCase()}/${product._id}`);
  };

  return (
    <div
      onClick={handleNavigate}
      className="relative bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer border border-gray-200 p-4 w-full max-w-sm"
    >
      {/* Discount Badge */}
      {product.discount && (
        <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-medium shadow-sm">
          -{product.discount}%
        </span>
      )}

      {/* Product Image */}
      <div className="flex justify-center items-center mb-4">
        <div className="w-52 h-52 overflow-hidden rounded-xl bg-gray-100 flex items-center justify-center">
          <img
            src={product?.image?.[0] || product?.images?.[0] || '/placeholder.png'}
            alt={product?.name || 'Product'}
            className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
          />
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-2">
        <p className="text-gray-400 text-sm">{product.category}</p>
        <h3 className="text-gray-800 font-semibold text-lg truncate">{product.name}</h3>

        {/* Rating */}
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <img
              key={i}
              src={i < Math.floor(product.rating || 4) ? assets.star_icon : assets.star_dull_icon}
              alt="rating"
              className="w-4 h-4"
            />
          ))}
          <span className="text-xs text-gray-400 ml-1">({product.rating || 4})</span>
        </div>

        {/* Price & Cart */}
        <div className="flex items-end justify-between mt-3">
          <p className="text-xl font-semibold text-primary">
            {currency}
            {product.offerPrice}{' '}
            <span className="text-gray-400 text-sm line-through ml-1">
              {currency}
              {product.price}
            </span>
          </p>

          {/* Cart Button */}
          <div onClick={(e) => e.stopPropagation()} className="text-primary">
            {!cartItems?.[product._id] ? (
              <button
                onClick={() => addToCart(product._id)}
                className="flex items-center justify-center gap-2 bg-primary text-white rounded-lg px-3 py-1.5 hover:bg-primary/90 transition text-sm"
              >
                <img src={assets.cart_icon} alt="cart_icon" className="w-4 h-4" />
                Add
              </button>
            ) : (
              <div className="flex items-center justify-center gap-2 bg-primary/20 rounded-lg px-3 py-1.5 select-none">
                <button
                  onClick={() => removeFromCart(product._id)}
                  className="text-md font-medium hover:text-primary cursor-pointer"
                >
                  -
                </button>
                <span className="w-5 text-center">{cartItems?.[product._id]}</span>
                <button
                  onClick={() => addToCart(product._id)}
                  className="text-md font-medium hover:text-primary cursor-pointer"
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
