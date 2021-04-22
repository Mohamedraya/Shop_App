import React from 'react';
import {View,Text,Button,StyleSheet,Image,ScrollView} from 'react-native';
import {useSelector,useDispatch} from 'react-redux';
import * as CartActions from '../../store/Actions/cart';


const ProductDetailsScreen = props => {

    const productId = props.route.params.productId;
    const selectedProduct = useSelector(state => 
          state.products.availableProducts.find(prod =>prod.id === productId));
    const dispatch = useDispatch();      
    return (
        <ScrollView>
            <Image source={{uri: selectedProduct.imageUrl}} style={styles.image}/>
            <View style={styles.btnWrapper}>
              <Button title= "Add To Cart" onPress={() => {
                  dispatch(CartActions.addToCart(selectedProduct));
              }}/>
            </View>            
            <Text style={styles.price}>${selectedProduct.price.toFixed(2)}</Text>
            <Text style={styles.description}>{selectedProduct.description}</Text>
        </ScrollView>
    );
};

export const screenOptions = navData => {
    return {
       headerTitle: navData.route.params.productTitle
    };   
};

const styles = StyleSheet.create({
    image: {
        width: "100%",
        height: 300
    },

    btnWrapper: {
        marginVertical: 20,
        alignItems: "center"
    },

    price: {
        fontFamily: 'open-sans-bold',
        fontSize: 20,
        color: "#888",
        textAlign: "center",
        marginVertical: 20
    },

    description: {
        fontFamily: 'open-sans',
        fontSize: 14,
        textAlign: "center",
        marginHorizontal: 20
    }
});

export default ProductDetailsScreen;