import React from "react";
import { 
    View, 
    Text,
    StyleSheet, 
    TouchableOpacity,
    ScrollView
} from "react-native";
import Colors from "../../config/colors";
import OverlayLoader from "../../components/OverlayLoader";
import { GetAllOrderInvoicePayments } from "../../services/OrderService";
import { showDateAsClientWant } from "../../utils/Util";

export default class Accounting extends React.Component {

    constructor(props) {
        super(props);

        console.log('order id-->', this.props.orderData);
        this.state = {
            active_tab: 3,
            showAlertModal: false,
            alertMessage: "",
            alertType: '',
            tabs: [
                { tab: 0, name: "Expenses"}, 
                { tab: 1, name: "Billing" },
                { tab: 2, name: "Invoice" },
                { tab: 3, name: "Payment" }
            ],
            isLoading: false,
            payments: []
        };
    }

    componentDidMount() {
        this.setState({isLoading: true});
        GetAllOrderInvoicePayments({ order_id: this.props.orderData.id })
        .then( (result) => {
            if(result.is_success) {
                this.setState({
                    payments: result.data
                });
            }
        } )
        .catch( e => console.log(e) )
        .finally( () => {
            this.setState({isLoading: false});
        });
    }

    render() {
        return (
            <View style={styles.container}>

                {
                    this.state.isLoading && <OverlayLoader visible={this.state.isLoading} />
                }

                <View style={styles.tabContainer}>
                    {this.state.tabs.map(tab => {
                        return (
                            <TouchableOpacity key={tab.tab} style={[{backgroundColor: tab.tab === this.state.active_tab ? Colors.danger : Colors.primary}, styles.tab]}
                                onPress={() => this.setState({ active_tab: tab.tab })}>
                                <Text style={{ color: Colors.white }}>{tab.name}</Text>
                            </TouchableOpacity>
                        )
                    })}
                </View>
                {
                    this.state.active_tab == 3 ? (
                        <>
                            <View>
                                <View style={{ flexDirection: 'row'  }}>
                                    <View style={styles.tableHeader}>
                                        <Text style={{ alignSelf: 'center', fontSize: 12, color: Colors.white }}>Invoice</Text>
                                    </View>

                                    <View style={styles.tableHeader}>
                                        <Text style={{ alignSelf: 'center', fontSize: 12, color: Colors.white }}>Amount</Text>
                                    </View>

                                    <View style={styles.tableHeader}>
                                        <Text style={{ alignSelf: 'center', fontSize: 12, color: Colors.white }}>Paid On</Text>
                                    </View>

                                    <View style={styles.tableHeader}>
                                        <Text style={{ alignSelf: 'center', fontSize: 12, color: Colors.white }}>Payment Mode</Text>
                                    </View>
                                </View>
                            </View>

                            <ScrollView>
                                {
                                    this.state.payments.length > 0 && this.state.payments.map( (item) => {
                                        return (
                                            <View style={[{ flexDirection: 'row' }, { marginTop: 10  }]} key={item.id}>
                                                <View style={[styles.tableHeader, {backgroundColor: Colors.lightGrey}]}>
                                                    <Text style={{ alignSelf: 'center'}}>{'#'}{item.invoice_number}</Text>
                                                </View>

                                                <View style={[styles.tableHeader, {backgroundColor: Colors.lightGrey}]}>
                                                    <Text style={{ alignSelf: 'center'}}>{'₹'}{item.amount}</Text>
                                                </View>

                                                <View style={[styles.tableHeader, {backgroundColor: Colors.lightGrey}]}>
                                                    <Text style={{ alignSelf: 'center'}}>{showDateAsClientWant(item.paid_on)}</Text>
                                                </View>

                                                <View style={[styles.tableHeader, {backgroundColor: Colors.lightGrey}]}>
                                                    <Text style={{ alignSelf: 'center' }}>{item.payment_type}</Text>
                                                </View>
                                            </View>
                                        )
                                    } )
                                }
                            </ScrollView>
                        </>

                        
                    ) : null
                }
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    tableHeader: {
        width: '25%', 
        justifyContent: 'center', 
        padding: 3,
        backgroundColor: Colors.primary
    },
    tab: {
        margin: 5, 
        padding: 5,
        paddingLeft: 10,
        paddingRight: 10, 
        elevation: 4,
        borderRadius: 10
    },
    tabContainer: {
        margin: 5,
        flexDirection: "row",
        flexWrap:'wrap',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    }
});