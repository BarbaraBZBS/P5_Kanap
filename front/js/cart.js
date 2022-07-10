/**
 * verifying local storage condition
 * @returns {boolean} localStorage condition
 */
function checkLocalStorage() {
    console.log("checkLocalStorage");
    if (!localStorage.getItem("cart")) {
        console.log("localStorage VIDE !");
        alert(
            "Votre panier est vide, selectionnez un produit depuis la page d'accueil et ajoutez le à votre panier !"
        );
        return false;
    } else {
        console.log("Storage :", JSON.parse(localStorage.getItem("cart")));
        return true;
    }
}

/**
 * cart setter for cart page (picking infos in local storage and API)
 * @param {Array} infosAPI products array from API
 * @returns {myCart} array of set cart infos 
 */
function setCart(infosAPI) {
    console.log("infosAPI", infosAPI);
    let locStorage = JSON.parse(localStorage.getItem("cart"));
    //console.log('locStorage', locStorage);
    /* loop to retrieve missing price info */
    for (let item of locStorage) {
        //console.log(item)
        let productDetail = infosAPI.find(function (detail) {
            // find needed product
            return detail._id == item.productId;
        });
        console.log(productDetail.price);
        item.price = productDetail.price;
        myCart.push(item);
    }
    console.log("myCart", myCart);
    return myCart;
}

/**
 * filling DOM/HTML
 */
function setHtmlContentProduct() {
    console.log("setHtmlContentProduct");
    if (myCart.length > 0) {
        let txtHtml = "";
        for (const row of myCart) {
            //console.log(row.id);
            txtHtml += `<article class="cart__item" data-id="${row.productId}" data-color="${row.color}">
    <div class="cart__item__img">
        <img src="${row.image}" alt="${row.alt}">
    </div >
    <div class="cart__item__content">
        <div class="cart__item__content__description">
            <h2>${row.name}</h2>
            <p>${row.color}</p>
            <p>${row.price * row.amount} €</p>
        </div>
        <div class="cart__item__content__settings">
            <div class="cart__item__content__settings__quantity">
                <p>Qté : </p>
                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${row.amount}">
            </div>
            <div class="cart__item__content__settings__delete">
                <p class="deleteItem">Supprimer</p>
            </div>
        </div >
    </div >
</article >`;
        }
        document.getElementById("cart__items").innerHTML = txtHtml;
    }
}

/**
 * compute setter for price of all products
 */
function setPriceForAllProducts() {
    console.log("setPriceForAllProducts");
    let finalPrice = 0;
    for (const row of myCart) {
        finalPrice += parseInt(row.price) * parseInt(row.amount)
    }
    document.getElementById("totalPrice").textContent = finalPrice
}

/**
 * compute setter for total number of products
 */
function setAmountForAllProducts() {
    console.log("setAmountForAllProducts");
    let total = 0;
    for (const row of myCart) {
        total += parseInt(row.amount)
    }
    document.getElementById("totalQuantity").innerText = total
}

/**
 * setter for product amount update
 * @returns {myCart} array of set cart infos
 */
function setQtyForOneProduct() {
    console.log("setQtyClick");
    let amountBtn = document.getElementsByClassName("itemQuantity");
    console.log(amountBtn);
    let cartProductId;
    let cartProductColor;
    let cartProductAmount;
    if (amountBtn.length > 0) {
        for (const row of amountBtn) {
            console.log("amount button :", row);
            row.addEventListener("change", function (e) {
                cartProductId = e.target.closest("article").dataset.id;
                cartProductColor = e.target.closest("article").dataset.color;
                cartProductAmount = row.value;
                console.log(cartProductId);
                console.log(cartProductAmount);
                let itemPrices = document.querySelectorAll('div.cart__item__content__description p:nth-child(3)');
                let idx = 0;
                for (const row of myCart) {
                    if (row.productId == cartProductId && row.color == cartProductColor) {
                        console.log(row.productId);
                        console.log(row.color);
                        console.log("MODIFICATION de la quantité pour : " + row.name + " " + row.color);
                        alert("MODIFICATION de la quantité pour : " + row.name + " " + row.color);
                        row.amount = cartProductAmount;
                        console.log('find prices', itemPrices);
                        console.log('found index', idx);
                        console.log('price to update', itemPrices[idx]);
                        itemPrices[idx].textContent = parseInt(row.amount) * parseInt(row.price) + " €";
                    }
                    idx++;
                }
                /** updating DOM **/
                setAmountForAllProducts();
                setPriceForAllProducts();
            })
        }
        return myCart;
    }
}

/**
 * chosen product removal 
 * @returns {myCart} array of set cart infos
 */
function removeOneProduct() {
    console.log("removeOneProduct");
    let deleteBtn = document.getElementsByClassName("deleteItem");
    //console.log(deleteBtn);
    let cartProductId;
    if (deleteBtn.length > 0) {
        for (const row of deleteBtn) {
            row.addEventListener("click", function (evt) {
                cartProductId = evt.target.closest("article").dataset.id;
                console.log(cartProductId);
                /** loop for cart product removal **/
                let idx = 0;
                for (const row of myCart) {
                    if (row.productId == cartProductId) {
                        console.log("SUPPRESSION du panier : " + row.name + " " + row.color);
                        alert("SUPPRESSION du panier : " + row.name + " " + row.color);
                        myCart.splice(idx, 1);
                        console.log('index', idx);
                    }
                    idx++;
                }
                /** updating DOM **/
                evt.target.closest("article").remove();
                setAmountForAllProducts();
                setPriceForAllProducts();
            });
        }
        return myCart;
    }
}

/***** page loading *****/
let myCart = [];
if (checkLocalStorage()) {
    fetch("http://localhost:3000/api/products")
        .then((response) => {
            console.log(response);
            return response.json();
        })
        .then((data) => {
            //console.log(response)
            myCart = setCart(data);
            setHtmlContentProduct();
            setAmountForAllProducts();
            setPriceForAllProducts();
            /**** EVENTS ****/
            myCart = removeOneProduct();
            myCart = setQtyForOneProduct();
        })
        .catch((error) => {
            console.log("Erreur : requête API", error);
            alert("Erreur !");
        });
}



