import React from 'react';
import { StyleSheet, Alert, Dimensions, YellowBox, TextInput, Image, ScrollView } from 'react-native';
import {
  Container,
  Header,
  Content,
  Form,
  Item,
  Input,
  Button,
  Icon,
  Text,
  View,
  List,
  ListItem,
  Fab
} from 'native-base';

import ExerciseListItem from '../components/ExerciseListItem';
import EmptyExerciseListMessage from '../components/EmptyExerciseListMessage';
import SearchBar from './../components/SearchBar';

const rnfs = require('react-native-fs');
const path = rnfs.DocumentDirectoryPath;

export default class Home extends React.Component{
  constructor(props){
    super(props);
    // rnfs.unlink(path + '/exercises.json');
    this.handlePress = this.handlePress.bind(this);
    this.readExerciseFile = this.readExerciseFile.bind(this);
    this.state = {
      searchValue: "",
      exercises: [],
      active: false,
      searchExercises: []
    };
  }

  forceRender = () => {
    this.setState({active: false});
    this.readExerciseFile();
  }

  componentDidMount(){
    YellowBox.ignoreWarnings(['Animated: `useNativeDriver`']);
    this._unsubscribe = this.props.navigation.addListener('focus', () => {      // Add a listener to refresh list on focus
      rnfs.exists(path + '/exercises.json').then(result => {
        if(result){         // File Exists
          // console.log('retrieving exercises');
          rnfs.readFile(path + '/exercises.json').then(result => {
            // console.log('file contents:');
            // console.log(result);
            let exercises = JSON.parse(result);
            this.setState({ exercises });
          });
        }else{
          let exercises = [];
          rnfs.writeFile(path + '/exercises.json', JSON.stringify(exercises));
        }
      });
    });
  }

  componentWillUnmount(){
    this._unsubscribe();
  }

  readExerciseFile = () => {
    rnfs.exists(path + '/exercises.json').then(result => {
      if(result){
        rnfs.readFile(path + '/exercises.json').then(result => {
          this.setState({ exercises: JSON.parse(result) });
        });
      }
    });
  }

  UNSAFE_componentWillMount(){
    rnfs.exists(path + '/exercises.json').then(result => {
      if(result){         // File Exists
        rnfs.readFile(path + '/exercises.json').then(result => {
          let exercises = JSON.parse(result);
          this.setState({ exercises });
        });
      }else{
        let exercises = [];
        rnfs.writeFile(path + '/exercises.json', JSON.stringify(exercises));
      }
    });
  }

  handlePress = (key) => {
      // console.log('deleting exercise with key ' + key);
      var toDelete = this.state.exercises[key - 1];
      // console.log('array without the exercise:');
      let exercises = this.state.exercises.filter(a => a.key != key);
      // console.log(exercises);
      // console.log('writing array to file');
      rnfs.unlink(path + '/exercises.json');
      rnfs.writeFile(path + '/exercises.json', JSON.stringify(exercises)).then(() => {
        // console.log('array written to file');
        this.setState({ exercises });
        this.setState({ searchExercises: [] });
        this.setState({ searchValue: '' });
        // console.log('state set to exercises');
      }).catch(err => {console.log(err)});

  }

  deleteFile = (file) => {
    rnfs.exists(file).then((exists) => {
      if(exists){
        rnfs.unlink(file).then( () => {
          console.log(`${file} deleted.`);
          this.setState({ exercises: [] });
        });
      }else{
        console.log('exercises.json does not exist.');
      }
    });
  }

  handleSearch = (text) => {
    this.setState({searchValue: text});
    
    let results = this.state.exercises.filter(a => a.name.toUpperCase().includes(text.toUpperCase()));
    
    if(results.length == 0 || results.length == this.state.exercises.length){
      this.setState({searchExercises: []});
    }else{
      this.setState({ searchExercises: results });
    }
  }

  render(){
    return (
      <Container>
        <Content>
          <ScrollView style={styles.view}>
            <SearchBar 
              handlePress={this.handlePress}
              navigation={this.props.navigation}
              forceRender={this.forceRender}
              exercises={this.state.exercises}
            />
            <List>
            {
              this.state.exercises.length == 0 ? 
                <EmptyExerciseListMessage /> : null
            }
            {
              this.state.exercises.map(exercise => {
                return (
                  <ExerciseListItem 
                    forceRender={this.forceRender}
                    key={exercise.key}
                    exercise={exercise} 
                    exercises={this.state.exercises} 
                    handlePress={this.handlePress} 
                    navigation={this.props.navigation} 
                    style={{
                      flex: 1, 
                      justifyContent: 'space-between', 
                      paddingLeft: 10,
                      paddingTop: 10,
                      paddingBottom: 10
                  }}/>);
              })
            }
            </List>
          </ScrollView>
          <Fab
            active={this.state.active}
            direction="left"
            style={{ backgroundColor: '#5067FF' }}
            position="bottomRight"
            onPress={() => this.setState({ active: !this.state.active })}
          >
            <Icon name="md-menu" />
            <Button 
              style={{ backgroundColor: '#DD5144' }} 
              onPress={
                () => {
                  Alert.alert(
                    "Confirm Delete",
                    "Are you sure you want to delete ALL exercises?",
                    [
                      {
                        text: 'Wait. What?! No!',
                        onPress: () => {console.log('cancelled')}
                      },
                      {
                        text: `Yes. I hate exercises.`,
                        onPress: () => {this.deleteFile(path + '/exercises.json')}
                      }
                    ],
                    { cancelable: true }
                  );
                } 
              }
            >
              <Icon name="trash" />
            </Button>
            <Button onPress={() => this.props.navigation.navigate('AddExercise')}>
                <Icon name="add" />
            </Button>
          </Fab>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
    button: {
        padding: 10,
        textAlign: "center"
    },
    view: {
        height: Dimensions.get('window').height - 80
    }
});
