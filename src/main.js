
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
                <p>${product.name}</p>
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
