import React , {useState,useEffect,useCallback,useReducer} from 'react';
import {View,StyleSheet,ScrollView,Platform, Alert,KeyboardAvoidingView,
        ActivityIndicator} from 'react-native';
import {HeaderButtons,Item} from 'react-navigation-header-buttons';
import CustomHeaderButton from '../../component/UI/HeaderButton';
import {useSelector,useDispatch} from 'react-redux';
import * as ProductsActions from '../../store/Actions/products';
import Input from '../../component/UI/Input';
import { isLoading } from 'expo-font';

const FORM_UPDATE = 'FORM_UPDATE';

const formReducer = (state,action) => {
    if(action.type === FORM_UPDATE) {
        const updatedValues = {
            ...state.inputValues,
            [action.input]: action.value
        };
        const updatedValidaites = {
            ...state.inputValidites,
            [action.input]: action.isVaild
        };
        let updatedFormIsValid = true;
        for (const key in updatedValidaites) {
            updatedFormIsValid = updatedFormIsValid && updatedValidaites[key];
        }
        return {           
            inputValues: updatedValues,
            inputValidites: updatedValidaites,
            formIsValid = updatedFormIsValid,
        };
    }
    return state;
};

const EditProductScreen = props => {

    const [isloading,setIsLoading] = useState(false);
    const [error,setError] = useState(false);

    const prodId = props.route.params ? props.route.params.productId : null;
    const EditedProduct = useSelector(state => 
                          state.products.userProducts.find(prod => prod.id === prodId));

    const dispatch = useDispatch();
    const [formState,dispatchFormState] = useReducer(formReducer,{inputValues: {
        title: EditedProduct ? EditedProduct.title : '',
        imageUrl: EditedProduct ? EditedProduct.imageUrl: '',
        description: EditedProduct ? EditedProduct.description :'',
        price: ''
    } , 
    inputValidites: {
        title: EditedProduct ? true : false,
        imageUrl: EditedProduct ? true : false,
        description: EditedProduct ? true : false,
        price: EditedProduct ? true : false
    }, 
    formIsValid: EditedProduct ? true : false});      
    
    useEffect(() => {
      if (error) {
          Alert.alert('an error occured',error,[{text:'Okay'}]);
      }
    } , [error]);
  
    const submitHandler = useCallback(async () => {
        if(!formState.formIsValid) {
            Alert.alert('Wrong input','please check errors',[{text:'Okay'}])
            return;
        }

        setError(null);
        setIsLoading(true);

        try {
            if(EditedProduct) {
                await dispatch(ProductsActions.updateProducts(prodId,formState.inputValues.title,
                                                         formState.inputValues.imageUrl,
                                                         formState.inputValues.description)
                                     );
             }
             else {
                await dispatch(ProductsActions.createProduct(formState.inputValues.title,
                                                        formState.inputValues.description,
                                                        formState.inputValues.imageUrl,
                                                        +formState.inputValues.price));
             }
        } catch (err) {
           setError(err.message);
        }
       
        setIsLoading(false);
        
    },[dispatch,prodId,formState]);

    useEffect(() => {
        props.navigation.setOptions({
            headerRight: () => (
                <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                 <Item title="Save" 
                  iconName={Platform.OS === 'android' ? 'md-checkmark':'ios-checkmark'}
                  onPress={submitHandler}/>
                </HeaderButtons>
             ),
         })       
    },[submitHandler]);

    const inputChangeHandler = useCallback((inputIdentifier,inputValue,inputValidity) => {
        
         dispatchFormState({type: FORM_UPDATE , value: inputValue, 
                           isVaild: inputValidity, input: inputIdentifier});
    },[dispatchFormState]);

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size='large'/>
            </View>
        );
    }

    return (
      <KeyboardAvoidingView style={{flex: 1}} behavior= "padding" 
                            keyboardVerticalOffset={100}>  
        <ScrollView>
          <View style={styles.mainForm}>

            <Input  id='title'
                    label= "title" keyboardType='default' autoCapitalize="sentences"
                    autoCorrect returnKeyType='next' errorText= "Enter a valid title"
                    onInputChange={inputChangeHandler.bind(this,'title')}
                    initialValue={EditedProduct ? EditedProduct.title : ''}
                    initiallyValid={!!EditedProduct} required
                    onInputChange={inputChangeHandler}/>

            <Input  id='imageurl'
                    label= "imageUrl" keyboardType='default' 
                    returnKeyType='next' errorText= "Enter a valid image"
                    initialValue={EditedProduct ? EditedProduct.imageUrl: ''}
                    initiallyValid={!!EditedProduct} required
                    onInputChange={inputChangeHandler.bind(this,'imageurl')}/>

            {EditedProduct ? null:( <Input id='price'  label= "price" keyboardType='decimal-pad' 
                                        returnKeyType='next' errorText= "Enter a valid price"
                                        required min={0.1}
                                        onInputChange={inputChangeHandler}/>)}

            <Input  id='description'
                    label= "description" keyboardType='default' 
                    autoCorrect  multiline numberOfLines = {3}
                    errorText= "Enter a valid des"
                    initialValue={EditedProduct ? EditedProduct.description: ''}
                    initiallyValid={!!EditedProduct} required minLength={5}
                    onInputChange={inputChangeHandler}/>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>  
    );
};

export const screenOptions = navData => {
    
    const routeParams = navData.route.params ? navData.route.params : {};
    return {
        headerTitle: routeParams.productId ? 
        'Edit Product' : 'Add Product',

        headerRight: () => (
           <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
            <Item title="Save" 
             iconName={Platform.OS === 'android' ? 'md-checkmark':'ios-checkmark'}
             onPress={submitFn}/>
           </HeaderButtons>
        ),
    };
};

const styles = StyleSheet.create({
    mainForm: {
        margin: 20
    },

    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default EditProductScreen;