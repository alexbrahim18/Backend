import express from "express";
import handlebars from "express-handlebars";
import __dirname from "./util.js";
import mongoose from "mongoose";
import productRouterMongo from "./router/products.mongo.router.js"
import cartRouterMongo from "./router/carts.mongo.router.js"
import cartsRouter from "./router/cart.mongo.router.js";
import productsRouter from "./router/product.mongo.router.js"
import userRouter from "./router/users.router.js"
import session from "express-session"
import MongoStore from "connect-mongo";
import passport from "passport";
import initializePassport from "./config/passport.config.js"
import dotenv from "dotenv"
dotenv.config()




mongoose.set("strictQuery", false);

const app = express();


app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(express.static(__dirname +"/public"))

app.engine("handlebars", handlebars.engine())
app.set("views", "./src/views")
app.set("view engine", "handlebars")

app.use(
  session({
      store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        dbName: process.env.MONGO_DB_NAME,
          mongoOptions: {
              useNewUrlParser: true,
              useUnifiedTopology: true,
          },
          ttl: 120,
      }),
      secret: "R0n4ld1nh0",
      resave: true,
      saveUninitialized: true,
  }),
);

initializePassport()
app.use(passport.initialize())
app.use(passport.session())

app.use("/", userRouter);
app.use("/api/products", productRouterMongo )
app.use("/api/carts", cartRouterMongo)
app.use("/carts", cartsRouter)
app.use("/products", productsRouter)
//app.use("/api/session", userRouter)






try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.MONGO_DB_NAME
    })
    console.log("DB connected!");
    app.listen(8080, () => console.log('Server Up'))
  } catch (err) {
    console.log('Exploto todo');
  }













