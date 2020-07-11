import React from 'react';
import {
    Container,
    Header,
    Content,
    Form,
    Item,
    Input,
    Button,
    Icon
} from 'native-base';

const rnfs = require('react-native-fs');
const path = rnfs.DocumentDirectoryPath;

export default class AddExercise extends React.Component{
    constructor(props){
        super(props);
        this.handlePress = this.handlePress.bind(this);
        this.state = {
            searchValue: ""
        };
    }

    handlePress = () => {
        let exerciseName = this.state.searchValue;
        let exercises;

        rnfs.exists(path + '/exercises.json').then(result => {
            if(result){
                console.log('exercises.json does exist');
                console.log('reading file contents');
                rnfs.readFile(path + '/exercises.json').then(result => {
                    console.log('file contents:');
                    console.log(result);
                    console.log('parsing file contents');
                    exercises = JSON.parse(result);
                    console.log('parsed file contents:');
                    console.log(exercises);
                    console.log('creating new exercise');
                    let newExercise = {
                        name: exerciseName,
                        dates: [],
                        key: exercises[exercises.length - 1].key + 1
                    };
                    console.log('new exercise object created:');
                    console.log(newExercise);
                    console.log('pushing new exercise to array');
                    exercises.push(newExercise);
                    console.log('new exercise added:');
                    console.log(exercises);
                    console.log('writing to file');
                    rnfs.writeFile(path + '/exercises.json', JSON.stringify(exercises)).then(err => {
                        if(err){
                            console.log(err);
                        }
                    });
                    console.log('redirecting to home page');
                    this.props.navigation.navigate('Home');
                }).catch(err => {console.log(err)});
            }else{
                console.log('exercises.json does not exist');
                console.log('creating exercises array');
                exercises = [
                    {
                        name: exerciseName,
                        key: 1,
                        dates: []
                    }
                ];
                console.log('exercise array created:');
                console.log(exercises);
                console.log('writing exercises to file');
                rnfs.writeFile(path + '/exercises.json', JSON.stringify(exercises));
                console.log('exercises written to file');
                console.log('redirecting to home page');
                this.props.navigation.navigate('Home');
            }
        });
    }

    render(){
        return (
            <Container>
                <Content>
                    <Form>
                        <Item>
                            <Input placeholder="Enter Exercise Name" value={this.state.searchValue} onChangeText={text => this.setState({searchValue: text})} onSubmitEditing={this.handlePress}/>
                            <Button>
                                <Icon name="add" onPress={this.handlePress}/>
                            </Button>
                        </Item>
                    </Form>
                </Content>
            </Container>
        );
    }
}