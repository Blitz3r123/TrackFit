import React from 'react';
import { StyleSheet, Modal, Alert, TouchableHighlight } from 'react-native';
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
    Fab,
    View,
    Card,
    CardItem,
    Body,
    List,
    ListItem
} from 'native-base';

const rnfs = require('react-native-fs');
const path = rnfs.DocumentDirectoryPath;

export default class Home extends React.Component{
    constructor(props){
        super(props);
        // rnfs.unlink(path + '/exercises.json');
        this.handlePress = this.handlePress.bind(this);
        this.state = {
            searchValue: "",
            exercises: []
        };
    }

    componentDidMount(){
        this._unsubscribe = this.props.navigation.addListener('focus', () => {      // Add a listener to refresh list on focus
            rnfs.exists(path + '/exercises.json').then(result => {
                if(result){         // File Exists
                    console.log('retrieving exercises');
                    rnfs.readFile(path + '/exercises.json').then(result => {
                        console.log('file contents:');
                        console.log(result);
                        let exercises = JSON.parse(result);
                        this.setState({ exercises });
                    });
                }else{
                    let exercises = [
                        {
                            name: exerciseName,
                            dates: []
                        }
                    ];
                    rnfs.writeFile(path + '/exercises.json', JSON.stringify(exercises));
                }
            });
        });
    }

    componentWillUnmount(){
        this._unsubscribe();
    }

    UNSAFE_componentWillMount(){
        console.log('home componentWillMount');
        rnfs.exists(path + '/exercises.json').then(result => {
            if(result){         // File Exists
                console.log('exercises.json does exist');
                console.log('reading exercises.json');
                rnfs.readFile(path + '/exercises.json').then(result => {
                    console.log('read exercises.json:');
                    console.log(result);
                    console.log('parsing exercises.json');
                    let exercises = JSON.parse(result);
                    console.log('exercises.json parsed:');
                    console.log(exercises);
                    this.setState({ exercises });
                });
            }else{
                console.log('exercises.json does not exist');
                let exercises = [];
                rnfs.writeFile(path + '/exercises.json', JSON.stringify(exercises));
            }
        });
    }

    handlePress = (key) => {
        console.log('deleting exercise with key ' + key);
        var toDelete = this.state.exercises[key - 1];
        console.log('array without the exercise:');
        let exercises = this.state.exercises.filter(a => a.key != key);
        console.log(exercises);
        console.log('writing array to file');
        rnfs.unlink(path + '/exercises.json');
        rnfs.writeFile(path + '/exercises.json', JSON.stringify(exercises)).then(() => {
            console.log('array written to file');
            this.setState({ exercises });
            console.log('state set to exercises');
            rnfs.readFile(path + '/exercises.json').then(result => {
                console.log('file after being written');
                console.log(result);
            });
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

    render(){
        return (
            <Container>
                <Content>
                    <Form>
                        <Item>
                            <Input 
                                placeholder="Search Exercise" 
                                value={this.state.searchValue}
                                onChangeText={text => this.setState({searchValue: text})}
                                />
                        </Item>
                    </Form>
                    <Button iconRight dark 
                        style={styles.button} 
                        onPress={() => this.props.navigation.navigate("AddExercise")}
                    >
                        <Text>Add Exercise</Text>
                    </Button>
                    <Button iconRight dark 
                        style={styles.button} 
                        onPress={() => this.deleteFile(path + '/exercises.json')}
                    >
                        <Text>Delete exercises.json</Text>
                    </Button>
                    <List>
                    {
                        this.state.exercises.map(exercise => {
                            return (<ListItem key={exercise.key}>
                                        <Text 
                                            onPress={() => {this.handlePress(exercise.key)}} 
                                        >
                                            {exercise.name} (key: {exercise.key})
                                        </Text>
                            </ListItem>)
                        })
                    }
                    </List>
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    button: {
        padding: 10,
        textAlign: "center"
    }
});
