import React from 'react';
import { TextInput, Dimensions, View } from 'react-native';
import { Form, Item, Icon, List, ListItem } from 'native-base';

const rnfs = require('react-native-fs');
const path = rnfs.DocumentDirectoryPath;

import ExerciseListItem from './ExerciseListItem';

export default class SearchBar extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      searchValue: "",
      searchExercises: [],
      exercises: this.props.exercises
    };
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
  
  handleSearch = (searchValue) => {
    this.setState({ searchValue: searchValue });
    
    if(searchValue.length > 0){
      this.readExerciseFile();

      let searchExercises = this.state.exercises.filter(item => {
        return item.name.toUpperCase().includes(searchValue.toUpperCase());
      });

      this.setState({ searchExercises });
    }else{
      this.setState({ searchExercises: [] });
    }

  }

  render(){
    return(
      <View>
      <Form style={{paddingRight: 10}}>
        <Item>
          <Icon name="search"></Icon>
          <TextInput 
            style={{
              width: Dimensions.get('window').width - (Dimensions.get('window').width / 5)
            }}
            placeholder="Search Exercise" 
            value={this.state.searchValue}
            onChangeText={text => this.handleSearch(text)}
            ref={(input) => {this.searchInput = input}}
          />
          <Icon name="close" onPress={() => {
            this.searchInput.clear();
            this.setState({ searchExercises: []});
          }}></Icon>
        </Item>
      </Form>
      <List>
      {
        // SEARCH RESULTS:
        this.state.searchExercises.length == 0 ? null : this.state.searchExercises.map(exercise => {
          return (
            <ExerciseListItem
              forceRender={this.props.forceRender}
              readExerciseFile={this.readExerciseFile}
              exercise={exercise}
              exercises={this.state.exercises} 
              handlePress={this.props.handlePress} 
              navigation={this.props.navigation} 
              style={{
                flex: 1, 
                justifyContent: 'space-between', 
                backgroundColor: '#eee',
                paddingLeft: 10
              }}/>
          )
        })
      }
      </List>
      </View>
    );
  }
}