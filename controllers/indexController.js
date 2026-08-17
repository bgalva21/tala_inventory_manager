const db = require('../db/queries');
const { body, validationResult } = require("express-validator");

const getIndex = async (req,res) =>{
    try{
        const products = await db.getAllProducts();
        const categories = await db.getAllCategories();
        res.render('index', {products:products , categories:categories});
    }catch(e){
        //server error
        console.error(`Could not get products or categories, error: `,e);
        res.status(500).send("Internal Server Error");
    }
    
}

const renderProductsByCategory = async (req,res) =>{
    const id = Number(req.params.id);

    try{
        const productsByCategories = await db.getProductByCategory(id);
        const categories = await db.getAllCategories();

        res.render('index', {products:productsByCategories , categories:categories});
    }catch(e){
        console.error(`Could not get products by category, error: `,e);
        res.status(500).send("Internal Server Error");
    }
};

const getProduct = async (req,res) =>{

    const id = Number(req.params.id);
    try{
        const product = await db.getProduct(id);
        res.render('product', {product:product});
    }catch(e){
        console.error("Error getting product: ", e);
        res.status(500).send("Internal Server Error");
    }
}

const updateProduct = async (req,res) =>{
    const stuff = req.body;
    const {id,name,description,price,stock} = req.body;
    
    if(price < 0){
        res.status(400).send("Price cannot be negative");
    }

    if(!name){
        res.status(400).send("Name needed");
    }
    
    try {
        const updateProduct = await db.updateProduct(id,name,description,price,stock);
        
        if(updateProduct){
            const productsByCategories = await db.getProductByCategory(id);
            const categories = await db.getAllCategories();

            res.redirect('index', {products:productsByCategories , categories:categories});
        }

    } catch (error) {
        console.error("Error updating product: ",error);
        res.status(500).send("Internal Server Error");
    }
}

module.exports ={
    getIndex,
    getProduct,
    renderProductsByCategory,
    updateProduct
};