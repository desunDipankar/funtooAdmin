import React, {Component} from "react";
import {
	StyleSheet,
	Text,
    View,
    Image
} from "react-native";
import Colors from "../../config/colors";
import { GetOrderGameCommonParts, AddGameCommonPartsForOrder } from "../../services/OrderService";
import OverlayLoader from "../OverlayLoader";
import Checkbox from "expo-checkbox";
import emitter from "../../helper/CommonEmitter";

export default class OrderCommonParts extends Component {
    constructor(props) {
        super(props);
        this._emitter = emitter;
        this.state = {
            isLoading: false,
            commonParts : []
        }
    }

    componentDidMount() {
        this.setState({isLoading: true});
        GetOrderGameCommonParts({order_id: this.props.orderData.id})
        .then( (result) => {
            this.setState({
                commonParts: result.data
            });
        })
        .catch( err => console.log(err) )
        .finally( () => {
            this.setState({isLoading: false});
        });
    }

    handleOnChange = (value, item) => {
        let data = {
            order_id: this.props.orderData.id,
            parts_id: item.parts_id,
            games: JSON.stringify(item.games),
            is_tic: (value === true) ? 1 : 0
        }

        this.setState({isLoading: true});
        AddGameCommonPartsForOrder(data)
        .then( (result) => {
            this.setState({isLoading: false} , () => {
                this._emitter.emit('LoadingPartsUpdatedFromCommonParts');
            });
        })
        .catch( err => console.log(err) );
    }

    render() {
        return (
            <View style={{ marginTop: 5 }}>

                {this.state.isLoading && <OverlayLoader visible={this.state.isLoading} />}

                {
                    this.state.commonParts.length > 0 && (
                        <View style={styles.header}>
                            <Text>Common Parts</Text>
                        </View>
                    )
                }

                <View>
                    {
                        this.state.commonParts.length > 0 && this.state.commonParts.map( (item) => {
                            return (
                                <View style={{ flexDirection: 'row', marginTop: 5, backgroundColor: Colors.white }} key={ item.parts_id }>
                                    <View style={{width: '16%', justifyContent: 'center', paddingHorizontal: 3}}>
                                        <Image style={{ width: 50, height: 50, borderWidth: 0.5, borderColor: '#dfdfdf'  }} source={{ uri: item.thumb_image_url}}/>
                                    </View>
                                    <View style={{width: '73%'}}>
                                        
                                        <View style={{ marginVertical: 7 }}>
                                            <Text>{item.parts_name}</Text>
                                        </View>
                                       
                                        <View style={{ flexDirection: 'row', flexWrap: 'wrap'}}>
                                        { item.games.map( (game) => {
                                                return (
                                                    <Text key={game.game_id} style={ styles.gameNameText }>{game.game_name} x {game.common_part_quantity}</Text>                                                )
                                            } ) }
                                        </View>
                                    </View>
                                    <View style={{width: '9%', justifyContent: 'center', alignItems: 'center', padding: 2}}>
                                        <Checkbox
                                            value={item.is_parts_loaded}
                                            onValueChange={(value) => { this.handleOnChange(value, item) }}
                                            style={{borderColor: '#dfdfdf', borderRadius: 5}}
                                        />
                                    </View>
                                </View>
                            )
                        })
                    }

                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    header: {
        marginLeft: 5,
        justifyContent: 'flex-start',
        backgroundColor: Colors.white,
        paddingVertical: 10,
    },
    gameNameText: {
        alignSelf: 'center',
        fontSize: 11,
        marginVertical: 2,
        marginLeft: 1,
        padding: 5,
        backgroundColor: Colors.primary,
        color: Colors.white,
        borderWidth: 0.7, 
        borderColor: '#dfdfdf',
        borderRadius: 8
    }
});