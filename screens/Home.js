import React from "react";
import {
	View,
	Text,
	Image,
	StyleSheet,
	TouchableOpacity,
	Dimensions,
	ScrollView,
	SafeAreaView,
} from "react-native";
import Carousel, { PaginationLight } from "react-native-x2-carousel";
import Colors from "../config/colors";
import Header from "../components/Header";
import Configs from "../config/Configs";
import { getNewArrivalsDetails, getSlider } from "../services/APIServices";
import AppContext from "../context/AppContext";
import Loader from "../components/Loader";
import CustomImage from "../components/CustomImage";
import { GetCategorys } from "../services/CategoryService";
import CarouselItem from 'react-native-snap-carousel';
import ProgressiveImage from "../components/ProgressiveImage";


const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

function wp(percentage) {
	const value = (percentage * viewportWidth) / 100;
	return Math.round(value);
}

const slideHeight = viewportHeight * 0.36;
const slideWidth = wp(33.1);
const itemHorizontalMargin = wp(0.5);

export const sliderWidth = viewportWidth;
export const itemWidth = slideWidth + itemHorizontalMargin * 2;

export default class Home extends React.Component {

	static contextType = AppContext;
	constructor(props) {
		super(props);
		this.state = {
			gameData: [],
			isLoading: false,
			cust_id: null,
			slider: [],
			categoryList: []
		};
	}

	componentDidMount = () => {
		this.focusListner = this.props.navigation.addListener("focus", () => { this.loadData() })
	};

	componentWillUnmount() {
		this.focusListner();
	}

	loadData = () => {
		this.loadAll();
	};

	loadAll = () => {
		this.setState({ isLoading: true });
		Promise.all([getNewArrivalsDetails(), getSlider(), GetCategorys()])
			.then((response) => {
				this.setState({
					gameData: response[0].data,
					slider: response[1].data,
					categoryList: response[2].data
				});
			})
			.catch(err => console.log(err))
			.finally(() => {
				this.setState({ isLoading: false });
			});
	}

	gotoGameDetails = (item) => {
		this.props.navigation.navigate("GameDetails", {
			game_id: item.id,
			cust_code: this.context.userData.cust_code,
			cust_id: this.state.cust_id
		});
	};

	renderCarouselItem = (item) => {
		let image_url = Configs.SLIDER_URL + item.image;
		return (
			<View key={item.id.toString()} style={{
				width: windowwidth,
				height: 300,
				alignItems: 'center',
				justifyContent: 'center',
			}}>
				<Image
					style={{ height: '100%', width: "100%" }}
					source={{ uri: image_url }}
					resizeMode="contain"
				/>
			</View>
		)
	};

	renderSliderlItem = (item) => {
		let image_url = Configs.CATEGORY_IMAGE_URL + item.item.image;

		return (
			<View key={item.item.id.toString()} style={styles.latestCollections}>
				<>
					<TouchableOpacity
						key={item.item.id.toString()}
						style={[styles.galleryGrid, {
							width: Math.floor((windowwidth - 10) / 3.2),
							height: Math.floor((windowwidth - 10) / 3.2),
							overflow: 'hidden',
						}]}
						onPress={this.gotoSubCategory.bind(this, item.item)}
					>
						<Image
							style={[styles.latestCollectionItemImg, { borderWidth: 0.5, borderColor: '#dfdfdf', }]}
							source={{ uri: image_url }}
							resizeMode="contain"
						/>
					</TouchableOpacity>

				</>

			</View>
		)
	};

	gotoSubCategory = (item) => {
		if (item.is_tag_open == 1) {
			this.props.navigation.navigate("Tag",
			{ category_id: item.id, tagList: item.tags });
		} else {
			this.props.navigation.navigate("SubCategory",
				{ category_id: item.id, name: item.name });
		}
	}

	goToTag = (item) => this.props.navigation.navigate("Tag", { category_id: item.id, tagList: item.tags });

	handleOnPressCategoryList = (item) => {
		if (item.after_click_open == 'tags') {
			this.goToTag(item);
		} else {
			this.gotoSubCategory(item);
		}
	}

	render = () => {
		return (
			<SafeAreaView style={styles.container}>
				<Header
					title="Welcome"
					searchIcon={true}
					wishListIcon={true}
					cartIcon={true}
					navigation={this.props.navigation}
				/>
				{this.state.isLoading ? (
					<Loader />
				) : (
					<>
						<ScrollView showsVerticalScrollIndicator={false}>
						<View style={{ width: '100%', height: 295 }}>
						<Carousel
								loop={true}
								autoplay={true}
								autoplayInterval={3000}
								pagination={PaginationLight}
								renderItem={this.renderCarouselItem}
								data={this.state.slider}

							/>
						</View>

						<View style={styles.carouselContainer}>
							<CarouselItem
								data={this.state.categoryList}
								renderItem={this.renderSliderlItem}
								sliderWidth={sliderWidth}
								itemWidth={itemWidth}
								autoplay={true}
								loop={true}
								activeSlideAlignment='start'
								inactiveSlideOpacity={1}
								inactiveSlideScale={1}
							/>
						</View>

						{/* <View style={styles.latestCollections}>
							<ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
								{this.state.categoryList.length > 0
									? this.state.categoryList.map((item, index) => {
										let image_url = Configs.CATEGORY_IMAGE_URL + item.image;
										return (
											<TouchableOpacity
												key={item.id.toString()}
												style={[styles.galleryGrid, { 
													width: Math.floor((windowwidth - 10) / 4),
													height: Math.floor((windowwidth - 10) / 4) 
												}  ]}
												onPress={ () => this.handleOnPressCategoryList(item) }
											>
												<Image 
													style={styles.latestCollectionItemImg}
													source={{ uri: image_url }}
													resizeMode="cover"
												/>
												<Text style={styles.text} numberOfLines={1}>{item.name}</Text>
											</TouchableOpacity>
										)
									})
									: null}
							</ScrollView>
						</View> */}

						<View style={{ marginTop: 0 }}>
							<View style={{ flex: 1, justifyContent: 'center', paddingLeft: 5 }}>
								<View>
									<Text style={[styles.title, { marginBottom: 0, marginLeft: 0, color: "#959595", fontWeight: 'normal', fontSize: 12 }]}>	New Arrivals</Text>
								</View>
								<View style={{
									width: "30%",
									backgroundColor: 'white',
									height: 2,
									marginVertical: 3
								}}></View>
							</View>
							<View style={styles.galleryContainer}>
								{this.state.gameData.length > 0
									&& this.state.gameData.map((item, index) => {
										let image_url = Configs.NEW_COLLECTION_URL + item.image;
										return (
											<TouchableOpacity
											key={item.id.toString()}
											style={[styles.galleryGrid, { marginHorizontal: Platform.OS == 'ios' ? 2 : 3, backgroundColor: '#fff', height: Platform.OS == 'ios' ? 110 : 95, marginBottom: 5, borderWidth: 0.6, borderColor: "#dfdfdf", padding: 2}]}
											onPress={this.gotoGameDetails.bind(this, item)}
										>
											{Platform.OS == 'ios' ? (
												<Image
													source={{ uri: image_url }}
													style={styles.galleryImg}
													resizeMode="contain"
												/>
											) : (
												<CustomImage
													source={{ uri: image_url }}
													style={styles.galleryImg}
													resizeMode="contain"
												/>
											)}
										</TouchableOpacity>
										);
									})
								}
							</View>
						</View>
						</ScrollView>
					</>
				)}

			</SafeAreaView>
		);
	}
}

const windowwidth = Dimensions.get("window").width;
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white,
	},
	carouselContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		height: 100
	},

	carousel: {
		height: 270,
		width: windowwidth,
		marginHorizontal: 0,
		borderRadius: 3,

	},
	carouselImg: {
		height: 270,
		width: windowwidth,
		borderRadius: 0,

	},

	title: {
		fontSize: 14,
		fontWeight: "bold",
		color: Colors.grey,
		marginBottom: 10,
		marginLeft: 5,
	},
	latestCollections: {
		marginTop: 0,
		marginLeft: 0,
	},

	latestCollectionItem: {
		width: Math.floor((windowwidth - 40) / 4),
		height: 70,
		marginHorizontal: 5,
		borderRadius: 5,
	},
	latestCollectionItemImg: {
		width: Platform.OS === 'android' ? Math.floor((windowwidth - 30) / 3) : Math.floor((windowwidth - 30) / 3),
		height: Platform.OS === 'android' ? 80 : 100,
		borderRadius: 0,
	},

	galleryContainer: {
		// flex: 1,
		flexDirection: "row",
		alignItems: "flex-start",
		flexWrap: "wrap",
	},
	galleryGrid: {
		width: Platform.OS === 'android' ? Math.floor((windowwidth - 10) / 3.1) : Math.floor((windowwidth - 10) / 3),
		height: 110,
		alignItems: "center",
		justifyContent: "center",
		marginHorizontal: 1,
		// borderRadius: 5
		// borderTopLeftRadius: 
	},
	galleryImg: {
		width: Platform.OS === 'android' ? Math.floor((windowwidth - 10) / 3.2) : Math.floor((windowwidth - 10) / 3.1),
		height: "98%",
	},
	newsConatiner: {
		marginTop: 40,
		width: windowwidth - 10,
		height: 70,
		marginHorizontal: 5,
		backgroundColor: "#e0ffff",
		borderWidth: 1,
		borderColor: Colors.textInputBorder,
		borderRadius: 3,
		alignItems: "center",
		justifyContent: "center",
	},
	newsText: {
		fontSize: 14,
		color: Colors.grey,
		opacity: 0.9,
	},
});