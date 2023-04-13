export const parsePrice = function (price,curencyCode = null) {
    price = price + "";
    return price.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}