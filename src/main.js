
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
function handleShowCart() {
    const iconCartHTML = document.querySelector(".bxs-cart");
    const cartHTML = document.querySelector(".cart");
    
    iconCartHTML.addEventListener("click", function(){
        cartHTML.classList.toggle("cart_show");
    });
}
function addToCartFromProducts(db){
    const productsHTML = document.querySelector(".products");
    productsHTML.addEventListener("click", function(e){
        if(e.target.classList.contains("bxs-message-square-add")){
            const id = Number(e.target.id);
            const productFind = db.products.find((product) => product.id===id);
            if(db.cart[productFind.id]){
                if(productFind.quantity===db.cart[productFind.id].amount)return alert("No tenemos mas en Bodega");
                db.cart[productFind.id].amount++;
            }else{
                db.cart[productFind.id]={...productFind,amount:1};

            }
            window.localStorage.setItem("cart",JSON.stringify(db.cart));
            printProductInCart(db);
        }
    })

}
function printProductInCart(db){
    const cartProducts= document.querySelector(".cart_products");
    console.log(cartProducts);
    let html="";
    for(const product in db.cart){
        const {quantity, price, name, image, id, amount} = db.cart[product];

        //console.log(db.cart[product]);
        html += `
        <div class="cart_product">
            <div class="cart_product--img">
                <img src="${image}" alt="imagen">
            </div>
            <div class="cart_products--body">
                <h4>${name} | ${price}</h4>
                <p>Stock: ${quantity}</p>
                <div class="cart_product--body-op" id=${id}>
                        <i class='bx bx-minus'></i>
                        <span>${amount} unit</span>
                        <i class='bx bx-plus'></i>
                        <i class='bx bx-trash'></i>
                </div>
            </div>
        </div>
        `

    }
    cartProducts.innerHTML=html;

} 
function handleProductInCart(db){
    const cart_products=document.querySelector(".cart_products");
    console.log(cart_products)
    cart_products.addEventListener("click", function(e){
        if(e.target.classList.contains("bx-plus")){
                const id = Number(e.target.parentElement.id);
                const productFind = db.products.find((product) => product.id===id);
                if(productFind.quantity===db.cart[productFind.id].amount)return alert("No tenemos mas en Bodega");
                db.cart[id].amount++;
            }
        if(e.target.classList.contains("bx-minus")){ 
                const id = Number(e.target.parentElement.id);
                const productFind = db.products.find((product) => product.id===id);
                if(db.cart[id].amount===1){
                    const response = confirm("¿Estas seguro que deseas eliminar este producto?")
                    if(!response){return;}
                    delete db.cart[id];
                    }else{
                        db.cart[id].amount--;
                    }
                
                
        }
        if(e.target.classList.contains("bx-trash")){
                const id = Number(e.target.parentElement.id);
                if(db.cart[id].amount===1){
                    const response = confirm("¿Estas seguro que deseas eliminar este producto?")
                    if(!response){return;}
                    delete db.cart[id];
                    }else{
                        db.cart[id].amount--;
                    }
                
        }
        window.localStorage.setItem("cart", JSON.stringify(db.cart));
        printProductInCart(db);
    });



}
async function main(){
    db={
        products:JSON.parse(window.localStorage.getItem("products"))||(await getProducts()),
        cart:JSON.parse(window.localStorage.getItem("cart"))||{}
    }
    console.log(db); 
    printProducts(db);
    handleShowCart();
    addToCartFromProducts(db);
    printProductInCart(db);
    handleProductInCart(db)
 
    
    
}
main();
