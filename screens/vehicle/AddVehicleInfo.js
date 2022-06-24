import React from "react";
import {
    View,
    StyleSheet,
    Text,
    Dimensions,
    TouchableOpacity,
    Alert,
    ScrollView,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView
} from "react-native";
import Colors from "../../config/colors";
import { Header } from "../../components";
import { DateAndTimePicker, Dropdown } from "../../components";
import AwesomeAlert from 'react-native-awesome-alerts';
import { getFormattedDate } from "../../utils/Util";
import { AddVehicleInfo as AddVehicleInfoApiService } from "../../services/VehicleInfoApiService";
import OverlayLoader from "../../components/OverlayLoader";
import { VenderList } from "../../services/VenderApiService";
import { GetAllWareHouses } from "../../services/WareHouseService";
import AppContext from "../../context/AppContext";
import moment from "moment";
import DateAndTimePicker2 from '../../components/DateAndTimePicker2'
import { showDateAsClientWant, showTimeAsClientWant } from "../../utils/Util";

export default class AddVehicleInfo extends React.Component {
    static contextType = AppContext;
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            orderData: this.props.route.params.orderData,
            selected_warehouse: '',
            warehouse_data: [],
            vender_name: '',
            vendor_id: null,
            venders: [],
            phone: '',
            type: '',
            journey_type: '',
            schedule_date: '',
            schedule_time: '',
            booking_done_by: '',
            booking_date: '',
            booking_time: '',
            from_address: '',
            to_address: ''
        }
    }

    currentTime = () => {
        return moment(new Date()).format("HH:mm");
    }

    calculateScheduleTime = (date, time) => {
        let m = moment(`${date} ${time}`, "YYYY-MM-DD hh:mm:ss").subtract(4, 'hours');

        return moment(m).format('h:mm');
    }

    componentDidMount() {
        this.setState({
            to_address: this.state.orderData.address,
            booking_done_by: this.context.userData.name,
            booking_date: moment().format('YYYY-MM-DD'),
            booking_time: this.currentTime(),
            journey_type: 'Onward',
            schedule_date: new Date(this.state.orderData.setup_date),
            schedule_time: this.calculateScheduleTime(this.state.orderData.setup_date, this.state.orderData.setup_by)
        }, this.Bind());
    }

    Bind() {
        this.setState({
            isLoading: true
        });
        Promise.all([VenderList(), GetAllWareHouses()]).then((values) => {
            this.setState({
                isLoading: false,
                venders: values[0].data,
                warehouse_data: values[1].data
            });
        }).catch((err) => {
            this.setState({
                isLoading: false
            }, () => {
                Alert.alert("Server Error", "please try again");
            });
        });
    }

    Add = () => {

        this.setState({
            isLoading: true
        });

        const data = {
            vender_id: this.state.vendor_id,
            order_id: this.state.orderData.id,
            type: this.state.type,
            phone: this.state.phone,
            journey_type: this.state.journey_type,
            schedule_date: getFormattedDate(this.state.schedule_date),
            schedule_time: this.state.schedule_time,
            from_address: this.state.from_address,
            to_address: this.state.to_address,
            booking_done_by: this.state.booking_done_by,
            booking_date: getFormattedDate(this.state.booking_date),
            booking_time: this.state.booking_time
        }

        AddVehicleInfoApiService(data).then((result) => {
            this.setState({
                isLoading: false
            });
            if (result.is_success) {
                this.props.navigation.goBack();
            }
        }).catch((err) => {
            this.setState({
                isLoading: false
            });
            console.log(err);
        })
    }

    render() {
        return (
            <>
                {this.state.isLoading && <OverlayLoader />}
                <SafeAreaView style={styles.container}>
                    <Header title={"Add Vehicle"} />
                    <KeyboardAvoidingView
                        keyboardVerticalOffset={500}
                        style={{ flex: 1, }}
                        behavior={(Platform.OS === 'ios') ? "padding" : null}
                        enabled
                    >

                        <View style={styles.form}>
                            <ScrollView showsVerticalScrollIndicator={false}>


                                {/* <Text style={{ fontSize: 15, marginBottom: 5, marginTop: 10, color: Colors.darkgrey }}>Vendor Details</Text> */}
                                <View style={[styles.rowContainer, { marginTop: 0 }]}>

                                    <View style={[styles.row, { paddingVertical: Platform.OS==='android'? 0 : 4, paddingBottom: Platform.OS==='android'?2: 4, borderBottomWidth: 0.8 }]}>
                                        <View style={[styles.rowLeft, { borderTopLeftRadius: 5 }]}>
                                            <Text style={styles.inputLable}>Choose Vendor:</Text>
                                        </View>
                                        <View style={[styles.rowRight, { borderTopRightRadius: 5 }]}>
                                        <Dropdown
                                                placeholder="Select Vender"
                                                value={this.state.vender_name}
                                                items={this.state.venders}
                                                onChange={(vendorData) => {
                                                    this.setState({
                                                        vendor_id: vendorData.id,
                                                        vender_name: vendorData.name,
                                                        phone: vendorData.mobile
                                                    })
                                                }}
                                                style={styles.textInput}
                                            />
                                        </View>
                                    </View>

                                    <View style={[styles.row, { paddingVertical: Platform.OS==='android'? 8 : 15, paddingBottom: Platform.OS==='android'?8: 15, borderBottomWidth: 0.8 }]}>
                                        <View style={[styles.rowLeft, { borderTopLeftRadius: 5 }]}>
                                            <Text style={styles.inputLable}>Contact Number:</Text>
                                        </View>
                                        <View style={[styles.rowRight, { borderTopRightRadius: 5, paddingLeft: 10}]}>
                                        <TextInput
                                                value={this.state.phone}
                                                autoCompleteType="off"
                                                keyboardType="number-pad"
                                                autoCapitalize="words"
                                                style={styles.textInput}
                                                onChangeText={(phone) => { this.setState({ phone: phone }) }}

                                            />
                                        </View>
                                    </View>

                                    <View style={[styles.row, { paddingVertical: Platform.OS==='android'? 8 : 11, paddingBottom: Platform.OS==='android'?8: 11, borderBottomWidth: 0.8 }]}>
                                        <View style={[styles.rowLeft, { borderTopLeftRadius: 5 }]}>
                                            <Text style={styles.inputLable}>Type:</Text>
                                        </View>
                                        <View style={[styles.rowRight, { borderTopRightRadius: 5, paddingLeft: 10 }]}>
                                        <TextInput
                                                value={this.state.type}
                                                autoCompleteType="off"
                                                autoCapitalize="words"
                                                style={styles.textInput}
                                                onChangeText={(type) =>
                                                    this.setState({ type: type })
                                                }
                                            />
                                        </View>
                                    </View>

                                    <View style={[styles.row, { paddingVertical: Platform.OS==='android'? 0 : 4, paddingBottom: Platform.OS==='android'?0: 4, borderBottomWidth: Platform.OS==='android'? 1 : 0.8}]}>
                                        <View style={[styles.rowLeft, { borderTopLeftRadius: 5 }]}>
                                            <Text style={styles.inputLable}>Journey Type:</Text>
                                        </View>
                                        <View style={[styles.rowRight, { borderTopRightRadius: 5 }]}>
                                        <Dropdown
                                                placeholder="Select"
                                                value={this.state.journey_type}
                                                items={[{ id: 'Onward', name: 'Onward' }, { id: 'Return', name: 'Return' }, { id: 'Both', name: 'Both' }]}
                                                onChange={(data) => { this.setState({ journey_type: data.id }) }}
                                                style={styles.textInput}
                                            />
                                        </View>
                                    </View>

                                    <View style={[styles.row, { paddingVertical: Platform.OS==='android'? 0 : 4, paddingBottom: Platform.OS==='android'?0: 4,  borderBottomWidth: Platform.OS==='android'? 1 : 0.8 }]}>
                                        <View style={[styles.rowLeft, { borderTopLeftRadius: 5 }]}>
                                            <Text style={styles.inputLable}>Select Warehouse:</Text>
                                        </View>
                                        <View style={[styles.rowRight, { borderTopRightRadius: 5 }]}>
                                        <Dropdown
                                                placeholder="Select"
                                                value={this.state.selected_warehouse}
                                                items={this.state.warehouse_data}
                                                onChange={(data) => {
                                                    this.setState({
                                                        selected_warehouse: data.name,
                                                        from_address: data.address
                                                    })
                                                }}
                                                style={styles.textInput}
                                            />
                                        </View>
                                    </View>

                                    <View style={[styles.row, { paddingVertical: Platform.OS==='android'? 8 : 12, paddingBottom: Platform.OS==='android'?8: 12, borderBottomWidth: 0.8 }]}>
                                        <View style={[styles.rowLeft, { borderTopLeftRadius: 5 }]}>
                                            <Text style={styles.inputLable}>From Address:</Text>
                                        </View>
                                        <View style={[styles.rowRight, { borderTopRightRadius: 5, paddingLeft: 10 }]}>
                                        <TextInput
                                                value={this.state.from_address}
                                                autoCompleteType="off"
                                                autoCapitalize="words"
                                                style={styles.textInput}
                                                editable={false}
                                                onChangeText={(address) => this.setState({ from_address: address })}
                                            />
                                        </View>
                                    </View>

                                    <View style={[styles.row, { paddingVertical: Platform.OS==='android'? 8 : 12, paddingBottom: Platform.OS==='android'?8: 12, borderBottomWidth: 0.8 }]}>
                                        <View style={[styles.rowLeft, { borderTopLeftRadius: 5 }]}>
                                            <Text style={styles.inputLable}>To Address:</Text>
                                        </View>
                                        <View style={[styles.rowRight, { borderTopRightRadius: 5 }]}>
                                        <View style={{width: "100%", marginLeft: 10}}>
                                        <TextInput
                                                value={this.state.to_address}
                                                autoCompleteType="off"
                                                autoCapitalize="words"
                                                style={styles.textInput}
                                                onChangeText={(address) => this.setState({ to_address: address })}
                                            />
                                            </View>
                                        </View>
                                    </View>

                                    <View style={[styles.rowTop, {paddingBottom: 0}]}>
                                        <View style={[styles.rowLeft, { borderTopLeftRadius: 5 }]}>
                                            <Text style={styles.inputLable}>Schedule:</Text>
                                        </View>
                                        <View style={[styles.rowRight, { borderBottomRightRadius: 5 }]}>
                                        <View style={{width: "55%"}}>
                                        <DateAndTimePicker2
                                                mode={"date"}
                                                label={""}
                                                value={this.state.schedule_date}
                                                onChange={(date) => { this.setState({ schedule_date: date }) }}
                                            />
                                        </View>
                                        <View style={styles.divider}></View>
                                        <View style={{width: "43%"}}>
                                        <DateAndTimePicker2
                                                mode={"time"}
                                                label={""}
                                                value={this.state.schedule_time}
                                                onChange={(time) => { this.setState({ schedule_time: time }) }}
                                            />
                                        </View>
                                        </View>
                                    </View>
                                </View>


                           
                            <View style={[styles.rowContainer, { marginTop: 10 }]}>

                            <View style={[styles.row, {paddingTop: 12, paddingBottom: 12, borderBottomWidth: 0.8 }]}>
                                <View style={[styles.rowLeft, { borderTopLeftRadius: 5 }]}>
                                    <Text style={styles.inputLable}>Booking Done By:</Text>
                                </View>
                                <View style={[styles.rowRight, { borderTopRightRadius: 5, paddingLeft: 10}]}>
                                <View style={{ width: '60%' }}>
                                            <Text style={{color: Colors.grey}}>{this.state.booking_done_by}</Text>
                                        </View>
                                </View>
                            </View>

                            <View style={[styles.row, { paddingBottom: 0 }]}>
                                    <View style={[styles.rowLeft, { borderTopLeftRadius: 5 }]}>
                                        <Text style={styles.inputLable}>Booking:</Text>
                                    </View>
                                    <View style={styles.rowRight}>
                                        <View style={{ width: "55%" }}>
                                            <DateAndTimePicker2
                                                mode={"date"}
                                                label={""}
                                                value={this.state.booking_date}
                                            />
                                        </View>

                                        <View style={styles.divider}></View>
                                        <View style={{ width: "43%" }}>
                                            <DateAndTimePicker2
                                                mode={"time"}
                                                label={""}
                                                value={this.state.booking_time}
                                            />
                                        </View>
                                    </View>
                                </View>

                            {/* <View style={[styles.rowTop, {paddingVertical: 11 }]}>
                                <View style={[styles.rowLeft, { borderTopLeftRadius: 5 }]}>
                                    <Text style={styles.inputLable}>Booking:</Text>
                                </View>
                                <View style={[styles.rowRight, { borderTopRightRadius: 5}]}>
                                <View style={{ width: '80%' }}>
                                            <Text style={{color: Colors.grey}}>{moment(this.state.booking_date).format('Do - MMM - YY (ddd)').toString()} | {this.state.booking_time.toString()}</Text>
                                        </View>
                                </View>
                            </View> */}
                            
                            </View>

                            <TouchableOpacity
                                    style={styles.submitBtn}
                                    onPress={this.Add}
                                >
                                    <Text style={{ fontSize: 18, color: Colors.white }}>
                                        {"Save"}
                                    </Text>
                                </TouchableOpacity>
                            </ScrollView>
                        </View>


                    </KeyboardAvoidingView>


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
                </SafeAreaView>
            </>
        );
    }
}

const windowWidth = Dimensions.get("screen").width;
const windowHeight = Dimensions.get("screen").height;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#d9dfe0',
        justifyContent: "center",
        alignItems: "center",
    },

    box: {
        borderColor: "#eee",
        borderWidth: 1,
        padding: 10,
        margin: 2,
    },

    boxHead: {
        fontFamily: 'serif',
        fontSize: 16,
        margin: 5,
        color: Colors.grey,
        fontWeight: 'bold'
    },
    lsitContainer: {
        flex: 1,
    },
    card: {
        flexDirection: "row",
        width: "100%",
        paddingHorizontal: 8,
        paddingVertical: 8,
        backgroundColor: Colors.white,
        // borderBottomWidth: 0.5,
        borderColor: Colors.textInputBorder,
    },
    qtyContainer: {
        width: "10%",
        alignItems: "center",
        justifyContent: "center",
    },
    titleText: {
        fontSize: 14,
        fontWeight: "bold",
        color: Colors.grey,
        marginBottom: 2,
    },
    subText: {
        fontSize: 13,
        color: Colors.grey,
        opacity: 0.9,
        marginBottom: 2,
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
    form: {
		flex: 1,
		paddingVertical: 4,
		paddingHorizontal: 5,
		//borderRadius: 10,
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
        //backgroundColor: Colors.textInputBg,
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

    textInput: {
        fontSize: 14,
        width: "100%",
        borderWidth: 0,
        // borderRadius: 4,
        borderColor: "#fff",
        backgroundColor: "#fff",
        marginBottom: 0,
        color: Colors.black,
        opacity: 0.8
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

    rowContainer: {
        borderColor: "#d2d1cd",
        borderWidth: 0,
        borderRadius: 5,
        paddingVertical: 0,
        paddingHorizontal: 5,
        backgroundColor: Colors.white,
    },

    row: {
        flexDirection: 'row',
        borderBottomColor: Colors.lightGrey,
        borderBottomWidth: 0.5,
        paddingBottom: 7
    },

    rowTop: {
        flexDirection: 'row',
        borderBottomColor: '#cfcfcf',
        paddingBottom: 8
    },

    inputLable: {
        fontSize: 14,
        color: Colors.black,
        marginBottom: 0,
        opacity: 0.8,
    },

    rowRight: {
        flexDirection: "row",
        width: '53%',
        marginLeft: 10,
        backgroundColor: '#fff',
        justifyContent: 'space-between',
    },

    rowLeft: {
        width: '47%',
        backgroundColor: '#fff',
        paddingLeft: 10,
        justifyContent: 'center',
    },

    divider: {
		width: "2%" , 
		borderLeftWidth: 0.3, 
		alignSelf: 'center' , 
		height: 20, 
		borderLeftColor: '#444', 
		opacity: 0.4
	}
});