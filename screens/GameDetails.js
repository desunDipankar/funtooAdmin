import React from "react";
import {
	View,
	StyleSheet,
	Text,
	TouchableOpacity,
	ScrollView,
	Dimensions,
	Modal,
	SafeAreaView,
	RefreshControl,
	Image
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../config/colors";
import Header from "../components/Header";
import Configs from "../config/Configs";
import { Gamedetail } from "../services/GameApiService";
import ProgressiveImage from "../components/ProgressiveImage";
import Loader from "../components/Loader";
import colors from "../config/colors";
import CustomImage from "../components/CustomImage";
import ImageView from "react-native-image-viewing";

export default class GameDetails extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isModalOpen: false,
			data: [],
			isLoading: true,
			game_id: this.props.route.params.game_id,
			game_ids: null,
			qty: 1,
			refreshing: false,

			activeTabKey: "A",
			selectedGalleryImageIndex: 0,
			isGalleryImageViewerOpen: false,
		};
	}
	componentDidMount = () => {

		this.loadGameDetails();
		this.focusListner = this.props.navigation.addListener("focus", () => { this.loadGameDetails() })

	};


	componentWillUnmount() {
		this.focusListner();
	}

	toggleModal = () => this.setState({ isModalOpen: !this.state.isModalOpen });

	gotoPartsList = () => {
		this.toggleModal();
		this.props.navigation.navigate("PartsList", { game_id: this.state.game_id });
	};

	gotoProductListingDetails = () => {
		this.toggleModal();
		let detail = this.state.data.game_list_detail ?? {};
		let game = { game_id: this.state.game_id, };
		//console.log(Object.assign(detail,game));
		this.props.navigation.navigate("ProductListingDetails", { data: Object.assign(detail, game), game_rent_to_customer: this.state.data.rent });
	};

	gotoProductLaunchDetails = () => {
		this.toggleModal();

		let detail = this.state.data.game_launch_detail ?? {};
		let game = { game_id: this.state.game_id };
		this.props.navigation.navigate("ProductLaunchDetails", { data: Object.assign(detail, game) });
	};


	gotoGameImage = () => {
		this.toggleModal();
		this.props.navigation.navigate("GameImageScreen", { game_id: this.state.game_id });
	};

	gotoGameTag = () => {
		this.toggleModal();
		this.props.navigation.navigate("GameTagScreen", { game_id: this.state.game_id });
	};

	loadGameDetails = () => {
		Gamedetail(this.state.game_id)
			.then((response) => {
				console.log('game_data', response.data);
				this.setState({

					data: response.data,
					isLoading: false,
					refreshing: false,
				});
			})
			.catch((err) => { });
	};

	GoToGamesByTag = (data) => {
		this.props.navigation.navigate("GamesByTag", { data: data });
	};

	setActiveTab = (key) =>
		this.setState(
			{
				activeTabKey: key,
			}
		);

	getGalleryImages = () => {
		console.log('gallery iamges -->', this.state.data)
		let { images } = this.state.data;
		let data = (images || []).map((item) => {
			return {
				id: item.id,
				uri: Configs.GAME_GALLERY_IMAGE_URL + item.image,
			};
		});
		return data;
	};


	openGalleryImageViewer = (id) => {
		let galleryImages = this.getGalleryImages();
		let index = galleryImages.findIndex((item) => item.id === id);

		this.setState({
			selectedGalleryImageIndex: index > -1 ? index : 0,
			isGalleryImageViewerOpen: true,
		});
	};

	closeGalleryImageViewer = () =>
		this.setState({
			selectedGalleryImageIndex: 0,
			isGalleryImageViewerOpen: false,
		});


	onRefresh = () => {
		this.setState({
			refreshing: true,
		}, () => {
			this.loadGameDetails()
		})
	};

	handlePrevNext = (game_id, name) => {
		this.props.navigation.push("GameDetails", {
			game_id: game_id,
			name: name
		});
	}


	render = () => {
		let url = "";

		if (this.state.data.hasOwnProperty("game")) {

			url = "https://ehostingguru.com/stage/funtoo/public/uploads/game/funtoo-6194cc0a0f0bd.jpg"

		}

		if (this.state.data.hasOwnProperty("image")) {

		}
		if (this.state.data.hasOwnProperty("tag")) {

		}

		let image_url = Configs.NEW_COLLECTION_URL + this.state.data.image;
		let data = this.state.data;
		let list_detail = data?.game_list_detail;
		let launch_detail = data?.game_launch_detail;
		console.log("*********", launch_detail?.mfg_photos.length)
		let total_cost = 0;
		launch_detail?.materials?.map(item => {
			total_cost = total_cost + Number(item?.amount);
		})



		return (
			<SafeAreaView style={styles.container}>
				<Header
					title={this.state.data.name}
					addAction={this.toggleModal}
					gameDetailsIcon={true}
					previous_game={this.state.data.previous_game}
					next_game={this.state.data.next_game}
					previous_game_function={() => this.handlePrevNext(this.state.data.previous_game.id, this.state.data.previous_game.name)}
					next_game_function={() => this.handlePrevNext(this.state.data.next_game.id, this.state.data.next_game.name)}
				/>

				{this.state.isLoading ? (
					<Loader />
				) : (
					<>
						<View style={styles.gameDetails}>
							<ScrollView showsVerticalScrollIndicator={false}
								refreshControl={
									<RefreshControl
										refreshing={this.state.refreshing}
										onRefresh={this.onRefresh}
									/>
								}
							>

								{/* <View style={styles.gameBannerContainer}>
									<ProgressiveImage
										source={{ uri: image_url }}
										resizeMode="cover"
										style={styles.gameBanner}
									/>
								</View> */}

								<View style={[styles.gameBannerContainer]}>
									<Image
										source={{ uri: image_url }}
										resizeMode="contain"
										style={styles.gameBanner}
									/>
								</View>

								{/* <Text style={styles.gameTitle}> {this.state.data.name}</Text>

								<Text style={styles.gameDesc}>
									{this.state.data.description}
								</Text>

								<View style={styles.galleryContainer}>
									{this.state.data.images.length > 0
										? this.state.data.images.map((item, index) => {
											let url = Configs.GAME_GALLERY_IMAGE_URL + item.image;
											return (
												// {GAME_GALLERY.map((item, index) => (
												<TouchableOpacity
													key={item.id.toString()}
													style={styles.galleryGrid}
												>
													<ProgressiveImage
														// source={item.src} //item.image+base_url
														source={{ uri: url }}
														style={styles.galleryImg}
														resizeMode="contain"
													/>
												</TouchableOpacity>
											);
										})
										: null}
								</View> */}

								<View style={styles.gameDetails}>
									<View style={{ justifyContent: 'center', alignItems: 'center' }}>
										<Text style={styles.gameTitle}>
											{this.state.data.name}
										</Text>
										<Text style={styles.productId}>{`(Product ID: G000${this.state.data.id})`}</Text>
									</View>

									<View style={{ height: 100, marginTop: 10, padding: 8 }}>
										<ScrollView nestedScrollEnabled={true} showsVerticalScrollIndicator={false}>
											<Text style={styles.gameDesc}>
												{this.state.data.description}
											</Text>
										</ScrollView>
									</View>
								</View>

								<View style={styles.galleryContainer}>
									{this.state.data.images.length > 0
										? this.state.data.images.map((item, index) => {
											let url = Configs.GAME_GALLERY_IMAGE_URL + item.image;
											return (
												<TouchableOpacity
													activeOpacity={1}
													key={item.id.toString()}
													style={[styles.galleryGrid, { marginHorizontal: Platform.OS == 'ios' ? 2 : 3, backgroundColor: '#fff', height: Platform.OS == 'ios' ? 110 : 95, marginBottom: 5, borderWidth: 0.6, borderColor: "#dfdfdf", padding: 2}]}
													onPress={this.openGalleryImageViewer.bind(this, item.id)}
												>
													{Platform.OS == 'ios' ? (
														<Image
															source={{ uri: url }}
															style={styles.galleryImg}
															resizeMode="contain"
														/>
													) : (
														<CustomImage
															source={{ uri: url }}
															style={styles.galleryImg}
															resizeMode="contain"
														/>
													)}

												</TouchableOpacity>
											);
										})
										: null}
									
								</View>

								<View style={{ marginTop: 20, padding: 8 }}>
									<View style={{ marginBottom: 5, flexDirection: 'row' }}>
										<Text style={[styles.gameDataText]}>{'Price: '}</Text>
										<Text style={{ fontSize: 9, paddingTop: Platform.OS == 'ios' ? 1 : 1.8, color: Colors.black, opacity: 0.6 }}>{'₹'}</Text>
										<Text style={[styles.gameDataText]}>
											{this.state.data.rent}
										</Text>
										<Text style={{ fontSize: 9, paddingTop: Platform.OS == 'ios' ? 1 : 1.8, color: Colors.black, opacity: 0.6 }}>{"00"}</Text>
									</View>

									<View style={{ marginBottom: 5 }}>
										<Text style={styles.gameDataText}>
											Size: {this.state.data.size}
										</Text>
									</View>

									<>
										<View style={{ flexDirection: 'row', alignItems: 'center' }}>
											<Text style={styles.gameDataText}>
												{"Tags: "}
											</Text>
											<ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
												{this.state.data.tags.length > 0
													? this.state.data.tags.map((item, index) => {
														return (
															<View style={{ borderWidth: 1, padding: 5, marginRight: 2, borderRadius: 3, borderColor: '#cfcfcf' }}>
																<Text
																	style={[styles.gameDataText, { fontSize: 10 }]}
																	key={item.id.toString()}
																>
																	{item.name}
																</Text>
															</View>
														);
													})
													: null}
											</ScrollView>
										</View>
									</>
								</View>

								{/* <View style={{ marginTop: 20 }}>
									<Text style={styles.gameDataText}>Rent : {this.state.data.rent}</Text>
									<Text style={styles.gameDataText}>Size : {this.state.data.size}</Text>
									<Text style={styles.gameDataText}>
										Tags : {" "}
										{this.state.data.tags.length > 0
											? this.state.data.tags.map((item, index) => {
												if (index != this.state.data.tags.length - 1) {
													return (

														<Text onPress={() => this.GoToGamesByTag(item)}
															key={item.id.toString()}>
															{item.name}/
														</Text>

													);
												} else {
													return (

														<Text key={Math.random().toString()} onPress={() => this.GoToGamesByTag(item)}>
															{item.name}
														</Text>

													);
												}
											})
											: null}
									</Text>
								</View> */}



								<View style={styles.tabRow}>
									<TouchableOpacity
										onPress={this.setActiveTab.bind(this, "A")}
										style={[
											styles.tab,
											this.state.activeTabKey === "A" ? styles.activeTab : null,
										]}
									>
										<Text
											style={
												this.state.activeTabKey === "A"
													? styles.activeText
													: styles.inActiveText
											}
										>
											Parts List
										</Text>
									</TouchableOpacity>
									<TouchableOpacity
										onPress={this.setActiveTab.bind(this, "B")}
										style={[
											styles.tab,
											this.state.activeTabKey === "B" ? styles.activeTab : null,
										]}
									>
										<Text
											style={
												this.state.activeTabKey === "B"
													? styles.activeText
													: styles.inActiveText
											}
										>
											Listing Details
										</Text>
									</TouchableOpacity>

									<TouchableOpacity
										onPress={this.setActiveTab.bind(this, "C")}
										style={[
											styles.tab,
											this.state.activeTabKey === "C" ? styles.activeTab : null,
										]}
									>
										<Text
											style={
												this.state.activeTabKey === "C"
													? styles.activeText
													: styles.inActiveText
											}
										>
											Launch Details
										</Text>
									</TouchableOpacity>
								</View>

								<View style={styles.tabContainer}>
									{this.state.activeTabKey === "A" && <View>
										{data.game_parts?.length > 0 ? <View>
											{data?.game_parts.map(item => {
												return (
													<View key={item.id.toString()} style={styles.card}>
														<View style={{ width: "80%" }}>
															<Text style={{color: Colors.black, opacity: 0.6}}>{`${item.part_name} - ${item.quantity} Nos`}</Text>
															<Text style={{fontStyle: 'italic', color: Colors.black, opacity: 0.6 }}>{`(${item.storage_name})`}</Text>
														</View>
														<View style={{ width: "20%" }}>
															<Image
																source={{ uri: item.image_thumb_url }}
																style={{ height: 57, width: "100%", borderWidth: 0.6, borderColor: "#dfdfdf", borderRadius: 3 }}
																resizeMode="cover"
															/>
														</View>
													</View>)
											})}

										</View>
											:

											<Text style={styles.noData}>
												Parts list no records
											</Text>
										}
									</View>}
									{this.state.activeTabKey === "B" && <View>
										{list_detail != null ?

											<View>
												<View style={[styles.newRow,{flexDirection: 'row'}]}>
													<Text style={[styles.rowLebal, {fontSize: 14, color: '#444', opacity: 0.6, marginRight: 5}]}>Type : </Text>
													<Text style={[styles.rowValue, {color: "#444", opacity: 0.6}]}>{list_detail?.type == 1 ? "Third Party" : "In House"}</Text>
												</View>

												{list_detail.type == 1 && <View style={[styles.newRow,{flexDirection: 'row'}]}>
													<Text style={[styles.rowLebal, {fontSize: 14, color: '#444', opacity: 0.6, marginRight: 5}]}>Vender Name : </Text>
													<Text style={[styles.rowValue, {color: "#444", opacity: 0.6}]}>{list_detail?.vender_name}</Text>
												</View>}

												<View style={[styles.newRow,{flexDirection: 'row'}]}>
													<Text style={[styles.rowLebal, {fontSize: 14, color: '#444', opacity: 0.6, marginRight: 5}]}>Item Name : </Text>
													<Text style={[styles.rowValue, {color: "#444", opacity: 0.6}]}>{list_detail?.item_name}</Text>
												</View>
												<View style={[styles.newRow,{flexDirection: 'row'}]}>
													<Text style={[styles.rowLebal, {fontSize: 14, color: '#444', opacity: 0.6, marginRight: 5}]}>Min Qty : </Text>
													<Text style={[styles.rowValue, {color: "#444", opacity: 0.6}]}>{list_detail?.minimum_quantity}</Text>
												</View>
												<View style={[styles.newRow,{flexDirection: 'row'}]}>
													<Text style={[styles.rowLebal, {fontSize: 14, color: '#444', opacity: 0.6, marginRight: 5}]}>Max Qty : </Text>
													<Text style={[styles.rowValue, {color: "#444", opacity: 0.6}]}>{list_detail?.maximum_quantity}</Text>
												</View>
												<View style={[styles.newRow,{flexDirection: 'row'}]}>
													<Text style={[styles.rowLebal, {fontSize: 14, color: '#444', opacity: 0.6, marginRight: 5}]}>Rate Per Unit : </Text>
													<Text style={[styles.rowValue, {color: "#444", opacity: 0.6}]}>{list_detail?.rate_per_unit}</Text>
												</View>
												<View style={[styles.newRow,{flexDirection: 'row'}]}>
													<Text style={[styles.rowLebal, {fontSize: 14, color: '#444', opacity: 0.6, marginRight: 5}]}>Margin (%) : </Text>
													<Text style={[styles.rowValue, {color: "#444", opacity: 0.6}]}>{list_detail?.margin}</Text>
												</View>
												<View style={[styles.newRow,{flexDirection: 'row'}]}>
													<Text style={[styles.rowLebal, {fontSize: 14, color: '#444', opacity: 0.6, marginRight: 5}]}>Rent to Customer : </Text>
													<Text style={[styles.rowValue, {color: "#444", opacity: 0.6}]}>{list_detail?.rent}</Text>
												</View>
											</View>
											: <Text style={styles.noData}>List details not records</Text>}
									</View>}
									{this.state.activeTabKey === "C" && <View>
										{launch_detail != null ? <View>

											<View style={[styles.newRow,{flexDirection: 'row'}]}>
												<Text style={[styles.rowLebal,  {fontSize: 14, color: '#444', opacity: 0.6, marginRight: 5}]}>Vender Name : </Text>
												<Text style={[styles.rowValue,{color: "#444", opacity: 0.6}]}>{launch_detail?.vender_name}</Text>
											</View>

											<View style={[styles.newRow,{flexDirection: 'row'}]}>
												<Text style={[styles.rowLebal,  {fontSize: 14, color: '#444', opacity: 0.6, marginRight: 5}]}>Pur / Mfg Date : </Text>
												<Text style={[styles.rowValue,{color: "#444", opacity: 0.6}]}>{launch_detail?.mfg_date}</Text>
											</View>

											<View>
												<Text>Material</Text>
											</View>

											{launch_detail?.materials?.length > 0 && (
												<>
													{launch_detail?.materials?.map((item) => (
														<View key={Math.random()}>
															<View style={[styles.newRow,{flexDirection: 'row'}]}>
																<Text style={[styles.rowLebal,{fontSize: 14, color: '#444', opacity: 0.6, marginRight: 5}]}>{item.name}</Text>
																<Text style={[styles.rowValue,{color: "#444", opacity: 0.6}]}>{item.amount}</Text>
															</View>
														</View>
													))}
												</>
											)}

											<View style={[styles.newRow,{flexDirection: 'row'}]}>
												<Text style={[styles.inputLable, { marginBottom: 0, fontWeight: 'bold' }]}>Total</Text>
												<Text style={[styles.inputLable, { marginBottom: 0, fontWeight: 'bold' }]}>{total_cost}</Text>
											</View>



											<View style={styles.galleryContainer}>
												{launch_detail?.mfg_photos.length > 0
													&& launch_detail.mfg_photos.map((item, index) => {
														// let url = Configs.GAME_GALLERY_IMAGE_URL + item.image;
														console.log("url************",Configs.NEW_COLLECTION_URL + item)
														return (
															// {GAME_GALLERY.map((item, index) => (
															<TouchableOpacity
																key={Math.random()}
																style={styles.galleryGrid}
															>
																<Image
																	// source={item.src} //item.image+base_url
																	source={{ uri: Configs.NEW_COLLECTION_URL + item }}
																	style={styles.galleryImg}
																	resizeMode="contain"
																/>
															</TouchableOpacity>
														);
													})
												}
											</View>

											<View style={styles.newRow}>
												<Text style={styles.rowLebal}>Comments </Text>
												<Text style={styles.rowValue}>{launch_detail?.comments}</Text>
											</View>

										</View> :
											<Text style={styles.noData}>Launch details not records</Text>
										}
									</View>}

								</View>

							</ScrollView>
						</View>
					</>
				)}

				<ImageView
					visible={this.state.isGalleryImageViewerOpen}
					images={this.getGalleryImages()}
					imageIndex={this.state.selectedGalleryImageIndex}
					onRequestClose={this.closeGalleryImageViewer}
				/>

				<Modal
					animationType="fade"
					transparent={true}
					statusBarTranslucent={true}
					visible={this.state.isModalOpen}
					onRequestClose={this.toggleModal}
				>
					<View style={styles.modalContainer}>
						<View style={styles.modalBody}>
							<TouchableOpacity
								activeOpacity={0.9}
								style={styles.modalBtn}
								onPress={this.gotoPartsList}
							>
								<Text style={styles.modalBtnText}>Loading / Part List</Text>
							</TouchableOpacity>

							<TouchableOpacity
								activeOpacity={0.9}
								style={styles.modalBtn}
								onPress={this.gotoProductListingDetails}
							>
								<Text style={styles.modalBtnText}>Product Listing Details</Text>
							</TouchableOpacity>

							<TouchableOpacity
								activeOpacity={0.9}
								style={[styles.modalBtn, styles.modalBtn]}
								onPress={this.gotoProductLaunchDetails}
							>
								<Text style={styles.modalBtnText}>Product Launch Details</Text>
							</TouchableOpacity>

							<TouchableOpacity
								style={styles.closeButton}
								onPress={this.toggleModal}
							>
								<Ionicons name="close-outline" style={styles.closeButtonText} />
							</TouchableOpacity>

							<TouchableOpacity
								activeOpacity={0.9}
								style={[styles.modalBtn, styles.modalBtn]}
								onPress={this.gotoGameImage}
							>
								<Text style={styles.modalBtnText}>Game Gallery</Text>
							</TouchableOpacity>

							<TouchableOpacity
								activeOpacity={0.9}
								style={[styles.modalBtn, styles.mb0]}
								onPress={this.gotoGameTag}
							>
								<Text style={styles.modalBtnText}>Game Tag</Text>
							</TouchableOpacity>

							<TouchableOpacity
								style={styles.closeButton}
								onPress={this.toggleModal}
							>
								<Ionicons name="close-outline" style={styles.closeButtonText} />
							</TouchableOpacity>
						</View>
					</View>
				</Modal>
			</SafeAreaView>
		);
	}
}

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const tabHeight = 50;
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white,
	},
	gameDetails: {
		flex: 1,
		padding: 0,
	},
	gameBannerContainer: {
		width: "100%",
		height: 320,
	  },
	gameBanner: {
		height: 310,
		width: "100%",
	},
	gameTitle: {
		fontSize: 18,
		fontWeight: "bold",
		color: Colors.black,
		alignSelf: "center",
		marginTop: 2,
	},
	gameDesc: {
		fontSize: 14,
		color: Colors.black,
		opacity: 0.9,
		textAlign: 'justify'
	},
	galleryContainer: {
		// flex: 1,
		flexDirection: "row",
		alignItems: "flex-start",
		flexWrap: "wrap",

	},
	galleryGrid: {
		width: Platform.OS === 'android' ? Math.floor((windowWidth - 10) / 3.1) : Math.floor((windowWidth - 10) / 3),
		height: 110,
		alignItems: "center",
		justifyContent: "center",
		marginHorizontal: 1,
		// borderRadius: 5
		// borderTopLeftRadius: 
	},
	galleryImg: {
		width: Platform.OS === 'android' ? Math.floor((windowWidth - 10) / 3.2) : Math.floor((windowWidth - 10) / 3.1),
		height: "98%",
	},
	gameDataText: {
		fontSize: 14,
		color: Colors.black,
		opacity: 0.6,
	},
	modalContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	modalBody: {
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: Colors.white,
		width: windowWidth - 30,
		minHeight: Math.floor(windowHeight / 4),
		padding: 15,
		borderRadius: 5,
		elevation: 8,
	},
	closeButton: {
		position: "absolute",
		zIndex: 11,
		top: 5,
		right: 5,
		backgroundColor: "#ddd",
		width: 25,
		height: 25,
		borderRadius: 40 / 2,
		alignItems: "center",
		justifyContent: "center",
		elevation: 0,
	},
	closeButtonText: {
		color: "#444",
		fontSize: 22,
	},
	modalBtn: {
		flexDirection: "row",
		width: 200,
		height: 35,
		marginBottom: 20,
		borderWidth: 1,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: Colors.primary,
		borderColor: Colors.primary,
		borderRadius: 5,
	},
	modalBtnText: {
		fontSize: 16,
		color: Colors.white,
	},
	mb0: {
		marginBottom: 0,
	},

	card: {
		flexDirection: "row",
		width: "100%",
		paddingHorizontal: 8,
		paddingVertical: 10,
		backgroundColor: Colors.white,
		borderBottomWidth: 1,
		borderColor: Colors.textInputBorder,
	},

	heading: {
		color: 'grey', fontSize: 18
	},
	newRow: {
		marginTop: 10,
		borderBottomColor: 'silver',
		borderBottomWidth: 1,
		paddingBottom: 5
	},
	rowLebal: {
		fontSize: 16,
		marginBottom: 5
	},
	rowValue: {
		//fontSize: 18, 
		color: colors.grey
	},


	//Table 

	thead: {
		flexDirection: "row",
		height: 45,
		borderTopWidth: 1,
		borderBottomWidth: 1,
		borderTopColor: Colors.textInputBorder,
		borderBottomColor: Colors.textInputBorder,
		backgroundColor: Colors.textInputBg,
	},

	tbody: {
		flexDirection: "row",
		height: 45,
		borderBottomWidth: 1,
		borderBottomColor: Colors.textInputBorder,
	},

	tdLeft: {
		flex: 1.3,
		borderLeftWidth: 1,
		borderRightWidth: 1,
		borderLeftColor: Colors.textInputBorder,
		borderRightColor: Colors.textInputBorder,
		justifyContent: "center",
		paddingHorizontal: 6,
	},
	tdRight: {
		flex: 0.7,
		alignItems: "flex-end",
		justifyContent: "center",
		borderRightWidth: 1,
		borderRightColor: Colors.textInputBorder,
		paddingHorizontal: 6,
	},

	///Tab


	tabRow: {
		width: "100%",
		height: tabHeight,
		flexDirection: "row",
		borderTopWidth: 0.5,
		borderTopColor: Colors.lightGrey,
		justifyContent: 'space-evenly',
		alignItems: 'center',
		marginTop: 15,
	},

	activeTab: {
		height: tabHeight,
		justifyContent: 'center',
		alignItems: 'center',
		borderBottomWidth: 2,
		borderBottomColor: Colors.primary,
	},
	activeText: {
		fontSize: 16,
		fontWeight: "bold",
		color: Colors.primary,
	},
	inActiveText: {
		fontSize: 16,
		color: "silver",
		opacity: 0.8,
	},


	tabContainer: {
		flex: 1,
		padding: 8,
		//height: windowHeight - tabHeight,
	},

	noData: {
		justifyContent: 'center',
		alignItems: 'center',
		alignSelf: 'center',
		//fontSize:18,
		color: 'red'

	},
	btn: {
		flexDirection: "row",
		width: 150,
		height: 45,
		borderRadius: 4,
		alignItems: "center",
		justifyContent: "center",
	},
	button: {
		flexDirection: "row",
		width: 150,
		height: 45,
		borderRadius: 4,
		alignItems: "center",
		justifyContent: "center",
		position: "absolute",
		right: 1
	},

	productId: {
		fontSize: 12,
		fontStyle: "italic",
	}
});