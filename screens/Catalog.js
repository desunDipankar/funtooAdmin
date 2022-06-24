import React from "react";
import {
	StyleSheet,
	FlatList, 
	SafeAreaView,
	RefreshControl,
	View,
	TouchableOpacity,
	Text
} from "react-native";
import Colors from "../config/colors";
import Header from "../components/Header";
import { GetCategorys } from "../services/CategoryService";
import Loader from "../components/Loader";
import EmptyScreen from "../components/EmptyScreen";
import Configs from "../config/Configs";
import ProgressiveImage from "../components/ProgressiveImage";
import { Ionicons } from "@expo/vector-icons";

export default class Catalog extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			categoryList: [],
			isLoading: true,
			refreshing: false,
		};
	}

	componentDidMount = () => {
		this.focusListner = this.props.navigation.addListener("focus", () => { this.loadCategoryList() })
	};

	componentWillUnmount() {
		this.focusListner();
	}

	loadCategoryList = () => {
		this.getCatData();
	};

	getCatData = () => {
		GetCategorys()
		.then((response) => {
			this.setState({
				categoryList: response.data,
				isLoading: false,
				refreshing: false,
			});
		})
		.catch((err) => {
			console.log(err);
		});
	}

	onRefresh = () => {
		this.setState({ refreshing: true }, () => { this.getCatData() })
	}

    gotoSubCategory = (item) => this.props.navigation.navigate("SubCategory", { category_id: item.id, category_name: item.name })

	gotoAddCategory = () => this.props.navigation.navigate("AddCategory");

	gotoEditCategory = (item) => this.props.navigation.navigate("EditCategory", { category_id: item.id });

	goToTag = (item) => this.props.navigation.navigate("Tag", { category_id: item.id, tagList: item.tags })

	onPressHandle = (item) => {
		if(item.after_click_open == 'tags') {
			this.goToTag(item);
		} else {
			this.gotoSubCategory(item);
		}
	}

	renderItem = ({item}) => {
		let url = (item.image != '') ? 
		Configs.CATEGORY_IMAGE_URL + item.image
		: 'https://www.osgtool.com/images/thumbs/default-image_450.png';
	
		return	(
			<>
				<View style={styles.listItem}>
					<TouchableOpacity style={{ flexDirection: 'row' }}
						onPress={this.onPressHandle.bind(this, item) }
						onLongPress={this.gotoEditCategory.bind(this, item)}>
						<View style={styles.left}>
							<ProgressiveImage
								style={styles.image}
								source={{ uri: url }}
								resizeMode="cover"
							/>
						</View>
						<View style={styles.middle}>
							<Text style={styles.name}>{item.name}</Text>
						</View>
						<View style={styles.right}>
							<View style={styles.qtyContainer}>
								<Text style={styles.qty}>{item.total_game}</Text>
							</View>
							<Ionicons
								name="chevron-forward"
								size={20}
								color={Colors.textInputBorder}
							/>
						</View>

					</TouchableOpacity>
				</View>
			</>
		)
	}

	renderEmptyContainer = () => {
		return (
			<EmptyScreen />
		)
	}

	render = () => {
		return (
			<SafeAreaView style={styles.container}>
				<Header title="Category" addAction={this.gotoAddCategory} />
				{this.state.isLoading ? (
					<Loader />
				) : (
					<FlatList
						data={this.state.categoryList}
						keyExtractor={(item, index) => item.id.toString()}
						renderItem={this.renderItem}
						ListEmptyComponent={this.renderEmptyContainer()}
						refreshControl={
							<RefreshControl
								refreshing={this.state.refreshing}
								onRefresh={this.onRefresh}
							/>
						}
					/>
				)}

			</SafeAreaView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white,
	},
	listItem: {
		borderBottomColor: Colors.textInputBorder,
		borderBottomWidth: 1,
		padding: 10,
	},
    left: {
		width: "20%",
		justifyContent: "center",
	},
	middle: {
		justifyContent: "center",
		flex: 1,
		paddingLeft: 10
	},
	right: {
		flexDirection: "row",
		justifyContent: "flex-end",
		alignItems: "center",
	},
    name: {
		fontSize: 18,
		color: Colors.grey,
	},
    qtyContainer: {
		height: 25,
		width: 45,
		borderRadius: 100,
		backgroundColor: Colors.primary,
		justifyContent: "center",
		alignItems: "center",
		padding: 3,
	},
    image: {
		width: "100%",
		height: 40,
	},
	qty: {
		fontSize: 14,
		color: Colors.white,
		textAlign: "center",
	}
});