import React from "react";
import {
    View,
    StyleSheet,
    Text,
    FlatList,
    Modal,
    Dimensions,
    TouchableOpacity,
    Alert,
    ScrollView,
    TextInput,
    RefreshControl,
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import Colors from "../../config/colors";
import { Header } from "../../components";
import Loader from "../../components/Loader";
import AwesomeAlert from 'react-native-awesome-alerts';
import { VenderTypeList, CreateVenderType, UpdateVenderType, DeleteVenderType } from "../../services/VenderTypeService";
import EmptyScreen from "../../components/EmptyScreen";

export default class VenderTypeScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            list: [],
            name: "",
            ordering: "",
            isModalOpen: false,
            refreshing: false,

            showAlertModal: false,
            alertMessage: "",
            alertType: '',
        };
    }

    componentDidMount = () => {
        this.VenderTypeList();
    }


    VenderTypeList() {
        this.setState({
            isLoading: true
        });

        VenderTypeList().then(res => {
            this.setState({
                isLoading: false,
                list: res.data,
                refreshing: false,
            });

        }).catch((error) => {
            Alert.alert("Server Error", error.message);
        })
    }


    AddVenderType() {
        let model = {
            name: this.state.name,
        }
        this.setState({
            isLoading: true
        });

        CreateVenderType(model).then(res => {
            this.setState({
                isLoading: false,
            });
            this.setState({
                isLoading: false
            });
            if (res.is_success) {
                this.VenderTypeList();
                this.setState({
                    isModalOpen: false,
                    showAlertModal: true,
                    alertType: "Success",
                    alertMessage: res.message
                })
            } else {
                this.setState({
                    showAlertModal: true,
                    alertType: "Error",
                    alertMessage: res.message
                })
            }



        }).catch((error) => {
            Alert.alert("Server Error", error.message);
        })
    }


    UpdateVenderType() {
        let model = {
            id: this.state.id,
            name: this.state.name,
        }
        this.setState({
            isLoading: true
        });

        UpdateVenderType(model).then(res => {
            this.setState({
                isLoading: false
            });
            if (res.is_success) {
                this.setState({
                    isModalOpen: false,
                    showAlertModal: true,
                    alertType: "Success",
                    alertMessage: res.message
                });
                this.VenderTypeList();
            } else {
                this.setState({
                    showAlertModal: true,
                    alertType: "Error",
                    alertMessage: res.message
                })
            }
        }).catch((error) => {
            Alert.alert("Server Error", error.message);
        })
    }


    DeleteVenderType = (id) => {
        Alert.alert(
            "Are your sure?",
            "Are you sure you want to remove this VenderType?",
            [
                {
                    text: "Yes",
                    onPress: () => {
                        DeleteVenderType({ id: id }).then(res => {
                            if (res.is_success) {
                                this.VenderTypeList();
                            }
                            else {
                                this.setState({
                                    showAlertModal: true,
                                    alertType: "Error",
                                    alertMessage: res.message
                                })
                            }

                        }).catch((error) => {
                            Alert.alert("Server Error", error.message);
                        })
                    },
                },
                {
                    text: "No",
                },
            ]
        );
    }

    ControlSubmit = () => {
        if (this.state.id) {
            this.UpdateVenderType();
            return;
        }
        this.AddVenderType();
    }


    hideAlert = () => {
        this.setState({
            showAlertModal: false
        });
    };


    editPart = (item) => {
        this.setState({
            id: item.id,
            name: item.name,
            isModalOpen: true,
        });
    }

    toggleModal = () =>
        this.setState({
            id: "",
            name: "",
            isModalOpen: !this.state.isModalOpen,
        });

    onRefresh = () => {
        this.setState({ refreshing: true }, () => { this.VenderTypeList() })
    }


    renderEmptyContainer = () => {
        return (
            <EmptyScreen />
        )
    }


    listItem = ({ item }) => (
        <View key={item.id.toString()} style={styles.card}>

            <View style={{ paddingLeft: 10, width: "90%" }}>
                <Text style={styles.subText}>{item.name}</Text>
            </View>
            <View style={styles.qtyContainer}>
                <TouchableOpacity
                    style={{ padding: 3 }}
                    onPress={this.editPart.bind(this, item)}
                >
                    <MaterialIcons name="create" size={22} color={Colors.success} />
                </TouchableOpacity>
                <TouchableOpacity style={{ padding: 3 }}>
                    <MaterialIcons name="delete" size={22} color={Colors.danger} onPress={this.DeleteVenderType.bind(this, item.id)} />
                </TouchableOpacity>
            </View>
        </View>
    );


    render() {
        return (
            <View style={styles.container}>
                <Header title="VenderType List" addAction={this.toggleModal} />

                {this.state.isLoading ? (
                    <Loader />
                ) : (
                    <FlatList
                        data={this.state.list}
                        keyExtractor={(item, index) => item.id.toString()}
                        renderItem={this.listItem}
                        initialNumToRender={this.state.list.length}
                        contentContainerStyle={styles.lsitContainer}
                        ListEmptyComponent={this.renderEmptyContainer()}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={this.onRefresh}
                            />
                        }
                    />
                )}

                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={this.state.isModalOpen}
                    onRequestClose={this.toggleModal}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.itemModalContainer}>
                            <View style={styles.itemModalHeader}>
                                <TouchableOpacity
                                    activeOpacity={1}
                                    style={styles.headerBackBtnContainer}
                                    onPress={this.toggleModal}
                                >
                                    <Ionicons name="arrow-back" size={26} color={Colors.white} />
                                </TouchableOpacity>
                                <View style={styles.headerTitleContainer}>
                                    <Text style={{ fontSize: 20, color: Colors.white }}>
                                        {this.state.id ? "Update" : "Add"}  VenderType
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.itemModalBody}>
                                <View style={styles.form}>
                                    <ScrollView showsVerticalScrollIndicator={false}>
                                        <View style={styles.inputContainer}>
                                            <Text style={styles.inputLable}> Name:</Text>
                                            <TextInput
                                                value={this.state.name}
                                                autoCompleteType="off"
                                                style={styles.textInput}
                                                onChangeText={(name) => this.setState({ name })}
                                            />
                                        </View>


                                        <TouchableOpacity
                                            style={styles.submitBtn}
                                            onPress={this.ControlSubmit}
                                        >
                                            <Text style={{ fontSize: 18, color: Colors.white }}>
                                                {this.state.id ? "Update" : "Save"}
                                            </Text>
                                        </TouchableOpacity>
                                    </ScrollView>
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>

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
        flex: 1,
        backgroundColor: Colors.white,
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
        flexDirection: "row",

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
});