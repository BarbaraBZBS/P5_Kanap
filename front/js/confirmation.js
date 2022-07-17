/**
 * finding which order id is to be displayed
 * @returns {idInUrl} Retrieved id in url
 */
function findOrderId() {
    const paramsString = window.location.href;
    const url = new URL(paramsString);
    const searchParams = new URLSearchParams(url.search);
    const idInUrl = searchParams.get('id');
    return idInUrl;
};
//console.log('id in Url :', findOrderId());

/**
 *  Page loading
 */
document.addEventListener('DOMContentLoaded', function () {
    loadOrderNumber();
});

/**
 * Displaying order number
 */
function loadOrderNumber() {
    document.getElementById('orderId').textContent = findOrderId();
    localStorage.clear();
}


