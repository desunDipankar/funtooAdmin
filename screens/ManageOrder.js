import React from "react";
import {
	View,
	StyleSheet,
	Text,
	TouchableOpacity,
	Dimensions,
	ScrollView
} from "react-native";
import Colors from "../config/colors";
import Configs from "../config/Configs";
import { Header } from "../components";

import LoadingList from "./manage-order/LoadingList";
import VehicleDetails from "./manage-order/VehicleDetails";
import Tracking from "./manage-order/Tracking";
import Accounting from "./manage-order/Accounting";
import Communications from "./manage-order/Communications";
import OrderDeliveryProofs from "./order/OrderDeliveryProofs";
import EventDetails from "./order/EventDetails";
import VendorVolunteers from "./order/VendorVolunteers";


export default class ManageOrder extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			activeTabIndex: this.props.route.params.activeTabIndex ? this.props.route.params.activeTabIndex : 0,
			data: this.props.route.params.orderItem
		};
	}

	setTabIndex = (index) => this.setState({ activeTabIndex: index });

	componentDidMount = () => {
		this.focusListner = this.props.navigation.addListener("focus", () => {
			this.setState({ isModalOpen: false });
		});
	};

	renderTabComponent = () => {
		let { activeTabIndex } = this.state;
		let component;
		switch (activeTabIndex) {
			case 0:
				component = <EventDetails
					orderData={this.props.route.params.orderItem}
					navigation={this.props.navigation}
				/>
				break;
			case 1:
				component = <OrderDeliveryProofs
					orderData={this.props.route.params.orderItem}
					navigation={this.props.navigation}
				/>
				break;
			case 2:
				component = <Tracking 
				orderData={this.props.route.params.orderItem}
				navigation={this.props.navigation}
				/>
				break;
			case 3:
				component = <Accounting 
					orderData={this.props.route.params.orderItem}
					navigation={this.props.navigation}
				/>
				break;
			// case 4:
			// 	component = <LoadingList
			// 		orderData={this.props.route.params.orderItem}
			// 		navigation={this.props.navigation}
			// 	/>
			// 	break;
			case 4:
				component = <VendorVolunteers
					orderData={this.props.route.params.orderItem}
					navigation={this.props.navigation}
				/>
				break;
			case 5:
				component = <VehicleDetails
					orderData={this.props.route.params.orderItem}
					navigation={this.props.navigation}
				/>
				break;
			// case 6:
			// 	component = <Proofs props={this.props} />
			// 	break;
			case 6:
				component = <Communications
					orderData={this.props.route.params.orderItem}
					navigation={this.props.navigation}
				/>
				break;

		}

		return component;
	};

	render = () => {
		return (
			<View style={styles.container}>
				<Header title="Order Details" />
				<View style={styles.tabContainer}>
					<ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
						{Configs.MANAGE_ORDER_TABS.map((value, index) => (
							<TouchableOpacity
								key={index.toString()}
								activeOpacity={this.state.activeTabIndex === index ? 1 : 0.2}
								onPress={
									this.state.activeTabIndex === index
										? undefined
										: this.setTabIndex.bind(this, index)
								}

								style={[
									styles.tab,
									this.state.activeTabIndex === index ? styles.activeTab : null,
								]}
							>
								<Text
									style={
										this.state.activeTabIndex === index
											? styles.activeText
											: styles.inActiveText
									}
								>
									{value}
								</Text>
							</TouchableOpacity>
						))}
					</ScrollView>
				</View>

				{this.renderTabComponent()}
			</View>
		);
	};
}

const tabHeight = 50;
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white,
	},
	tabContainer: {
		marginTop: 5,
		width: "100%",
		height: tabHeight,
		flexDirection: "row",
		borderBottomWidth: 1,
		borderBottomColor: "#d1d1d1",
		borderTopWidth: 1,
		borderTopColor: "#d1d1d1",
		elevation: 1,
	},
	tab: {
		minWidth: 120,
		paddingHorizontal: 15,
		alignItems: "center",
		justifyContent: "center",
		height: tabHeight,
		backgroundColor: Colors.primary,
	},
	underlineStyle: {
		backgroundColor: Colors.primary,
		height: 3,
	},
	activeTab: {
		height: tabHeight - 2,
		borderBottomWidth: 2,
		borderBottomColor: Colors.white,
	},
	activeText: {
		fontSize: 14,
		fontWeight: "bold",
		color: Colors.white,
	},
	inActiveText: {
		fontSize: 14,
		color: Colors.white,
		opacity: 0.8,
	},


	form: {
		flex: 1,
		padding: 8,
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

	callBtn: {
		position: "absolute",
		padding: 8,
		bottom: 5,
		right: 0,
	},


	submitBtn: {
		marginTop: 15,
		marginBottom: 15,
		height: 45,
		width: "100%",
		backgroundColor: Colors.primary,
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 4,
	},
	//Model

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
});
