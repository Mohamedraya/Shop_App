import React ,{useEffect,useState}from 'react';
import {View,Platform,Flatlist,ActivityIndicator,StyleSheet} from 'react-native';
import {useSelector,useDispatch} from 'react-redux';
import {HeaderButtons,Item} from 'react-navigation-header-buttons';
import CustomHeaderButton from '../../component/UI/HeaderButton';
import OrderItem from '../../component/shop/OrderItem';
import * as OrdersAction from '../../store/Actions/orders';

const OrdersScreen = () => {

    const [isLoading,setIsLoading] = useState(false);
    const orders = useSelector(state => state.orders.orders);
    const dispatch = useDispatch();

    useEffect(() => {
        setIsLoading(true);
        dispatch(OrdersAction.fetchOrders()).then(() => {
            setIsLoading(false);
        });
    },[dispatch]);

    if (isLoading) {
        return (
            <View style={StyleSheet.centered}>
                <ActivityIndicator size='large'/>
            </View>
        );
    }

    if(orders.length === 0) {
        return <View style={{flex: 1,justifyContent: "center",alignItems:"center"}}>
            <Text>No Product Found</Text>
        </View>
    }

    return (
        <Flatlist data={orders} keyExtractor={item => item.id}
                  renderItem={itemData => <OrderItem amount={itemData.item.totalAmount}
                                                     date={itemData.item.date}
                                                     items={itemData.item.items}/>}/>
    );
};

export const screenOptions = navData => {
    return {
        headerTitle: "Your Orders",

        headerLeft: () => (<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                     <Item title="Menu" 
                           iconName={Platform.OS === 'android' ? 'md-menu':'ios-menu'}
                           onPress={() => {navData.navigation.toggleDrawer()}}/>
                    </HeaderButtons>)
    };    
};

const style = StyleSheet.create({
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default OrdersScreen;