import React from 'react';
import { StyleSheet, Text, View, Alert, TextInput } from 'react-native';
import {
	ListItem,
	Icon
} from 'native-base';

const rnfs = require('react-native-fs');
const path = rnfs.DocumentDirectoryPath + '/exercises.json';

export default class ExerciseListItem extends React.Component {
	
	constructor(props){
		super(props);
		this.state = {
			editToggle: true,
			editKey: '',
			editValue: ''
		};
	}

	toggleEdit = (key) => {
		this.state.editKey == key ? this.resetEdit() : this.setState({ editKey: key, editToggle: true });
	}

	resetEdit = () => {
		this.setState({
			editToggle: false,
			editKey: '',
			editValue: ''
		});
	}

	editExercise = () => {
		let oldExercise = this.props.exercises.filter(a => {
			return a.key == this.state.editKey;
		})[0];

		// Create new exercise
		let newExercise = {
			key: this.state.editKey,
			name: this.state.editValue,
			dates: oldExercise.dates
		};

		let exercises = this.props.exercises;
		// Remove old item from array
		let newExercises = exercises.filter(a => {
			return a.key != this.state.editKey
		});

		// Place new exercise in array
		newExercises.push(newExercise);

		newExercises = newExercises.sort((a, b) => {
			return a.key - b.key;
		});

		// Write new array to file
		console.log(path);
		rnfs.exists(path)
		.then((exists) => {
			if(exists){
				
				rnfs.unlink(path).then(() => {
					rnfs.writeFile( path, JSON.stringify(newExercises) ).then(success => {
						this.resetEdit();
						this.props.readExerciseFile;
						this.props.forceRender();
					}).catch(err => console.log('writeFile error: ' + err.message));
				}).catch(err => console.log('unlink error: ' + err.message));

			}else{
				console.log(path + " doesn't exist.");
			}
		})
		.catch(err => {console.log('exists error:' + err.message);});
	}

	render(){
    return (
			<ListItem 
				style={this.props.style} 
				key={this.props.exercise.key}
				onPress={() => {
					this.props.navigation.navigate('ViewExercise', {
						exercise: this.props.exercise,
						exercises: this.props.exercises
					});
				}}
			>
				{
					this.state.editToggle && this.props.exercise.key == this.state.editKey ? 
						<TextInput 
							style={styles.input} 
							value={this.state.editValue}
							autoFocus={true}
							onChangeText={val => { this.setState({ editValue: val }) }}
							onFocus={() => { this.setState({ editValue: this.props.exercise.name }) }}
							onPress={() => {
								this.editExercise()
							}}
							onSubmitEditing={() => {
								this.editExercise()
							}}
						></TextInput>
						: 
						<Text style={styles.exerciseText}>

							{this.props.exercise.name}

						</Text>
				}
				<View style={styles.icons}>
					{
						this.state.editToggle && this.props.exercise.key == this.state.editKey ? 
						<Icon 
							style={{...styles.icon, marginRight: 20, color: 'green'}} 
							name="md-checkmark"
							onPress={() => this.editExercise(this.props.exercise.key)}
						></Icon> 
						: 
						<Icon 
							style={{...styles.icon, marginRight: 20}} 
							name="create"
							onPress={() => this.toggleEdit(this.props.exercise.key)}
						></Icon>
					}
					<Icon 
						onPress={
							() => {
								Alert.alert(
									"Confirm Delete",
									`Are you sure you want to delete ${this.props.exercise.name}?`,
									[
										{
											text: 'What?! No!',
											onPress: () => {console.log('cancelled')}
										},
										{
											text: `Yes. I don't want to see ${this.props.exercise.name} ever again.`,
											onPress: () => {this.props.handlePress(this.props.exercise.key)}
										}
									],
									{ cancelable: true }
								);
							} 
						}
						style={{ ...styles.icon }} 
						name="md-trash"
					></Icon>
				</View>
			</ListItem>
    );
  }
}

const styles = StyleSheet.create({
	exerciseText: {
		color: 'black',
		fontSize: 16
	},
	icons: {
		display: 'flex',
		width: '20%',
		justifyContent: 'space-evenly',
		flexDirection: 'row',
		marginRight: 10
	},
	icon: {
		color: '#bbb',
		fontWeight: 'normal'
	},
	input: {
		backgroundColor: '#eee', 
		width: '50%'
	}
});
