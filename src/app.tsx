import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import AppContainer from './navigation/app-container'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RealmProvider } from '@realm/react';
import { schemas } from './utils/realm';
type Props = {}

const App = (props: Props) => {
  return (
        <SafeAreaProvider>
            <GestureHandlerRootView style={styles.root}>
                <RealmProvider schema={schemas}>
                        <AppContainer/>
                </RealmProvider>
            </GestureHandlerRootView>
        </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

export default App