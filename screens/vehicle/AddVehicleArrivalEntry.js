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
    Image
} from "react-native";
import Colors from "../../config/colors";
import { Header } from "../../components";
import { DateAndTimePicker, Dropdown } from "../../components";
import AwesomeAlert from 'react-native-awesome-alerts';
import { getFormattedDate, getFileData } from "../../utils/Util";
import { AddVehicleArrivalEntry as  AddVehicleArrivalEntryService } from "../../services/VehicleInfoApiService";
import OverlayLoader from "../../components/OverlayLoader";
import { Entypo } from '@expo/vector-icons'; 
import * as ImagePicker from 'expo-image-picker';

export default class AddVehicleArrivalEntry extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: this.props.route.params?.data,
            isLoading: false,
            showAlertModal: false,
            alertType: "Success",
            alertMessage: '',

            vehicles_info_id: null,
            photo: null,
            photoUrl: null,
            arrival_date: '',
            arrival_time: ''
        }
    }

    componentDidMount() {
        this.setState({
            vehicles_info_id: this.state.data.id
        })
    }

    hideAlert = () => {
        this.setState({showAlertModal: true})
    }

    Add = () => {
        let data = {
            photo: this.state.photo,
            vehicles_info_id: this.state.vehicles_info_id,
            arrival_date: getFormattedDate(this.state.arrival_date),
            arrival_time: this.state.arrival_time
        }

        AddVehicleArrivalEntryService(data).then( (response) => {
            console.log(response)
        });
    }

    pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            quality: 1,
        });

        this.setState({
            photoUrl: result.uri,
            photo: getFileData(result)
        });
    }

    render() {
        return (
            <>
                { this.state.isLoading && <OverlayLoader /> }
                <View style={styles.container}>
                    <Header title={"Add Entry"} />
                    <KeyboardAvoidingView
                        keyboardVerticalOffset={500}
                        style={{ flex: 1, }}
                        behavior={(Platform.OS === 'ios') ? "padding" : null}
                        enabled
                    >
                        <View style={styles.form}>
                            <ScrollView showsVerticalScrollIndicator={false}>



                                <View style={styles.box}>

                                    <TouchableOpacity
                                        onPress={this.pickImage}    
                                    >
                                        <Text>Choose Image</Text>
                                        <Entypo name="image" size={50} color="black" />
                                    </TouchableOpacity>

                                    {this.state.photoUrl && <Image source={{ uri: this.state.photoUrl }} style={{ width: 200, height: 200 }} />}


                                    <DateAndTimePicker
                                        mode={"date"}
                                        label={"Arrival Date:"}
                                        value={this.state.arrival_date}
                                        onChange={(arrival_date) => { this.setState({ arrival_date: arrival_date }) }}
                                    />

                                    <DateAndTimePicker
                                        mode={"time"}
                                        label={"Arrival Time:"}
                                        value={this.state.arrival_time}
                                        onChange={ (arrival_time) => { this.setState({arrival_time: arrival_time}) } }
                                    />

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
                </View>
            </>
        )
    }
}

const windowWidth = Dimensions.get("screen").width;
const windowHeight = Dimensions.get("screen").height;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
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
        paddingVertical: 10,
        backgroundColor: Colors.white,
        borderBottomWidth: 1,
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
        padding: 8,
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
});