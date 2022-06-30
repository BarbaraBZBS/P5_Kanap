
checkLocalStorage()

//verifying local storage state
function checkLocalStorage() {
    if (!localStorage.getItem("cart")) {
      console.log("localStorage VIDE !");
      alert("Votre panier est vide, selectionnez un produit depuis la page d'accueil et ajoutez le à votre panier !");
    }
    else {
      console.log("Storage :", JSON.parse(localStorage.getItem("cart")));
      load();
    }
};

//loading each card of cart
function load () {
    const cartItems = getCartItems();
    for (let cartItem of cartItems) {
        showCartItem(cartItem)
    }
}

//getting storage elements
function getCartItems() {
    let cartItems = JSON.parse(localStorage.getItem('cart'));
    if (cartItems != null) {
        return cartItems;
    }
    else {
        alert("Votre panier est vide, selectionnez un produit depuis la page d'accueil et ajoutez le à votre panier !")
    }
}

//displaying html content for cart
function showCartItem(cartItem) {
    //calling API to display prices 
    fetch("http://localhost:3000/api/products")
        .then(function (res) {
            if (res.ok) {
                return res.json();
            }
        })
        .then(function (products) {
            for (let product of products) {
                let id = product._id;
                let price = product.price;
                let totalCartItemPrice = parseInt(price) * parseInt(cartItem.amount);

                if (id == cartItem.productId) {
                    //creating elements
                    const cartItemsSection = document.getElementById('cart__items');
                    const showArticle = document.createElement('article');
                    const showImgDiv = document.createElement('div');
                    const showImage = document.createElement('img');
                    const showContentDiv = document.createElement('div');
                    const showDescriptionDiv = document.createElement('div');
                    const showHeading = document.createElement('h2');
                    const showColorParagraph = document.createElement('p');
                    const showPriceParagraph = document.createElement('p');
                    const showSettingsDiv = document.createElement('div');
                    const showSetQuantityDiv = document.createElement('div');
                    const showQuantityParagraph = document.createElement('p');
                    const showInput = document.createElement('input');
                    const showSettingsDeleteDiv = document.createElement('div');
                    const showSetDeleteParagraph = document.createElement('p');
                    //adding text, class and attributes to elements
                    showArticle.setAttribute('data-id', cartItem.productId);
                    showArticle.setAttribute('data-color', cartItem.color);
                    showArticle.classList.add('cart__item');
                    showImgDiv.classList.add('cart__item__img');
                    showImage.src = cartItem.image;
                    showImage.alt = cartItem.alt;
                    showContentDiv.classList.add('cart__item__content');
                    showDescriptionDiv.classList.add('cart__item__content__description');
                    showHeading.innerText = cartItem.name;
                    showColorParagraph.innerText = cartItem.color;
                    showPriceParagraph.innerText = totalCartItemPrice + " €";
                    showSettingsDiv.classList.add('cart__item__content__settings');
                    showSetQuantityDiv.classList.add('cart__item__content__settings__quantity');
                    showQuantityParagraph.innerText = "Qté: ";
                    showInput.setAttribute('type', 'number');
                    showInput.classList.add('itemQuantity');
                    showInput.setAttribute('name', 'itemQuantity');
                    showInput.setAttribute('min', '1');
                    showInput.setAttribute('max', '100');
                    showInput.setAttribute('value', cartItem.amount);
                    showSettingsDeleteDiv.classList.add('cart__item__content__settings__delete');
                    showSetDeleteParagraph.classList.add('deleteItem');
                    showSetDeleteParagraph.innerText = "Supprimer";
                    document.getElementById('totalQuantity').innerText = sumCartItems(cartItem);
                    document.getElementById('totalPrice').innerText = totalPrice(totalCartItemPrice);
                    //adding elements to html page
                    showArticle.appendChild(showImgDiv);
                    showImgDiv.appendChild(showImage);
                    showArticle.appendChild(showContentDiv);
                    showContentDiv.appendChild(showDescriptionDiv);
                    showDescriptionDiv.appendChild(showHeading);
                    showDescriptionDiv.appendChild(showColorParagraph);
                    showDescriptionDiv.appendChild(showPriceParagraph);
                    showArticle.appendChild(showSettingsDiv);
                    showSettingsDiv.appendChild(showSetQuantityDiv);
                    showSetQuantityDiv.appendChild(showQuantityParagraph);
                    showSetQuantityDiv.appendChild(showInput);
                    showArticle.appendChild(showSettingsDeleteDiv);
                    showSettingsDeleteDiv.appendChild(showSetDeleteParagraph);
                    cartItemsSection.appendChild(showArticle);
                }
            }
        })
        .catch(function (err) {
            console.log("an error occurred", err);
            //alert("erreur")
        })
};

let sumItem = 0;
let sumPrice = 0;
//computing total prices in cards
function sumCartItems(cartItem) {
    sumItem += parseInt(cartItem.amount);
    return sumItem;
};

//computing total price of cart items
function totalPrice(totalCartItemPrice) {
    sumPrice += totalCartItemPrice;
    return sumPrice;
};