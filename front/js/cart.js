/**
 * verifying local storage condition
 * @returns {boolean} localStorage condition
 */
function checkLocalStorage() {
    console.log('checkLocalStorage');
    if (!localStorage.getItem('cart')) {
        localStorage.clear();
        console.log("localStorage VIDE !");
        alert(
            "Votre panier est vide, vous allez être redirigé vers la page d'accueil. Sélectionnez un produit et ajoutez le à votre panier !"
        );
        location.href = 'index.html';
        return false;
    } else {
        console.log('Storage :', JSON.parse(localStorage.getItem('cart')));
        formFirstName();
        formLastName();
        formAddress();
        formCity();
        formEmail();
        return true;
    }
}

/**
 * cart setter for cart page (picking infos in local storage and API)
 * @param {Array} infosAPI products array from API
 * @returns {myCart} array of set cart infos 
 */
function setCart(infosAPI) {
    //console.log("infosAPI", infosAPI);
    let locStorage = JSON.parse(localStorage.getItem('cart'));
    //console.log('locStorage', locStorage);
    /* loop to retrieve missing price info */
    for (let item of locStorage) {
        //console.log(item)
        let productDetail = infosAPI.find(function (detail) {
            // find needed product
            return detail._id == item.productId;
        });
        //console.log(productDetail.price);
        item.price = productDetail.price;
        myCart.push(item);
    }
    console.log('myCart', myCart);
    return myCart;
}

/**
 * filling DOM/HTML
 */
function setHtmlContentProduct() {
    console.log('setHtmlContentProduct');
    if (myCart.length > 0) {
        let txtHtml = "";
        for (const row of myCart) {
            //console.log(txtHtml);
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
        document.getElementById('cart__items').innerHTML = txtHtml;
    }
}

/**
 * computing setter for price of all products
 */
function setPriceForAllProducts() {
    console.log('setPriceForAllProducts');
    let finalPrice = 0;
    for (const row of myCart) {
        finalPrice += parseInt(row.price) * parseInt(row.amount)
    }
    //console.log('total price :', finalPrice);
    document.getElementById('totalPrice').textContent = finalPrice
}

/**
 * compute setter for total number of products
 */
function setAmountForAllProducts() {
    console.log('setAmountForAllProducts');
    let total = 0;
    for (const row of myCart) {
        total += parseInt(row.amount)
    }
    //console.log('total quantity :', total);
    document.getElementById('totalQuantity').innerText = total
}

/**
 * setter for product amount update
 * @returns {myCart} array of set cart infos
 */
function setQtyForOneProduct() {
    console.log('setQtyClick');
    let amountBtn = document.getElementsByClassName('itemQuantity');
    //console.log(amountBtn);
    let cartProductId;
    let cartProductColor;
    let cartProductAmount;
    if (amountBtn.length > 0) {
        for (const row of amountBtn) {
            //console.log("amount button :", row);
            row.addEventListener('change', function (e) {
                cartProductId = e.target.closest('article').dataset.id;
                cartProductColor = e.target.closest('article').dataset.color;
                cartProductAmount = row.value;
                //console.log(cartProductId);
                //console.log(cartProductColor);
                //console.log(cartProductAmount);
                if (row.value == 0 || row.value < 0 || row.value == "" || row.value > 100) {
                    alert("Choisissez une nouvelle quantité comprise entre 1 et 100 !");
                    setHtmlContentProduct();
                }
                else {
                    /**storage update**/
                    let cartItemsUpdate = JSON.parse(localStorage.getItem('cart'));
                    for (let item of cartItemsUpdate) {
                        if (item.productId == cartProductId && item.color == cartProductColor) {
                            item.amount = cartProductAmount;
                            console.log('new amount :', item.amount);
                            console.log('cart :', cartItemsUpdate);
                        }
                    }
                    localStorage.setItem('cart', JSON.stringify(cartItemsUpdate));
                    /**myCart update**/
                    let itemPrices = document.querySelectorAll('div.cart__item__content__description p:nth-child(3)');
                    let idx = 0;
                    for (const row of myCart) {
                        if (row.productId == cartProductId && row.color == cartProductColor) {
                            //console.log(row.productId);
                            //console.log(row.color);
                            console.log("MODIFICATION de la quantité pour : " + row.name + " " + row.color);
                            //alert("MODIFICATION de la quantité pour : " + row.name + " " + row.color);
                            row.amount = cartProductAmount;
                            //console.log('find prices', itemPrices);
                            //console.log('found index', idx);
                            //console.log('price to update', itemPrices[idx]);
                            itemPrices[idx].textContent = parseInt(row.amount) * parseInt(row.price) + " €";
                        }
                        idx++;
                    }
                    /** updating DOM **/
                    setAmountForAllProducts();
                    setPriceForAllProducts();
                }
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
    console.log('removeOneProduct');
    let deleteBtn = document.getElementsByClassName('deleteItem');
    //console.log(deleteBtn);
    let cartProductId;
    let cartProductColor;
    if (deleteBtn.length > 0) {
        for (const row of deleteBtn) {
            row.addEventListener('click', function (e) {
                cartProductId = e.target.closest('article').dataset.id;
                cartProductColor = e.target.closest('article').dataset.color;
                //console.log(cartProductId);
                //console.log(cartProductColor);
                let cartItemsCheck = JSON.parse(localStorage.getItem('cart'));
                let filtered = cartItemsCheck.filter(element => {
                    return element.productId === cartProductId && element.color != cartProductColor
                        || element.productId != cartProductId && element.color != cartProductColor;
                });
                localStorage.setItem('cart', JSON.stringify(filtered));
                //console.log('new cart :', JSON.parse(localStorage.getItem('cart')));
                /** loop for cart product removal **/
                let idx = 0;
                for (const row of myCart) {
                    if (row.productId == cartProductId && row.color == cartProductColor) {
                        console.log("SUPPRESSION du panier : " + row.name + " " + row.color);
                        alert("SUPPRESSION du panier : " + row.name + " " + row.color);
                        myCart.splice(idx, 1);
                        //console.log('index', idx);
                    }
                    idx++;
                }
                /** updating DOM **/
                e.target.closest('article').remove();
                setAmountForAllProducts();
                setPriceForAllProducts();
                if (deleteBtn.length == 0) {
                    localStorage.clear();
                    alert("Vous avez supprimé le dernier article du panier, vous allez être redirigé vers la page d'accueil !");
                    location.href= 'index.html'
                }                      
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
            //console.log(response);
            return response.json();
        })
        .then((data) => {
            //console.log(data)
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
            //alert("Erreur !");
        });
}


////-------------------------------------FORM------------------------------------------------////

/**
 * firstName field validation
 */
function formFirstName() {
    const firstName = document.getElementById('firstName');
    firstName.addEventListener('change', function (e) {
        if (/^[A-Z][A-Za-z -ïîëéèùûêâôöçäü]{1,45}$/.test(e.target.value)) {
            document.getElementById('firstNameErrorMsg').textContent = "";
            firstName.style.border = 'solid medium green';
            document.getElementById('order').removeAttribute('disabled');
        }
        else if (e.target.value == '') {
            document.getElementById('order').setAttribute('disabled', 'true');
        }
        else {
            document.getElementById('firstNameErrorMsg').textContent = "Veuillez renseigner votre prénom... (p. ex. Gregory)";
            firstName.style.border = 'solid thin red';
            document.getElementById('order').setAttribute('disabled', 'true');
        }
    })
}

/**
 * lastName field validation
 */
function formLastName() {
    const lastName = document.getElementById('lastName');
    lastName.addEventListener('change', function (e) {
        if (/^[A-Z][A-Za-z -ïîëéèùûêâôöçäü]{1,45}$/.test(e.target.value)) {
            document.getElementById('lastNameErrorMsg').textContent = "";
            lastName.style.border = 'solid medium green';
            document.getElementById('order').removeAttribute('disabled');
        }
        else if (e.target.value == '') {
            document.getElementById('order').setAttribute('disabled', 'true');
        }
        else {
            document.getElementById('lastNameErrorMsg').textContent = "Veuillez renseigner votre nom... (p. ex. Lambert)";
            lastName.style.border = 'solid thin red';
            document.getElementById('order').setAttribute('disabled', 'true');
        }
    })
}

/**
 * address field validation
 */
function formAddress() {
    let address = document.getElementById('address');
    address.addEventListener('change', function (e) {
        if (/^[a-zA-Z0-9\s,'-.ç _àçïîëéêèûâùôöäü]*$/.test(e.target.value)) {
            document.getElementById('addressErrorMsg').textContent = "";
            address.style.border = 'solid medium green';
            document.getElementById('order').removeAttribute('disabled');
        }
        else if (e.target.value == '') {
            document.getElementById('order').setAttribute('disabled', 'true');
        }
        else {
            document.getElementById('addressErrorMsg').textContent = "Veuillez renseigner votre adresse... (p. ex. 10 rue du pommier)";
            address.style.border = 'solid thin red';
            document.getElementById('order').setAttribute('disabled', 'true');
        }
    })
}

/**
 * city field validation
 */
function formCity() {
    let city = document.getElementById('city');
    city.addEventListener('change', function (e) {
        if (/^[A-Z][A-Za-z\s'-. _àçïîëéêèûâùôöçäü]*$/.test(e.target.value)) {
            document.getElementById('cityErrorMsg').textContent = "";
            city.style.border = 'solid medium green';
            document.getElementById('order').removeAttribute('disabled');
        }
        else if (e.target.value == '') {
            document.getElementById('order').setAttribute('disabled', 'true');
        }
        else {
            document.getElementById('cityErrorMsg').textContent = "Veuillez renseigner votre ville... (p. ex. Grenoble)";
            city.style.border = 'solid thin red';
            document.getElementById('order').setAttribute('disabled', 'true');

        }
    })
}

/**
 * email field validation
 */
function formEmail() {
    let email = document.getElementById('email');
    email.addEventListener('change', function (e) {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(e.target.value)) {
            document.getElementById('emailErrorMsg').textContent = "";
            email.style.border = 'solid medium green';
            document.getElementById('order').removeAttribute('disabled');
        }
        else if (e.target.value == '') {
            document.getElementById('order').setAttribute('disabled', 'true');
        }
        else {
            document.getElementById('emailErrorMsg').textContent = "Veuillez renseigner une adresse email valide... (p. ex. j.vincent@google.org)";
            email.style.border = 'solid thin red';
            document.getElementById('order').setAttribute('disabled', 'true');
        }
    })
}

/**
 * sending form
 * @param {object} e event for even listener
 */
function sendForm(e) {
    let form = document.querySelector('.cart__order__form');
    e.preventDefault();
    //console.log('form :', form);
    let valid = form.checkValidity();
    //console.log('validity', valid);
    if (valid == true) {
        //console.log('validity', valid);
        const formOrder = requestForm();
        //console.log('order', formOrder);
        fetch("http://localhost:3000/api/products/order/",
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formOrder)
            })
            .then(function (res) {
                if (res.ok) {
                    //console.log('res', res)
                    return res.json();
                }
            })
            .then(function (formOrder) {
                alert("Merci pour votre commande !");
                console.log('success :', formOrder);
                location.href = 'confirmation.html?id=' + formOrder.orderId;
                //console.log('storage', JSON.parse(localStorage.getItem("cart"));
            })
            .catch(function (err) {
                console.log("an error occurred", err);
                //alert("erreur")
            })
    }
}

/**
 * building post request element
 * @returns {object} formOrder built post request
 */
function requestForm() {
    const formOrder = {
        contact: {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            email: document.getElementById('email').value
        },
        products: requestIds(),
    }
    return formOrder
}

/**
 * retrieving item ids needed while building post element
 * @returns {array} getIds found ids
 */
function requestIds() {
    const getIds = [];
    for (let row of myCart) {
        const ids = row.productId;
        let onlyIds = ids.split();
        //console.log('ids split', onlyIds);
        getIds.push(onlyIds)
    }
    return getIds
}

/**
 * form event listener
 */
document.querySelector('.cart__order__form').addEventListener('submit', sendForm);
