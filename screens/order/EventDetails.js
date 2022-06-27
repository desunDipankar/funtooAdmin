import React, { Component } from "react";
import {
	View,
	StyleSheet,
	Text,
	LayoutAnimation,
	Platform,
	UIManager,
	ScrollView,
	TouchableOpacity
} from "react-native";

import Colors from "../../config/colors";
import { GetOrder } from "../../services/OrderService";
import OverlayLoader from "../../components/OverlayLoader";
import { showDateAsClientWant } from "../../utils/Util";
import OrderAndGenerateBill from "../../components/Orders/OrderAndGenerateBill";
import ProgressiveImage from '../../components/ProgressiveImage'

export default class EventDetails extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showLoader: false,
			orderData: props.orderData,
			eventDetails: null,
			expanded: false
		}
		if (Platform.OS === 'android') {
			UIManager.setLayoutAnimationEnabledExperimental(true);
		}
	}

	componentDidMount() {
		this.setState({ showLoader: true });
		GetOrder({ id: this.state.orderData.id })
			.then((result) => {
				if (result.is_success) {
					this.setState({
						eventDetails: result.data
					});
				}
			})
			.catch(err => console.log(err))
			.finally(() => {
				this.setState({ showLoader: false });
			});
	}

	changeLayout = () => { LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); this.setState({ expanded: !this.state.expanded }); }

	render = () => {
		let lineItems = this.state.eventDetails?.line_items;
		return (
			<>
				{
					(this.state.showLoader) ? (
						<OverlayLoader visible={this.state.showLoader} />
					) : (
						<View style={styles.container}>
							{/* <ScrollView> */}
								<View style={styles.rowContainer}>
									<View style={[styles.row , {}]}>
										<View style={[styles.rowLeft, {}]}>
											<Text style={styles.inputLable}>Event Start:</Text>
										</View>
										  <View style={[styles.rowRight, { }]}>
											<View style={{ width: "55%" }}>
												<TouchableOpacity
													activeOpacity={1}
													style={{ paddingRight: 0, paddingVertical: 4, paddingLeft: 10, width: "100%" }} >
													<Text style={styles.location}>{showDateAsClientWant(this.state.eventDetails?.event_date)}</Text>
												</TouchableOpacity>
											</View>
											<View style={[styles.divider,{marginLeft:14}]}></View>
											<View style={{ width: "45%", borderTopRightRadius: 5, }}>
												<TouchableOpacity
													activeOpacity={1}
													style={{ paddingRight: 0, paddingVertical: 4, paddingLeft: 10, width: "100%" }} >
													<Text style={styles.location}>{this.state.eventDetails?.event_data?.event_start_time}</Text>
												</TouchableOpacity>
											</View>
										</View>
									</View>

									<View style={styles.row}>
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
											<View style={[styles.divider ,{marginLeft:14}]}></View>
											<View style={{ width: "45%" }}>
												<TouchableOpacity
													activeOpacity={1}
													style={{ paddingRight: 0, paddingVertical: 4, paddingLeft: 10, width: "100%" }} >
													<Text style={styles.location}>{this.state.eventDetails?.event_data?.event_end_time}</Text>
												</TouchableOpacity>
											</View>
										</View>
									</View>

									<View style={styles.row}>
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
											<View style={[styles.divider , {marginLeft:14}]}></View>
											<View style={{ width: "45%" }}>
												<TouchableOpacity
													activeOpacity={1}
													style={{ paddingRight: 0, paddingVertical: 4, paddingLeft: 10, width: "100%" }} >
													<Text style={styles.location}>{this.state.eventDetails?.event_data?.setup_start_time}</Text>
												</TouchableOpacity>
											</View>
										</View>
									</View>

									<View style={styles.row}>
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
									</View>

									<View style={styles.row}>
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
									</View>

									<View style={styles.rowTop}>
										<View style={styles.rowLeft}>
											<Text style={styles.inputLable}>Event Type:</Text>
										</View>
										<View style={[styles.rowRight , {marginLeft:19}]}>
											<TouchableOpacity
												activeOpacity={1}
												style={{ paddingRight: 0, paddingVertical: 4, paddingLeft: 10, width: "100%" }} >
												<Text style={styles.location}>{this.state.eventDetails?.event_data?.event_type_name}</Text>
											</TouchableOpacity>
										</View>
									</View>
								</View>
                               
								<View style={styles.rowContainer}>

									<View style={styles.row}>
										<View style={styles.rowLeft}>
											<Text style={styles.inputLable}>Venue:</Text>
										</View>
										<View style={styles.rowRight}>
											<TouchableOpacity
												activeOpacity={1}
												style={{ paddingRight: 0, paddingVertical: 4, paddingLeft: 10, width: "100%" }} >
												<Text style={styles.location}>{this.state.eventDetails?.event_data?.venue}</Text>
											</TouchableOpacity>
										</View>
									</View>

									<View style={styles.row}>
										<View style={styles.rowLeft}>
											<Text style={styles.inputLable}>Address:</Text>
										</View>
										<View style={styles.rowRight}>
											<TouchableOpacity
												activeOpacity={1}
												style={{ paddingRight: 0, paddingVertical: 4, paddingLeft: 10, width: "100%" }} >
												<Text style={styles.location}>{this.state.eventDetails?.event_data?.address}</Text>
											</TouchableOpacity>
										</View>
									</View>

									<View style={styles.rowTop}>
										<View style={styles.rowLeft}>
											<Text style={styles.inputLable}>Google Location:</Text>
										</View>
										<View style={[styles.rowRight , {marginLeft:19}]}>
											<TouchableOpacity
												activeOpacity={1}
												style={{ paddingRight: 0, paddingVertical: 4, paddingLeft: 10, width: "100%" }} >
												<Text style={styles.location}>{this.state.eventDetails?.event_data?.google_location}</Text>
											</TouchableOpacity>
										</View>
									</View>

									{/* {this.state.orderDetails?.event_data?.google_location ? (
										null
									) : (
										<View style={styles.row}>
											<View style={styles.rowLeft}>
												<Text style={styles.inputLable}>Landmark:</Text>
											</View>
											<View style={styles.rowRight}>
												<TouchableOpacity
													activeOpacity={1}
													style={{ paddingRight: 0, paddingVertical: 4, paddingLeft: 10, width: "100%" }} >
													<Text style={styles.location}>{this.state.eventDetails?.event_data?.landmark ?? 'N/A'}</Text>
												</TouchableOpacity>
											</View>
										</View>
									)} */}

								</View>

								{/* <View style={[styles.rowContainer]}>

									<View style={{ marginBottom: 10 }}>
										<Text style={{ fontSize: 16 }}>Games</Text>
									</View>

									{
										lineItems?.map(item => {
											return (
												<View key={item.game.id} style={[styles.listRow]}>
													<View style={{ flexDirection: 'row' }}>
														<View style={{ width: "20%", borderWidth: 1, borderColor: '#dfdfdf' }}>
															<ProgressiveImage
																source={{ uri: item.game.image_url }}
																style={{ height: 57, width: "100%" }}
																resizeMode="cover"
															/>
														</View>
														<View style={{ width: "50%", paddingLeft: 10, justifyContent: 'center' }}>

															<Text style={[styles.titleText]} numberOfLines={1} ellipsizeMode="tail">
																{item.game.name}
															</Text>
															<View style={{ flexDirection: 'row', }}>
																<Text style={{ color: Colors.black, opacity: 0.6 }}>{`${item.quantity > 1 ? item.quantity + " * " : ''}`}</Text>
																<Text style={{ fontSize: 9, paddingTop: Platform.OS == 'ios' ? 1.1 : 2.2, color: Colors.black, opacity: 0.6 }}>{'₹'}</Text>
																<Text style={{ color: Colors.black, opacity: 0.6 }}>{`${Math.floor(item.price)}`}</Text>
																<Text style={{ fontSize: 9, paddingTop: Platform.OS == 'ios' ? 1 : 1.8, color: Colors.black, opacity: 0.6 }}>{"00"}</Text>
															</View>
														</View>
														<View style={{ width: '30%', flexDirection: 'row', justifyContent: 'flex-end', paddingTop: 7 }}>
															<Text style={{ fontSize: 9, paddingTop: Platform.OS == 'ios' ? 1.1 : 2.2, color: Colors.black, opacity: 0.6 }}>{'₹'}</Text>
															<Text style={{ color: Colors.black, opacity: 0.6 }}>{item.total_amount}</Text>
															<Text style={{ fontSize: 9, paddingTop: Platform.OS == 'ios' ? 1 : 1.8, color: Colors.black, opacity: 0.6 }}>{"00"}</Text>
														</View>
													</View>
												</View>
											)
										})
									}

								</View> */}

								{/* <View style={[styles.cardFooter, { flexDirection: "column" }]}>
									<View style={styles.pricingItemContainer}>
										<Text style={styles.pricingText}>Sub Total</Text>
										<View style={{ flexDirection: 'row', justifyContent: 'center' }}>
											<Text style={{ fontSize: 9, paddingTop: Platform.OS == 'ios' ? 1.1 : 2.2, color: Colors.black, opacity: 0.6 }}>{'₹'}</Text>
											<Text style={{ color: Colors.black, opacity: 0.6 }}>{this.state.eventDetails?.subtotal}</Text>
											<Text style={{ fontSize: 9, paddingTop: Platform.OS == 'ios' ? 1 : 1.8, color: Colors.black, opacity: 0.6 }}>{"00"}</Text>
										</View>
									</View>

									{
										this.state.transport_price > 0 ?
											null :
											<View style={[styles.pricingItemContainer, { marginTop: 5 }]}>
												<Text style={styles.pricingText}>Transport Charges</Text>
												<View style={{ flexDirection: 'row', justifyContent: 'center' }}>
													<Text style={{ fontSize: 9, paddingTop: Platform.OS == 'ios' ? 1.1 : 2.2, color: Colors.black, opacity: 0.6 }}>{'₹'}</Text>
													<Text style={{ color: Colors.black, opacity: 0.6 }}>{this.state.eventDetails?.transport}</Text>
													<Text style={{ fontSize: 9, paddingTop: Platform.OS == 'ios' ? 1 : 1.8, color: Colors.black, opacity: 0.6 }}>{"00"}</Text>
												</View>
											</View>
									}


									{
										this.state.discount == 0 ?
											null :
											<View style={[styles.pricingItemContainer, { marginTop: 5 }]}>
												<Text style={styles.pricingText}>Discount</Text>
												<View style={{ flexDirection: 'row', justifyContent: 'center' }}>
													<Text style={{ fontSize: 9, paddingTop: Platform.OS == 'ios' ? 1.1 : 2.2, color: Colors.black, opacity: 0.6 }}>{'₹'}</Text>
													<Text style={{ color: Colors.black, opacity: 0.6 }}>{this.state.eventDetails?.discount}</Text>
													<Text style={{ fontSize: 9, paddingTop: Platform.OS == 'ios' ? 1 : 1.8, color: Colors.black, opacity: 0.6 }}>{"00"}</Text>
												</View>
											</View>
									}

									<View style={[styles.pricingItemContainer, { marginTop: 5 }]}>
										<Text style={styles.pricingText}>GST 18%</Text>
										<View style={{ flexDirection: 'row', justifyContent: 'center' }}>
											<Text style={{ fontSize: 9, paddingTop: Platform.OS == 'ios' ? 1.1 : 2.2, color: Colors.black, opacity: 0.6 }}>{'₹'}</Text>
											<Text style={{ color: Colors.black, opacity: 0.6 }}>{this.state.eventDetails?.total_tax}</Text>
											<Text style={{ fontSize: 9, paddingTop: Platform.OS == 'ios' ? 1 : 1.8, color: Colors.black, opacity: 0.6 }}>{"00"}</Text>
										</View>
									</View>

									<View style={[styles.pricingItemContainer, { marginTop: 5 }]}>
										<Text style={[styles.pricingText, { fontWeight: "bold" }]}>
											Total Amount
										</Text>
										<View style={{ flexDirection: 'row', justifyContent: 'center' }}>
											<Text style={{ fontSize: 9, paddingTop: Platform.OS == 'ios' ? 1.1 : 2.2, color: Colors.black, opacity: 0.6 }}>{'₹'}</Text>
											<Text style={{ color: Colors.black, opacity: 0.6 }}>{this.state.eventDetails?.grand_total}</Text>
											<Text style={{ fontSize: 9, paddingTop: Platform.OS == 'ios' ? 1 : 1.8, color: Colors.black, opacity: 0.6 }}>{"00"}</Text>
										</View>
									</View>
								</View> */}
							{/* </ScrollView> */}
							<OrderAndGenerateBill orderData={this.props.orderData} />
						</View>
					)
				}
			</>
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
	},
	rowContainerGames: {
		paddingHorizontal: 8,
		paddingVertical: 10,
		backgroundColor: Colors.white,
		borderRadius: 4,
		elevation: 10,
		marginLeft: 10,
		marginRight: 10
	},
	row: {
		marginTop: 0,
		flexDirection: 'row',
		justifyContent:'space-between',
		marginBottom: 0,
		borderBottomWidth: 1.5,
		borderBottomColor: '#cfcfcf'
	},

	rowTop: {
		marginTop: 0,
		flexDirection: 'row',
		marginBottom: 0,
		// backgroundColor:'red'
	},
	rowLeft: {
		width: '34%',
		backgroundColor: '#fff',
		paddingLeft: 0,
		paddingVertical: 10,
		justifyContent: 'center',
		marginTop: 0,
		// paddingTop:1,
		// paddingBottom:1,
	},

	rowRight: {
		flexDirection: "row",
		width: '60%',
		justifyContent: 'center',
		alignItems:'center',
		marginLeft: 0,
		backgroundColor: '#fff',
		marginTop: 0,
		justifyContent:'space-between',
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
		fontSize: 14,
		color: Colors.black,
		marginBottom: 0,
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
	cardFooter: {
		borderRadius: 4,
		marginLeft: 10,
		width: "94%",
		paddingHorizontal: 8,
		paddingVertical: 10,
		backgroundColor: Colors.white,
		elevation: 10,
		marginBottom: 10,
	},

	pricingItemContainer: {
		width: "100%",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},

	pricingText: {
		fontSize: 14,
		color: Colors.black,
	},

	location: {
		color: Colors.black,
		fontSize: 14,
		opacity: 0.8
	},
	divider: {
		width: "3%",
		borderLeftWidth: 0.3,
		alignSelf: 'center',
		height: 20,
		borderLeftColor: '#444',
		opacity: 0.4,
		paddingLeft:0
	}
});