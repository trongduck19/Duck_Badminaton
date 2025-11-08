import express from 'express';
import { upload } from '../configs/multer.js';
import {
  addProduct,
  changeStock,
  deleteProduct,
  productById,
  productList,
  updateProduct,
} from '../controllers/productController.js';
import authSeller from '../middlewares/authSeller.js';

const productRouter = express.Router();

productRouter.post('/add', upload.array(['images']), authSeller, addProduct);
productRouter.get('/list', productList);
productRouter.get('/:id', productById);
productRouter.post('/stock', authSeller, changeStock);
productRouter.put('/:id', upload.array('images'), updateProduct);
productRouter.delete('/:id', deleteProduct);

export default productRouter;
