import {ADD_TO_CART,REMOVE_FROM_CART} from '../Actions/cart';
import {ADD_ORDER} from '../Actions/orders';
import CartItem from '../../models/cart-item';
import { DELETE_PRODUCT } from '../Actions/products';

const initialState = {
    items: {},
    totalAmount: 0
};

export default cartReducer = (state = initialState , action) => {
 
    switch (action.type) {
        case ADD_TO_CART:
            const addedProduct = action.product;
            const prodprice = addedProduct.price;
            const prodTitle = addedProduct.title;
            const pushToken = addedProduct.pushToken;

            let updatedOrNewCartItem;

            if (state.items[addedProduct.id]) {
                //already have the item in cart
                updatedOrNewCartItem = new CartItem(
                    state.items[addedProduct.id].quantity + 1, prodprice , prodTitle,pushToken,
                    state.items[addedProduct.id].sum + prodprice               
                );
                return {
                    ...state,
                    items: {...state.items , [addedProduct.id] : updateCartItem},
                    totalAmount: state.totalAmount + prodprice
                };
            }
            else {
                updatedOrNewCartItem = new CartItem(1,prodprice,prodTitle,prodprice,pushToken);
                return {
                    ...state,
                    items: {...state.items , [addedProduct.id] : newCartItem},
                    totalAmount: state.totalAmount + prodprice
                };
            }

        case REMOVE_FROM_CART:
            const selectedCartItem = state.items[action.pid];
            const currentQty = selectedCartItem.quantity;
            let updateCartItems;    
            if (currentQty > 1) {
                // need to reduce it , not erase it
                const updateCartItem = new CartItem(selectedCartItem - 1 , selectedCartItem.prodprice,
                                                    selectedCartItem.prodTitle,selectedCartItem.sum-prodprice);
                updateCartItems = {...state.items , [action.pid]: updateCartItem};                                                    
            }
            else {
                // need to erase it
                updateCartItems = {...state.items};
                delete updateCartItems[action.pid];
            }
            return {
                ...state,
                items: updateCartItems,
                totalAmount: state.totalAmount - selectedCartItem.prodprice
            };
        
        case ADD_ORDER:
            return initialState;  
        
        case DELETE_PRODUCT:
            if (!state.items[action.pid]) {
               return state;
            }
            const updatedItems = {...state.items};
            const itemTotal = state.items[action.pid].sum;
            delete updatedItems[action.pid]
            return {
                ...state,
                items: updatedItems,
                totalAmount: state.totalAmount - itemTotal
            };    
    };

    return state;
};