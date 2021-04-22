import React ,{useState}from 'react';
import {View,Text,FlatList,Button,StyleSheet} from 'react-native';
import {useSelector,useDispatch} from 'react-redux';
import Colors from '../../constants/Colors';
import CartItem from '../../component/shop/CartItem';
import * as CartActions from '../../store/Actions/cart';
import * as OrdersActions from '../../store/Actions/orders';
import Card from '../../component/UI/Card';

const CartScreen = props => {

    const [isLoading,setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const cartTotalAmount = useSelector(state => state.cart.totalAmount);
    const CartItems = useSelector(state => {
        const transformedCartItems = [];
        for (const key in state.cart.items) {
            transformedCartItems.push({
                productId: key,
                productTitle: state.cart.items[key].productTitle,
                productPrice: state.cart.items[key].productPrice,
                quantity: state.cart.items[key].quantity,
                sum: state.cart.items[key].sum,
                productPushToken: state.cart.items[key].pushToken
            });
        }
        return transformedCartItems;       
    });

    const sendOrderHandler = async () => {
        setIsLoading(true);
        await dispatch(OrdersActions.addOrder(CartItems,cartTotalAmount));
        setIsLoading(false);
    };

    return (
        <View style={styles.screen}>
          <Card style={styles.summary}>
            <Text style={styles.summaryText}>Total: <Text style={styles.amount}>${Math.round(cartTotalAmount.toFixed(2)*100/100)}</Text></Text>
            
            {isLoading ? <ActivityIndicator size='small'/> : 
            <Button title="Order now" disabled={CartItems.length === 0}
            onPress={sendOrderHandler}/>}

            
          </Card>
          <FlatList data={CartItems} keyExtractor={item => item.productId}
                    renderItem={itemData => <CartItem quantity={itemData.item.quantity}
                                                      title={itemData.item.productTitle}
                                                      amount={itemData.item.sum}
                                                      deletable
                                                      onRemove={() => {
                                                        dispatch(CartActions.removeFromCart(itemData.item.productId));   
                                                      }}/>}/>
        </View>
    );
};

export const screenOptions = {
    headerTitle: "Your Cart"
};

const styles = StyleSheet.create({
    screen: {
        margin: 20
    },
    summary: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        padding: 10
    },
    summaryText: {
        fontFamily: 'open-sans-bold',
        fontSize: 18
    },
    amount: {
        color: Colors.primary
    }
});

export default CartScreen;