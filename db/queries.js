const pool = require("./pool");

async function getAllProducts(){
    const products = await pool.query('SELECT * FROM products');
    return products.rows;
};

async function getAllCategories(){
    const categories = await pool.query('SELECT * FROM categories');
    return categories.rows;
};

async function getProduct(id){
    const product = await pool.query('SELECT * FROM products WHERE products.product_id = $1',[id]);
    return product.rows;
};

async function createNewProduct(id,name,description,price,stock,category_id){
    await pool.query('INSERT INTO products VALUES ($1, $2, $3, $4, $5, $6)',[id,name,description,price,stock,category_id]);
};

async function getProductTableSize(){
    const id =  await pool.query("SELECT COUNT (*) FROM products");
    return id.rows;
};

async function deleteProduct(id){
    await pool.query('DELETE FROM products WHERE product_id = $1',[id]);
};

async function updateProduct(id,name,description,price,stock) {
    await pool.query('UPDATE products SET product_name = $2 , description = $3 , price = $4 , stock = $5 WHERE product_id = $1',[id,name,description,price,stock]);
};

async function getProductByCategory(category_id){
    const products = await pool.query('SELECT * FROM categories JOIN products ON products.category_id = categories.category_id WHERE categories.category_id = $1',[category_id]);
    return products.rows;
};

async function createCategory(id,name){
    await pool.query("INSERT INTO categories VALUES ($1 ,$2)",[id,name]);
}

async function deleteCategory(id){
    await pool.query("DELETE FROM categories WHERE category_id = $1",[id]);
}

// async function sortPrice(type){
//     if(type ==='DESC'){
//         const products = await pool.query('SELECT * FROM products ORDER BY price DESC');
//         return products.rows;
//     }else{
//         const products = await pool.query('SELECT * FROM products ORDER BY price');
//         return products.rows;
//     }

//     //SELECT * FROM categories JOIN products ON products.category_id = categories.category_id WHERE categories.category_id = 3 ORDER BY price;

// };



module.exports = {
    getAllProducts,
    getAllCategories,
    getProduct,
    createNewProduct,
    deleteProduct,
    updateProduct,
    getProductByCategory,
    getProductTableSize,
    createCategory,
    deleteCategory
};