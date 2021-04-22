class Product {
    constructor(id,ownerId,ownerPushToken,title,imageUrl,description,price) {
        this.id = id;
        this.ownerId = ownerId;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
        this.pushToken = ownerPushToken;
    }
}

export default Product;