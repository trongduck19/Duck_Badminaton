import { toast } from 'react-hot-toast';
import { assets } from '../assets/assets';
import { useAppContext } from '../context/AppContext';

const ProductCard = ({ product }) => {
  const { addToCart, removeFromCart, cartItems, navigate } = useAppContext();

  if (!product) return null;

  const handleNavigate = () => {
    navigate(`/products/${product.category.toLowerCase()}/${product._id}`);
  };

  const isSoldOut = !product.inStock || product.stockQty <= 0;

  // ✅ Check stock before adding
  const handleAdd = () => {
    if ((cartItems[product._id] || 0) + 1 > product.stockQty) {
      toast.error(` Only ${product.stockQty} items left in stock`);
      return;
    }
    addToCart(product._id);
  };

  return (
    <div
      onClick={handleNavigate}
      className="relative bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer border border-gray-200 p-4 w-full max-w-xs flex flex-col"
    >
      {/* Discount Badge */}
      {product.discount && (
        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-medium shadow-sm z-10">
          -{product.discount}%
        </span>
      )}

      {/* Sold Out Badge */}
      {isSoldOut && (
        <div className="absolute top-2 right-2">
          <span className="bg-white shadow-sm border border-red-500 text-red-500 text-xs px-2 py-0.5 rounded-full font-semibold z-10">
            SOLD OUT
          </span>
        </div>
      )}

      {/* Product Image */}
      <div className="flex justify-center items-center mb-3">
        <div className="w-full h-64 flex items-center justify-center bg-gray-100 rounded-xl overflow-hidden">
          <img
            src={product?.image?.[0] || '/placeholder.png'}
            alt={product?.name || 'Product'}
            className={`object-contain w-full h-full transition-transform duration-300 ${
              !isSoldOut ? 'hover:scale-105' : 'opacity-60'
            }`}
          />
        </div>
      </div>

      {/* Product Info */}
      <div className="flex-1 flex flex-col justify-between">
        <div className="space-y-1">
          <p className="text-gray-400 text-sm">{product.category}</p>
          <h3 className="text-gray-800 font-semibold text-lg">{product.name}</h3>

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

          {/* Price */}
          <div className="mt-1 flex items-baseline gap-2">
            <p className="text-primary font-bold text-lg">${product.offerPrice}</p>
            <p className="text-gray-400 line-through text-sm">${product.price}</p>
          </div>
        </div>

        {/* Add to Cart */}
        {!isSoldOut && (
          <div onClick={(e) => e.stopPropagation()} className="mt-3">
            {!cartItems?.[product._id] ? (
              <button
                onClick={handleAdd}
                className="w-full py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
              >
                Add to Cart
              </button>
            ) : (
              <div className="flex items-center justify-between border border-primary rounded-lg overflow-hidden">
                <button
                  onClick={() => removeFromCart(product._id)}
                  className="w-1/3 text-center py-2 bg-primary/20 hover:bg-primary/30"
                >
                  -
                </button>
                <span className="w-1/3 text-center">{cartItems[product._id]}</span>
                <button
                  onClick={handleAdd} //
                  disabled={(cartItems[product._id] || 0) >= product.stockQty}
                  className="w-1/3 text-center py-2 bg-primary/20 hover:bg-primary/30 disabled:opacity-50"
                >
                  +
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
