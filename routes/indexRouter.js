const { Router } = require('express');
const indexRouter = Router();
const indexController = require('../controllers/indexController');


indexRouter.get('/', indexController.getIndex);
indexRouter.post('/', indexController.updateProduct);
indexRouter.get('/product/v1/:id', indexController.getProduct);
indexRouter.get('/category/v1/:id', indexController.renderProductsByCategory);


module.exports = indexRouter;