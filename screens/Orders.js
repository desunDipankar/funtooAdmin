import React from "react";
import {
	View,
	StyleSheet,
	Text,
	TouchableOpacity,
	SectionList,
	RefreshControl
} from "react-native";
import moment from "moment";
import Colors from "../config/colors";
import Header from "../components/Header";
import Loader from "../components/Loader";
import EmptyScreen from "../components/EmptyScreen";
import { GetOrders } from "../services/OrderService";
import ShowMoreLess from "../components/ShowMoreLess";
import { showDateAsClientWant, showTimeAsClientWant } from "../utils/Util";

export default class Orders extends React.Component {
	
	constructor(props) {
		super(props)
		this.state = {
			orderData: [],
			isLoading: false,
			refreshing: false,
		}
	}

	componentDidMount() {
		this.loadOrderDetails();
	}

	loadOrderDetails = () => {
		this.setState({ isLoading: true });
		GetOrders('confirmed')
		.then((result) => {
			if (result.is_success) {
				this.setState({
					orderData: result.data
				});
			}
		})
		.catch(err => console.log(err))
		.finally(() => {
			this.setState({
				isLoading: false,
				refreshing: false
			});
		});
	}

	gotoManageOrder = (item) => {
		
		this.props.navigation.navigate("ManageOrder", { orderItem: item });
	};

	onRefresh = () => {
		this.setState({ refreshing: true }, () => { this.loadOrderDetails() })
	}

	renderEmptyContainer = () => {
		return (
			<EmptyScreen />
		)
	}

	listItem = ({ item }) => {
		return (
			<TouchableOpacity
				key={item.id.toString()}
				activeOpacity={0.8}
				style={styles.card}
				onPress={() => this.gotoManageOrder(item)}
			>
				<Text style={styles.desc}>{"Order#: " + item.order_id}</Text>
				<Text style={styles.desc}>{"Event Date: "} {showDateAsClientWant(item.event_date)}</Text>
				<Text style={styles.desc}>{"Venue: " + item.venue}</Text>
				<Text style={styles.desc}>{"Setup by: " + showTimeAsClientWant(item.setup_by)}</Text>
				<Text style={styles.desc}>
					{"Event Time: " + showTimeAsClientWant(item.event_start_time) + ' - ' + showTimeAsClientWant(item.event_end_time)}
				</Text>
				<Text style={styles.desc}>
					{"Client Name: " + (item.customer_name !== null ? item.customer_name : "")}
				</Text>


				<ShowMoreLess render={() => (

					<View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 }}>

						<TouchableOpacity
							onPress={() => {
								this.props.navigation.navigate("ManageOrder", { orderItem: item });
							}}
							style={{ margin: 5 }}
						>
							<Text style={styles.moreMenu}>Order Details</Text>
						</TouchableOpacity>

						<TouchableOpacity
							onPress={() => {
								this.props.navigation.navigate("ManageOrder", {
									orderItem: item,
									activeTabIndex: 2
								});
							}}
							style={{ margin: 5 }}
						>
							<Text style={styles.moreMenu}>Tracking</Text>
						</TouchableOpacity>

						<TouchableOpacity
							onPress={() => {
								this.props.navigation.navigate("OrderSetupPhotos", {
									orderItem: item
								});
							}}
							style={{ margin: 5 }}
						>
							<Text style={styles.moreMenu}>Setup Photos</Text>
						</TouchableOpacity>

					</View>

				)} />


			</TouchableOpacity>


		)
	};

	render = () => (
		<View style={styles.container}>
			<Header title="Manage Orders" />
			{this.state.isLoading ? (
				<Loader />
			) : (
				<SectionList
					sections={this.state.orderData}
					keyExtractor={(item, index) => item.id.toString()}
					renderItem={this.listItem}
					contentContainerStyle={styles.listContainer}
					ListEmptyComponent={this.renderEmptyContainer()}
					renderSectionHeader={({ section: { title } }) => {
						return (
							<View style={styles.sectionHeader}>
								<View style={styles.sectionHeaderLeft}>
									<Text style={{ fontSize: 26, color: Colors.white }}>
										{moment(title, "YYYY-MM-DD").format("DD")}
									</Text>
								</View>
								<View style={styles.sectionHeaderRight}>
									<Text style={{ fontSize: 16, color: Colors.white }}>
										{moment(title, "YYYY-MM-DD").format("dddd")}
									</Text>
									<Text style={{ fontSize: 14, color: Colors.white }}>
										{moment(title, "YYYY-MM-DD").format("MMMM YYYY")}
									</Text>
								</View>
							</View>
						)
					}}
					refreshControl={
						<RefreshControl
							refreshing={this.state.refreshing}
							onRefresh={this.onRefresh}
						/>
					}
				/>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white,
	},
	moreMenu: {
		alignSelf: 'center',
		fontSize: 11,
		marginVertical: 2,
		marginLeft: 1,
		padding: 10,
		backgroundColor: Colors.primary,
		color: Colors.white,
		borderWidth: 0.7,
		borderColor: '#dfdfdf',
		borderRadius: 8
	},
	listContainer: {
		padding: 8,
	},
	sectionHeader: {
		width: "100%",
		height: 50,
		flexDirection: "row",
		backgroundColor: Colors.primary,
		marginBottom: 10,
		borderRadius: 3,
	},
	sectionHeaderLeft: {
		width: "14%",
		alignItems: "flex-end",
		justifyContent: "center",
		borderRightWidth: 1,
		borderRightColor: Colors.white,
		paddingRight: 10,
	},
	sectionHeaderRight: {
		alignItems: "flex-start",
		justifyContent: "center",
		paddingLeft: 10,
	},
	card: {
		width: "100%",
		paddingHorizontal: 8,
		paddingVertical: 10,
		backgroundColor: Colors.white,
		borderRadius: 4,
		elevation: 10,
		marginBottom: 10,
	},
	desc: {
		fontSize: 14,
		color: Colors.grey,
		marginBottom: 3,
		fontWeight: "normal",
		opacity: 0.9,
	}
});
