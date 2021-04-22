
import React  ,{useState}from 'react';
import {Text, View ,StyleSheet} from 'react-native';
import {createStore,combineReducers,applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import ReduxThunk from 'redux-thunk';
import productsReducer from './store/Reducers/productsReducer';
import cartReducer from './store/Reducers/cartReducer';
import ordersReducer from './store/Reducers/ordersReducer';
import AppNavigator from './navigation/AppNavigator';
import {AppLoading} from 'expo';
import * as Font from 'expo-font';
import authReducer from './store/Reducers/auth';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {shouldShowAlert: true}
  }
});

const rootReducer = combineReducers({
  products: productsReducer,
  cart: cartReducer,
  orders: ordersReducer,
  auth : authReducer
});

const store = createStore(rootReducer,applyMiddleware(ReduxThunk));

const fetchFont = () => {
   return Font.loadAsync({
     'open-sans': require('./assets/Fonts/OpenSans-Regular.ttf'),
     'open-sans-bold': require('./assets/Fonts/OpenSans-Bold.ttf') 
   });
};

 function App() {

  const [fontLoaded,setFontLoaded] = useState(false);

  if(!fontLoaded) {
    return (<AppLoading startAsync={fetchFont} onFinish={() => {setFontLoaded(true)}}/>
    );
  }

  return (
    <Provider store={store}>
      <AppNavigator/>
    </Provider>

  );
}

export default App;

const styles = StyleSheet.create({
  
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});
