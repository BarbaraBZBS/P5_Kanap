/**
 * verifying local storage condition
 */
(function checkLocalStorage() {
    if (!localStorage.getItem("cart")) {
      console.log("localStorage VIDE !");
      alert("Votre panier est vide, selectionnez un produit depuis la page d'accueil et ajoutez le à votre panier !");
    }
    else {
      console.log("Storage :", JSON.parse(localStorage.getItem("cart")));
      load();
    }
})()

/**
 * loading each card of cart
 */
async function load () {
    const cartItems = await getCartItems();
    for (let cartItem of cartItems) {
        showCartItem(cartItem)
    }
}

/**
 * getting storage elements
 * @returns {cartItems} LocalStorage Array
 */
function getCartItems() {
    let cartItems = JSON.parse(localStorage.getItem('cart'));
    if (cartItems != null) {
        return cartItems;
    }
    else {
        alert("Votre panier est vide, selectionnez un produit depuis la page d'accueil et ajoutez le à votre panier !")
    }
}

/**
 * computing total price in each card
 * @param {object} cartItem LocaStorage Array element
 * @param {string} price API product price retrieved
 * @returns {number} Computed total of cart item prices
 */
function totalCartItemPrice(cartItem, price) {
    //computing price multiplied by amount converted to integer
    let totalCartItemPrice = parseInt(price) * parseInt(cartItem.amount);
    console.log("item price :", price);
    console.log("item amount :", cartItem.amount);
    return totalCartItemPrice
}

/**
 * computing sum of items in each card
 */
function sumCartItems() {
    // getting item quantity info from DOM elements
    let numberOfItems = document.getElementsByClassName('itemQuantity');
    console.log('products amount :', numberOfItems);
    //looping to make use of info array
    let totalAmount = 0;
    for (let item of numberOfItems) {
        //console.log(item);
        //console.log(item.value);
        //console.log(typeof(item.value));
        //computing sum of amount
        totalAmount += parseInt(item.value);
    }
    console.log('tot :', totalAmount);
    //updating DOM with sum of items
    document.getElementById('totalQuantity').innerText = totalAmount;
}

/**
 * computing sum of items prices
 */
function totalPrice() {
    //getting item price info from DOM elements
    let itemsPrices = document.querySelectorAll('div.cart__item__content__description p:nth-child(3)');
    console.log('found prices :', itemsPrices);
    //looping to make use of info array
    let totalOfPrices = 0;
    for (let itemPrice of itemsPrices) {
      console.log('found price : ', itemPrice);
      //finding required value
      console.log('price value? :', itemPrice.innerText);
      let priceInfo = itemPrice.innerText;
      console.log('still price value? :', priceInfo);
      //extracting number from value
      let replaced = priceInfo.replace(/\D/g, '');
      console.log("replaced number extracted:", replaced)
      //computing sum of prices
      totalOfPrices += parseInt(replaced);
    }
    console.log('total :', totalOfPrices);
    //updating DOM with sum of prices
   document.getElementById('totalPrice').innerText = totalOfPrices;
    };

/**
 * creating new article
 * @param {object} cartItem LocaStorage Array element
 * @returns {showArticle} Article HTML content
 */
function createArticle(cartItem) {
    const showArticle = document.createElement('article');
    showArticle.classList.add('cart__item');
    showArticle.dataset.id = cartItem.productId;
    console.log('data-id :', showArticle.dataset.id);
    showArticle.dataset.color = cartItem.color;
    console.log('data-color :', showArticle.dataset.color);
    return showArticle;
}

/**
 * creating new image section
 * @param {object} cartItem LocaStorage Array element
 * @returns {showImgDiv} Image HTML content
 */
function createImage(cartItem) {
    const showImgDiv = document.createElement('div');
    const showImage = document.createElement('img');
    showImgDiv.classList.add('cart__item__img');
    showImage.src = cartItem.image;
    showImage.alt = cartItem.alt;
    showImgDiv.appendChild(showImage);
    return showImgDiv
}

/**
 * creating new settings section
 * @param {object} cartItem LocaStorage Array element
 * @returns {showSettingsDiv} Settings div HTML content
 */
function createItemSettings(cartItem) {
    const showSettingsDiv = document.createElement('div');
    const showSetQuantityDiv = document.createElement('div');
    const showQuantityParagraph = document.createElement('p');
    const showInput = document.createElement('input');
    showSettingsDiv.classList.add('cart__item__content__settings'); showSetQuantityDiv.classList.add('cart__item__content__settings__quantity');
    showQuantityParagraph.innerText = "Qté: ";
    showInput.setAttribute('type', 'number');
    showInput.classList.add('itemQuantity');
    showInput.setAttribute('name', 'itemQuantity');
    showInput.setAttribute('min', '1');
    showInput.setAttribute('max', '100');
    showInput.setAttribute('value', cartItem.amount);
    showSettingsDiv.appendChild(showSetQuantityDiv);
    showSetQuantityDiv.appendChild(showQuantityParagraph);
    showSetQuantityDiv.appendChild(showInput);
    return showSettingsDiv
}

/**
 * creating new delete settings section
 * @param {object} cartItem 
 * @returns {showSettingsDeleteDiv} Delete settings div HTML content
 */
function createItemSettingsDelete(cartItem) {
    const showSettingsDeleteDiv = document.createElement('div');
    const showSetDeleteParagraph = document.createElement('p'); showSettingsDeleteDiv.classList.add('cart__item__content__settings__delete');
    showSetDeleteParagraph.classList.add('deleteItem');
    showSetDeleteParagraph.innerText = "Supprimer";
    showSettingsDeleteDiv.appendChild(showSetDeleteParagraph);
    return showSettingsDeleteDiv
}

/**
 * displaying html content for cart
 * @param {object} cartItem LocaStorage Array element
 */
 function showCartItem(cartItem) {
    //calling API to display prices
    //get data promise check validity response and catch error
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

                if (id == cartItem.productId) {
                    //calling functions to create elements
                    const showArticle = createArticle(cartItem);
                    const showImgDiv = createImage(cartItem);
                    const showSettingsDiv = createItemSettings(cartItem);
                    const showSettingsDeleteDiv = createItemSettingsDelete(cartItem);
                    //creating description section
                    const cartItemsSection = document.getElementById('cart__items');
                    const showContentDiv = document.createElement('div');
                    const showDescriptionDiv = document.createElement('div');
                    const showHeading = document.createElement('h2');
                    const showColorParagraph = document.createElement('p');
                    const showPriceParagraph = document.createElement('p');
                    showContentDiv.classList.add('cart__item__content'); showDescriptionDiv.classList.add('cart__item__content__description');
                    showHeading.innerText = cartItem.name;
                    showColorParagraph.innerText = cartItem.color;
                    showPriceParagraph.innerText = totalCartItemPrice(cartItem, price) + " €";
                    showContentDiv.appendChild(showDescriptionDiv);
                    showDescriptionDiv.appendChild(showHeading);
                    showDescriptionDiv.appendChild(showColorParagraph);
                    showDescriptionDiv.appendChild(showPriceParagraph);
                    showArticle.appendChild(showImgDiv);
                    showArticle.appendChild(showContentDiv);
                    showContentDiv.appendChild(showSettingsDiv);
                    showContentDiv.appendChild(showSettingsDeleteDiv);
                    cartItemsSection.appendChild(showArticle);
                    //calling functions to display computed infos
                    sumCartItems();
                    totalPrice();
                    //calling functions for clickable buttons
                    removeCartItem();
                    updateItemAmount();
                }
            }
        })
        .catch(function (err) {
            console.log("an error occurred", err);
            //alert("erreur")
        })
};


/**
 * making delete buttons functional
 */
function removeCartItem() {
    // finding delete buttons in DOM
    let deleteButtons = document.getElementsByClassName('deleteItem');
    let itemId;
    let itemColor;
    if (deleteButtons.length > 0) {
        //looping to work with each button
        for (let button of deleteButtons) {
            console.log('delete button :', button);
            //adding event listener to button
            button.addEventListener('click', function (e) {
                itemId = e.target.closest('article').dataset.id;
                itemColor = e.target.closest('article').dataset.color;
                console.log('id of item :', itemId);
                console.log('color of item :', itemColor);
                //removing article from DOM
                e.target.closest('article').remove();
                //removing item from localStorage
                let cartItemsCheck = JSON.parse(localStorage.getItem('cart'));
                let filtered = cartItemsCheck.filter(element => {
                    return element.productId === itemId && element.color != itemColor || element.productId != itemId && element.color != itemColor;
                });
                console.log('filtered :', filtered);
                console.log('cart :', cartItemsCheck);
                localStorage.setItem('cart', JSON.stringify(filtered));
                console.log('new cart :', JSON.parse(localStorage.getItem('cart')));
                //computing price and products amount again
                sumCartItems();
                totalPrice();
            })
        }
    }
    else {

    }
};

/**
 * making item amount input selection functional
 */
function updateItemAmount() {
    let amountButtons = document.getElementsByClassName('itemQuantity');
    let itemId;
    let itemColor;
    let itemValue;
    if (amountButtons.length > 0) {
        for (let button of amountButtons) {
            console.log('amount button :', button);
            button.addEventListener('change', function (e) {
                itemId = e.target.closest('article').dataset.id;
                itemColor = e.target.closest('article').dataset.color;
                itemValue = button.value;
                console.log('id of item :', itemId);
                console.log('color of item :', itemColor);
                console.log('item amount :', itemValue);
                let cartItemsUpdate = JSON.parse(localStorage.getItem('cart'));
                for (let item of cartItemsUpdate) {
                    if (item.productId == itemId && item.color == itemColor) {
                        item.amount = itemValue;
                        console.log('new amount :', item.amount);
                        console.log('cart :', cartItemsUpdate);
                    };
                    localStorage.setItem('cart', JSON.stringify(cartItemsUpdate));
                    console.log('new cart ok?:', JSON.parse(localStorage.getItem('cart')));
                    //computing price and products amount again
                    sumCartItems();
                    totalPrice();
                    location.reload(true);
                }
            })
        }
    }
}



//for form =>
//  document.getElementById('firstNameErrorMsg').innerText = "Veuillez renseigner votre prénom... ";
//  document.getElementById('lastNameErrorMsg').innerText = "Veuillez renseigner votre nom... ";
//  document.getElementById('addressErrorMsg').innerText = "Veuillez renseigner votre adresse... ";
//  document.getElementById('cityErrorMsg').innerText = "Veuillez renseigner votre ville... ";
//  document.getElementById('emailErrorMsg').innerText = "Veuillez renseigner une adresse email valide...";



// //computing total price in each card
// function totalCartItemPrice() {
//     let idk;
//       let itemsPrices = document.querySelectorAll('div.cart__item__content__description p:nth-child(3)');
//     console.log('found prices :', itemsPrices);
//     //looping to make use of info array
//     for (let itemPrice of itemsPrices) {
//       console.log('found price : ', itemPrice);
//       //finding required value
//       //console.log('price value? :', itemPrice.innerText);
//       let priceInfo = itemPrice.innerText;
//       //console.log('still price value? :', priceInfo);
//       //extracting number from value
//       let replaced = priceInfo.replace(/\D/g, '');
//       console.log("replaced number extracted:", replaced)
//       //let priceId = itemPrice.closest('article').dataset.id;
//       console.log('price id :', priceId);
//       let numberOfItems = document.getElementsByClassName('itemQuantity');
//       console.log('num items :', numberOfItems);
//       for (let product of numberOfItems) {
//         idk = product.value
//         console.log('idk :', idk)
//         console.log('compute :', parseInt(idk) * parseInt(replaced) );
//         //itemPrice.innerText = parseInt(idk) * parseInt(replaced);
//       }
//       console.log('idk :', idk);
//       itemPrice.innerText = parseInt(idk) * parseInt(replaced);
//       }
  
//   }