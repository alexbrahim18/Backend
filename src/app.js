import express from "express";
import handlebars from "express-handlebars";
import __dirname from "./util.js";
import mongoose from "mongoose";
import productRouterMongo from "./router/products.mongo.router.js"
import cartRouterMongo from "./router/carts.mongo.router.js"
import cartsRouter from "./router/cart.mongo.router.js";
import productsRouter from "./router/product.mongo.router.js"


const uri = "mongodb+srv://alexbrahim18:156304495sS44@cluster0.acpqu06.mongodb.net/ecommerce"


const app = express();


app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(express.static(__dirname +"/public"))

app.engine("handlebars", handlebars.engine())
app.set("views", "./src/views")
app.set("view engine", "handlebars")

app.use(express.json())


app.use("/api/products", productRouterMongo )
app.use("/api/carts", cartRouterMongo)
app.use("/carts", cartsRouter)
app.use("/products", productsRouter)



try {
    await mongoose.connect(uri,{ dbName: "ecommerce" });
    console.log("DB conected");
    app.listen(8080, () => {console.log("Server UP");});
} catch (error) {
    console.log(error);
}














