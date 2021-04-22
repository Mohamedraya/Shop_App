class CartItem {
    constructor (quantity,productPrice,productTitle,sum,pushToken) {
        //store all data that recive
        this.quantity = quantity;
        this.productPrice = productPrice;
        this.productTitle = productTitle;
        this.sum = sum;
        this.pushToken = pushToken;
    }
}

export default CartItem;