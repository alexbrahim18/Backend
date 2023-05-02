import { Router } from "express";
import ProductManager from "../helpers/ProductManager.js";

const router = Router()
const manager = new ProductManager()

const pList = JSON.parse(manager.getProducts()) 

router.get('/', (req, res)=>{
    res.render('index', {pList})
    
})

export default router