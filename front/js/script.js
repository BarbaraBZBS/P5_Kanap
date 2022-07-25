/**
 *  Page loading
 */
document.addEventListener('DOMContentLoaded', function () {
    load();
});

/**
 * Loading each product card on home page
 */
async function load() {
    const products = await getProducts();
    //console.log('products :', products);
    for (let product of products) {
        showProduct(product)
    }
}

/**
 * Calling API to get products info
 * @returns {products} API products array
 */
function getProducts() {
    //getting data after checking validity response then catching error
    return fetch("http://localhost:3000/api/products")
        .then(function (res) {
            if (res.ok) {
                return res.json()
            }
        })
        .then(function (products) {
            //console.log('products :', products);
            return products
        })
        .catch(function (err) {
            console.log('error :', err);
            //alert("Erreur")
        })
}

/**
 * displaying HTML content for each card
 * @param {object} product API retrieved product to display 
 */
function showProduct(product) {
    //console.log('product :', product)
    const itemsSection = document.getElementById('items');
    const showAnchor = document.createElement('a');
    const showArticle = document.createElement('article');
    const showImage = document.createElement('img');
    const showHeading = document.createElement('h3');
    const showParagraph = document.createElement('p');
    showAnchor.setAttribute('href', './product.html?id=' + product._id);
    showImage.setAttribute('src', product.imageUrl);
    showImage.alt = product.altTxt;
    showHeading.innerText = product.name;
    showHeading.classList.add('productName');
    showParagraph.innerText = product.description;
    showParagraph.classList.add('productDescription');
    showArticle.appendChild(showImage);
    showArticle.appendChild(showHeading);
    showArticle.appendChild(showParagraph);
    showAnchor.appendChild(showArticle);
    itemsSection.appendChild(showAnchor);
}

