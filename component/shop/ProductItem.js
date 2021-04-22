import React from 'react';
import {View,Text,Image,StyleSheet,Button,TouchableOpacity,
        TouchableNativeFeedback,Platform} from 'react-native';
import Card from '../UI/Card';        

const ProductItem = (props) => {

    let TouchableCmp = TouchableOpacity;
    if(Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }
    return (
     <Card> 
      <TouchableCmp onPress={props.onSelect} useForeground> 
        <View style={styles.product}>
            <View style={styles.imageContainer}>
              <Image source={{uri: props.image}} style={styles.image}/>
            </View>           
            <View style={styles.texts}>
              <Text style={styles.title}>{props.title}</Text>
              <Text style={styles.price}>${props.price.toFixed(2)}</Text>
            </View>           
            <View style={styles.actions}>
                {props.children}
            </View>
        </View>
      </TouchableCmp>
    </Card>
    );
};

const styles = StyleSheet.create({
    product: {
        height: 300,
        margin: 20
    },

    imageContainer: {
        width: "100%",
        height: "60%",
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        overflow: "hidden"
    },

   image: {
        width: "100%",
        height: "100%"
    },

    texts: {
        alignItems: "center",
        height: "17%",
        padding: 10
    },

    title: {
        fontFamily: 'open-sans-bold',
        fontSize: 18,
        marginVertical: 5
    },

    price: {
        fontFamily: 'open-sans',
        fontSize: 14,
        color: "#888"
    },

    actions: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        height: "23%"
    }
});

export default ProductItem;