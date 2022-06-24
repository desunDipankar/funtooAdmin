import React, { Component } from "react";
import {
    View,
    StyleSheet,
    Text,
    Dimensions,
    TouchableOpacity,
    ScrollView,
    TextInput,
    SafeAreaView
} from "react-native";
import Colors from "../../config/colors";
import { Header } from "../../components";
import { DateAndTimePicker, Dropdown } from "../../components";
import DateAndTimePicker2 from '../../components/DateAndTimePicker2'
import AwesomeAlert from 'react-native-awesome-alerts';
import AppContext from "../../context/AppContext";
import { getFormattedDate } from "../../utils/Util";
import { AddOrderVolunteerVendorDetails } from "../../services/OrderService";
import * as SMS from 'expo-sms';
import OverlayLoader from "../../components/OverlayLoader";
import { VenderList } from "../../services/VenderApiService";
import { showDateAsClientWant } from "../../utils/Util";
import moment from "moment";
import { GetTotalVolunteerRequiredForEvent } from "../../services/VolunteerApiService";

export default class OrderVendorVolunteersAdd extends Component {

    static contextType = AppContext;
    constructor(props) {
        super(props);
        this.state = {
            orderData: this.props.route.params.orderData,
            orderDetails: null,
            venders: [],
            isModalOpen: false,
            refreshing: false,
            showAlertModal: false,
            alertMessage: "",
            alertType: '',
            totalVolunteerRequired: null,
            isLoading: false,

            order_id: '',
            vender_id: "",
            event_id: "",
            vender_name: "",
            booking_done_by: "",
            booking_date: "",
            booking_time: '',
            reporting_date: null,
            reporting_time: "",
            num_of_staff_required: "",
            num_of_hours: "",
            rate_per_hour: "",
            amount: "",
            mobile: "",
            reporting_date: "",
            closing_time: ""
        };
    }

    componentDidMount = () => {
        this.setState({ isLoading: true });
        Promise.all([VenderList(), GetTotalVolunteerRequiredForEvent({ order_id: this.state.orderData.id })])
            .then((result) => {
                this.setState({
                    venders: result[0].data,
                    totalVolunteerRequired: result[1].data.total_volunteers,
                    num_of_staff_required: result[1].data.total_volunteers
                }, () => this.init());
            })
            .catch(err => console.log(err))
            .finally(() => {
                this.setState({
                    isLoading: false
                });
            });
    }

    init = () => {
        let reporting_date = new Date(this.state.orderData.event_date);
        this.setState({
            order_id: this.state.orderData.id,
            reporting_date: reporting_date,
            reporting_time: this.timeAddSubtract(this.state.orderData.event_start_time, 90, "-"),
            booking_done_by: this.context.userData?.name,
            booking_date: moment().format('YYYY-MM-DD'),
            booking_time: this.currentTime(),
            closing_time: this.timeAddSubtract(this.state.orderData.setup_by, 60, "+")
        }, () => this.UpdateHumberOfHours());
    }

    UpdateHumberOfHours = () => {
        let hours = this.getDiffHour(
            this.state.orderData.event_start_time, 
            this.state.orderData.event_end_time, 
            this.state.orderData.event_date
        );

        console.log('hours -->', hours)
        hours = Math.abs(hours);
        this.setState({ num_of_hours: hours.toString() });
    }

    NumberOfHours = () => {
        let start_time = new Date(this.state.orderData.event_start_time)
        let end_time = new Date(this.state.orderData.event_end_time)

        let hours = end_time.getHours() - start_time.getHours();
        console.log("hours from my func--> ", hours);
    }

    

    currentTime = () => {
        return moment(new Date()).format("HH:mm");
    }

    timeAddSubtract = (time, minutes, type) => {
        console.log('time add subtract-->', time)
        console.log('time add subtract-->', minutes)
        if (!time || !minutes || !type) {
            return null;
        }
        let stringDate = moment(new Date()).format("YYYY-MM-DD") ;
        let date = new Date(stringDate);
        let res = null;
        switch (type) {
            case '+':
                let addTime = moment(date).add(minutes, 'minutes').toDate();
                res = `${addTime.getUTCHours()}:${addTime.getUTCMinutes()}`;
                break;
            case '-':
                let subTime = moment(date).subtract(minutes, 'minutes').toDate();
                res = `${subTime.getUTCHours()}:${subTime.getUTCMinutes()}`;
                break;
        }
        return res;
    }

    getDiffHour = (from, to, date) => {
        console.log('from to date-->', from)
        console.log('from to date-->', to)
        console.log('from to date-->', date)
        
        let fromDate = moment(`${date} ${from}`);
        let toDate = moment(`${date} ${to}`);

        return toDate.hours() - fromDate.hours();
    }

    SendSms = async (mobile, msg) => {
        const result = await SMS.sendSMSAsync(
            [this.context.userData?.phone, mobile],
            msg
        );
    }

    onBookingDateChange = (selectedDate) =>
        this.setState({ booking_date: selectedDate });

    onBookingTimeChange = (selectedTime) =>
        this.setState({ booking_time: selectedTime });

    onChangeReportingDate = (value) =>
        this.setState({ reporting_date: value });

    onReportingTimeChange = (selectedTime) => {
            this.setState({ reporting_time: selectedTime }, () => this.UpdateHumberOfHours());
        };

    onClosingTimeChange = (value) => {
        this.setState({ closing_time: value }, () => this.UpdateHumberOfHours());
    };

    SetVenderId = (v) => {
        this.setState({
            vender_id: v.id,
            vender_name: v.name,
            mobile: v.mobile
        });
    };

    ControlSubmit = () => {
        let data = {
            'order_id': this.state.order_id,
            'vender_id': this.state.vender_id,
            'num_of_staff_required': this.state.num_of_staff_required,
            'num_of_hours': this.state.num_of_hours,
            'reporting_date': getFormattedDate(this.state.reporting_date),
            'reporting_time': this.state.reporting_time,
            'closing_date': getFormattedDate(this.state.reporting_date), // setting reporting_date as closing_date currently
            'closing_time': this.state.closing_time,
            'booking_done_by': this.state.booking_done_by,
            'booking_date': this.state.booking_date,
            'booking_time': this.state.booking_time,
            'rate_per_hour': this.state.rate_per_hour,
            'amount': this.state.amount,
            'mobile': this.state.mobile
        };

        this.setState({ isLoading: true });
        AddOrderVolunteerVendorDetails(data)
            .then((result) => {
                if (result.is_success) {
                    this.gotoBack();
                } else {
                    this.setState({
                        showAlertModal: true,
                        alertType: "Error",
                        alertMessage: result.message
                    });
                }
            })
            .catch(err => console.log(err))
            .finally(() => {
                this.setState({ isLoading: false });
            });
    }

    hideAlert = () => {
        this.setState({
            showAlertModal: false
        });
    };

    setStatus = (v) => {
        this.setState({
            status: v.id,
            status_name: v.name,
        });
    };

    gotoBack = () => this.props.navigation.goBack();

    UpdateAmount = () => {
        let num_of_hours = Number(this.state.num_of_hours);
        let rate_per_hour = Number(this.state.rate_per_hour);
        let num_of_staff_required = Number(this.state.num_of_staff_required);
        let total = num_of_hours * rate_per_hour * num_of_staff_required;
        this.setState({ amount: total.toString() });
    }

    setMobile = (number) => {
        if (number?.length <= 10) {
            this.setState({ mobile: number });
        }
    }

    render() {
        return (
            <>
                {this.state.isLoading &&
                    <OverlayLoader />}
                <SafeAreaView style={styles.container}>
                    <Header title={"Add Volunteer"} />

                    <View style={styles.form}>
                        <ScrollView showsVerticalScrollIndicator={false}>


                            {/* <Text style={{ fontSize: 15, marginBottom: 5, marginTop: 10, color: Colors.darkgrey }}>Vendor Details</Text> */}
                            <View style={[styles.rowContainer, { marginTop: 0 }]}>

                                <View style={[styles.row, { paddingVertical: Platform.OS==='android'? 4 : 8, paddingBottom: Platform.OS==='android'?4: 8, borderBottomWidth: 0.8 }]}>
                                    <View style={[styles.rowLeft, { borderTopLeftRadius: 5 }]}>
                                        <Text style={styles.inputLable}>Choose Vendor</Text>
                                    </View>
                                    <View style={[styles.rowRight, { borderTopRightRadius: 5 }]}>
                                        <View style={{ width: "100%" }}>
                                            <Dropdown
                                                placeholder="Select Vender"
                                                value={this.state.vender_name}
                                                items={this.state.venders}
                                                onChange={this.SetVenderId}
                                                style={styles.textInput}
                                            />
                                        </View>
                                    </View>
                                </View>



                                {/* <Text style={{ fontSize: 15, marginBottom: 5, marginTop: 10, color: Colors.darkgrey }}>Other Info</Text> */}


                                <View style={[styles.row, { paddingVertical: Platform.OS==='android'? 8 : 12, paddingBottom: Platform.OS==='android'?8: 15, borderBottomWidth: 0.8 }]}>
                                    <View style={[styles.rowLeft]}>
                                        <Text style={styles.inputLable}>No. of Staff:</Text>
                                    </View>
                                    <View style={[styles.rowRight, { borderTopRightRadius: 5 }]}>
                                        <View style={{ width: "100%", marginLeft: 10 }}>
                                            <TextInput
                                                value={this.state.num_of_staff_required}
                                                autoCompleteType="off"
                                                keyboardType="number-pad"
                                                style={styles.textInput}
                                                onChangeText={(num_of_staff_required) =>
                                                    this.setState({ num_of_staff_required })
                                                }
                                                onBlur={this.UpdateAmount}
                                            />
                                        </View>
                                    </View>
                                </View>


                                {/* <Text style={{ marginTop: 5, marginBottom: 15, color: Colors.darkgrey }}>Total No. of Staff Required: {(this.state.totalVolunteerRequired !== null) ? this.state.totalVolunteerRequired : ''}</Text> */}




                                <View style={[styles.row, {borderBottomWidth: 0.8, paddingVertical: 0 }]}>
                                    <View style={[styles.rowLeft, { borderTopLeftRadius: 5 }]}>
                                        <Text style={styles.inputLable}>Reporting:</Text>
                                    </View>
                                    <View style={styles.rowRight}>
                                        <View style={{ width: "55%" }}>
                                        <DateAndTimePicker2
                                                mode={"date"}
                                                label={""}
                                                value={this.state.reporting_date}
                                                onChange={this.onChangeReportingDate}
                                            />
											</View>

                                        <View style={styles.divider}></View>
                                        <View style={{ width: "43%" }}>
                                            <DateAndTimePicker2
                                                mode={"time"}
                                                label={""}
                                                value={this.state.reporting_time}
                                                onChange={this.onReportingTimeChange}
                                            />

                                        </View>
                                    </View>
                                </View>

                                <View style={[styles.row, {borderBottomWidth:Platform.OS === 'android'? 1 : 1, paddingVertical: 0, paddingBottom: 0}]}>
                                    <View style={[styles.rowLeft]}>
                                        <Text style={styles.inputLable}>Closing Time:</Text>
                                    </View>
                                    <View style={[styles.rowRight]}>
                                        <View style={{ width: "100%" }}>
                                            <DateAndTimePicker2
                                                mode={"time"}
                                                label={""}
                                                value={this.state.closing_time}
                                                onChange={this.onClosingTimeChange}
                                            />
                                        </View>
                                    </View>

                                </View>

                                <View style={[styles.row, { paddingVertical: Platform.OS==='android'? 8 : 12, paddingBottom: Platform.OS==='android'?8: 15, borderBottomWidth: 0.8 }]}>
                                    <View style={[styles.rowLeft]}>
                                        <Text style={styles.inputLable}>No. of Hours:</Text>
                                    </View>
                                    <View style={[styles.rowRight]}>
                                        <View style={{ width: "100%", marginLeft: 10 }}>
                                            <TextInput
                                                value={this.state.num_of_hours}
                                                autoCompleteType="off"
                                                keyboardType="number-pad"
                                                style={styles.textInput}
                                                onChangeText={(num_of_hours) =>
                                                    this.setState({ num_of_hours })
                                                }
                                                editable={false}
                                                onBlur={this.UpdateAmount}
                                            />
                                        </View>
                                    </View>

                                </View>

                                <View style={[styles.row, { paddingVertical: Platform.OS==='android'? 8 : 12, paddingBottom: Platform.OS==='android'?8: 15, borderBottomWidth: 0.8 }]}>
                                    <View style={[styles.rowLeft, { borderTopLeftRadius: 5 }]}>
                                        <Text style={styles.inputLable}>Contact Number:</Text>
                                    </View>
                                    <View style={[styles.rowRight, { borderTopRightRadius: 5 }]}>
                                        <View style={{ width: "100%", paddingLeft: 10 }}>
                                            <TextInput
                                                value={this.state.mobile}
                                                autoCompleteType="off"
                                                keyboardType="number-pad"
                                                autoCapitalize="words"
                                                style={styles.textInput}
                                                onChangeText={(mobile) =>
                                                    this.setMobile(mobile)
                                                }
                                            />
                                        </View>
                                    </View>

                                </View>

                                <View style={[styles.row, { paddingVertical: Platform.OS==='android'? 8 : 12, paddingBottom: Platform.OS==='android'?8: 15, borderBottomWidth: 0.8 }]}>
                                    <View style={[styles.rowLeft, { borderTopLeftRadius: 5 }]}>
                                        <Text style={styles.inputLable}>Rate per Hour:</Text>
                                    </View>
                                    <View style={[styles.rowRight, { borderTopRightRadius: 5 }]}>
                                        <View style={{ width: "100%", paddingLeft: 10 }}>
                                            <TextInput
                                                value={this.state.rate_per_hour}
                                                autoCompleteType="off"
                                                keyboardType="numeric"
                                                style={styles.textInput}
                                                onChangeText={(rate_per_hour) =>
                                                    this.setState({ rate_per_hour })
                                                }
                                                onBlur={this.UpdateAmount}
                                            />
                                        </View>
                                    </View>

                                </View>

                                <View style={[styles.row, { paddingVertical: Platform.OS==='android'? 8 : 12, paddingBottom: Platform.OS==='android'?8: 15, borderBottomWidth: 0.8 }]}>
                                    <View style={[styles.rowLeft, { borderTopLeftRadius: 5 }]}>
                                        <Text style={styles.inputLable}>Amount:</Text>
                                    </View>
                                    <View style={[styles.rowRight, { borderTopRightRadius: 5 }]}>
                                        <View style={{ width: "100%", paddingLeft: 10 }}>
                                            <TextInput
                                                value={this.state.amount}
                                                autoCompleteType="off"
                                                keyboardType="numeric"
                                                style={styles.textInput}
                                                onChangeText={(amount) => this.setState({ amount })}
                                                editable={false}
                                            />
                                        </View>
                                    </View>

                                </View>



                                {/* <Text style={{ fontSize: 15, marginBottom: 5, marginTop: 10, color: Colors.darkgrey }}>Booking Info</Text> */}


                                <View style={[styles.row, { paddingVertical: 0, borderBottomWidth: 1, paddingBottom: 0}]}>
                                    <View style={[styles.rowLeft, { borderTopLeftRadius: 5 }]}>
                                        <Text style={styles.inputLable}>Booking Done By:</Text>
                                    </View>
                                    <View style={[styles.rowRight, { borderTopRightRadius: 5 }]}>
                                        <View style={{ width: '80%', padding: 15, paddingLeft: 10,  }}>
                                            <Text style={{ color: Colors.grey }}>{this.state.booking_done_by}</Text>
                                        </View>
                                    </View>
                                </View>
                                {/* <View style={styles.row}>
										<View style={[styles.rowLeft, { borderTopLeftRadius: 5 }]}>
											<Text style={styles.inputLable}>Booking:</Text>
										</View>
										<View style={[styles.rowRight, { borderTopRightRadius: 5, }]}>
											<View style={{ width: "55%" }}>
												<TouchableOpacity
													activeOpacity={1}
													style={{ paddingRight: 0, paddingVertical: 4, paddingLeft: 10, width: "100%" }} >
													<Text style={styles.location}>{showDateAsClientWant(this.state.booking_date)}</Text>
												</TouchableOpacity>
											</View>
											<View style={styles.divider}></View>
											<View style={{ width: "45%", borderTopRightRadius: 5, }}>
												<TouchableOpacity
													activeOpacity={1}
													style={{ paddingRight: 0, paddingVertical: 4, paddingLeft: 10, width: "100%" }} >
													<Text style={styles.location}>{this.state.booking_time.toString()}</Text>
												</TouchableOpacity>
											</View>
										</View>
									</View> */}
                                <View style={[styles.rowTop, { paddingVertical: 0 }]}>
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


                            </View>


                            <TouchableOpacity
                                style={styles.submitBtn}
                                onPress={this.ControlSubmit}
                            >
                                <Text style={{ fontSize: 18, color: Colors.white }}>
                                    {this.state.id ? "Update & Send msg" : "Update & Send msg"}
                                </Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>

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
        )
    }
}

const windowWidth = Dimensions.get("screen").width;
const windowHeight = Dimensions.get("screen").height;
const styles = StyleSheet.create({
    cardBody: {
        marginTop: 10,
        marginBottom: 10
    },
    cardHeader: {
        fontSize: 25,
        marginBottom: 15
    },

    container: {
        flex: 1,
        backgroundColor: '#d9dfe0',
        justifyContent: "center",
        alignItems: "center",
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
        // borderBottomWidth: 1,
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
    // form: {
    //     flex: 1,
    //     paddingTop: 10,
    //     paddingBottom: 10,
    //     paddingLeft: 20,
    //     paddingRight: 20

    // },

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
    // textInput: {
    //     padding: 9,
    //     fontSize: 14,
    //     width: "100%",
    //     borderWidth: 1,
    //     borderRadius: 4,
    //     borderColor: Colors.textInputBorder,
    //     backgroundColor: Colors.textInputBg,
    // },

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
        marginTop: 0,
        flexDirection: 'row',
        marginBottom: 0,
        borderBottomColor: '#cfcfcf',
        borderBottomWidth: 0.4,
        paddingVertical: 5,
        paddingBottom: 8
    },

    rowTop: {
        flexDirection: 'row',
        borderBottomColor: '#cfcfcf',
        // borderBottomWidth: 0.6,
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
        marginLeft: 0,
        backgroundColor: '#fff',
        marginTop: 0,
        // justifyContent: 'space-evenly',
        alignItems: "center",
    },

    rowLeft: {
        width: '47%',
        backgroundColor: '#fff',
        paddingLeft: 2,
        justifyContent: 'center',
        marginTop: 0,
        // paddingTop:1,
        // paddingBottom:1,
    },

    divider: {
        width: "2%",
        borderLeftWidth: 0.3,
        alignSelf: 'center',
        height: 20,
        borderLeftColor: '#444',
        opacity: 0.4
    }
});