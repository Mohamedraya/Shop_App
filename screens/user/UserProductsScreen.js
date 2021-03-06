import React from 'react';
import {Button,FlatList,Platform,Alert, View,Text} from 'react-native';
import ProductItem from '../../component/shop/ProductItem';
import { useSelector , useDispatch} from "react-redux";
import {HeaderButtons,Item} from 'react-navigation-header-buttons';
import CustomHeaderButton from '../../component/UI/HeaderButton';
import * as productsActions from '../../store/Actions/products';

const UserProductsScreen = props => {

    const userProducts = useSelector(state => state.products.userProducts);
    const dispatch = useDispatch();

    const editProductHandler = (id) => {
        props.navigation.navigate('EditProduct',{productId: id});
    };

    const deleteHandler = (id) => {
        Alert.alert('Are you sure','Do you really want to delete this item',[
            {text: 'No'  , style: 'default'},
            {text: 'Yes' , style: 'destructive',onPress: () => {
                dispatch(productsActions.deleteProduct(itemData.item.id))
                  }}
        ]);
    };

    if(userProducts.length === 0) {
        return <View style={{flex: 1,justifyContent: "center",alignItems:"center"}}>
            <Text>No Product Found</Text>
        </View>
    }

    return (
        <FlatList data={userProducts} keyExtractor={item => item.id}
                  renderItem={itemData => <ProductItem image={itemData.item.imageUrl}
                                                       title={itemData.item.title}
                                                       price={itemData.item.price}
                                                       onSelect={() => {}}
                                                       >

                            <Button title="Edit" 
                                    onPress={()=>{editProductHandler(itemData.item.id)}}/>

                            <Button title="Delete"  
                                    onPress={deleteHandler.bind(this,itemData.item.id)}/>              

                                         </ProductItem>}/>
    );
};

export const screenOptions = navData => {
    return {
    headerTitle: 'Your Products',

    headerLeft: () => (<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        <Item title="Menu" 
        iconName={Platform.OS === 'android' ? 'md-menu':'ios-menu'}
        onPress={() => {navData.navigation.toggleDrawer()}}/>
       </HeaderButtons>),

    headerRight: () => (
        <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        <Item title="Add" 
        iconName={Platform.OS === 'android' ? 'md-create':'ios-create'}
        onPress={() => {navData.navigation.navigate('EditProduct')}}/>
       </HeaderButtons>
    ),   
       };
};

export default UserProductsScreen;