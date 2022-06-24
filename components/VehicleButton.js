import React from "react";
import { 
    Button,
    ActivityIndicator,
    Alert
   } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { AddVehicleArrivalEntry } from "../services/VehicleInfoApiService";
import { getFileData } from "../utils/Util";
import Colors from "../config/colors";

export default class VehicleButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showLoder: false,
            vehicleInfo: this.props.vehicleInfo,
            currentStatus: this.props.currentStatus
        }
    }

    componentDidMount() {}

    setButtonTitle = () => {
        if(this.state.vehicleInfo.journey_type == 'Onward') {
            if(this.state.currentStatus == 'v-basic-info-recorded') {
                return 'Vehicle Photo';
            } else if(this.state.currentStatus == 'v-arrival-entry') {
                return 'Onward Journey Start';
            } else if(this.state.currentStatus == 'v-up-start') {
                return 'Onward Journey End';
            } else if(this.state.currentStatus == 'v-up-end') {
                return 'Payment Info';
            } else if(this.state.currentStatus == 'v-payment-info-added') {
                return 'Raise Invoice';
            } else {
                return 'Invoice Raised';
            }
        }else if(this.state.vehicleInfo.journey_type == 'Return') {
            if(this.state.currentStatus == 'v-basic-info-recorded') {
                return 'Vehicle Photo';
            } else if(this.state.currentStatus == 'v-arrival-entry') {
                return 'Return Journey Start';
            } else if(this.state.currentStatus == 'v-down-start') {
                return 'Return Journey End';
            } else if(this.state.currentStatus == 'v-down-end') {
                return 'Payment Info';
            } else if(this.state.currentStatus == 'v-payment-info-added') {
                return 'Raise Invoice';
            } else {
                return 'Invoice Raised';
            }
        } else {
            if(this.state.currentStatus == 'v-basic-info-recorded') {
                return 'Vehicle Photo';
            } else if(this.state.currentStatus == 'v-arrival-entry') {
                return 'Onward Journey Start';
            } else if(this.state.currentStatus == 'v-up-start') {
                return 'Onward Journey End';
            } else if(this.state.currentStatus == 'v-up-end') {
                return 'Return Journey Start';
            } else if(this.state.currentStatus == 'v-down-start') {
                return 'Return Journey End';
            } else if(this.state.currentStatus == 'v-down-end') {
                return 'Payment Info';
            } else if(this.state.currentStatus == 'v-payment-info-added') {
                return 'Raise Invoice';
            } else {
                return 'Invoice Raised';
            }
        }
    }

    pickImageAndUploadArrivalEntry = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            quality: 1,
        });
        
        if (!result.cancelled) {
            let data = {
                vehicles_info_id: this.state.vehicleInfo.vehicles_info_id,
                photo: getFileData(result)
            }
            this.setState({showLoder: true});
            AddVehicleArrivalEntry(data).then( (result) => {
           
                this.setState({
                    showLoder: false,
                    currentStatus: 'v-arrival-entry'
                })
            }).catch( (err) => {
                console.log('errors -->', err);
                this.setState({showLoder: false});
                Alert.alert("Server Error", "Please try agian");
            });
        }
    }

    handleOnePress = () => {
        if(this.state.vehicleInfo.journey_type == 'Onward') {
            if(this.state.currentStatus == 'v-basic-info-recorded') {
                this.pickImageAndUploadArrivalEntry();
            } else if(this.state.currentStatus == 'v-arrival-entry') {
                this.props.navigation.navigate("VehicleUpWordJourneyStartAdd", { vehicleInfo: this.props.vehicleInfo, callBack: this.props.callBack });
            } else if(this.state.currentStatus == 'v-up-start') {
                this.props.navigation.navigate("VehicleUpWordJourneyEndAdd", { vehicleInfo: this.props.vehicleInfo, callBack: this.props.callBack });
            } else if(this.state.currentStatus == 'v-up-end') {
                this.props.navigation.navigate("VehiclePaymentInfoAdd", { vehicleInfo: this.props.vehicleInfo });
            } else if(this.state.currentStatus == 'v-payment-info-added') {
                this.props.navigation.navigate("VehicleBilling", { vehicleInfo: this.props.vehicleInfo });
            }
        } else if(this.state.vehicleInfo.journey_type == 'Return') {
            if(this.state.currentStatus == 'v-basic-info-recorded') {
                this.pickImageAndUploadArrivalEntry();
            } else if(this.state.currentStatus == 'v-arrival-entry') {
                this.props.navigation.navigate("VehicleDownWordJourneyStartAdd", { vehicleInfo: this.props.vehicleInfo, callBack: this.props.callBack });
            } else if(this.state.currentStatus == 'v-down-start') {
                this.props.navigation.navigate("VehicleDownWordJourneyEndAdd", { vehicleInfo: this.props.vehicleInfo, callBack: this.props.callBack });
            } else if(this.state.currentStatus == 'v-down-end') {
                this.props.navigation.navigate("VehiclePaymentInfoAdd", { vehicleInfo: this.props.vehicleInfo });
            } else if(this.state.currentStatus == 'v-payment-info-added') {
                this.props.navigation.navigate("VehicleBilling", { vehicleInfo: this.props.vehicleInfo });
            }
        } else {
            if(this.state.currentStatus == 'v-basic-info-recorded') {
                this.pickImageAndUploadArrivalEntry();
            } else if(this.state.currentStatus == 'v-arrival-entry') {
                this.props.navigation.navigate("VehicleUpWordJourneyStartAdd", { vehicleInfo: this.props.vehicleInfo, callBack: this.props.callBack });
            } else if(this.state.currentStatus == 'v-up-start') {
                this.props.navigation.navigate("VehicleUpWordJourneyEndAdd", { vehicleInfo: this.props.vehicleInfo, callBack: this.props.callBack });
            } else if(this.state.currentStatus == 'v-up-end') {
                this.props.navigation.navigate("VehicleDownWordJourneyStartAdd", { vehicleInfo: this.props.vehicleInfo, callBack: this.props.callBack });
            } else if(this.state.currentStatus == 'v-down-start') {
                this.props.navigation.navigate("VehicleDownWordJourneyEndAdd", { vehicleInfo: this.props.vehicleInfo, callBack: this.props.callBack });
            } else if(this.state.currentStatus == 'v-up-end') {
                this.props.navigation.navigate("VehiclePaymentInfoAdd", { vehicleInfo: this.props.vehicleInfo });
            } else if(this.state.currentStatus == 'v-payment-info-added') {
                this.props.navigation.navigate("VehicleBilling", { vehicleInfo: this.props.vehicleInfo });
            }
        }
    }

    render() {
        return (
            <>
                { this.state.showLoder ? (
                    <ActivityIndicator 
                    animating={this.state.showLoder}
                    size="small"
                    color={Colors.primary}
                    />
                ) : (
                    <Button 
                        title={`${this.setButtonTitle()}`}
                        onPress={this.handleOnePress}
                        color={Colors.primary}
                    />
                ) }
            </>
        )
    }
}