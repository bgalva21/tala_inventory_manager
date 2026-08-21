const db = require('../db/queries');
const { body, validationResult } = require("express-validator");


const getProducts = async (req,res) =>{
    try{

        const {sort ,category} = req.query;
        const categories = await db.getAllCategories();

        console.log(sort);

        if(category){
            if(!sort){
                let products = await db.getProductByCategory(category);
                return res.render('index', {products:products , categories:categories, selectedCategory:category});
            }

            let products = await db.getProductByCategorySorted(category,sort);
            console.log(products);

            return res.render('index', {products:products, categories:categories, selectedCategory:category})

        }else{

            if(!sort){
                let products = await db.getAllProducts("");
                return res.render('index', {products:products , categories:categories , selectedCategory:""});
            }

            let products = await db.getAllProductsStockSorted(sort);
            return res.render('index', {products:products , categories:categories , selectedCategory:""});
            
        }  
    }catch(e){
        //server error
        console.error(`Could not get products or categories`,e);
        return res.status(500).send("Internal Server Error");
    }
    
}


const getProduct = async (req,res) =>{

    const id = Number(req.params.id);
    try{
        const product = await db.getProduct(id);
        return res.render('product', {product:product});
    }catch(e){
        console.error("Error getting product: ", e);
        return res.status(500).send("Internal Server Error");
    }
}

const updateProduct = async (req,res) =>{
    const id = Number(req.params.id);
    const {name,description,price,stock} = req.body;

    console.log(id);
    
    if(price < 0){
        return res.status(400).send("Price cannot be negative");
    }

    if(!name){
        return res.status(400).send("Name needed");
    }
    
    try {
        const updateProduct = await db.updateProduct(id,name,description,price,stock);
        return res.redirect('/products');        

    } catch (error) {
        console.error("Error updating product: ",error);
        return res.status(500).send("Internal Server Error");
    }
}

const deleteProduct = async (req,res) =>{
    const id = Number(req.params.id);

    try{
        await db.deleteProduct(id);
        return res.redirect('/products');
    }catch(error){
        console.error("Error deleting product: ",error);
        return res.status(500).send("Internal server error");
    };
};

const createProduct = async (req,res) =>{
    const {name,description,price,stock,categories} = req.body;
    if(!name || !description || !price || !stock || !categories ){
        return res.status(400).send("Values must not be empty!");
    }

    try{
        const id = await db.getProductTableSize();
        let dbId = Number(id[0].count);
        dbId++;
        const dbPrice = parseFloat(price);
        const dbStock = Number(stock);
        const dbCategory= Number(categories);

        await db.createNewProduct(dbId,name,description,dbPrice,dbStock,dbCategory);
        return res.redirect('products');
    }catch(error){
        console.error("Error adding product: ",error);
        return res.status(500).send("Internal server error");
    };

}


const renderCreateForm =  async (req,res) =>{
    try{
        const categories = await db.getAllCategories();
        res.render('create', {categories:categories});
    }catch(e){
        console.error("Failed to render view ",e);
        res.status(500).send("Internal server error");
    }  
};

const renderCategoryForm = async (req,res) =>{
    const type = req.query.form;
    

    try{
        const categories = await db.getAllCategories();

        if(type === 'create'){
            return res.render('categoryForm', {type:type });
        }

        if(type === 'delete'){
            return res.render('categoryForm', {type:type ,categories:categories ,error:""});
        }
    }catch(e){
        console.error("Failed to render view ",e);
        return res.status(500).send("Internal server error");
    }
        
};

const handleCategoryForm = async (req,res) =>{
    const info = req.body;
    console.log("this is info",info);

    try{

        const categories = await db.getAllCategories();
        const categorySize = categories.length + 1;

        if(info.form_type === 'create' && info.category !== ""){
            db.createCategory(categorySize,info.category);
            return res.redirect("/products");
        }

        if(info.form_type === 'delete'){
            const check = await db.getProductByCategory(info.categoryId);
            
            if(check.length === 0){
                await db.deleteCategory(info.categoryId);
                return res.redirect('/products');
            }
        
            return res.render('categoryForm',{ type:'delete', categories:categories ,error :"Cannot delete category with products" });

        }
    }catch(e){
        console.error("Category form failed ",e);
        return res.status(500).send("Internal server error");
    }
};

module.exports ={
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    renderCreateForm,
    renderCategoryForm,
    handleCategoryForm
};