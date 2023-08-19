import express from "express";
import handlebars from "express-handlebars";
import mongoose from "mongoose";
import session from "express-session"
import cookieParser from "cookie-parser"
import passport from "passport";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";

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
import mockingproductsRouter from "./router/mockingproducts.router.js";
import logRouter from "./router/logs.router.js";
import __dirname,{passportAuthenticate} from "./utils.js";
import initializePassport from "./config/passport.config.js"
import { messageModel } from "./models/message.model.js";
import errorHandler from "./controllers/errors/middleware.error.js";
import { createLogger } from "./utils.js";


mongoose.set("strictQuery", false);

const app = express();
const logger = createLogger();

const swaggerOptions = {
  definition: {
      openapi: "3.1.0",
      info: {
          title: "Mister Zapato Ecommerce - Documentation",
          description:
              "API para administrar productos, usuarios y pedidos en una aplicación de ecommerce.",
          version: "1.0.0",
      },
  },
  apis: ['./src/docs/**/*.yaml'],
};
const specs = swaggerJSDoc(swaggerOptions);
app.use("/docs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

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




/* try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.MONGO_DB_NAME
    })
    logger.debug(Date.now() + " / DB conected");
    app.listen(8080, () => console.log('Server Up'))
  } catch (err) {
    logger.error(Date.now() + " / " + error);
  } */

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.MONGO_DB_NAME
    });
    logger.debug(Date.now() + " / DB conected");
    const httpServer = app.listen(8080, () => {
        logger.debug(Date.now() + " / Server UP");
    });

    const socketServer = new Server(httpServer);

    socketServer.on("connection", (socketClient) => {
        //const prod = new ProductManager("./src/data/productos.json");
        logger.info(Date.now() + " / User conected");
        socketClient.on("deleteProd", (prodId) => {
            const result = prod.deleteProduct(prodId);
            if (result.error) {
                socketClient.emit("error", result);
            } else {
                socketServer.emit("products", prod.getProducts());
                socketClient.emit("result", "Producto eliminado");
            }
        });
        socketClient.on("addProd", (product) => {
            const producto = JSON.parse(product);
            const result = prod.addProduct(producto);
            if (result.error) {
                socketClient.emit("error", result);
            } else {
                socketServer.emit("products", prod.getProducts());
                socketClient.emit("result", "Producto agregado");
            }
        });
        socketClient.on("newMessage", async (message) => {
            try {
                logger.info(Date.now() + " / " + message);
                let newMessage = await messageModel.create({
                    user: message.email.value,
                    message: message.message,
                });
                logger.info(Date.now() + " / ", newMessage);
                socketServer.emit("emitMessage", newMessage);
            } catch (error) {
                logger.error(Date.now() + " / " + error);
                socketClient.emit("error", error);
            }
        });
    });
} catch (error) {
    logger.error(Date.now() + " / " + error);
}













