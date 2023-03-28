class ProductManager {
    constructor (){
        this.products = []
        this.index = 0
    }

    getProducts = () =>{
        return this.products
    }
    
    getProductByID =(id)=>{
        
    const found = this.products.find(e=> e.id === id)
    found === undefined ? console.log("Not Found") : console.log(found);     
        
    }
    
    addProduct = (title,description,price,thumbnail,code,stock) =>{
        this.index++
        const id = this.index
        
        const event ={ id,title,description,price,thumbnail,code,stock}

        if (this.products.some(i => i.code === code)){
            console.log("Codigo repetido");
        } else if(!description || !title || !price || !thumbnail || !code || !stock ){
            console.log("faltan datos");
        }else{
            this.products.push(event)
        }

        
    }

}

const manager = new ProductManager()
manager.addProduct("PS5", "Consola de videojuegos", 240000, "url", "consol1",5 );
manager.addProduct("XBOX ONE", "Consola de videojuegos", 230000,"url","consol2", 6);
manager.getProducts();
manager.getProductByID(2);
console.log(manager.products);