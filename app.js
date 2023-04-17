const express = require("express");

const app = express();

app.get("/", (req,res)=>{
    const productManager = require("./ProductManager.js")
    const manager = new productManager()

    manager.addProduct("Zapatillas Adidas Stan Smith", "Zapatillas marca adidas, modelo Stan Smith, color verde", 23000, "Sin imagen", "def123",8);
    manager.addProduct("Zapatillas Adidas ADIZERO", "Zapatillas marca adidas, modelo ADIZERO, color negro", 28900, "Sin imagen", "def456",13);
    manager.addProduct("Zapatillas Adidas Superstar", "Zapatillas marca Adidas, modelo Superstar, color blanco", 39600, "Sin imagen", "abc456",6);
    manager.addProduct("Zapatillas Nike Air Max", "Zapatillas marca Nike, modelo Air Max, color azul", 24300, "Sin imagen", "abc123",15);
    manager.addProduct("Zapatillas Nike Vapormax", "Zapatillas marca Nike, modelo Vapormax color negro", 19900, "Sin imagen", "abc789",9);
    manager.addProduct("Zapatillas Nike React infinity", "Zapatillas marca Nike, modelo React infinity, color veige", 25750, "Sin imagen", "ghi123",11);
    manager.addProduct("Zapatillas Nike ZoomX", "Zapatillas marca Nike, modelo ZoomX, color rosa", 88900, "Sin imagen", "ghi456",12);
    manager.addProduct("Zapatillas Puma TRC Blaze", "Zapatillas marca Puma, modelo TRC Blaze, color celeste", 33500, "Sin imagen", "ghi789",10);
    manager.addProduct("Zapatillas Puma Cruise Rider", "Zapatillas marca Puma, modelo Cruise Rider, color rosa", 34500, "Sin imagen", "jkl123",5);
    manager.addProduct("Zapatillas Puma Suede Classic", "Zapatillas marca Puma, modelo Suede classic, color rojo", 20000, "Sin imagen", "def789",25);

    res.send("Productos cargados.")
});

app.get("/products", (req,res) => {
    const query = req.query;
    const productos = require("./productos.json")
    let resultados = productos
    if(query.limit){
        const limit = parseInt(query.limit)
        resultados= resultados.slice(0,limit)
    }
    res.send(resultados)
})

app.get("/products/:id", (req,res) => {
    const id = parseInt(req.params.id)
    if(isNaN(id)){
        res.status(400).send("El id debe ser un numero")
        return
    }
    const productos = require("./productos.json")
    let resultado = productos.filter(producto => producto.id === id)
    if(resultado.length === 0 ){
        res.status(404).send("No se encontro ningun producto con ese ID")
        return
    }
    res.send(resultado)
    
})




app.listen(8080, ()=>{console.log("Server UP!")})