
/**
 * getting all product articles to show up on homepage
 */
(function loadProducts() {
    //get data and check validity response
    fetch("http://localhost:3000/api/products")
    .then (function(res) {
        if (res.ok) {
            return res.json();
        }
    })
    .then (function(products) {
        //console.log('products :', products);
        const itemsSection = document.getElementById('items')
        //console.log('product 2 :', products[1].name + ' ' + products[1].price + '€');
        for (let product of products) {
            //console.log('product :', product);
            //console.log('product name :', product.name);
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
    })
    .catch(function(err) {
        console.log('error :', err);
        alert("Erreur");
    })
})()
