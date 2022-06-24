import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import Colors from "../config/colors";
import Header from "../components/Header";

export default class WishList extends React.Component {
	render = () => (
		<View style={styles.container}>
			<Header title="Wish List" />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
