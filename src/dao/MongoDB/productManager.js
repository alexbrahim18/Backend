import mongoose from "mongoose"
import productModel from "../models/product.model.js";

const uri = "mongodb+srv://alexbrahim18:156304495sS44@cluster0.acpqu06.mongodb.net/ecommerce"

try {
  await mongoose.connect(uri,{ dbName: "ecommerce" });
  console.log("DB conected");
} catch (err) {
  console.log(err);
}

class productManager {
 
 createProduct= async(productData) =>{
    const {
      title,
      description,
      price,
      status,
      code,
      stock,
      category,
      thumbnail,
    } = productData;

    const lastProduct = await productModel.findOne(
      {},
      {},
      { sort: { id: -1 } }
    );

    const id = lastProduct ? lastProduct.id + 1 : 1;

    const codeExists = await productModel.exists({ code });

    if (codeExists) {
      throw new Error("El codigo del producto ya existe");
    }

    const product = new productModel({
      id,
      title,
      description,
      price,
      status,
      code,
      stock,
      category,
      thumbnail,
    });

    await product.save();
    return product;
  };


  
  getProducts = async (limit = 10, page = 1, query, sort) => {
    
    const vquery = query === "Hombre" || query === "mujer"||query==="niño"  ? { category: query } : {};
    const vsort = sort === "asc" || sort === "desc" ? { price: sort } : {};
    try {
        const productos = await productModel.paginate(vquery, {
            page,
            limit,
            lean: true,
            sort: vsort,
        });
        const queryLink = query === "{}"|| undefined ? "" : "query=" + query + "&";
        const limitLink = limit === 10 ? "" : "limit=" + limit + "&";
        const sortLink = sort === undefined ? "" : "sort=" + sort + "&";
        const result = {
            status: "success",
            payload: productos.docs,
            totalPages: productos.totalPages,
            prevPage: productos.prevPage,
            nextPage: productos.nextPage,
            page: productos.page,
            hasPrevPage: productos.hasPrevPage,
            hasNextPage: productos.hasNextPage,
            prevLink: productos.hasPrevPage
                ? "products?" +
                  queryLink +
                  limitLink +
                  sortLink +
                  "&page=" +
                  productos.prevPage
                : null,
            nextLink: productos.hasNextPage
                ? "products?" +
                  queryLink +
                  limitLink +
                  sortLink +
                  "page=" +
                  productos.nextPage
                : null,
        };
        console.log(productos);
        return result;
    } catch (error) {
        return { error: 3, servererror: error };
    }}
  
  async getProductById (id) {
    try {
        const foundprod = productModel.findOne({ _id: id }).lean().exec();
        return foundprod;
    } catch (error) {
        return { error: 3, servererror: error };
    }
  };

  async updateProduct(productId, newData) {
    const product = await productModel.findByIdAndUpdate(productId, newData, {
      new: true,
    });
    return product;
  };

  async deleteProduct(productId) {
    const product = await productModel.findByIdAndDelete(productId);
    return product;
  };
};


export default productManager;