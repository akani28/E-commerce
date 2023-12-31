
async function getProducts(){
try {
    const data = await fetch("https://services-academlo-shopping.onrender.com/");
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
                <h4 class="modal" id="${product.id}">${product.name}<b> | </b><span><b>stock</b>: ${product.quantity}</span></h4>
                <h5>
                $${product.price}
                ${product.quantity ? `<i class='bx bxs-message-square-add' id="${product.id}" ></i>` : `<span class="sold">Sold out</span>`
            }
                    
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
            printTotal(db);
            handlePrintAmountProducts(db);
        }
    })

}
function printProductInCart(db){
    const cartProducts= document.querySelector(".cart_products");
    //console.log(cartProducts);
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
    //console.log(cart_products)
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
                const response = confirm("¿Estas seguro que deseas eliminar este producto?");
                if(!response){
                    return;
                }else{

                    delete db.cart[id];
                }
                
                
        }
        window.localStorage.setItem("cart", JSON.stringify(db.cart));
        printProductInCart(db);
        printTotal(db);
        handlePrintAmountProducts(db);
    });



}
function printTotal(db) {
    const infoTotal = document.querySelector(".info__total");
    const infoAmount = document.querySelector(".info__amount");

    let totalProducts = 0;
    let amountProducts = 0;

    for(const product in db.cart){
        const { amount, price} = db.cart[product];
        totalProducts += price * amount;
        amountProducts += amount;

    }
    infoAmount.textContent = "$" + amountProducts + " units";
    infoTotal.textContent = "$" + totalProducts + ".00";
}
function handleTotal(db){
    const btnBuy=document.querySelector(".btn__buy");
    btnBuy.addEventListener("click", function(){
        if(!Object.values(db.cart).length)
        return alert("Enserio no vas a comprar nada????");
        const response = confirm("Seguro vas a gastar solo eso?");
        if(!response) return;

        const currentProducts = [];
        for(const product of db.products){
            const productCart = db.cart[product.id];
            if(product.id === productCart?.id){
                currentProducts.push({
                    ...product,
                    quantity: product.quantity - productCart.amount,
                });
            }else{
                currentProducts.push(product);
            }

        }
        db.products = currentProducts;
        db.cart = {}
        window.localStorage.setItem("products", JSON.stringify(db.products));
        window.localStorage.setItem("cart", JSON.stringify(db.cart));
        printTotal(db);
        printProductInCart(db);
        printProducts(db);
        handlePrintAmountProducts(db);
    });

}
function handlePrintAmountProducts(db){
    const amountProducts = document.querySelector(".amountProducts");

    let amount= 0;

    for(const product in db.cart){
        amount += db.cart[product].amount;

    }
    amountProducts.textContent = amount;
}
//---------funciones de prueba--------
function printProductInModal(db){
    const modalErrorHTML = document.querySelector(".modalError");
    console.log(modalErrorHTML);
    let html="";
    for(const product in db.products) {
        const{description, quantity, price, name, image, id, amount} = db.products[product];
        html = `
        <div class="modalError">
        <div class="modal_close">
        <i class='bx bxs-x-circle'></i>
        </div>
        <div class="modal_image">
        <img src="${image}" alt="image">
        </div>
        <div class="modal_name"><p>${name}</p></div>
        <div class="modal_info"><p>${description}</p></div>
        <div class="modal_footer">
        <div><p>${price}</p><i class='bx bxs-plus-circle'></i></div>
        <p>${quantity}</p>
        </div>
        </div>
        `
    }
    modalErrorHTML.innerHTML += html;
    
}
function addToModalFromProducts(db){
    const productsHTML = document.querySelector(".products");
    productsHTML.addEventListener("click", function(e) {
        if(e.target.classList.contains("modal")){
            const id= Number(e.target.id);
            const productFound = db.products.find(function(product){
                return product.id === id;
            });
            console.log("id de la",e.target.id);
            console.log(productFound);
            handleToShowModal();
        }
    
        
    });
}
function modal(){
    productsHTML.addEventListener("click", function(e){
        console.log(e.target.getAttribute("src"));
        console.log(e.target.classList.contains(".product"));
        if(e.target.classList.contains("products")){
        contentModalErrorHTML.classList.toggle("contentModalError_show");
            
    }
    });
    iconClose.addEventListener("click", function(){
        contentModalErrorHTML.classList.remove("contentModalError_show");


    });


}
function filter(){
    const buttons = document.querySelectorAll(".buttons .btn");
    buttons.forEach(function(button){
        button.addEventListener("click", function(e){
            const filter = e.target.id;
                console.log(e.target.id);
                if(filter === "all"){
                    printProducts(db);
                    console.log(db.products[0]);
                }else{
                    const newArray =db.products.filter(function(product){
                        for(const key in product){
                            console.log(product[key]);
                        }
                        return product.category === filter;
                    });
                    printProducts(newArray);
                }
        });

    });
    
}
function handleToShowModal() {
    const iconCloseHTML = document.querySelector(".icon_close");
    const cardModal_products = document.querySelector(".cardModal");
    cardModal_products.classList.add("cardModal_show");
    iconCloseHTML.addEventListener("click", function(){
        cardModal_products.classList.remove("cardModal_show");
    })
}
async function main(){
    db={
        products:JSON.parse(window.localStorage.getItem("products"))||(await getProducts()),
        cart:JSON.parse(window.localStorage.getItem("cart"))||{}
    }
    //console.log(db); 
    printProducts(db);
    handleShowCart();
    addToCartFromProducts(db);
    printProductInCart(db);
    handleProductInCart(db);
    printTotal(db);
    handleTotal(db);
    handlePrintAmountProducts(db);
    //printProductInModal(db);
    //addToModalFromProducts(db);


    const productsHTML = document.querySelector(".products");
    const cardModalproductsHTML = document.querySelector(".cardModal_products");
    productsHTML.addEventListener("click", function(e) {
        if(e.target.classList.contains("modal")){
            const id= Number(e.target.id);
            const productFound = db.products.find(function(product){
                return product.id === id;
            });
            console.log(productFound);
            const {name, image} = productFound;
            let html = `
            <div class="cardModal_products">
                <div class="modal_image">
                    <img src="${image}" alt="imagen">
                </div>
            <div class="modal_name">
                <p>${name}</p>
            </div>
        </div>
            `;
            cardModalproductsHTML.innerHTML=html;
            handleToShowModal();
        }
    
        
    });
    
    
}
main();


