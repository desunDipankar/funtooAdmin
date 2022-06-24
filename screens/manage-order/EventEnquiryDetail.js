import React from "react";
import {
	View,
	StyleSheet,
	Text,
	ScrollView,
	Image,
	Dimensions
} from "react-native";
import Colors from "../../config/colors";
import { showDateAsClientWant, showTimeAsClientWant } from "../../utils/Util";
import Header from "../../components/Header";
import OverlayLoader from "../../components/OverlayLoader";
import ProgressiveImage from "../../components/ProgressiveImage";
import { FontAwesome} from "@expo/vector-icons";
import Configs from "../../config/Configs";
import {GetOrder} from "../../services/OrderService";
import colors from "../../config/colors";
import { color } from "react-native-reanimated";

export default class EventEnquiryDetail extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			order_data: this.props.route.params.data,
			isLoading: false,
			model: {},
			enquiryData: {}
		};
	}

	componentDidMount = () => {

		this.setState({
			isLoading: true
		});
		GetOrder({id : this.state.order_data.id})
		.then( (result) => {
			this.setState({
				enquiryData: result.data
			});
			console.log("order data", result);
		} )
		.catch( err => console.log(err) )
		.finally( () => {
			this.setState({
				isLoading: false
			})
		} );
	}

	render = () => {
		let eventDetails = this.state.enquiryData?.event_data;
		console.log('evnet details>>>>>>>>>>>>>.'  , eventDetails)
		let lineItems = this.state.enquiryData?.line_items;
		return (
			<View style={styles.container}>
				<Header title="Enquiry Deatils" />
				{this.state.isLoading && <OverlayLoader visible={true} />}
				{
					this.state.isLoading ? (
						<OverlayLoader visible={true} />
					) : (
						<View style={styles.form}>
							<ScrollView showsVerticalScrollIndicator={false}>
							<View style={styles.rowContainer}>
										<View style={{ borderTopLeftRadius: 5 }}>
											<Text style={[styles.inputLable, { fontSize: 20 }]}>Event :-</Text>
											{/* <View style={styles.row}>
												<View style={[styles.rowLeft, { borderTopRightRadius: 5,width: "45%" }]}>
													<Text style={styles.inputLable}>Date:</Text>
													</View>
											</View> */}
										</View>

							            <View style={styles.row}>
										
											<View style={[styles.rowLeft, { borderTopRightRadius: 5,width: "45%" }]}>
												<Text style={[styles.inputLable , {color:Colors.black}]}>Date:</Text>
											
											</View>
											<View style={[styles.rowRight, { width: "55%" }]}>
												<Text style={[styles.inputLable ]} >
												{showDateAsClientWant(eventDetails?.event_date)}
												</Text>

											</View>
										</View>
										
										<View style={styles.row}>
										
											<View style={[styles.rowLeft, { borderTopRightRadius: 5,width: "45%" }]}>
												<Text style={[styles.inputLable ,{color:Colors.black}]}>Time: </Text>
											
											</View>
											<View style={[styles.rowRight, { width: "55%" }]}>
												<Text style={ {color:colors.black}} >
												{showTimeAsClientWant(eventDetails?.event_start_time)} - {showTimeAsClientWant(eventDetails?.event_end_time)}
												</Text>

											</View>
										</View>

										<View style={styles.rowlast}>
										
											<View style={[styles.rowLeft, { borderTopRightRadius: 5,width: "45%" }]}>
												<Text style={[styles.inputLable , {color:Colors.black}]}>Play Time:  </Text>
											
											</View>
											<View style={[styles.rowRight, { width: "55%" }]}>
												<Text style={styles.inputLable} >
												{eventDetails?.play_time}
												</Text>

											</View>
											
										</View>
										{/* <View style={styles.rowContainer}>
											
											</View> */}
										{/* <View style={{ borderTopLeftRadius: 5 }}>
											<Text style={[styles.inputLable , {fontSize:20}]}>Setup :-</Text>
										</View> */}
										{/* <View style={styles.row}>
										
										<View style={[styles.rowLeft, { borderTopRightRadius: 5,width: "45%" }]}>
											<Text style={[styles.inputLable]}>Date: </Text>
										
											</View>
											<View style={[styles.rowRight, { width: "55%" }]}>
												<Text style={[styles.inputLable]} >
												{showDateAsClientWant(eventDetails?.setup_date)}
												</Text>

											</View>
									</View> */}
									{/* <View style={styles.row}>
										
										<View style={[styles.rowLeft, { borderTopRightRadius: 5,width: "45%" }]}>
											<Text style={[styles.inputLable]}>Time: </Text>
										
											</View>
											<View style={[styles.rowRight, { width: "55%" }]}>
												<Text style={[styles.inputLable]} >
												{showTimeAsClientWant(eventDetails?.setup_start_time)}
												</Text>

											</View>
									</View> */}

									{/* <View style={styles.row}>
										
										<View style={[styles.rowLeft, { borderTopRightRadius: 5,width: "45%" }]}>
											<Text style={[styles.inputLable]}># of Guest: </Text>
										
											</View>
											<View style={[styles.rowRight, { width: "55%" }]}>
												<Text style={[styles.inputLable]} >
												{eventDetails?.num_of_guest}
												</Text>

											</View>
									</View> */}

									{/* <View style={styles.row}>
										
										<View style={[styles.rowLeft, { borderTopRightRadius: 5,width: "45%" }]}>
											<Text style={[styles.inputLable]}># of Kids: </Text>
										
											</View>
											<View style={[styles.rowRight, { width: "55%" }]}>
												<Text style={[styles.inputLable]} >
												{eventDetails?.num_of_kids}
												</Text>

											</View>
										</View> */}
										{/* <View style={styles.rowlast}>
										
										<View style={[styles.rowLeft, { borderTopRightRadius: 5,width: "45%" }]}>
											<Text style={[styles.inputLable]}>  Event Type: </Text>
										
											</View>
											<View style={[styles.rowRight, { width: "55%" }]}>
												<Text style={[styles.inputLable]} >
												{eventDetails?.event_type_name}
												</Text>

											</View>
									 </View> */}
									 {/* <View style={styles.row}>
										<View style={[styles.rowLeft]}>
											<Text style={styles.inputLable}>Event End:</Text>
										</View>
										<View style={[styles.rowRight]}>
											<View style={{ width: "55%" }}>
												<TouchableOpacity
													activeOpacity={1}
													style={{ paddingRight: 0, paddingVertical: 4, paddingLeft: 10, width: "100%" }} >
													<Text style={styles.location}>{showDateAsClientWant(this.state.eventDetails?.event_date)}</Text>
												</TouchableOpacity>
											</View>
											<View style={styles.divider}></View>
											<View style={{ width: "45%" }}>
												<TouchableOpacity
													activeOpacity={1}
													style={{ paddingRight: 0, paddingVertical: 4, paddingLeft: 10, width: "100%" }} >
													<Text style={styles.location}>{this.state.eventDetails?.event_data?.event_end_time}</Text>
												</TouchableOpacity>
											</View>
										</View>
									</View> */}

									{/* <View style={styles.row}>
										<View style={[styles.rowLeft]}>
											<Text style={styles.inputLable}>Setup:</Text>
										</View>
										<View style={[styles.rowRight]}>
											<View style={{ width: "55%" }}>
												<TouchableOpacity
													activeOpacity={1}
													style={{ paddingRight: 0, paddingVertical: 4, paddingLeft: 10, width: "100%" }} >
													<Text style={styles.location}>{showDateAsClientWant(this.state.eventDetails?.setup_date)}</Text>
												
												</TouchableOpacity>
											</View>
											<View style={styles.divider}></View>
											<View style={{ width: "45%" }}>
												<TouchableOpacity
													activeOpacity={1}
													style={{ paddingRight: 0, paddingVertical: 4, paddingLeft: 10, width: "100%" }} >
													<Text style={styles.location}>{this.state.eventDetails?.event_data?.setup_start_time}</Text>
												</TouchableOpacity>
											</View>
										</View>
									</View> */}

									{/* <View style={styles.row}>
										<View style={styles.rowLeft}>
											<Text style={styles.inputLable}>Playtime:</Text>
										</View>
										<View style={styles.rowRight}>
											<TouchableOpacity
												activeOpacity={1}
												style={{ paddingRight: 0, paddingVertical: 4, paddingLeft: 10, width: "100%" }} >
												<Text style={styles.location}>{this.state.eventDetails?.event_data?.play_time}</Text>
											</TouchableOpacity>
										</View>
									</View> */}

									{/* <View style={styles.row}>
										<View style={styles.rowLeft}>
											<Text style={styles.inputLable}># of Guests:</Text>
										</View>
										<View style={styles.rowRight}>
											<TouchableOpacity
												activeOpacity={1}
												style={{ paddingRight: 0, paddingVertical: 4, paddingLeft: 10, width: "100%" }} >
												<Text style={styles.location}>{this.state.eventDetails?.event_data?.num_of_guest}</Text>
											</TouchableOpacity>
										</View>
									</View> */}

									{/* <View style={styles.rowTop}>
										<View style={styles.rowLeft}>
											<Text style={styles.inputLable}>Event Type:</Text>
										</View>
										<View style={styles.rowRight}>
											<TouchableOpacity
												activeOpacity={1}
												style={{ paddingRight: 0, paddingVertical: 4, paddingLeft: 10, width: "100%" }} >
												<Text style={styles.location}>{this.state.eventDetails?.event_data?.event_type_name}</Text>
											</TouchableOpacity>
										</View>
									</View> */}
								</View>
								<View style={styles.rowContainer}>
								<View style={{ borderTopLeftRadius: 5 }}>
											<Text style={[styles.inputLable, { fontSize: 20 }]}>Setup :-</Text>
											
										</View>
										<View style={styles.row}>
										
										<View style={[styles.rowLeft, { borderTopRightRadius: 5,width: "45%" }]}>
											<Text style={[styles.inputLable, {color:Colors.black}]}>Date: </Text>
										
											</View>
											<View style={[styles.rowRight, { width: "55%" }]}>
												<Text style={[styles.inputLable,{color:Colors.black}]} >
												{showDateAsClientWant(eventDetails?.setup_date)}
												</Text>

											</View>
										</View> 
										<View style={styles.row}>
										
										<View style={[styles.rowLeft, { borderTopRightRadius: 5,width: "45%" }]}>
											<Text style={[styles.inputLable,{color:Colors.black}]}>Time </Text>
										
											</View>
											<View style={[styles.rowRight, { width: "55%" }]}>
												<Text style={[styles.inputLable,{color:Colors.black}]} >
												{showTimeAsClientWant(eventDetails?.setup_start_time)}
												</Text>

											</View>
										</View> 

										<View style={styles.row}>
										
										<View style={[styles.rowLeft, { borderTopRightRadius: 5,width: "45%" }]}>
											<Text style={[styles.inputLable,{color:Colors.black}]}> # of Guest:</Text>
										
											</View>
											<View style={[styles.rowRight, { width: "55%" }]}>
												<Text style={[styles.inputLable,{color:Colors.black}]} >
												{eventDetails?.num_of_guest}
												</Text>

											</View>
										</View> 

										<View style={styles.row}>
										
										<View style={[styles.rowLeft, { borderTopRightRadius: 5,width: "45%" }]}>
											<Text style={[styles.inputLable,{color:Colors.black}]}>  # of Kids:</Text>
										
											</View>
											<View style={[styles.rowRight, { width: "55%" }]}>
												<Text style={[styles.inputLable,{color:Colors.black}]} >
												{eventDetails?.num_of_kids}
												</Text>

											</View>
										</View> 

										<View style={styles.rowlast}>
										
										<View style={[styles.rowLeft, { borderTopRightRadius: 5,width: "45%" }]}>
											<Text style={[styles.inputLable,{color:Colors.black}]}>   Event Type:</Text>
										
											</View>
											<View style={[styles.rowRight, { width: "55%" }]}>
												<Text style={[styles.inputLable,{color:Colors.black}]} >
												{eventDetails?.event_type_name}
												</Text>

											</View>
										</View> 
										{/* // */}
											</View>
									<View style={styles.rowContainer}>
									<View style={styles.row}>
										
										<View style={[styles.rowLeft, { borderTopRightRadius: 5,width: "45%" }]}>
											<Text style={[styles.inputLable,{color:Colors.black}]}> Venue: </Text>
										
											</View>
											<View style={[styles.rowRight, { width: "55%" }]}>
												<Text style={[styles.inputLable,{color:Colors.black}]} >
												{eventDetails?.venue}
												</Text>

											</View>
										</View>
										<View style={styles.row}>
										
										<View style={[styles.rowLeft, { borderTopRightRadius: 5,width: "45%" }]}>
											<Text style={[styles.inputLable,{color:Colors.black}]}>  Address: </Text>
										
											</View>
											<View style={[styles.rowRight, { width: "55%" }]}>
												<Text style={[styles.inputLable,{color:Colors.black}]} >
												{eventDetails?.address}
												</Text>

											</View>
										</View>
										<View style={styles.row}>
										
										<View style={[styles.rowLeft, { borderTopRightRadius: 5,width: "45%" }]}>
											<Text style={[styles.inputLable,{color:Colors.black}]}>   Landmark: </Text>
										
											</View>
											<View style={[styles.rowRight, { width: "55%" }]}>
												<Text style={[styles.inputLable,{color:Colors.black}]} >
												{eventDetails?.landmark}
												</Text>

											</View>
										</View>

										<View style={styles.row}>
										
										<View style={[styles.rowLeft, { borderTopRightRadius: 5,width: "45%" }]}>
											<Text style={[styles.inputLable,{color:Colors.black}]}> Which Floor is the setup?:</Text>
										
											</View>
											<View style={[styles.rowRight, { width: "55%" }]}>
												<Text style={[styles.inputLable,{color:Colors.black}]} >
												{eventDetails?.floor_name}
												</Text>

											</View>
										</View>
										

										<View style={styles.rowlast}>
										
										<View style={[styles.rowLeft, { borderTopRightRadius: 5,width: "45%" }]}>
											<Text style={[styles.inputLable,{color:Colors.black}]}> Google Location:</Text>
										
											</View>
											<View style={[styles.rowRight, { width: "55%" }]}>
												<Text style={[styles.inputLable, {color:Colors.black}]} >
												{eventDetails?.google_location}
												</Text>

											</View>
										</View>
						</View>
		
								<View style={styles.rowContainer}>
		
									<View style={{ marginBottom: 10 }}>
										<Text style={{ fontWeight: 'bold', fontSize: 16 }}>Games</Text>
									</View>

									{lineItems?.map(item => {
										return (
											<View key={item.id.toString()} style={styles.listRow}>
												<View style={{ flexDirection: 'row' }}>
													<View style={{ width: "20%" }}>
														<ProgressiveImage
															source={{ uri: item.game.image_url  }}
															style={{ height: 57, width: "100%" }}
															resizeMode="cover"
														/>
													</View>
													<View style={{ width: "50%", paddingLeft: 10 }}>
														<Text style={styles.titleText} numberOfLines={1} ellipsizeMode="tail">
															{item.game.name}
														</Text>
														<Text style={styles.subText}>{item.quantity} Quantity</Text>
													</View>
													<View style={styles.qtyContainer}>
														<Text>Rent</Text>
														<Text style={styles.subText}>
															<FontAwesome name="rupee" size={13} color={Colors.grey} />
															{item.total_amount}
														</Text>
													</View>
												</View>
											</View>
										)
									})}
								</View>
							</ScrollView>
						</View>
					)
				}
			</View>
		);
	}
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white,
	},
	
		rowContainer: {
			paddingHorizontal: 6,
			backgroundColor: Colors.white,
			borderRadius: 4,
			elevation: 10,
			margin: 10,
			shadowColor: Colors.grey,
			shadowOffset: {width: 2, height: 4},
			shadowOpacity: 0.2,
			shadowRadius: 6,
		}

	,
	row: {
		marginTop: 0,
		flexDirection: 'row',
		marginBottom: 0,
		borderBottomWidth: 1.5,
		borderBottomColor: '#cfcfcf',
		// backgroundColor:'red'
	},
	rowlast: {
		marginTop: 0,
		flexDirection: 'row',
		marginBottom: 0,
		// borderBottomWidth: 1.5,
		// borderBottomColor: '#cfcfcf'
	},
	rowLeft: {
		
		width: '47%',
		backgroundColor: '#fff',
		paddingLeft: 0,
		paddingVertical: 10,
		justifyContent: 'center',
		marginTop: 0,
	},
	rowRight: {
		paddingLeft: 0,
		paddingVertical: 10,
		// flexDirection: "row",
		justifyContent:'center',
		width: '53%',
		marginLeft: 0,
		// backgroundColor: 'red',
		marginTop: 0,
		// justifyContent: 'space-evenly',
	},

	activeTab: {
		backgroundColor: Colors.primary,
	},

	activeText: {
		fontWeight: "bold",
		color: 'white',
	},
	inActiveText: {
		color: "silver",
		opacity: 0.8,
	},
	inputLable: {
		fontSize: 14,
		color: Colors.black,
		marginBottom: 0,
		opacity: 0.8,
		
	},
	form: {
		flex: 1,
		padding: 8,
	},
	topBtnContainer: {
		width: "100%",
		flexDirection: "row",
		justifyContent: "space-evenly",
		marginBottom: 30,
	},
	topBtn: {
		paddingHorizontal: 15,
		paddingVertical: 8,
		borderWidth: 1,
		borderColor: Colors.textInputBorder,
		backgroundColor: Colors.textInputBg,
		marginRight: 15,
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
	},
	submitBtn: {
		marginTop: 15,
		height: 45,
		width: "100%",
		backgroundColor: Colors.primary,
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 4,
	},

	desc: {
		fontSize: 14,
		color: Colors.grey,
		marginBottom: 3,
		fontWeight: "normal",
		opacity: 0.9,
	},


	listRow: {
		borderBottomColor: "#eee",
		borderBottomWidth: 1,
		paddingHorizontal: 5,
		paddingVertical: 5,
	},

	titleText: {
		fontSize: 14,
		fontWeight: "bold",
		color: Colors.grey,
		marginBottom: 2,
	},
});
