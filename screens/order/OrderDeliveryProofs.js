import React, { Component } from "react";
import {
    View,
    StyleSheet,
    Text,
    Image,
    ScrollView
} from "react-native";
import Colors from "../../config/colors";
import OverlayLoader from "../../components/OverlayLoader";
import { GetOrderPoofDetails } from "../../services/OrderService";
import OrderLoadingPartList from "../../components/Orders/OrderLoadingPartList";
import OrderGamesPhotoProof from "../../components/Orders/OrderGamesPhotoProof";
import OrderVolunteerProof from "../../components/Orders/OrderVolunteerProof";
import { FontAwesome5, FontAwesome } from '@expo/vector-icons';
import OrderCommonParts from "../../components/Orders/OrderCommonParts";
import emitter from "../../helper/CommonEmitter";

export default class OrderDeliveryProofs extends Component {
    constructor(props) {
        super(props);
        this._emitter = emitter;
        this.state = {
            orderData: props.orderData,
            isLoading: false,
            proofDetails: []
        }
    }

    componentDidMount() {
        this.getOrderProofDetails();
        this._emitter.on('LoadingPartsUpdatedFromCommonParts', this.loadDataOnLoadingPartsChanged.bind(this));
    }

    componentWillUnmount() {
        this._emitter.removeListener('LoadingPartsUpdatedFromCommonParts', this.loadDataOnLoadingPartsChanged.bind(this));
    }

    componentDidUpdate(){
        if(Object.keys(this._emitter._events).length == 0){
            this._emitter.on('LoadingPartsUpdatedFromCommonParts', this.loadDataOnLoadingPartsChanged.bind(this));
        }
    }

    getOrderProofDetails = () => {
        this.setState({ isLoading: true });
        GetOrderPoofDetails({ order_id: this.props.orderData.id })
        .then((result) => {
            if (result.is_success) {
                this.setState({
                    proofDetails: result.data
                });
            }
        })
        .catch(err => console.log(err))
        .finally(() => {
            this.setState({ isLoading: false });
        });
    }

    loadDataOnLoadingPartsChanged = () => {
        this.getOrderProofDetails();
    }

    render() {
        return (
            <>
                {(this.state.isLoading == true) ? (
                    <OverlayLoader visible={this.state.isLoading} />
                ) : (
                    <View style={styles.container}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ width: '50%' }}>
                                {/* <Text style={[styles.tableRow, { fontSize: 11 }]}>Item Name: </Text> */}
                            </View>

                            <View style={{ width: '16%' }}>
                                <FontAwesome5 name="truck" size={14} style={[styles.tableRow,{ alignSelf: 'center' }]} color="#dfdfdf" />
                                {/* <Text style={[styles.tableRow, { fontSize: 11, alignSelf: 'center' }]}>LOD</Text> */}
                            </View>
                            <View style={{ width: '18%' }}>
                            <FontAwesome name="photo" size={14} style={[styles.tableRow,{ alignSelf: 'center' }]} color="#dfdfdf" />
                                {/* <Text style={[styles.tableRow, { fontSize: 11, alignSelf: 'center' }]}>PHOTO</Text> */}
                            </View>
                            <View style={{ width: '16%' }}>
                                <FontAwesome name="user-circle-o" size={14} style={[styles.tableRow,{ alignSelf: 'center' }]} color="#dfdfdf" />
                                {/* <Text style={[styles.tableRow, { fontSize: 11, alignSelf: 'center' }]}>VOL</Text> */}
                            </View>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            {
                                (this.state.proofDetails.length > 0) ? this.state.proofDetails?.map((item) => {
                                    return (
                                        <View style={{
                                            flexDirection: 'row',
                                            marginTop: 5,
                                            marginHorizontal: 2,
                                            paddingVertical: 5,
                                            borderRadius: 5,
                                            backgroundColor: Colors.white
                                        }}
                                            key={item.name}>
                                            <View style={{ width: '50%', }}>
                                                <View style={{ flexDirection: 'row', marginTop: 5, marginBottom: 5, paddingHorizontal: 5, }}>
                                                    <View style={{ width: '65%', flexDirection: 'row',}}>
                                                        <Image
                                                            style={{ height: 57, width: 65, alignSelf: 'flex-start', borderWidth: 0.5, borderColor: '#dfdfdf' }}
                                                            source={{
                                                                uri: item.game_image_url
                                                            }}
                                                            resizeMode={'contain'}
                                                        />
                                                       <View style={{paddingLeft: 10, alignSelf: 'center'}}>
                                                            <Text style={{ color: Colors.black }}>{item.name}</Text>
                                                            <Text style={{ color: Colors.darkgrey }}>{`${item.quantity > 1 ? 'Qty: '+item.quantity : ''} `}</Text>
                                                        </View>
                                                    </View>
                                                    
                                                </View>
                                            </View>

                                            <View style={{ width: '16%', alignItems: 'center', justifyContent: 'center' }}>
                                                <OrderLoadingPartList item={item} orderData={this.props.orderData}/>
                                            </View>

                                            <View style={{ width: '18%', alignItems: 'center', justifyContent: 'center' }}>
                                                <OrderGamesPhotoProof item={item} orderData={this.props.orderData}/>
                                            </View>

                                            <View style={{ width: '16%', alignItems: 'center', justifyContent: 'center' }}>
                                                <OrderVolunteerProof item={item} orderData={this.props.orderData}/>
                                            </View>

                                        </View>
                                    )
                                }) : null
                            }
                            <OrderCommonParts orderData={this.props.orderData}/>
                        </ScrollView>
                    </View>
                )}
            </>
        )
    }
}

const styles = StyleSheet.create({
    tableRow: {
        // backgroundColor: Colors.lightGrey,
        paddingHorizontal: 5,
        paddingVertical: 10,
        marginRight: 5,
        color: Colors.grey
    },
    tableRow2: {
        // backgroundColor: Colors.lightGrey,
        marginRight: 5,
        color: Colors.grey,
        width: 50
    },
    container: {
        flex: 1,
        backgroundColor: "#F4F4F4",
    }
});