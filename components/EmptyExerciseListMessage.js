import React from 'react';
import { StyleSheet, Text, View, Alert, Image, Dimensions } from 'react-native';

export default class EmptyExerciseListMessage extends React.Component {
  render(){
    return (
			<View>
        <Image 
          style={{
            flex: 1, 
            resizeMode: 'contain', 
            position: 'absolute', 
            width: '100%', 
            height: '75%'
          }}
          source={{ uri: 'https://image.freepik.com/free-vector/exercice_53876-59978.jpg' }}
        />
          <View 
            style={{ 
              height: Dimensions.get('window').height/2, 
              alignItems: 'center', 
              justifyContent: 'center',
              padding: 50,
              marginTop: Dimensions.get('window').height/4
            }}
          >
            <Text style={{
              color: '#aaa',
              textAlign: 'center',
              fontSize: 16
            }}>
              Looks like you don't have any exercises, why not add some using the menu button below?
            </Text>
          </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({});
