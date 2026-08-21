const { Router } = require('express');
const indexRouter = Router();
const indexController = require('../controllers/indexController');


indexRouter.get('/products', indexController.getProducts);

indexRouter.get('/create', indexController.renderCreateForm);
indexRouter.post('/create', indexController.createProduct)

indexRouter.get('/category', indexController.renderCategoryForm);
indexRouter.post('/category', indexController.handleCategoryForm);

indexRouter.get('/product/v1/:id', indexController.getProduct);
indexRouter.post('/product/v1/:id', indexController.updateProduct);
indexRouter.post('/delete/product/v1/:id', indexController.deleteProduct);




module.exports = indexRouter;