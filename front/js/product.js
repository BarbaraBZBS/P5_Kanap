
// getting only one product to show up on each product page
function loadProduct() {
    var paramsString = window.location.href;
    var url = new URL(paramsString);
    var searchParams = new URLSearchParams(url.search);
    var idInUrl = searchParams.get('id');
    //console.log('id in url :', idInUrl);
    fetch("http://localhost:3000/api/products/" + idInUrl)
    .then (function(res) {
        if(res.ok) {
            return res.json();
        }
    })
    .then (function(product) {
        //console.log('product :', product);
        const itemImageSection = document.querySelector('div.item__img');
        const showProductImage = document.createElement('img');
        showProductImage.setAttribute('src', product.imageUrl);
        showProductImage.alt = product.altTxt;
        const itemTitleSection = document.getElementById('title');
        itemTitleSection.innerHTML = product.name;
        const itemPriceSection = document.getElementById('price');
        itemPriceSection.innerHTML = product.price + " ";
        const itemDescriptionSection = document.getElementById('description');
        itemDescriptionSection.innerHTML = product.description;
        const itemColorsSection = document.getElementById('colors');
        const colors = product.colors.values();
        for (let color of colors) {
            const selectOptions = document.createElement('option');
            selectOptions.value = color;
            selectOptions.text = color;
            itemColorsSection.add(selectOptions);
        }
        
        itemImageSection.appendChild(showProductImage);
        showProductImage.append(showProductImageAlt);
    })
    .catch(function(err) {
        //an error occurred
    })
    }
  loadProduct();
  
  