const express = require("express");
const path = require("node:path"); 

const app = express();

app.set("views" , path.join(__dirname, "views"));
app.set( "view engine", "ejs");

const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

app.use(express.urlencoded({ extended: true }));

const { error } = require("node:console");
const PORT = 3000;


const indexRouter = require('./routes/indexRouter');

app.use('/', indexRouter);


app.use((err,req,res,next) =>{
    console.error(err);
    res.static(err.statusCode || 500).send(err.message);
})


app.listen(PORT , (error) =>{
    if(error){
        throw error;
    }

    console.log(`Server running on port ${PORT}`);
});

