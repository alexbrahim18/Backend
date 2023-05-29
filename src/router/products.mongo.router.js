import { Router } from "express";
import productModel from "../dao/models/product.model.js";
import ProductManager from "../dao/MongoDB/productManager.js";



const router = Router()

const manager = new ProductManager()

/* router.get("/", async (req, res) => {
    
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      //const query = req.query.query || "";
      //const sort = req.query.sort || "";

      
      
      try{
        //const products = await productModel.paginate()
        const products = manager.getProducts(page,limit)
        console.log(products);
        products.prevLink = products.hasPrevPage ? `/api/products?page=${products.prevPage}?limit=${products.limit}?query=${products.query}?sort=${products.sort}` : ''
        products.nextLink = products.hasNextPage ? `/api/products?page=${products.nextPage}?limit=${products.limit}?query=${products.query}?sort=${products.sort}` : '' 


        res.status(201).render("products", products);
      } catch (err) {
        console.error(err);
        res.status(500).json({ err: "Ocurrió un error al obtener los productos" });
      }
    }) */
    
  router.get("/",async (req,res)=>{
    try {
        const productos = await manager.getProducts(req.query.limit, req.query.page,req.query.query , req.query.sort);
        console.log(productos);
        res.status(200).render("products", productos);
    } catch (err) {
        res.status(400).send(err);
    }
  })


router.get("/create", async (req,res)=>{
    res.render("create")
})

router.post("/", async (req, res) => {
  const product = req.body;  
  try {
        const result = await manager.createProduct(product);
    } catch (err) {
        res.status(400).send(err);
    }
    res.redirect("/api/products")
});



router.delete("/delete/:id", async (req,res)=>{
  manager.deleteProduct(req.params.id);
  res.send("Se borro el producto correctamente")
})




export default router