import React from 'react';
import {Platform,SafeAreaView,Button,View} from 'react-native';
import {createStackNavigator}  from '@react-navigation/stack';
import {createDrawerNavigator, DrawerItemList} from '@react-navigation/drawer';
import {Ionicons} from '@expo/vector-icons';
import Colors from '../constants/Colors';
import {useDispatch} from 'react-redux';
import * as authAction from '../store/Actions/auth';
import ProductsScreen , {screenOptions as productsScreenOptions} from '../screens/shop/ProdcutsScreen';
import ProductDetailsScreen , {screenOptions as ProductDetailOptions} from '../screens/shop/ProductDetailsScreen';
import CartScreen , {screenOptions as cartScreenOptions}from '../screens/shop/Cartnavigation-drawer';
import {createAppContainer} from 'react-navigScreen';
import OrdersScreen ,{screenOptions as OrdersScreenOptions} from '../screens/shop/OrdersScreen';
import UserProductsScreen , {screenOptions as UserProductsScreenOptions}from '../screens/user/UserProductsScreen';
import EditProductScreen  , {screenOptions as editProductScreenOptions} from '../screens/user/EditProductScreen';
import AuthScreen ,{screenOptions as authScreenOptions}from '../screens/user/AuthScreen';
import StartUpScreen from '../screens/user/StartUpScreen';

const defaultNavOptions = {
    headerStyle: {
        backgroundColor: Platform.OS === "android" ? Colors.primary : ""
    },
    headerTitleStyle: {
        fontFamily: 'open-sans-bold'
    },
    headerTintColor: Platform.OS === "android" ?  "white" : Colors.primary

};


const ProductsStackNavigator = createStackNavigator();

export const ProductsNavigator = () => {
    return <ProductsStackNavigator.Navigator screenOptions={defaultNavOptions}>
              <ProductsStackNavigator.Screen name="ProductScreen"  component={ProductsScreen}
                                             options={productsScreenOptions}/>
              <ProductsStackNavigator.Screen name="ProductDetails" component={ProductDetailsScreen}
                                             options={ProductDetailOptions}/>
              <ProductsStackNavigator.Screen name="Cart" component={CartScreen}
                                             options={cartScreenOptions}/>
           </ProductsStackNavigator.Navigator>
};

const OrdersStackNavigator = createStackNavigator();

export const OrdersNavigator = () => {
    return <OrdersStackNavigator.Navigator screenOptions={defaultNavOptions}>
              <OrdersStackNavigator.Screen name="Orders" component={OrdersScreen}
                                           options={OrdersScreenOptions}/>
           </OrdersStackNavigator.Navigator>
};

const AdminStackNavigator = createStackNavigator();

export const AdminNavigator = () => {
    return <AdminStackNavigator.Navigator screenOptions={defaultNavOptions}>
               <AdminStackNavigator.Screen name="UserProducts" component={UserProductsScreen}
                                           options={UserProductsScreenOptions}/>
               <AdminStackNavigator.Screen name="EditProduct"  component={EditProductScreen}
                                           options={editProductScreenOptions}/>
           </AdminStackNavigator.Navigator>
};

const ShopDrawerNavigator = createDrawerNavigator();

export const ShopNavigator = () => {
    const dispatch = useDispatch();
    return <ShopDrawerNavigator.Navigator drawerContent={
        props => {
            
            return(
                <View style={{flex: 1,paddingTop: 20}}>
                  <SafeAreaView forseInset={{top: 'always',horizontal: 'never'}}>
                      <DrawerItemList {...props}/>
                      <Button title= "Logout" onPress={() => {
                          dispatch(authAction.logout());
                          
                      }}/>
                  </SafeAreaView>
                </View>
            );
        }
    } drawerContentOptions={
        {
            activeTintColor: Colors.primary
        }
    }>
               <ShopDrawerNavigator.Screen name="ProductsScreen" component={ProductsNavigator}
                                           options={{
                                            drawerIcon: props => (
                                                <Ionicons name={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
                                                          size={23} color={props.color}/>
                                            )
                                        }}/>
               <ShopDrawerNavigator.Screen name="Orders"         component={OrdersNavigator}
                                           options={ {
                                            drawerIcon: props => (
                                                <Ionicons name={Platform.OS === 'android' ? 'md-list' : 'ios-list'}
                                                          size={23} color={props.color}/>
                                            )
                                        }}/>
               <ShopDrawerNavigator.Screen name="Admin"          component={AdminNavigator}
                                           options={{ 
                                            drawerIcon: props => (
                                                <Ionicons name={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
                                                          size={23} color={props.color}/>
                                            )
                                        }}/>
           </ShopDrawerNavigator.Navigator>
};

const AuthStackNavigator = createStackNavigator();

export const AuthNavigator = () => {
    <AuthStackNavigator.Navigator screenOptions={defaultNavOptions}>
       <AdminStackNavigator.Screen name="Auth" component={AuthScreen}
                                   options={authScreenOptions}/>
    </AuthStackNavigator.Navigator>
};

/*const ProductsNavigator = createStackNavigator({
    ProductsScreen: ProductsScreen,
    ProductDetails: ProductDetailsScreen,
    Cart: CartScreen

}, { 
    defaultNavigationOptions: defaultNavOptions
      
});



const OrdersNavigator = createStackNavigator({
    Orders: OrdersScreen
},{
    navigationOptions: {
        drawerIcon: drawerConfig => (
            <Ionicons name={Platform.OS === 'android' ? 'md-list' : 'ios-list'}
                      size={23} color={drawerConfig.tintColor}/>
        )
    },
    defaultNavigationOptions: defaultNavOptions
});

const AdminNavigator = createStackNavigator({
    UserProducts: UserProductsScreen,
    EditProduct : EditProductScreen
},{
    navigationOptions: {
        drawerIcon: drawerConfig => (
            <Ionicons name={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
                      size={23} color={drawerConfig.tintColor}/>
        )
    },
    defaultNavigationOptions: defaultNavOptions
});

const ShopNavigator = createDrawerNavigator({
     Products: ProductsNavigator,
     Orders: OrdersNavigator,
     Admin: AdminNavigator
},{
    contentOptions: {
        activeTintColor: Colors.primary
    },
    contentComponent: props => {
        const dispatch = useDispatch();
        return(
            <View style={{flex: 1,paddingTop: 20}}>
              <SafeAreaView forseInset={{top: 'always',horizontal: 'never'}}>
                  <DrawerNavigatorItems {...props}/>
                  <Button title= "Logout" onPress={() => {
                      dispatch(authAction.logout());
                      
                  }}/>
              </SafeAreaView>
            </View>
        );
    }
});

const AuthNavigator = createStackNavigator({
    Auth: Authscreen
},{
    defaultNavigationOptions: defaultNavOptions
});

const MainNavigator = createSwitchNavigator({
    StartUp: StartUpScreen,
    Auth: AuthNavigator,
    Shop: ShopNavigator
});*/

export default createAppContainer(MainNavigator);