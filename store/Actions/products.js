import Product from '../../models/product';
import * as Notifications from 'expo-notifications';
import * as Permissions   from "expo-permissions";
export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const CREATE_PRODUCT = 'CREATE_PRODUCT';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';
export const SET_PRODUCT    = 'SET_PRODUCT';


export const fetchProducts = () => {

     return async (dispatch,getState) => {
            // any asynch code you want

          const userId = getState.auth.ownerId;
        try {
            const response = await fetch('https://e-commerce-a7dc9-default-rtdb.firebaseio.com/products.json');
    
            if (!response.ok) {
                throw new Error('something went wrong')
            }
            const resData = await response.json();
            const loadedProduct = [];
            
            for(const key in resData) {
                loadedProduct.push(
                    new Product(key,resData[key].ownerId,resData[key].ownerPushToken,resData[key].title,resData[key].imageUrl,
                                resData[key].description,resData[key].price));
            }
            dispatch({type: SET_PRODUCT, products: loadedProduct,
                      userProducts: loadedProduct.filter(prod => prod.ownerId === userId)});
     
  } catch(err) {
    // send to custom analytic server  
    throw err;}
 };
};

export const createProduct = (title,description,imageUrl,price) => {
    
    return async (dispatch,getState) => {
        // any asynch code you want
        let pushToken;
        let statusObj = await Permissions.getAsync(Permissions.NOTIFICATIONS);
        
        if (statusObj.status !== 'granted') {
            statusObj = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        }

        if(statusObj !== 'granted') {
            pushToken = null;
        }
        else {
            pushToken = (await Notifications.getExpoPushTokenAsync()).data;
        }

        Notifications.getExpoPushTokenAsync();
        const token = getState().auth.token;
        const userId = getState().auth.userId;
        const response = await fetch(`https://e-commerce-a7dc9-default-rtdb.firebaseio.com/products.json?auth=${token}`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({title,description,imageUrl,price,ownerId:userId,
                                  ownerPushToken: Pushtoken})
        });

        const resData = await response.json();
        console.log(resData);

        dispatch({
            type: CREATE_PRODUCT,
            productData: {id: resData.name,title,description,imageUrl,price,ownerId:userId,pushToken:pushToken}
        });      
    };
};

export default updateProduct = (id,title,description,imageUrl) => {
    
    return async (dispatch , getState) => {
        const token = getState().auth.token;
        const response = await fetch(
            `https://e-commerce-a7dc9-default-rtdb.firebaseio.com/products/${id}.json?auth=${token}`,{
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({title,description,imageUrl})
        });
        if (!response.ok) {
            throw new Error ('something went wrong');
        }
        dispatch ({
            type: UPDATE_PRODUCT,
            pid: id,
            productData: {title,description,imageUrl}
        });
    };
};

export const deleteProduct = productId => {
    
    return async (dispatch,getState) => {
        const token = getState().auth.token;
        const response = await fetch(
            `https://e-commerce-a7dc9-default-rtdb.firebaseio.com/products/${productId}.json?auth=${token}`,{
             method: 'DELETE',            
        });

        if (!response.ok) {
            throw new Error ('something went wrong');
        }

        dispatch ({
            type: DELETE_PRODUCT,
            pid: productId
        });
    };
    
};