import React ,{useState,useEffect,useCallback} from 'react';
import {View,FlatList,Platform,Button,ActivityIndicator,StyleSheet} from 'react-native';
import {useSelector,useDispatch} from 'react-redux';
import ProductItem from '../../component/shop/ProductItem';
import * as CartActions from '../../store/Actions/cart';
import * as ProductsActions from '../../store/Actions/products';
import {HeaderButtons,Item} from 'react-navigation-header-buttons';
import CustomHeaderButton from '../../component/UI/HeaderButton';
import Colors from '../../constants/Colors';

const ProductsScreen = (props) => {

    const [isLoading,setIsLoading] = useState(false);
    const [isRefreshing,setIsRefreshing] = useState(false); 
    const [error,setError] = useState();
    const products = useSelector(state => state.products.availableProducts);
    const dispatch = useDispatch();

    const loadProducts = useCallback( async () => {
      setError(null);
      setIsRefreshing(true);
      try {
        dispatch(ProductsActions.fetchProducts());
      } catch (err) {
          setError(err.message);
      }
      setIsRefreshing(false);
    },[dispatch,setIsLoading,setError]);

    useEffect(() => {
      const unsubscribe = props.navigation.addListener('focus',loadProducts);
      return () => {unsubscribe();}
    },[loadProducts]);

  useEffect(() => {
      setIsLoading(true);          
      loadProducts().then(() => {
        setIsLoading(false);
      });
  },[dispatch,loadProducts]);

    const selectItemHandler = (id,title) => {
      props.navigation.navigate('ProductDetails',{productId:id,
                                               productTitle:title});
    };

    if (error) {
      return <View style={Styles.centered}>
               <Text>an error occurred</Text>
               <Button title="try again" onPress={loadProducts}/>
             </View>
    }

    if (isLoading) {
      return <View style={Styles.centered}>
        <ActivityIndicator size='large' color={Colors.primary}/>
      </View>
    }

    if (!isLoading && products.length === 0) {
      return <View style={Styles.centered}>
               <Text>No Products found</Text>
             </View>
    }

    return (
        <FlatList onRefresh={loadProducts} refreshing={isRefreshing}
                data={products} keyExtractor={item => item.id}
                renderItem={itemData => 
                            <ProductItem image={itemData.item.imageUrl}
                                         title={itemData.item.title}
                                         price={itemData.item.price}
                                         onSelect={()=>{
                                           selectItemHandler(itemData.item.id,itemData.item.title);
                                         }}
                                         >
                                           <Button title="View Details" 
                                                   onPress={()=>{
                                                    selectItemHandler(itemData.item.id,itemData.item.title);
                                                  }}/>

                                           <Button title="Add to cart"  
                                                   onPress={() => {dispatch(CartActions.addToCart(itemData.item));}}/>
                                         </ProductItem>}/>
    );
};

export const screenOptions = navData => {
  return {  
    headerTitle: "All Products",

    headerLeft: () => (<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                 <Item title="Menu" 
                 iconName={Platform.OS === 'android' ? 'md-menu':'ios-menu'}
                 onPress={() => {navData.navigation.toggleDrawer()}}/>
                </HeaderButtons>),

    headerRight: () => (<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                   <Item title="Cart" 
                         iconName={Platform.OS === 'android' ? 'md-cart':'ios-cart'}
                         onPress={() => {navData.navigation.navigate('Cart')}}/>
                  </HeaderButtons>)
         };
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default ProductsScreen;