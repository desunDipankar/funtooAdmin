import React, { Component } from "react";
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    Dimensions,
    Alert,
    FlatList,
    RefreshControl,
    Modal,
    Platform,
    Linking
} from "react-native";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import Colors from "../../config/colors";
import Configs from "../../config/Configs";
import { VolunteerList, AddVolunteer, UpdateVolunteer, DeleteVolunteer } from "../../services/VolunteerApiService";
import { DeleteVenderEnquiry, VenderEnquiryList } from "../../services/VenderEnquiryApiService";
import { VenderList } from "../../services/VenderApiService";
import AwesomeAlert from 'react-native-awesome-alerts';
import AppContext from "../../context/AppContext";
import * as SMS from 'expo-sms';
import OverlayLoader from "../../components/OverlayLoader";
import { 
    GetAllOrderVolunteerVendorDetails, 
    DeleteOrderVolunteerVendorDetails,
    AddOrderCommunicationDetails,
    GetAllOrderCommunicationDetails,
    DeleteOrderCommunicationDetails
} from "../../services/OrderService";
import { showDateAsClientWant, showTimeAsClientWant } from "../../utils/Util";


export default class VendorVolunteers extends Component {

    static contextType = AppContext;
    constructor(props) {
        super(props);
        this.state = {
            orderData: this.props.orderData,
            isLoading: false,
            currentTab: 'Vendorlist',
            orderVendorList: [],
            vendorList: [],
            communicationList: [],
            isVenderModalOpen: false
        }
    }

    loadAllOrderVolunteerVendorDetails = () => {
        this.setState({ isLoading: true });
        Promise.all([
            GetAllOrderVolunteerVendorDetails({ order_id: this.state.orderData.id }),
            VenderList(),
            GetAllOrderCommunicationDetails({order_id: this.state.orderData.id, type: 'call'})
        ])
        .then((result) => {
            if (result[0].is_success) {
                this.setState({
                    orderVendorList: result[0].data
                });
            }
            if (result[1].is_success) {
                this.setState({
                    vendorList: result[1].data
                });
            }
            if (result[2].is_success) {
                this.setState({
                    communicationList: result[2].data
                });
            }
        })
        .catch(err => console.log(err))
        .finally(() => {
            this.setState({ isLoading: false });
        });
    }

    componentDidMount() {
        this.loadAllOrderVolunteerVendorDetails();
        this.focusLisnter = this.props.navigation.addListener('focus', () => {
            this.loadAllOrderVolunteerVendorDetails();
        });
    }

    componentWillUnmount() {
        this.focusLisnter = null;
    }
    
    addNewVendorToEventForVolunteers = () => {
        this.props.navigation.navigate("OrderVendorVolunteersAdd", {
            orderData: this.props.orderData
        });
    }

    toggleVenderModal = () => {
        this.setState( (prevState) => {
            return {
                isVenderModalOpen: !prevState.isVenderModalOpen
            }
        } )
    }

    dialCall = (mobile, vendorDetails) => {
        let phoneNumber = (Platform.OS === 'android') ? `tel:${mobile}` : `telprompt:${mobile}`;
        Linking.openURL(phoneNumber)
        .then( (isSuccess) => {
            // create a call record here
            if(isSuccess) {
                let data  = {
                    order_id: this.state.orderData.id,
                    type: 'call',
                    vendor_name: vendorDetails.name,
                    called_number: mobile,
                    created_by: this.context.userData.id,
                    created_by_name: this.context.userData.name
                }
                AddOrderCommunicationDetails(data).
                then( res => {console.log(res)} )
                .catch( err => {} );
            }
        })
        .catch( err  => console.log(err));
    };

    DeleteOrderVendorVolunteer = (id) => {
        Alert.alert(
            "Are your sure?",
            "Are you sure you want to remove this item?",
            [
                {
                    text: "Yes",
                    onPress: () => {
                        this.setState({
                            orderVendorList: this.state.orderVendorList.filter(item => item.id !== id)
                        }, () => DeleteOrderVolunteerVendorDetails({ id: id }).then(res => { }).catch(err => { console.log(err) }));
                    },
                },
                {
                    text: "No"
                },
            ]
        );
    }

    deleteCommunicationListItem = (id) => {
        Alert.alert(
            "Alert",
            "Are you sure you want to remove this item?",
            [
                {
                    text: "Yes",
                    onPress: () => {
                        this.setState({
                            communicationList: this.state.communicationList.filter(item => item.id !== id)
                        }, () => DeleteOrderCommunicationDetails({ id: id }).then(res => { }).catch(err => { console.log(err) }));
                    },
                },
                {
                    text: "No"
                },
            ]
        );
    }

    renderOrderVendorListItem = ({ item }) => {
        return (
            <TouchableOpacity key={item.id}
                onLongPress={this.DeleteOrderVendorVolunteer.bind(this, item.id)}
                onPress={() => console.log('update this item')}
                style={styles.listRow}
            >
                <View style={styles.leftPart}>
                    <View style={{ flexDirection: 'row' }}>
                        <View><Text>Vendor Name : <Text style={styles.title}>{item.vendor_name}</Text></Text></View>
                    </View>
                    <Text style={styles.subText}>
                        {"# of staff booked: " + item.num_of_staff_required} Guys
                    </Text>
                    <Text style={styles.subText}>Amount: {item.amount}</Text>
                    <Text style={styles.subText}>Reporting Date: {showDateAsClientWant(item.reporting_date)}</Text>
                    <Text style={styles.subText}>Reporting Time: {showTimeAsClientWant(item.reporting_time)}</Text>
                </View>

                <View style={[styles.rightPart, { alignItems: 'flex-end' }]}></View>
            </TouchableOpacity>
        )
    }

    
    renderVendorListItem = ({ item }) => {
        
        return (
            <View key={item.id}
                onLongPress={ () => console.log('delet enq') }
                onPress={ () => console.log('go to more update page') }
                style={styles.listRow}
            >

                <View style={styles.leftPart}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.title}>Vendor Name:{item.name}  </Text>
                    </View>
                    <Text style={styles.subText}>
                        {"Shop Name: " + item.shop_name}
                    </Text>

                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.subText} t>Mobile :</Text>
                        <TouchableOpacity onPress={ () => this.dialCall(item.mobile, item) }>
                            <Text style={styles.rowValue}>{item.mobile}</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <View>
                            {item.mobiles?.map((number, index) => <TouchableOpacity key={index}
                                onPress={ () => this.dialCall(number, item) }>
                                <FontAwesome name="phone" size={17} color={'green'}><Text>{number}</Text></FontAwesome>
                            </TouchableOpacity>)}
                        </View>
                    </View>
                </View>
                <View style={[styles.rightPart, { alignItems: 'flex-end' }]}>
                </View>
            </View>
        )
    }

    renderCommunicationListItem = ({item}) => {
        return(
            <TouchableOpacity key={item.id}
                onLongPress={ () => this.deleteCommunicationListItem(item.id) }
                onPress={() => console.log('update screen')}
                style={styles.listRow}
            >
                <View style={styles.leftPart}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.title}>Call By: {item.created_by_name}  </Text>
                    </View>
                    <Text style={styles.subText}>
                        {"Date: " + showDateAsClientWant(item.calling_date) + " (" + showTimeAsClientWant(item.calling_time) + ")"}
                    </Text>
                    <Text style={styles.subText}>{"Vendor Name: " + item.vendor_name}</Text>
                    <Text style={styles.subText}>{"Mobile: " + item.called_number}</Text>
                    <Text style={styles.subText}>{"Remark: "}</Text>
                    <Text style={styles.subText}>{item.comments}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    render = () => (
        <>
            {
                (this.state.isLoading === true) ? (
                    <OverlayLoader visible={this.state.isLoading} />
                ) : null
            }

            <View style={styles.container}>

                <View style={styles.tabContainer}>

                    {this.state.currentTab === "Vendorlist" ? <View style={[styles.tab, styles.activeTab, { flexDirection: 'row', alignItems: 'center' }]}>
                        <Text style={styles.activeText}>
                            Volunteer
                        </Text>
                        <TouchableOpacity
                            onPress={() => this.addNewVendorToEventForVolunteers()}
                        >
                            <FontAwesome
                                name="plus"
                                size={14}
                                color={Colors.primary}
                                style={{ marginLeft: 10 }}
                            />

                        </TouchableOpacity>

                    </View>
                        : <TouchableOpacity
                            onPress={() => this.setState({ currentTab: 'Vendorlist' })}
                            style={styles.tab}
                        >
                            <Text
                                style={styles.inActiveText}
                            >
                                Volunteers
                            </Text>
                        </TouchableOpacity>
                    }
                    
                    {this.state.currentTab === "Enquiry" ? <View style={[styles.tab, styles.activeTab, { flexDirection: 'row', alignItems: 'center' }]}>
                        <Text style={styles.activeText}>
                            Call Records
                        </Text>
                        <TouchableOpacity
                            onPress={() => this.toggleVenderModal()  }
                        >
                            <FontAwesome
                                name="plus"
                                size={14}
                                color={Colors.primary}
                                style={{ marginLeft: 10 }}
                            />

                        </TouchableOpacity>

                    </View>
                        : <TouchableOpacity
                            onPress={() => this.setState({ currentTab: 'Enquiry' })}
                            style={styles.tab}
                        >
                            <Text
                                style={styles.inActiveText}
                            >
                                Call Records
                            </Text>
                        </TouchableOpacity>
                    }

                </View>

                {this.state.currentTab == "Vendorlist" &&
                    <View style={{ marginBottom: 60 }}>
                        <FlatList
                            data={this.state.orderVendorList}
                            keyExtractor={(item, index) => item.id.toString()}
                            renderItem={this.renderOrderVendorListItem}
                            initialNumToRender={4}
                            contentContainerStyle={styles.listContainer}
                            refreshControl={
                                <RefreshControl
                                    refreshing={false}
                                    onRefresh={() => this.loadAllOrderVolunteerVendorDetails()}
                                />
                            }
                        />
                    </View>}

                {this.state.currentTab == "Enquiry" && 
                <View style={{ marginBottom: 60 }}>
                    <FlatList
                        data={this.state.communicationList}
                        keyExtractor={(item, index) => item.id.toString()}
                        renderItem={this.renderCommunicationListItem}
                        initialNumToRender={4}
                        contentContainerStyle={styles.listContainer}
                        refreshControl={
                            <RefreshControl
                                refreshing={false}
                                onRefresh={() => this.loadAllOrderVolunteerVendorDetails()}
                            />
                        }
                    />
                </View>}
            </View>

            <Modal
                animationType="fade"
                transparent={true}
                visible={this.state.isVenderModalOpen}
                onRequestClose={this.toggleVenderModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.itemModalContainer}>
                        <View style={styles.itemModalHeader}>
                            <TouchableOpacity
                                activeOpacity={1}
                                style={styles.headerBackBtnContainer}
                                onPress={this.toggleVenderModal}
                            >
                                <Ionicons name="arrow-back" size={26} color={Colors.white} />
                            </TouchableOpacity>
                            <View style={styles.headerTitleContainer}>
                                <Text style={{ fontSize: 20, color: Colors.white }}>
                                    Contact Vendors
                                </Text>
                            </View>
                        </View>
                        <View style={styles.itemModalBody}>
                            <FlatList
                                data={this.state.vendorList}
                                keyExtractor={(item, index) => item.id.toString()}
                                renderItem={this.renderVendorListItem}
                                initialNumToRender={this.state.vendorList?.length}
                                contentContainerStyle={styles.listContainer}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={false}
                                        onRefresh={ () => console.log('refresh page') }
                                    />
                                }
                            />
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );
}

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const tabHeight = 50;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    tabContainer: {
        width: "100%",
        height: tabHeight,
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#d1d1d1",
        borderTopWidth: 0,
        borderTopColor: "#d1d1d1",
        elevation: 1,
        marginTop: 10
    },

    tab: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        height: tabHeight,
    },
    underlineStyle: {
        backgroundColor: Colors.primary,
        height: 3,
    },
    activeTab: {
        height: tabHeight - 1,
        borderBottomWidth: 2,
        borderBottomColor: Colors.primary,
    },
    activeText: {
        fontSize: 14,
        fontWeight: "bold",
        color: Colors.primary,
    },
    inActiveText: {
        fontSize: 14,
        color: "silver",
        opacity: 0.8,
    },

    listContainer: {
        flex: 1,
        margin: 5
    },
    card: {
        width: "100%",
        paddingHorizontal: 8,
        paddingVertical: 10,
        backgroundColor: Colors.white,
        borderBottomWidth: 1,
        borderColor: Colors.textInputBorder,
        elevation: 2,
    },


    rowContainer: {
        borderColor: 'silver',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,

    },
    row: {
        marginTop: 5,
        flexDirection: 'row',
    },
    rowItem: {
        width: '33.33%',
        justifyContent: 'center',
        alignItems: 'center'
    },

    rowLebel: {
        fontWeight: 'bold',
        //color: 'silver',
        fontSize: 16

    },
    rowValue: {
        color: 'gray'
    },

    subText: {
        fontSize: 13,
        color: Colors.grey,
        opacity: 0.9,
        marginBottom: 2,
    },

    btn_touch: {
        width: "10%",
        alignItems: "center",
        justifyContent: "center",
    },
    form: {
        flex: 1,
        padding: 8,
    },
    topBtnContainer: {
        width: "100%",
        flexDirection: "row",
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
    thead: {
        width: "100%",
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
    tdLarge: {
        flex: 0.5,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderLeftColor: Colors.textInputBorder,
        borderRightColor: Colors.textInputBorder,
        justifyContent: "center",
        paddingHorizontal: 6,
    },
    tdSmall: {
        flex: 0.2,
        alignItems: "center",
        justifyContent: "center",
        borderRightWidth: 1,
        borderRightColor: Colors.textInputBorder,
        paddingHorizontal: 6,
    },
    tdLabel: {
        fontSize: 14,
        color: Colors.grey,
        opacity: 0.8,
    },
    capsule: {
        height: 25,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingBottom: 2,
        borderRadius: 50,
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
    modalOverlay: {
        justifyContent: "center",
        alignItems: "center",
        width: windowWidth,
        height: windowHeight,
        backgroundColor: Colors.white,
    },
    itemModalContainer: {
        flex: 1,
        width: windowWidth,
        height: windowHeight,
        backgroundColor: Colors.white,
    },
    itemModalHeader: {
        height: 55,
        flexDirection: "row",
        width: "100%",
        backgroundColor: Colors.primary,
        elevation: 1,
        alignItems: "center",
        justifyContent: "flex-start",
    },
    headerBackBtnContainer: {
        width: "15%",
        height: 55,
        paddingLeft: 5,
        alignItems: "flex-start",
        justifyContent: "center",
    },
    headerTitleContainer: {
        width: "70%",
        paddingLeft: 20,
        height: 55,
        alignItems: "center",
        justifyContent: "center",
    },
    itemModalBody: {
        flex: 1,
        height: windowHeight - 55,
    },

    listRow: {

        flexDirection: "row",
        paddingHorizontal: 8,
        paddingVertical: 10,
        backgroundColor: Colors.white,
        borderRadius: 4,
        elevation: 10,
        marginBottom: 10,
        margin: 5,
    },

    leftPart: {
        width: "80%",
        justifyContent: "center",
    },
    rightPart: {
        width: "20%",
        justifyContent: "center",
    },

    title: {
        fontSize: 16,
        color: Colors.grey,
        fontWeight: "bold",
        lineHeight: 24,
    },

    subText: {
        color: Colors.grey,
        opacity: 0.8,
        fontSize: 14,
        lineHeight: 22,
    }
});