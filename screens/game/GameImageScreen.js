import React from "react";
import {
    View,
    StyleSheet,
    Text,
    Image,
    FlatList,
    Modal,
    Dimensions,
    TouchableOpacity,
    Alert,
    ScrollView,
    TextInput,
    RefreshControl
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import Colors from "../../config/colors";
import { Header, Dropdown } from "../../components";
import Configs, { ToFormData } from "../../config/Configs";
import { getFileData } from "../../utils/Util";
import Loader from "../../components/Loader";
import ProgressiveImage from "../../components/ProgressiveImage";
import AwesomeAlert from 'react-native-awesome-alerts';
import { GetGameImageByGameId, AddGameImage, DeleteGameImage } from "../../services/GameApiService";

import * as ImagePicker from "expo-image-picker";


export default class GameImageScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            list: [],
            galleryImages: [],
            galleryImageData: [],
            id: "",
            game_id: this.props.route.params.game_id,

            isModalOpen: false,
            refreshing: false,

            showAlertModal: false,
            alertMessage: "",
            alertType: '',
        };
    }

    componentDidMount = () => {
        this.GetGameImageByGameId();
    }



    addGalleryImage = () => {
        let { galleryImages, galleryImageData } = this.state;
        ImagePicker.requestMediaLibraryPermissionsAsync().then((status) => {
            if (status.granted) {
                let optins = {
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 1,
                };

                ImagePicker.launchImageLibraryAsync(optins).then((result) => {
                    if (!result.cancelled) {
                        galleryImages.push({ uri: result.uri });
                        galleryImageData.push(getFileData(result));

                        this.setState({
                            galleryImages: galleryImages,
                            galleryImageData: galleryImageData,
                        });
                    }
                });
            } else {
                Alert.alert("Warning", "Please allow permission to choose an icon");
            }
        });
    };


    GetGameImageByGameId() {
        this.setState({
            isLoading: true
        });

        GetGameImageByGameId(this.state.game_id).then(res => {
            this.setState({
                isLoading: false,
                list: res.data,
                refreshing: false,
            });

        }).catch((error) => {
            Alert.alert("Server Error", error.message);
        })
    }


    AddGameImage=()=> {
        let model = {
            game_id: this.state.game_id,
        }
        this.setState({
            isLoading: true
        });


        let forData = ToFormData(model);
        forData = this.AppendImage(forData);

        AddGameImage(forData).then(res => {
            this.setState({
                isLoading: false,
            });
            this.setState({
                isLoading: false
            });
            if (res.is_success) {
                this.GetGameImageByGameId();
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


    DeleteGameImage=(id)=> {

        Alert.alert(
            "Are your sure?",
            "Are you sure you want to remove this image?",
            [
              {
                text: "Yes",
                onPress: () => {
                    let model = {
                        id: id,
                    }
                    this.setState({
                        isLoading: true
                    });
            
                    DeleteGameImage(model).then(res => {
                        this.setState({
                            isLoading: false,
                        });
                        this.setState({
                            isLoading: false
                        });
                        if (res.is_success) {
                            this.GetGameImageByGameId();
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
                },
              },
              {
                text: "No",
              },
            ]
          );
    }

    AppendImage(fd) {
        let files = this.state.galleryImageData;
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            fd.append('images[]', file);
        }
        return fd;
    }

    hideAlert = () => {
        this.setState({
            showAlertModal: false
        });
    };



    lsitItem = ({ item }) => (
        <TouchableOpacity
            key={item.id.toString()}
            style={styles.galleryGrid}
        >
            <ProgressiveImage
                source={{ uri: Configs.GAME_GALLERY_IMAGE_URL + item.image }}
                style={styles.galleryImg}
                resizeMode="contain"
            />
        </TouchableOpacity>

    );


    toggleModal = () =>
        this.setState({
            id: null,
            imageURI: null,
            isModalOpen: !this.state.isModalOpen,
        });

    onRefresh = () => {
        this.setState({ refreshing: true }, () => { this.GetGameImageByGameId() })
    }


    render() {
        return (
            <View style={styles.container}>
                <Header title="Gallery" addAction={this.toggleModal} />
                {this.state.isLoading ? (
                    <Loader />
                ) : (

                    <View style={styles.galleryContainer}>
                        {this.state.list?.map(item => {
                            let url = Configs.GAME_GALLERY_IMAGE_URL + item.image;
                            return (
                                <TouchableOpacity
                                    key={item.id.toString()}
                                    style={styles.galleryGrid}
                                    onLongPress={()=>this.DeleteGameImage(item.id)}
                                >
                                    <ProgressiveImage
                                        source={{ uri: url }}
                                        style={styles.galleryImg}
                                        resizeMode="contain"
                                        
                                    />
                                </TouchableOpacity>
                            )
                        })}

                    </View>
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
                                        Add Gallery Image
                                    </Text>
                                </View>
                            </View>



                            <View style={styles.itemModalBody}>
                                <View style={styles.form}>
                                    <ScrollView showsVerticalScrollIndicator={false}>

                                        <Text style={[styles.inputLable, { marginTop: 20 }]}>
                                            Add Photos:
                                        </Text>
                                        <View style={styles.galleryContainer}>
                                            {this.state.galleryImages.map((value, index) => (
                                                <TouchableOpacity
                                                    key={index.toString()}
                                                    activeOpacity={1}
                                                    style={styles.galleryGrid}
                                                >
                                                    <Image
                                                        source={{ uri: value.uri }}
                                                        resizeMode="contain"
                                                        style={styles.galleryImg}
                                                    />
                                                </TouchableOpacity>
                                            ))}
                                            <TouchableOpacity
                                                activeOpacity={1}
                                                style={styles.galleryAddBtn}
                                                onPress={this.addGalleryImage}
                                            >
                                                <Ionicons name="add" size={40} color={Colors.primary} />
                                            </TouchableOpacity>
                                        </View>


                                        <TouchableOpacity
                                            style={styles.submitBtn}
                                            onPress={this.AddGameImage}
                                        >
                                            <Text style={{ fontSize: 18, color: Colors.white }}>
                                                Upload
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


    galleryGrid: {
        width: Math.floor((windowWidth - 16) / 4),
        height: Math.floor((windowWidth - 16) / 4),
        alignItems: "center",
        justifyContent: "center",
    },

    galleryImg: {
        width: Math.floor((windowWidth - 16) / 4),
        height: Math.floor((windowWidth - 16) / 4),
        borderWidth: 2,
        borderColor: Colors.white,
    },

    galleryContainer: {
        marginTop: 5,
        flexDirection: "row",
        alignItems: "flex-start",
        flexWrap: "wrap",
    },
});

