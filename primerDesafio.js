class ProductManager {
    constructor (){
        this.products = []
        this.index = 0
    }

    getProducts = () =>{
        console.log(this.products); 
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
manager.getProducts();
manager.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123",25 );
manager.getProducts();
manager.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123",25 );
manager.getProductByID(1);
manager.getProductByID(2);