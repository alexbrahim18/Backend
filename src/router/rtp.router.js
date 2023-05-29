import { Router } from "express"
import ProductManager from "../dao/fileSystem/ProductManager.js"

const router= Router()
const manager= new ProductManager()

const pList= JSON.parse(manager.getProducts()) 


router.get('/', (req, res)=>{
    res.render('realTimeProducts', {pList})
    
})

router.post('/',(req, res)=>{
    
    if (pList.some(i => i.code === req.body.code)){
        res.status(206).send("Codigo repetido")
    } else if(!req.body.description || !req.body.title || !req.body.price || !req.body.thumbnail || !req.body.code || !req.body.stock || !req.body.category ){
        res.status(206).send("Faltan datos")
    }else{
        manager.addProduct(req.body)
        res.render('realTimeProducts')
    }
})

export default router