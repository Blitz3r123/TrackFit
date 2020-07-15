import React from 'react';
import {
    Container,
    Header,
    Form,
    Item,
    Content,
    Input,
    Icon,
    Button,
    CardItem,
    Card,
    Body,
    List,
    ListItem,
    Fab
} from 'native-base';
import { Text, Dimensions, StyleSheet, View, TextInput, Alert } from 'react-native';
import { clockRunning } from 'react-native-reanimated';

const rnfs = require('react-native-fs');
const path = rnfs.DocumentDirectoryPath + '/exercises.json';

export default class ViewExercise extends React.Component{
    
    constructor(props){
        super(props);
        
        this.handleSubmit = this.handleSubmit.bind(this);

        // Check if exercise was passed through - if not redirect to home
        if(this.props.route.params.exercise == undefined){
            this.props.navigation.navigate('Home');
        }

        this.state = {
            repValue: '',
            weightValue: '',
            unitValue: '',
            exercise: this.props.route.params.exercise,
            active: false
        };
        
        this.orderDates();
    }

    UNSAFE_componentWillUpdate(){
        this.orderDates();
    }

    handleRepInput = (value, type) => {
        if(type == 'rep'){
            this.setState({ repValue: value });
        }else if(type == 'weight'){
            this.setState({ weightValue: value });
            
        }else if(type == 'unit'){
            this.setState({ unitValue: value });

        }
    }

    // Formats dates into dd/mm/yyy format
    formatDate = (dateObj) => {
        let dd = String(dateObj.getDate()).padStart(2, '0');
        let mm = String(dateObj.getMonth() + 1).padStart(2, '0'); //January is 0!
        let yyyy = dateObj.getFullYear();

        let formattedDate = dd + '/' + mm + '/' + yyyy;
        return formattedDate;
    }

    unformatDate = (dateString) => {
        let seperated = dateString.split('/');
        let dd = seperated[0];
        let mm = seperated[1];
        let yyyy = seperated[2];

        return mm + '/' + dd + '/' + yyyy;
    }

    handleSubmit = () => {
        let { repValue, weightValue, unitValue } = this.state;
        let dateValue = this.formatDate(new Date());
        // let dateValue = "12/07/2020";
        let exercise = this.state.exercise;

        if(repValue == '' || weightValue == '' || unitValue == ''){
            Alert.alert(
                "",
                "Come on... Don't leave the boxes empty...",
                [
                    {
                        text: 'Ok...',
                        onPress: () => {console.log('cancelled')}
                    }
                ],
                { cancelable: true }
            );
        }else{
            let dateItem = {
                key: 0,
                rep: repValue,
                weight: weightValue,
                unit: unitValue
            };
    
            /* 
                1. Look for date in exercise object
                2. If date not found
                    2.1 Create new date obj with date: ... and items: []
                    2.2 Push new date obj to exercise.dates
                    2.3 Create new item object with rep, set and unit values
                    2.4 Push new item object to exercise.dates[0].items
                3. If date found
                    3.1 Create new item object with rep, set and unit values
                    3.2 Find index of date which would be exercise.dates[need_to_find_index]
                    3.3 Push new item object to exercise.dates[need_to_find_index]
            */
            // Date not found
            let dateExists = exercise.dates.filter(a => { return a.date == dateValue}).length > 0;

            if(!dateExists){
                let dateObj = {
                    date: dateValue,
                    items: []
                };
    
                dateItem.key = 1;
                dateObj.items.push(dateItem);
                exercise.dates.push(dateObj);
                this.setState({ exercise });
            }else{
                let dateObj = exercise.dates.filter(a => a.date == dateValue)[0];
    
                /*
                    dateObj looks like:
                    {
                        "date": "...",
                        "items": [
                            {
                                "key": "...",
                                "rep": "...",
                                "unit": "...",
                                "weight": "..."
                            }
                        ]
                    }
                */
                if(dateObj.items.length > 0){
                    dateItem.key = dateObj.items[dateObj.items.length - 1].key + 1;
                }else{
                    dateItem.key = 1;
                }
    
                dateObj.items.push(dateItem);
    
                this.setState({ exercise });
            }
    
            this.setState({
                repValue: '',
                weightValue: '',
            });
    
            let exercises = this.props.route.params.exercises;
    
            exercises = exercises.filter(a => {
                return a.name != this.state.exercise.name
            });
    
            exercises.push(exercise);
    
            // Write new exercise to file
            rnfs.writeFile(path, JSON.stringify(exercises))
                .then(() => {
                    console.log('File updated.');
                })
                .catch(err => {
                    console.log(err)
                });
        }
    }

    deleteDate = (date) => {
        let exercise = this.state.exercise;
        let dates = exercise.dates;

        dates = dates.filter(a => {
            return a.date != date;
        });

        exercise.dates = dates;

        this.setState({ exercise });
    }

    deleteItem = (date, key) => {
        /*
            Exercise:
            {
                name: ...,
                key: ...,
                dates: []
            }

            Dates: 
            [
                {
                    date: ...,
                    items: [
                        {
                            key: ...,
                            rep: ...,
                            weight: ...,
                            unit: ...
                        }
                    ]
                }
            ]
        */
        /*
            1. Get the exercise obj
            2. Create new dates array without needed date
            3. Create new date object and remove the item from it
            4. Push new date obj to dates
            5. Put dates array in exercise obj
        */
       let exercise = this.state.exercise;
       let datesWithMissing = exercise.dates.filter(a => {
           return a.date != date;
       });

       let dateObj = exercise.dates.filter(a => {return a.date == date})[0];

       let newItems = dateObj.items.filter(a => {return a.key != key});

       dateObj.items = newItems;

       datesWithMissing.push(dateObj);
       exercise.dates = datesWithMissing;

       this.setState({ exercise });

       let exercises = this.props.route.params.exercises;
    
        exercises = exercises.filter(a => {
            return a.name != this.state.exercise.name
        });

        exercises.push(exercise);

        // Write new exercise to file
        rnfs.writeFile(path, JSON.stringify(exercises))
            .then(() => {
                console.log('File updated.');
            })
            .catch(err => {
                console.log(err)
            });
    }

    orderDates = () => {
        this.state.exercise.dates.sort((a,b) => {
            a = new Date(this.unformatDate(a.date));
            b = new Date(this.unformatDate(b.date));
            return b - a;
        })
    }

    render(){
        return (
            <Container>
                <Content>
                    <View>
                        <Form style={styles.form}>
                            <TextInput 
                                keyboardType='numeric' 
                                style={styles.input} 
                                placeholder='Rep'
                                value={this.state.repValue}
                                returnKeyType='next'
                                autoFocus={true}
                                onSubmitEditing={() => {this.weightInput.focus();}}
                                blurOnSubmit={false}
                                onChangeText={text => {this.handleRepInput(text, 'rep')}}
                            ></TextInput>

                            <Icon name="close" style={styles.x}></Icon>

                            <TextInput 
                                style={styles.input} 
                                placeholder='Weight'
                                value={this.state.weightValue}
                                returnKeyType='next'
                                ref={input => {this.weightInput = input;}}
                                onChangeText={text => {this.handleRepInput(text, 'weight')}}
                                onSubmitEditing={() => {this.unitInput.focus();}}
                                blurOnSubmit={false}
                                keyboardType='numeric'
                            ></TextInput>

                            <TextInput 
                                style={styles.input} 
                                placeholder='Unit'
                                value={this.state.unitValue}
                                onChangeText={text => {this.handleRepInput(text, 'unit')}}
                                ref={input => {this.unitInput = input;}}
                                onSubmitEditing={() => {this.handleSubmit()}}
                            ></TextInput>

                            <Button 
                                primary 
                                style={{marginRight: 10}} 
                                onPress={() => {this.handleSubmit()}}
                            >
                                <Icon name="add"></Icon>
                            </Button>
                        </Form>
                        <View style={styles.example}>
                            <Text style={{fontWeight: 'bold', color: '#aaa'}}>Example: 12 x 60Kg, 45 x 1 Min</Text>
                        </View>
                        <View style={styles.cardList}>
                        {
                            this.state.exercise.dates.map(date => {
                                return (
                                    <Card key={date.key}>
                                        <CardItem header style={{flex: 1, justifyContent: 'space-between'}}>
                                            <Text style={{fontSize: 14, fontWeight: 'bold'}}>{date.date}</Text>
                                            <Icon 
                                                name="trash"
                                                style={{
                                                    color: '#aaa'
                                                }}
                                                onPress={() => {
                                                    Alert.alert(
                                                        "Confirm Delete",
                                                        "Are you sure you want to delete ALL exercises on " +date.date+ "?",
                                                        [
                                                            {
                                                                text: 'Wait. What?! No!',
                                                                onPress: () => {console.log('cancelled')}
                                                            },
                                                            {
                                                                text: `Yes. I did not do anything on ${date.date}.`,
                                                                onPress: () => {
                                                                    this.deleteDate(date.date)
                                                                }
                                                            }
                                                        ],
                                                        { cancelable: true }
                                                    );
                                                }}
                                            ></Icon>
                                        </CardItem>
                                        <CardItem style={{paddingTop: 0, paddingLeft: 0, marginTop: -20}}>
                                            <List style={styles.list}>
                                            {
                                                date.items.reverse().map(item => {
                                                    return (
                                                        <ListItem style={{flex: 1, justifyContent: 'space-between'}}>
                                                            <Text style={{fontSize: 14}}>
                                                                {item.rep} x {item.weight} {item.unit}
                                                            </Text>
                                                            <Icon 
                                                                name="trash"
                                                                style={{
                                                                    color: '#ccc',
                                                                    fontSize: 20
                                                                }}
                                                                onPress={() => {
                                                                    
                                                                    Alert.alert(
                                                                        "",
                                                                        "You sure?",
                                                                        [
                                                                            {
                                                                                text: 'No.',
                                                                                onPress: () => {console.log('cancelled')}
                                                                            }, 
                                                                            {
                                                                                text: 'Yep.',
                                                                                onPress: () => {
                                                                                    this.deleteItem(date.date, item.key)
                                                                                }
                                                                            }
                                                                        ],
                                                                        { cancelable: true }
                                                                    );

                                                                }}
                                                            >
                                                            </Icon>
                                                        </ListItem>
                                                    );
                                                })
                                            }
                                            </List>
                                        </CardItem>
                                    </Card>
                                );
                            })
                        }
                        </View>
                    </View>
                </Content>
            </Container>
        );
    }
}

let styles = StyleSheet.create({
    form: {
        flex: 1, 
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 20,
        marginLeft: 5
    },
    input: {
        borderColor: '#eee',
        paddingTop: 10,
        backgroundColor: '#efefef',
        marginLeft: 10,
        marginRight: 10,
        width: Dimensions.get('window').width / 5
    },
    x: {
        paddingTop: 15,
        marginRight: 10,
        marginLeft: 10,
        fontSize: 22
    },
    example: {
        width: Dimensions.get('window').width,
        borderBottomColor: '#eee',
        borderBottomWidth: 2,
        paddingBottom: 10,
        marginTop: 10,
        marginLeft: 15,
    },
    cardList: {},
    list: {
        width: 100 + '%'
    }
});