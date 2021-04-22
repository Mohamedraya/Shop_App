import Order from '../../models/order';
export const ADD_ORDER = 'ADD_ORDER';
export const SET_ORDERS = 'SET_ORDERS';


export const addOrder = (cartItems,totalAmount) => {

    return async (dispatch,getState) => {
        const token  = getState().auth.token;
        const userId = getState().auth.userId; 
        const date = new Date();
        const response = await fetch(`https://e-commerce-a7dc9-default-rtdb.firebaseio.com/orders/${userId}.json?auth=${token}`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({cartItems,totalAmount,
                                  date: date.toISOString()})
        });

        if (!response.ok) {
            throw new Error('something went wrong');
        }
        const resData = await response.json();
        dispatch ({
            type: ADD_ORDER,
            orderData: {id: resData.name,items: cartItems , 
                        amount: totalAmount,date: date}
        });

        for (const cartItem of cartItems) {
            const pushToken = cartItem.pushToken;
            fetch('https://exp.host/--/api/v2/push/send',{
                method: "post",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    cartItems,
                    totalAmount,
                    date: date.toISOString()
                })
            });
        }
        for (const cartItem of cartItem) {
            const pushToken = cartItem.pushToken;
            fetch('https://expo.host/--/api/v2/push/send',{
                method: "post",
                headers: {
                    'Accept': 'application/json',
                    'Accept-Encoding': 'gzip,deflate',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    to: pushToken,
                    title: 'Order was placed',
                    body : cartItem.productTitle
                })
            });
        }
    };
};

export const fetchOrders = () => {

    return async (dispatch,getState) => {
        const userId = getState().auth.userId;
        try {
            const response = await fetch(`https://e-commerce-a7dc9-default-rtdb.firebaseio.com/orders/${userId}.json`);
    
            if (!response.ok) {
                throw new Error('something went wrong')
            }
            const resData = await response.json();
            const loadedOrders = [];
            
            for(const key in resData) {
                loadedOrders.push(
                    new Order(key,resData[key].cartItems,resData[key].totalAmount,
                        new Date(resData[key].date)) 
                );
            }
        dispatch({
            type: SET_PRODUCT,
            orders: loadedOrders
        });
    } catch (err) {
        throw err;
    }
};
}   