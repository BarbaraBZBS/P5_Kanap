/**
 * finding which id/product is to be displayed
 * @returns {idInUrl} Retrieved id in url
 */
function findIdInPage() {
    const paramsString = window.location.href;
    const url = new URL(paramsString);
    const searchParams = new URLSearchParams(url.search);
    const idInUrl = searchParams.get('id');
    return idInUrl;
};
console.log('id in Url :', findIdInPage());

document.addEventListener('DOMContentLoaded', function () {
    load();
});

/**
 * Loading product to display 
 */
async function load() {
    const product = await getProduct();
    console.log('product', product)
    showProduct(product);
}

/**
 * calling API to get product info
 * @returns {product} API product by id
 */
function getProduct() {
    return fetch("http://localhost:3000/api/products/" + findIdInPage())
        .then(function (res) {
            if (res.ok) {
                return res.json();
            }
        })
        .then(function (product) {
            console.log('product :', product);
            return product;
        })
        .catch(function (err) {
            console.log('error :', err);
            alert("Erreur");
        })
}

/**
 * integrating page html content
 * @param {object} product API retrieved array element
 */
function showProduct(product) {
    const itemImageSection = document.querySelector('div.item__img');
    const showProductImage = document.createElement('img');
    showProductImage.src = product.imageUrl;
    showProductImage.alt = product.altTxt;
    const itemTitleSection = document.getElementById('title');
    itemTitleSection.innerText = product.name;
    const itemPriceSection = document.getElementById('price');
    itemPriceSection.innerText = product.price;
    const itemDescriptionSection = document.getElementById('description');
    itemDescriptionSection.innerText = product.description;
    const itemColorsSection = document.getElementById('colors');
    const colors = Object.values(product.colors);
    console.log(colors);
    for (let color of colors) {
        console.log(color);
        const selectOptions = document.createElement('option');
        selectOptions.value = color;
        selectOptions.text = color;
        itemColorsSection.add(selectOptions);
    }
    itemImageSection.appendChild(showProductImage);
};


/**
 * filling localstorage for the first time with product details
 */
function populateCart() {
    let selectedProductQuantity = document.getElementById('quantity').value;
    let selectedColor = document.getElementById('colors').value;

    const cart = [{
        productId: findIdInPage(),
        amount: selectedProductQuantity,
        color: selectedColor,
        name: document.getElementById('title').innerText,
        image: document.querySelector('.item__img img').src,
        description: document.getElementById('description').innerText,
        alt: document.querySelector('.item__img img').alt
    }];

    if (!localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify(cart));
        alert("Article ajouté au panier !");
        console.log('empty cart added new item');
    }

    else {
        if (checkSameCartItem() == false) {
            console.log('not same cart item');
            addItemToCart();
            alert("Article ajouté au panier !");
        }
        else {
            console.log('same cart item')
            updateAmount();
            alert("Cette couleur pour ce modèle se trouve dans le panier, la quantité a été augmentée !");
        }
    }
};

/**
 * verifying if same product with same color is in cart
 * @returns {boolean} State of product to be added to cart
 */
function checkSameCartItem() {
    let checker = false;
    let selectedColor = document.getElementById('colors').value;
    let cartToCheck = JSON.parse(localStorage.getItem('cart'));
    for (let item of cartToCheck) {
        console.log('cart item :', item);
        if (item.productId == findIdInPage() && item.color == selectedColor) {
            checker = true;
        }
    }
    return checker;
};

/**
 * adding new item to cart if there is already something in cart
 */
function addItemToCart() {
    let selectedProductQuantity = document.getElementById('quantity').value;
    let selectedColor = document.getElementById('colors').value;
    let oldCart = JSON.parse(localStorage.getItem('cart'));
    //making sure parsed cart is an array
    const array = Array.from(oldCart);
    //console.log('array? :', array);
    array.push(
        {
            productId: findIdInPage(),
            amount: selectedProductQuantity,
            color: selectedColor,
            name: document.getElementById('title').innerText,
            image: document.querySelector('.item__img img').src,
            description: document.getElementById('description').innerText,
            alt: document.querySelector('.item__img img').alt
        },
    );
    localStorage.setItem('cart', JSON.stringify(array));
};

/**
 * updating quantity if same product with same color has already been added to cart
 */
function updateAmount() {
    let selectedProductQuantity = document.getElementById('quantity').value;
    let selectedColor = document.getElementById('colors').value;
    let cartToUpdate = JSON.parse(localStorage.getItem('cart'));
    for (let item of cartToUpdate) {
        if (item.productId == findIdInPage() && item.color == selectedColor) {
            item.amount = parseInt(item.amount) + parseInt(selectedProductQuantity);
            console.log('amount :', item.amount)
        }
    }
    localStorage.setItem('cart', JSON.stringify(cartToUpdate));
};

/**
 * verifying user input value/selection
 * @returns {boolean} State of user selection
 */
function checkInputPopulate() {
    if (document.getElementById('quantity').value == 0 || document.getElementById('quantity').value > 100) {
        alert("Choisissez un nombre d'article(s) entre 1 et 100 !");
        return false;
    }
    else if (document.getElementById('colors').value == "") {
        alert("Choisissez une couleur !");
        return false;
    }
    else {
        console.log('ok :');
        return true;
    }
};

/**
 * clicking addtocart button triggers filling of localstorage
 */
document.getElementById('addToCart').addEventListener('click', function () {
    if (checkInputPopulate()) {
        populateCart();
        console.log('Storage :', localStorage);
    }
});




