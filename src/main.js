
async function getProducts(){
try {
    const data = await fetch("https://ecommercebackend.fundamentos-29.repl.co/");
    const res = await data.json();
    return res;
} catch (error) {
    console.log(error);
    
}

}
async function main(){
    const res = await getProducts();
    console.log(res);
}
main();
