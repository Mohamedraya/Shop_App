import React , {useState,useReducer,useCallback,useEffect} from 'react';
import {ScrollView,ActivityIndicator,KeyboardAvoidingView,
        StyleSheet,Button,Alert} from 'react-native';
import {useDispatch} from 'react-redux';
import {LinearGradient} from 'expo-linear-gradient';
import Input from '../../component/UI/Input';
import Card from '../../component/UI/Card';
import * as authAction from '../../store/Actions/auth';


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

const AuthScreen = props => {

    const [isLoading,setIsLoading] = useState(false);
    const [error,setError]         = useState(false);
    const [isSignup,setIsSignup]   = useState(false);

    const dispatch = useDispatch();

    const [formState,dispatchFormState] = useReducer(formReducer,{inputValues: {
       email: '',
       password: ''
    } , 
    inputValidites: {
       email: false,
       password: false
    }, 
    formIsValid: false});

    useEffect(() => {

        if(error) {
            Alert.alert("an error Occurred",error,[{text: "Okay"}])
        }
    },[error]);

    const authHandler = async () => {
        let action;
        if (isSignup) {
            action = authAction.signup(formState.inputValues.email,formState.inputValues.password);
        }
        else {
            action = authAction.login(formState.inputValues.email,formState.inputValues.password);
        } 
        setError(null);
        setIsLoading(true);
        try {
            await dispatch (action);
            //props.navigation.navigate("Shop");
        }
        catch (err) {
            setError(err.message);
            setIsLoading(false);
        }      
    };

    const inputChangeHandler = useCallback((inputIdentifier,inputValue,inputValidity) => {
        
        dispatchFormState({type: FORM_UPDATE , value: inputValue, 
                          isVaild: inputValidity, input: inputIdentifier});
   },[dispatchFormState]);
    

    return (
        <KeyboardAvoidingView style={styles.screen} behavior='padding'
                              keyboardVerticalOffset={50}>
         <LinearGradient color={['#ffedff','#ffe3ff']} style={styles.gradient}>                                  
          <Card style={styles.authContainer}>
            <ScrollView>
                <Input id= "email" label= "E-mail" keyboardType= "email-address"
                       required email autoCapitalize= "none" 
                       errorText= "please enter a valid email"
                       onInputChange= {inputChangeHandler} initialValue= ""/>

                <Input id= "password" label= "password" keyboardType= "default"
                       required minLength= {5} autoCapitalize= "none" secureTextEntry 
                       errorText= "please enter a valid password"
                       onInputChange= {inputChangeHandler} initialValue= ""/> 

            {isLoading ? (<ActivityIndicator/>) : 
            (<Button title= {isSignup ? 'Sign Up' : 'Login'} onPress= {authHandler}/>) }

               
                <Button title= {`Switch to ${isSignup ? 'login' : 'Sign Up'}`} 
                        onPress= {() => {
                            setIsSignup(prevState => !prevState);
                        }}/>             
            </ScrollView>
          </Card>
         </LinearGradient> 
        </KeyboardAvoidingView>
    );
};

export const screenOptions = {
    headertitle: "Authenticate"
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },

    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },

    authScreen: {
        width: "80%",
        maxWidth: 400,
        maxHeight: 400,
        padding: 20
    }
});

export default AuthScreen;