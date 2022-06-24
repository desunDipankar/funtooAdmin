import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Platform,
    StyleSheet,
    StatusBar,
    Alert,
    Dimensions,
} from "react-native";
import Constants from "expo-constants";
import { FontAwesome, Feather } from "@expo/vector-icons";
import Colors from "../../config/colors";
import ProgressiveImage from "../../components/ProgressiveImage";
import { ScrollView } from "react-native-gesture-handler";
import * as Animatable from 'react-native-animatable';
import AwesomeAlert from 'react-native-awesome-alerts';

import { UserLogin } from "../../services/UserApiService";
import OverlayLoader from "../../components/OverlayLoader";
import AppContext from "../../context/AppContext";
import { writeUserData } from "../../utils/Util";
export default class UserLoginScreen extends React.Component {

    static contextType = AppContext;

    constructor(props) {
        super(props);
        this.state = {
            phone: '',
            password: '',
            isShowPassword: true,

            showAlertModal: false,
            alertMessage: "",
            alertType: '',
        }
    }


    hideAlert = () => {
        this.setState({
            showAlertModal: false
        });
    };

    UserLogin = () => {
        let model = { 
            phone: this.state.phone, 
            password: this.state.password 
        };
        this.setState({
            isLoading: true
        });
        UserLogin(model).then(res => {
            if (res.is_success) {
                writeUserData(res.data);
                this.context.setUserData(res.data);
            } else {
                this.setState({
                    showAlertModal: true,
                    alertType: "Error",
                    alertMessage: res.message
                })
            }
        }).catch((error) => {
            Alert.alert("Server Error", error.message);
        }).finally( () => {
            this.setState({
                isLoading: false
            });
        } )
    }

    render() {
        return (
            <View style={styles.container}>
                {this.state.isLoading && <OverlayLoader />}
                <StatusBar backgroundColor={Colors.primary} barStyle="light-content" />
                <Animatable.View style={{ alignItems: 'center', paddingVertical: 40, }}
                    animation="shake"
                >
                    <View style={styles.logoContainer}>
                        <ProgressiveImage
                            source={require("../../assets/logo.png")}
                            resizeMode={"cover"}
                            style={styles.logoImg}
                        />
                    </View>
                </Animatable.View>
                <Animatable.View
                    animation="fadeInUpBig"
                    style={styles.footer}
                >
                    <ScrollView>
                        <View style={styles.body}>
                            <View style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 30 }}>
                                <Text style={{ fontSize: 35 }}>Login</Text>
                            </View>

                            <View style={styles.row}>
                                <Text style={styles.rowText}>Mobile Number</Text>
                                <View style={styles.action}>
                                    <FontAwesome
                                        name="phone"
                                        color={Colors.grey}
                                        size={20}
                                    />
                                    <TextInput
                                        placeholder="Mobile Number"
                                        placeholderTextColor="#666666"
                                        style={styles.textInput}
                                        autoCapitalize="none"
                                        keyboardType="numeric"
                                        onChangeText={(phone) => this.setState({ phone })}
                                    />
                                </View>
                            </View>

                            <View style={styles.row}>
                                <Text style={styles.rowText}>Password</Text>
                                <View style={styles.action}>
                                    <FontAwesome
                                        name="lock"
                                        color={Colors.grey}
                                        size={20}
                                    />
                                    <TextInput
                                        placeholder="Password"
                                        placeholderTextColor="#666666"
                                        style={styles.textInput}
                                        autoCapitalize="none"
                                        secureTextEntry={this.state.isShowPassword}
                                        onChangeText={(password) => this.setState({ password })}
                                    />

                                    <TouchableOpacity
                                        onPress={() => this.setState({
                                            isShowPassword: !this.state.isShowPassword
                                        })}
                                    >
                                        {this.state.isShowPassword ?
                                            <Feather
                                                name="eye-off"
                                                color="grey"
                                                size={20}
                                            />
                                            :
                                            <Feather
                                                name="eye"
                                                color="grey"
                                                size={20}
                                            />
                                        }
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={styles.row}>
                                <TouchableOpacity
                                    style={[styles.signIn, {
                                        borderColor: '#009387',
                                        marginTop: 10,
                                        backgroundColor: Colors.primary
                                    }]}
                                    onPress={this.UserLogin}
                                >
                                    <Text style={[styles.textSign, {
                                        color: Colors.white
                                    }]}>Sign In</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.row}>
                                <TouchableOpacity
                                    style={{ justifyContent: 'center', alignItems: 'center' }}
                                    onPress={()=>this.props.navigation.navigate("MobileVerification")}
                                >
                                    <Text style={[styles.textSign, {
                                        color: Colors.primary,fontSize:16
                                    }]}>Forgot Password</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </Animatable.View>
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
        )
    }
}

const windowWidth = Dimensions.get("screen").width;
const windowHeight = Dimensions.get("screen").height;
const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.primary,
        flex: 1,
        paddingTop: Constants.statusBarHeight,
    },

    footer: {
        flex: Platform.OS === 'ios' ? 3 : 5,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    body: {
        backgroundColor: Colors.white,
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
    },

    logoContainer: {
        width: 150,
        height: 150,
        borderRadius: 30,
        overflow: "hidden",
        borderWidth: 3,
        borderColor: Colors.white,
    },
    logoImg: {
        width: 150,
        height: 150,
    },

    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 50
    },

    row: {
        flex: 3,
        backgroundColor: Colors.white,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 20
    },
    text_header: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 30
    },
    rowText: {
        color: '#05375a',
        fontSize: 18
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    actionError: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#FF0000',
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
    },
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
    },
    button: {
        alignItems: 'center',
        marginTop: 50
    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'
    }
});