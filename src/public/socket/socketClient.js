import ProductManager from '/src/helpers/ProductManager.js'

const manager = new ProductManager()
const socketClient= io()


let createProd = document.getElementById("createProd")
createProd.addEventListener("onClick", reviewList() )

const printList=(data)=>{
    let divList = document.getElementById("divList")
    const card = ""
    data.foreach(product => {
        card=` <div class="card">
        <h5>${product.title}</h5>
        <img src=${product.thumbnail} class="card-img-top" alt="${product.title}">
        <div>
        <p>${product.description}</p>
        <p>${product.stock}</p>
        <p>${product.category}</p>
        <h5>Precio: $ ${product.price}</h5>
        </div>
      </div>`;
        divList.innerHTML= card;
    });
}
const reviewList=()=>{
    let pList= JSON.parse(manager.getProducts()) 
    socketClient.emit("productList", {pList})
}  
socketClient.on('productList', pList =>{ 
    printList(pList)
    })


const firstData= JSON.parse(manager.getProducts()) 
console.log(firstData);
printList(firstData)
