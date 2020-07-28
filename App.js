import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer, StackActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Home from './screens/Home';
import ViewExercise from './screens/ViewExercise';
import AddExercise from './screens/AddExercise';

import Header from './components/Header';

const Stack = createStackNavigator();

export default class App extends React.Component {
  render(){
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          
          <Stack.Screen 
            name="Home" 
            component={Home} 
            options={{
              headerTitle: props => <Header {...props} />
            }}
          />

          <Stack.Screen 
            name="ViewExercise" 
            component={ViewExercise} 
            options={
              ({ route }) => ({ title: route.params.exercise.name })
            }
          />
          
          <Stack.Screen 
            name="AddExercise" 
            component={AddExercise} 
          />

        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
