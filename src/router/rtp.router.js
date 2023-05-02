import { Router } from "express"
import ProductManager from "../helpers/ProductManager.js"

const router= Router()
const manager= new ProductManager()

const pList= manager.getProducts()

router.get('/', (req, res)=>{
    res.render('realTimeProducts', {pList})
    
})

router.post('/',(req, res)=>{
    
    if(!req.body.title || !req.body.description || !req.body.price || !req.body.stock|| !req.body.category){
        res.status(206).send("Faltan datos")
   }else{
        manager.addProduct(req.body)
        res.render('realTimeProducts')
    }
})

export default router