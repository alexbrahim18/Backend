const fs = require("fs");


class ProductManager {
    constructor (){
        this.products = []
        this.index = 0
        this.path = "./productos.json"
        fs.writeFileSync(this.path, JSON.stringify(this.products, null , "\t") )
    }

    getProducts = () =>{
        const productsList =  fs.readFileSync(this.path, "utf-8")
        return(productsList); 
    }
    
    getProductByID =(id)=>{
    
    const lista = JSON.parse(fs.readFileSync(this.path, "utf-8")) ;
    
    const found = lista.find(e=> e.id === id)
    found === undefined ? console.log("Not Found") : console.log(found);     
        
    }
    
    
    
    addProduct = (title,description,price,thumbnail,code,stock) =>{
        this.index++
        const id = this.index
        
        const product ={ id,title,description,price,thumbnail,code,stock}

        if (this.products.some(i => i.code === code)){
            console.log("Codigo repetido");
        } else if(!description || !title || !price || !thumbnail || !code || !stock ){
            console.log("faltan datos");
        }else{
            this.products.push(product)
            fs.writeFileSync(this.path, JSON.stringify(this.products, null , "\t") )
            
        }

        
    }

    updateProduct = (id, campo, cambio)=>{
        const objIndex = this.products.findIndex(obj=>obj.id === id)
         
        if(objIndex !== -1) {
            this.products[objIndex][campo] = cambio
            fs.writeFileSync(this.path, JSON.stringify(this.products, null , "\t")) 
        }else{
            return console.log("Producto no encontrado");
        }
    }

    deleteProduct = (id) =>{
        const borrar = this.products.findIndex(obj=>obj.id === id)

        if(borrar !== -1) {
            this.products.splice(borrar, 1);
            fs.writeFileSync(this.path, JSON.stringify(this.products, null , "\t")) 
        }else{
            return console.log("Producto no encontrado");
        }
    }


}


module.exports= ProductManager;


/* const manager = new ProductManager()
console.log(manager.getProducts()); 
manager.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123",25 );
console.log(manager.getProducts()); 
manager.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123",25 );
manager.getProductByID(1); 
manager.getProductByID(2);
manager.updateProduct(1, "price","150");
manager.getProductByID(1); 
manager.deleteProduct(1);
manager.deleteProduct(2); */