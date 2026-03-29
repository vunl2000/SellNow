import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';

import Ionicons from '@react-native-vector-icons/ionicons';

import Home from '../screens/home';
import Customer from '../screens/customer';
import InventoryScreen from '../screens/inventory';
import { createStackNavigator } from '@react-navigation/stack';
import CreateOrderScreen from '../screens/order';
import BootSplash from 'react-native-bootsplash';
import StatisticsScreen from '../screens/statistics';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function OrderStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={Home} />

      <Stack.Screen
        name="CreateOrderScreen"
        component={CreateOrderScreen}
        options={{ presentation: 'modal' }}
      />
    </Stack.Navigator>
  );
}

function CustomDrawerContent(props: any) {
  const { state, navigation } = props;
  const focused = state.routeNames[state.index];
  const appVersion = '1.0.0';

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{ paddingTop: 0 }}
    >
      <View style={styles.drawerHeader}>
        <View style={styles.avatarContainer}>
          <Ionicons name="storefront" size={32} color="#2563EB" />
        </View>
        <Text style={styles.shopName}>Cửa hàng của tôi</Text>
        <Text style={styles.appVersion}>Phiên bản {appVersion}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.menuContainer}>
        <DrawerItem
          label="Đơn hàng"
          icon={({ color, size }) => (
            <Ionicons
              name={focused === 'OrderStack' ? 'receipt' : 'receipt-outline'}
              size={size}
              color={color}
            />
          )}
          labelStyle={styles.drawerLabel}
          onPress={() => navigation.navigate('OrderStack')}
          focused={focused === 'OrderStack'}
          activeBackgroundColor="#EFF6FF"
          inactiveBackgroundColor="transparent"
          inactiveTintColor="#4B5563"
          activeTintColor="#2563EB"
        />

        <DrawerItem
          label="Khách hàng"
          icon={({ color, size }) => (
            <Ionicons
              name={focused === 'Customer' ? 'people' : 'people-outline'}
              size={size}
              color={color}
            />
          )}
          labelStyle={styles.drawerLabel}
          onPress={() => navigation.navigate('Customer')}
          focused={focused === 'Customer'}
          activeBackgroundColor="#EFF6FF"
          inactiveBackgroundColor="transparent"
          inactiveTintColor="#4B5563"
          activeTintColor="#2563EB"
        />

        <DrawerItem
          label="Kho hàng"
          icon={({ color, size }) => (
            <Ionicons
              name={focused === 'Inventory' ? 'cube' : 'cube-outline'}
              size={size}
              color={color}
            />
          )}
          labelStyle={styles.drawerLabel}
          onPress={() => navigation.navigate('Inventory')}
          focused={focused === 'Inventory'}
          activeBackgroundColor="#EFF6FF"
          inactiveBackgroundColor="transparent"
          inactiveTintColor="#4B5563"
          activeTintColor="#2563EB"
        />

        <DrawerItem
          label="Thống kê"
          icon={({ color, size }) => (
            <Ionicons
              name={
                focused === 'Statistics' ? 'bar-chart' : 'bar-chart-outline'
              }
              size={size}
              color={color}
            />
          )}
          labelStyle={styles.drawerLabel}
          onPress={() => navigation.navigate('Statistics')}
          focused={focused === 'Statistics'}
          activeBackgroundColor="#EFF6FF"
          inactiveBackgroundColor="transparent"
          inactiveTintColor="#4B5563"
          activeTintColor="#2563EB"
        />
      </View>
    </DrawerContentScrollView>
  );
}

function MyDrawer() {
  return (
    <Drawer.Navigator
      initialRouteName="OrderStack"
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: '#FFFFFF',
          width: 280,
        },
      }}
    >
      <Drawer.Screen name="OrderStack" component={OrderStack} />
      <Drawer.Screen name="Customer" component={Customer} />
      <Drawer.Screen name="Inventory" component={InventoryScreen} />
      <Drawer.Screen name="Statistics" component={StatisticsScreen} />
    </Drawer.Navigator>
  );
}

const AppContainer = () => {
  return (
    <NavigationContainer onReady={() => BootSplash.hide({ fade: true })}>
      <MyDrawer />
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  drawerHeader: {
    padding: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    backgroundColor: '#F8FAFC',
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  shopName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  shopEmail: {
    fontSize: 14,
    color: '#6B7280',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 16,
    marginVertical: 8,
  },
  menuContainer: {
    paddingHorizontal: 8,
  },
  drawerLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  appVersion: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500',
  },
});

export default AppContainer;
