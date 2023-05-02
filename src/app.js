import express from "express";
import  productRouter from "./router/products.router.js";
import cartRouter from "./router/carts.router.js";
import handlebars from "express-handlebars";
import viewsRouter from "./router/views.router.js";
import rtpRouter from "./router/rtp.router.js";
import __dirname from "./util.js";
import {Server} from "socket.io";



const app = express();

app.use(express.static(__dirname +"/public"))

app.engine("handlebars", handlebars.engine())
app.set("views", __dirname+"/views")
app.set("view engine", "handlebars")

app.use(express.json())

app.use("/api/products", productRouter)
app.use("/api/carts", cartRouter)
app.use("/", viewsRouter)
app.use("/realtimeproducts", rtpRouter)


const httpServer = app.listen(8080, ()=>{console.log("Server UP!")})

const socketServer = new Server(httpServer)

socketServer.on("connection", socketClient =>{
    console.log("Nuevo cliente conectado")
    socketClient.on("productList", pList =>{
        socketServer.emit("Productos",pList)
    })
})










