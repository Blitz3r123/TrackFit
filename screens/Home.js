import React from 'react';
import { StyleSheet, Alert, Dimensions, YellowBox, Modal } from 'react-native';
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
    Card,
    CardItem,
    Body,
    List,
    ListItem,
    Fab
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
            exercises: [],
            active: false,
            searchExercises: []
        };
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
        // console.log('home componentWillMount');
        rnfs.exists(path + '/exercises.json').then(result => {
            if(result){         // File Exists
                // console.log('exercises.json does exist');
                // console.log('reading exercises.json');
                rnfs.readFile(path + '/exercises.json').then(result => {
                    // console.log('read exercises.json:');
                    // console.log(result);
                    // console.log('parsing exercises.json');
                    let exercises = JSON.parse(result);
                    // console.log('exercises.json parsed:');
                    // console.log(exercises);
                    this.setState({ exercises });
                });
            }else{
                // console.log('exercises.json does not exist');
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
        // console.log('searching for "' + text + '":');
        this.setState({searchValue: text});
        let results = this.state.exercises.filter(a => a.name.toUpperCase().includes(text.toUpperCase()));
        if(results.length == 0 || results.length == this.state.exercises.length){
            this.setState({searchExercises: []});
        }else{
            this.setState({ searchExercises: results });
        }

        // console.log('searchExercises:');
        console.log(this.state.searchExercises);
    }

    render(){
        return (
            <Container>
                <Content>
                    <View style={styles.view}>
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
                                    // this.deleteFile(path + '/exercises.json');
                                } 
                            }
                        >
                            <Icon name="trash" />
                        </Button>
                        <Button onPress={() => this.props.navigation.navigate('AddExercise')}>
                            <Icon name="add" />
                        </Button>
                    </Fab>
                        <Form>
                            <Item>
                                <Input 
                                    placeholder="Search Exercise" 
                                    value={this.state.searchValue}
                                    onChangeText={text => this.handleSearch(text)}
                                    />
                            </Item>
                        </Form>
                        {/* <Button iconRight dark 
                            style={styles.button} 
                            onPress={() => this.props.navigation.navigate("AddExercise")}
                        >
                            <Text>Add Exercise</Text>
                        </Button> */}
                        <List>
                        {
                            // SEARCH RESULTS:
                            this.state.searchExercises.length == 0 ? console.log('no search results') : this.state.searchExercises.map(exercise => {
                                return (
                                        <ListItem 
                                            style={{
                                                flex: 1, 
                                                justifyContent: 'space-between', 
                                                paddingTop: 20, 
                                                paddingBottom: 20, 
                                                paddingLeft: 10, 
                                                paddingRight: 10, 
                                                backgroundColor: '#6ffcd2'
                                            }} 
                                            key={exercise.key}
                                        >
                                            <Text>
                                                {exercise.name}
                                            </Text>
                                            <Icon 
                                                onPress={
                                                    () => {
                                                        Alert.alert(
                                                            "Confirm Delete",
                                                            `Are you sure you want to delete ${exercise.name}?`,
                                                            [
                                                                {
                                                                    text: 'Wait. What?! No!',
                                                                    onPress: () => {console.log('cancelled')}
                                                                },
                                                                {
                                                                    text: `Yes. I don't want to see ${exercise.name} ever again.`,
                                                                    onPress: () => {this.handlePress(exercise.key)}
                                                                }
                                                            ],
                                                            { cancelable: true }
                                                        );
                                                    } 
                                                }
                                                style={{ color: 'grey' }} 
                                                name="md-trash"
                                            ></Icon>
                                </ListItem>)
                            })
                        }
                        </List>
                        <List>
                        {
                            this.state.exercises.map(exercise => {
                                return (
                                        <ListItem 
                                            style={{
                                                flex: 1, 
                                                justifyContent: 'space-between', 
                                                paddingTop: 20, 
                                                paddingBottom: 20, 
                                                paddingLeft: 10, 
                                                paddingRight: 15
                                            }} 
                                            key={exercise.key}
                                        >
                                            <Text onPress={() => {
                                                this.props.navigation.navigate('ViewExercise', {
                                                    exercise: exercise,
                                                    exercises: this.state.exercises
                                                });
                                            }}>
                                                {exercise.name}
                                            </Text>
                                            <Icon 
                                                onPress={
                                                    () => {
                                                        Alert.alert(
                                                            "Confirm Delete",
                                                            `Are you sure you want to delete ${exercise.name}?`,
                                                            [
                                                                {
                                                                    text: 'Wait. What?! No!',
                                                                    onPress: () => {console.log('cancelled')}
                                                                },
                                                                {
                                                                    text: `Yes. I don't want to see ${exercise.name} ever again.`,
                                                                    onPress: () => {this.handlePress(exercise.key)}
                                                                }
                                                            ],
                                                            { cancelable: true }
                                                        );
                                                    } 
                                                }
                                                style={{ color: 'grey' }} 
                                                name="md-trash"
                                            ></Icon>
                                </ListItem>)
                            })
                        }
                        </List>
                    </View>
                    {/* <Button iconRight dark 
                        style={styles.button} 
                        onPress={() => this.deleteFile(path + '/exercises.json')}
                    >
                        <Text>Delete exercises.json</Text>
                    </Button> */}
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
