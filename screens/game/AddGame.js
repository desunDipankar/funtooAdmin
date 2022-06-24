import React from "react";
import {
	View,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	ScrollView,
	Alert,
	Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import Colors from "../../config/colors";
import { Header, Dropdown } from "../../components";
import { getFileData } from "../../utils/Util";
import AwesomeAlert from 'react-native-awesome-alerts';
import { add_game, CheckGamePriorityOrderForAdd } from "../../services/GameApiService";
import { getCategory, getSubCategory } from "../../services/APIServices";
import { PriorityList } from "../../services/PriorityService";

import OverlayLoader from "../../components/OverlayLoader";
export default class AddGame extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			imageURI: undefined,
			imageData: undefined,
			categoryID: this.props.route.params?.cat.id ?? undefined,
			categoryName: this.props.route.params?.cat.name ?? undefined,
			subCategoryID: this.props.route.params?.sub_cat.id ?? undefined,
			subCategoryName: this.props.route.params?.sub_cat.name ?? undefined,
			priority_id:"",
			priority_name:"",
			gameTitle: "",
			price: "",
			description: "",
			instruction: "",
			size: "",
			quantity:"",
			number_of_staff:"",
			ordering:"",
			isLoading: false,
			categories: [],
			subCategories: [],
			prioritys:[],
			showAlertModal: false,
			alertMessage: "Please Wait.....",
			alertType: 'Error',
			isGameOrderPriorityAlertVisible: false,
			gameOrderPriorityUpdateErrorMessage: '',
			matchedAlreadyExistGame: null
		};
	}

	componentDidMount = () => {
		this.getCategorys();
		this.PriorityList();
	}

	getCategorys() {
		this.setState({
			isLoading: true
		});

		Promise.all([getCategory(),getSubCategory(this.state.categoryID)])
		.then(res => {
			this.setState({
				isLoading: false,
				categories:res[0].data,
				subCategories:res[1].data,
			});

		}).catch((error) => {
			Alert.alert("Server Error", error.message);
		})
	}

	getSubCategorys(id) {
		this.setState({
			isLoading:true
		})
		getSubCategory(id).then(res => {
			this.setState({
				subCategories:res.data,
				isLoading:false
			});

		}).catch((error) => {
			Alert.alert("Server Error", error.message);
		})
	}

	PriorityList() {
		this.setState({
			isLoading:true
		})
		PriorityList().then(res => {
			this.setState({
				prioritys:res.data,
				isLoading:false
			});

		}).catch((error) => {
			Alert.alert("Server Error", error.message);
		})
	}

	showAlert = () => {
		this.setState({
			showAlertModal: true
		});
	};
	
	hideAlert = () => {
		this.setState({
			showAlertModal: false
		});
		this.gotoBack();
	};

	chooseIcon = () => {
		ImagePicker.requestMediaLibraryPermissionsAsync().then((status) => {
			if (status.granted) {
				this.setState({
					imageURI: undefined,
					imageData: undefined,
				});

				let optins = {
					mediaTypes: ImagePicker.MediaTypeOptions.Images,
					allowsEditing: true,
					aspect: [1, 1],
					quality: 1,
				};

				ImagePicker.launchImageLibraryAsync(optins).then((result) => {
					if (!result.cancelled) {
						this.setState({
							imageURI: result.uri,
							imageData: getFileData(result),
						});
					}
				});
			} else {
				Alert.alert("Warning", "Please allow permission to choose an icon");
			}
		});
	};

	setCategory = (v) => {
		this.setState({
			categoryID: v.id,
			categoryName: v.name,
			subCategoryID: '',
			subCategoryName: '',
		});
		this.getSubCategorys(v.id)
	};

	setSubCategory = (v) => {
		this.setState({
			subCategoryID: v.id,
			subCategoryName: v.name,
		});
	};

	setPriority = (v) => {
		this.setState({
			priority_id: v.id,
			priority_name: v.name,
		});
	};

	createGame = () => {

		let model = {
			name: this.state.gameTitle,
			game_slug: this.state.gameTitle,
			description: this.state.description,
			instruction: this.state.instruction,
			rent: this.state.price,
			size: this.state.size,
			video_link: "",
			parent_cat_id: this.state.categoryID,
			child_cat_id: this.state.subCategoryID,
			image: this.state.imageData,
			priority_id:this.state.priority_id,
			quantity:this.state.quantity,
			number_of_staff:this.state.number_of_staff,
			ordering:this.state.ordering
		}

		this.setState({
			isLoading: true
		});

		CheckGamePriorityOrderForAdd(this.state.ordering, this.state.priority_id)
		.then( (result) => {
			this.setState({
				isLoading: false
			});

			if(result.is_success) {
				this.setState({
					isLoading: true
				}, () => {
					// all set create the game
					add_game(model).then(res => {
						this.setState({
							isLoading: false
						});

						if(res.is_success){
							this.setState({
								showAlertModal: true,
								alertType: 'Success',
								alertMessage: res.message,
								gameTitle: '',
								description: '',
								instruction: '',
								price: '',
								size: '',
								video_link: "",
								parent_cat_id: '',
								child_cat_id: '',
								imageURI: undefined,
								imageData: undefined,
							});
						}else{
							this.setState({
								showAlertModal: true,
								alertType: 'Error',
								alertMessage: res.message
							});
						}
					}).catch((error) => {
						Alert.alert("Server Error", error.message);
					});
				});
			} else {
				// means another game already exist with this current priority
				const errorMsg = result.message + '. Do you want to edit the game first?'
				this.setState({
					isGameOrderPriorityAlertVisible: true,
					alertType: 'Error',
					gameOrderPriorityUpdateErrorMessage: errorMsg,
					matchedAlreadyExistGame: result.matched_game_data
				});
			}
		}).catch( (err) => {
			this.setState({
				showAlertModal: true,
				alertType: 'Error',
				alertMessage: 'Server Error. Please try again leter'
			});
		});
	}

	gotoBack = () => this.props.navigation.goBack();

	render = () => {
		const { isLoading } = this.state;
		if (isLoading) {
			return (
				<OverlayLoader />
			)
		}
		return (
			<View style={styles.container}>
				<Header title="Create New Game" />
				<View style={styles.form}>
					<ScrollView showsVerticalScrollIndicator={false}>
						<View style={styles.iconPickerContainer}>
							<Text style={styles.inputLable}>Choose Icon</Text>
							<TouchableOpacity
								activeOpacity={1}
								style={styles.imageContainer}
								onPress={this.chooseIcon}
							>
								{typeof this.state.imageURI !== "undefined" ? (
									<Image
										style={styles.image}
										source={{ uri: this.state.imageURI }}
									/>
								) : (
									<Ionicons name="image" color={Colors.lightGrey} size={40} />
								)}
							</TouchableOpacity>
						</View>

						<View style={styles.inputContainer}>
							<Text style={styles.inputLable}>Category:</Text>
							<Dropdown
								placeholder="Select Category Name"
								value={this.state.categoryName}
								items={this.state.categories}
								onChange={this.setCategory}
								style={styles.textInput}
							/>
						</View>

						<View style={styles.inputContainer}>
							<Text style={styles.inputLable}>Sub Category:</Text>
							<Dropdown
								placeholder="Select Sub Category Name"
								value={this.state.subCategoryName}
								items={this.state.subCategories}
								onChange={this.setSubCategory}
								style={styles.textInput}
							/>
						</View>

						<View style={styles.inputContainer}>
							<Text style={styles.inputLable}>Priority:</Text>
							<Dropdown
								placeholder="Priority"
								value={this.state.priority_name}
								items={this.state.prioritys}
								onChange={this.setPriority}
								style={styles.textInput}
							/>
						</View>

						<View style={styles.inputContainer}>
							<Text style={styles.inputLable}>Ordering:</Text>
							<TextInput
								value={this.state.ordering}
								autoCompleteType="off"
								keyboardType="numeric"
								//autoCapitalize="words"
								style={styles.textInput}
								onChangeText={(ordering) => this.setState({ ordering })}
							/>
						</View>

						<View style={styles.inputContainer}>
							<Text style={styles.inputLable}>Game Title:</Text>
							<TextInput
								value={this.state.gameTitle}
								autoCompleteType="off"
								autoCapitalize="words"
								style={styles.textInput}
								onChangeText={(gameTitle) => this.setState({ gameTitle })}
							/>
						</View>

						<View style={styles.inputContainer}>
							<Text style={styles.inputLable}>Quantity:</Text>
							<TextInput
								value={this.state.quantity}
								autoCompleteType="off"
								keyboardType="numeric"
								//autoCapitalize="words"
								style={styles.textInput}
								onChangeText={(quantity) => this.setState({ quantity })}
							/>
						</View>

						<View style={styles.inputContainer}>
							<Text style={styles.inputLable}>Number Of Staff:</Text>
							<TextInput
								value={this.state.number_of_staff}
								keyboardType="numeric"
								autoCompleteType="off"
								//autoCapitalize="words"
								style={styles.textInput}
								onChangeText={(number_of_staff) => this.setState({ number_of_staff })}
							/>
						</View>


						<View style={styles.inputContainer}>
							<Text style={styles.inputLable}>Price:</Text>
							<TextInput
								value={this.state.price}
								autoCompleteType="off"
								keyboardType="numeric"
								//autoCapitalize="words"
								style={styles.textInput}
								onChangeText={(price) => this.setState({ price })}
							/>
						</View>

						<View style={styles.inputContainer}>
							<Text style={styles.inputLable}>Size:</Text>
							<TextInput
								value={this.state.size}
								autoCompleteType="off"
								autoCapitalize="words"
								style={styles.textInput}
								onChangeText={(size) => this.setState({ size })}
							/>
						</View>

						<View style={[styles.inputContainer, { marginTop: 10 }]}>
							<Text style={styles.inputLable}>Description:</Text>
							<TextInput
								multiline={true}
								numberOfLines={5}
								autoCompleteType="off"
								autoCapitalize="words"
								style={[styles.textInput, { textAlignVertical: "top" }]}
								value={this.state.description}
								onChangeText={(description) => this.setState({ description })}
							/>
						</View>

						<View style={[styles.inputContainer, { marginTop: 10 }]}>
							<Text style={styles.inputLable}>Instruction:</Text>
							<TextInput
								multiline={true}
								numberOfLines={2}
								autoCompleteType="off"
								autoCapitalize="words"
								style={[styles.textInput, { textAlignVertical: "top" }]}
								value={this.state.instruction}
								onChangeText={(instruction) => this.setState({ instruction })}
							/>
						</View>

						<TouchableOpacity style={styles.submitBtn} onPress={this.createGame}>
							<Text style={{ fontSize: 18, color: Colors.white }}>SUBMIT</Text>
						</TouchableOpacity>
					</ScrollView>
					<AwesomeAlert
						show={this.state.showAlertModal}
						showProgress={false}
						title={this.state.alertType}
						message={this.state.alertMessage}
						closeOnTouchOutside={true}
						closeOnHardwareBackPress={false}
						showCancelButton={false}
						showConfirmButton={true}
						cancelText="cancel"
						confirmText="Ok"
						confirmButtonColor="#DD6B55"
						onCancelPressed={() => {
							this.hideAlert();
						}}
						onConfirmPressed={() => {
							this.hideAlert();
						}}
					/>

					<AwesomeAlert
						show={this.state.isGameOrderPriorityAlertVisible}
						showProgress={false}
						title={this.state.alertType}
						message={this.state.gameOrderPriorityUpdateErrorMessage}
						closeOnTouchOutside={true}
						closeOnHardwareBackPress={false}
						showCancelButton={true}
						showConfirmButton={true}
						cancelText="cancel"
						confirmText="Yes! Edit the Game"
						confirmButtonColor="#DD6B55"
						onCancelPressed={() => { this.setState({
							isGameOrderPriorityAlertVisible: !this.state.isGameOrderPriorityAlertVisible,
							matchedAlreadyExistGame: null
							})
						}}
						onConfirmPressed={() => {
							this.setState({
								isGameOrderPriorityAlertVisible: !this.state.isGameOrderPriorityAlertVisible,
							}, () => {
								this.props.navigation.push("EditGame",
								{
									cat: { 
										id: this.state.matchedAlreadyExistGame.parent_category.id, 
										name: this.state.matchedAlreadyExistGame.parent_category.name 
									},
									sub_cat: { 
										id: this.state.matchedAlreadyExistGame.child_category.id,
										name: this.state.matchedAlreadyExistGame.child_category.name
									},
									game:  this.state.matchedAlreadyExistGame.game
								});
							});
						}}
					/>

				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white,
	},
	form: {
		flex: 1,
		padding: 8,
	},
	iconPickerContainer: {
		flexDirection: "row",
		marginVertical: 10,
		alignItems: "center",
		justifyContent: "space-between",
	},
	imageContainer: {
		borderColor: "#ccc",
		borderWidth: 1,
		padding: 3,
		backgroundColor: "#fff",
		borderRadius: 5,
	},
	image: {
		height: 50,
		width: 50,
	},
	defaultImgIcon: {
		fontSize: 50,
		color: "#adadad",
	},
	inputContainer: {
		width: "100%",
		marginBottom: 20,
	},
	inputLable: {
		fontSize: 16,
		color: Colors.grey,
		marginBottom: 10,
		opacity: 0.8,
	},
	textInput: {
		padding: 9,
		fontSize: 14,
		width: "100%",
		borderWidth: 1,
		borderRadius: 4,
		borderColor: Colors.textInputBorder,
		backgroundColor: Colors.textInputBg,
		color: Colors.grey,
	},
	submitBtn: {
		marginTop: 15,
		height: 50,
		width: "100%",
		backgroundColor: Colors.primary,
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 4,
	},
});
