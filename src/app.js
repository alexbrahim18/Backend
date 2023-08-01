import express from "express";
import handlebars from "express-handlebars";
import mongoose from "mongoose";
import session from "express-session"
import cookieParser from "cookie-parser"
import passport from "passport";

import {Server} from "socket.io";

import config from "./config/config.js"
import apiProductsRouter from "./router/apiProduct.mongo.router.js"
import productsRouter from "./router/products.mongo.router.js"
import apiCartsRouter from "./router/apiCart.mongo.router.js"
import cartsRouter from "./router/carts.mongo.router.js"
import realTimeProductsRouter from "./router/rtp.router.js"
import chatRouter from "./router/chat.router.js";
import userRouter from "./router/users.router.js"
import mailerRouter from "./router/mailer.router.js";
import smsRouter from "./router/sms.router.js";
import mockingproductsRouter from "./routes/mockingproducts.router.js";
import logRouter from "./routes/logs.router.js";
import __dirname,{passportAuthenticate} from "./utils.js";
import initializePassport from "./config/passport.config.js"
import { messageModel } from "./models/message.model.js";
import errorHandler from "./controllers/errors/middleware.error.js";
import { createLogger } from "./utils.js";


mongoose.set("strictQuery", false);

const app = express();
const logger = createLogger();

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.engine("handlebars", handlebars.engine())
app.set("views", "./src/views")
app.set("view engine", "handlebars")
app.use(cookieParser());
app.use(
    session({
        secret: config.SESSION_SECRET,
        resave: true,
        saveUninitialized: true,
    })
);

initializePassport()
app.use(passport.initialize())
app.use(passport.session())


app.use("/", userRouter);
app.use("/api/products", passportAuthenticate("jwt"), apiProductsRouter);
app.use("/products", passportAuthenticate("jwt"), productsRouter);
app.use("/api/carts", passportAuthenticate("jwt"), apiCartsRouter);
app.use("/carts", passportAuthenticate("jwt"), cartsRouter);
app.use("/chat", passportAuthenticate("jwt"), chatRouter);
app.use("/mail", passportAuthenticate("jwt"), mailerRouter);
app.use("/sms", passportAuthenticate("jwt"), smsRouter);
app.use("/mockingproducts", passportAuthenticate("jwt"), mockingproductsRouter);
app.use("/loggerTest", passportAuthenticate("jwt"), logRouter);
app.use(
  "/realtimeproducts",
  passportAuthenticate("jwt"),
  realTimeProductsRouter
);
app.use(express.static(__dirname + "/public"));
app.use(errorHandler);




try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.MONGO_DB_NAME
    })
    logger.debug(Date.now() + " / DB conected");
    app.listen(8080, () => console.log('Server Up'))
  } catch (err) {
    logger.error(Date.now() + " / " + error);
  }













