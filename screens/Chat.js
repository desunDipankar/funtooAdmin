import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import Colors from "../config/colors";
import Header from "../components/Header";

export default class Chat extends React.Component {
	render = () => (
		<View style={styles.container}>
			<Header title="Chat" />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
