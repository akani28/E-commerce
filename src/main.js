
async function getProducts(){
try {
    const data = await fetch("https://ecommercebackend.fundamentos-29.repl.co/");
    const res = await data.json();
    window.localStorage.setItem("products",JSON.stringify(res));
    return res;
} catch (error) {
    console.log(error);
    
}

}
function printProducts(db){
    const productsHTML = document.querySelector(".products");
    let html="";
    for(const product of db.products){
        
        html +=`
        <div class="product">
            <div class="product_img">
                <img src="${product.image}" alt="imagen">
            </div>

            <div class="product_info">
            <h4>${product.name}<b> | </b><span><b>stock</b>: ${product.quantity}</span></h4>
            <h5>
            $${product.price}
            <i class='bx bxs-message-square-add' id="${product.id}" ></i>
            </h5>
        </div>
               
        </div>
        `
        productsHTML.innerHTML= html;
    }
}
async function main(){
    db={
        products:JSON.parse(window.localStorage.getItem("products"))||(await getProducts()),
        cart:{}
    }
    console.log(db); 
    printProducts(db);
    

}
main();
