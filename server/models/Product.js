import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: [String], required: true },
    price: { type: Number, required: true },
    offerPrice: { type: Number, required: true },
    image: { type: [String], required: true },
    category: { type: String, required: true },
    stockQty: { type: Number, required: true, default: 0 },
    inStock: { type: Boolean, default: true },
  },
  { timestamps: true },
);

productSchema.pre('save', function (next) {
  this.inStock = this.stockQty > 0;
  next();
});

const Product = mongoose.models.product || mongoose.model('Product', productSchema);

export default Product;
