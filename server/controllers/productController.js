import { v2 as cloudinary } from 'cloudinary';
import Product from '../models/Product.js';

// 🟢 Add Product: /api/product/add
export const addProduct = async (req, res) => {
  try {
    const productData = JSON.parse(req.body.productData);
    const images = req.files || [];

    // Upload hình lên Cloudinary
    const imagesUrl = await Promise.all(
      images.map(async (item) => {
        const result = await cloudinary.uploader.upload(item.path, {
          resource_type: 'image',
        });
        return result.secure_url;
      }),
    );

    // Tạo sản phẩm mới
    const newProduct = new Product({
      ...productData,
      image: imagesUrl,
    });

    // 🧾 Cập nhật inStock theo stockQty
    newProduct.inStock = newProduct.stockQty > 0;

    await newProduct.save();
    res.json({ success: true, message: 'Product added successfully', product: newProduct });
  } catch (error) {
    console.error('Add Product Error:', error.message);
    res.json({ success: false, message: error.message });
  }
};

// 🟡 Get All Products: /api/product/list
export const productList = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json({ success: true, products });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

// 🔵 Get Product by ID: /api/product/:id
export const productById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

// 🟠 Change Product Stock: /api/product/stock
export const changeStock = async (req, res) => {
  try {
    const { id, stockQty } = req.body;

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    product.stockQty = stockQty;
    product.inStock = stockQty > 0;

    await product.save();
    res.json({ success: true, message: 'Product stock updated', product });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

// 🟣 Update Product: PUT /api/product/:id
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = { ...req.body };

    // Upload hình mới nếu có
    if (req.files && req.files.length > 0) {
      const imagesUrl = await Promise.all(
        req.files.map(async (file) => {
          const result = await cloudinary.uploader.upload(file.path, {
            resource_type: 'image',
          });
          return result.secure_url;
        }),
      );
      updatedData.image = imagesUrl;
    }

    // Tự động cập nhật tồn kho
    if (updatedData.stockQty !== undefined) {
      updatedData.inStock = updatedData.stockQty > 0;
    }

    const product = await Product.findByIdAndUpdate(id, updatedData, { new: true });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    res.status(200).json({ success: true, message: 'Product updated successfully', product });
  } catch (error) {
    console.error('Update Product Error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔴 Delete Product: DELETE /api/product/:id
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete Product Error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    // Check tồn kho
    const cart = await Cart.findOne({ user: req.user._id });
    const currentQtyInCart =
      cart?.items.find((i) => i.product.toString() === productId)?.quantity || 0;

    if (currentQtyInCart + quantity > product.stockQty) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stockQty - currentQtyInCart} products available`,
      });
    }

    // Thêm vào giỏ hàng
    if (!cart) {
      const newCart = new Cart({
        user: req.user._id,
        items: [{ product: productId, quantity }],
      });
      await newCart.save();
    } else {
      const item = cart.items.find((i) => i.product.toString() === productId);
      if (item) {
        item.quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }
      await cart.save();
    }

    res.json({ success: true, message: 'Added to cart' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
