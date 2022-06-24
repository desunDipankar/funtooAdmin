import React from 'react';
import {
	View,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	ScrollView,
	Alert,
	Image,
    Dimensions,
    FlatList,
    Modal,
    RefreshControl
} from "react-native";
import EmptyScreen from "../../components/EmptyScreen"
import { Header } from "../../components";
import Loader from "../../components/Loader";
import AwesomeAlert from 'react-native-awesome-alerts';
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import Colors from "../../config/colors";
import { AddWareHouse, GetAllWareHouses, UpdateWareHouse, DeleteWareHouse } from '../../services/WareHouseService';

export default class WarehouseScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            warehouses: [],
            isModalOpen: false,
            isLoading: false,
            refreshing: false,
            showAlertModal: false,
            alertType: '',
            alertMessage: '',

            id: null,
            name: '',
            address: ''
        }
    }

    componentDidMount() {
        // get all warehouse item
        this.getAllWareHouses();
    }
    
    getAllWareHouses() {

        this.setState({
            isLoading: true
        });
        GetAllWareHouses().then( (result) => {
            this.setState({
                isLoading: false,
                warehouses: result.data,
                refreshing: false,
            });
        })
    }

    Edit = () => {
        let data = {
            id: this.state.id,
            name: this.state.name,
            address: this.state.address
        };

        this.setState({
            isLoading: true
        });

        UpdateWareHouse(data).then( (result) => {
            this.setState({
                isLoading: false
            });

            if(result.is_success) {
                this.setState({
                    isModalOpen: false,
                    showAlertModal: true,
                    alertType: "Success",
                    alertMessage: "Warehouse updated successfully"
                }, () => {
                    this.getAllWareHouses();
                })
            } else {
                this.setState({
                    isModalOpen: false,
                    showAlertModal: true,
                    alertType: "Success",
                    alertMessage: "Please try again"
                })
            }

        }).catch( (err) => {
            this.setState({
                isLoading: false
            });

            this.setState({
                isModalOpen: false,
                showAlertModal: true,
                alertType: "Error",
                alertMessage: "Network error"
            });
        });


    }
  
    Add = () => {
        let data = {
            name: this.state.name,
            address: this.state.address
        }
        this.setState({
            isLoading: true
        });

        AddWareHouse(data).then( (response) => {
            this.setState({isLoading: false});
            if(response.is_success) {
                this.setState({
                    isModalOpen: false,
                    showAlertModal: true,
                    alertType: "Success",
                    alertMessage: "Warehouse added successfully"
                }, () => {
                    this.getAllWareHouses();
                })
            } else {
                this.setState({
                    showAlertModal: true,
                    alertType: "Error",
                    alertMessage: "Please try again"
                })
            }
        });

       
    }

    ControlSubmit = () => {
        if( this.state.id !== null ) {
            this.Edit();
        } else {
            this.Add();
        }
    }

    editPart = (item) => {
        this.setState({
            id: item.id,
            name: item.name,
            address: item.address,
            isModalOpen: true,
        });
    }

    Delete = (id) => {
        Alert.alert(
            "Are your sure?",
            "Are you sure you want to remove this warehouse?",
            [
                {
                    text: "Yes",
                    onPress: () => {
                        DeleteWareHouse({ id: id }).then( (result) => {
                            if(result.is_success) {
                                this.getAllWareHouses();
                            }
                        }).catch((err) => {
                            Alert.alert("Sever Error", "Please try again leter")
                        });
                    }
                },
                {
                    text: "No",
                },
            ]
        );
    }

    toggleModal = () => {
        this.setState({
            isModalOpen: !this.state.isModalOpen,
            id: null,
            name: '',
            address: ''
        })
    }

    hideAlert = () => {
        this.setState({
            showAlertModal: false
        });
    };

    listItem = ({item}) => (
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
                    <MaterialIcons name="delete" size={22} color={Colors.danger} onPress={this.Delete.bind(this, item.id)} />
                </TouchableOpacity>
            </View>
        </View>
    )

    onRefresh () {
        this.setState({ refreshing: true }, () => { this.getAllWareHouses() })
    }

    render() {
        return (
            <View>
                <Header title="Warehouse" addAction={ (e) => { this.toggleModal() } }/>
                {this.state.isLoading ? (
                    <Loader />
                ) : (
                    <FlatList
                        data={this.state.warehouses}
                        keyExtractor={(item, index) => item.id.toString()}
                        renderItem={this.listItem}
                        initialNumToRender={ this.state.warehouses.length }
                        contentContainerStyle={styles.lsitContainer}
                        ListEmptyComponent={ <EmptyScreen /> }
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
                                        {this.state.id ? "Update" : "Add"}  Warehouse
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

                                        <View style={styles.inputContainer}>
                                            <Text style={styles.inputLable}> Address:</Text>
                                            <TextInput
                                                value={this.state.address}
                                                autoCompleteType="off"
                                                style={styles.textInput}
                                                onChangeText={(address) => this.setState({ address })}
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