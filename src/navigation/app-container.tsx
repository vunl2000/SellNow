import { NavigationContainer } from '@react-navigation/native'
import { createDrawerNavigator } from '@react-navigation/drawer';
import Home from '../screens/home';
import Customer from '../screens/customer';

const Drawer = createDrawerNavigator();

function MyDrawer() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="Profile" component={Customer} />
    </Drawer.Navigator>
  );
}

const AppContainer = () => {
    return (
        <NavigationContainer>
            <MyDrawer />
        </NavigationContainer>
    )
}

export default AppContainer;