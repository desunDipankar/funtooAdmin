import React, {useState} from "react";
import { useNavigation } from "@react-navigation/native";
import {
	StyleSheet,
	Text,
	TouchableOpacity,
    Alert
} from "react-native";
import Colors from "../../config/colors";
import OverlayLoader from "../OverlayLoader";
import { CreateInvoice } from "../../services/OrderService";


export default function OrderAndGenerateBill(props) {
    const navigation = useNavigation();
	const [showLoader, setShowLoader] = useState(false);

	function createInvoice() {
		setShowLoader(true);
		CreateInvoice({ order_id: props.orderData.id })
		.then( (result) => {
			if(result.is_success) {
				navigation.navigate("OrderInvoice", {
					id: result.data.invoice_id
				});
			}
		})
		.catch( err => console.log(err) )
		.finally( () => {
			setShowLoader(false);
		});
	}

    function confirmUserForGenerateBill() {
        Alert.alert(
			"Alert",
			"Are you sure you want to generate Invoice?",
			[
				{
					text: "Yes",
					onPress: () => { createInvoice() }
				},
				{
					text: "No"
				},
			]
		);
    }

    return (

		<>

			<OverlayLoader visible={showLoader}/>

		 	<TouchableOpacity onPress={ () => confirmUserForGenerateBill() }
				style={ styles.billGenerateBtn }>
				<Text style={styles.btnText}>Complete {'&'} Generate Bill</Text>
			</TouchableOpacity>
		</>
		

       
    )
}

const styles = StyleSheet.create({
    billGenerateBtn: {
		backgroundColor: Colors.primary, 
		marginLeft: 12, 
		marginRight: 12,
		marginBottom: 10, 
		padding: 10,
		borderRadius: 10,
		elevation: 4
	},
    btnText: {
        color: Colors.white, 
        textAlign: 'center'
    }
})