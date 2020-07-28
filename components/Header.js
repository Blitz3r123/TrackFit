import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default class Header extends React.Component {
  render(){
    return (
        <View style={styles.background}>
            <Text style={styles.text}>TrackFit</Text>
        </View>
    );
  }
}

const styles = StyleSheet.create({
    background: {
        margin: 0
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#3e41e0',
        textAlign: 'center'
    }
});
