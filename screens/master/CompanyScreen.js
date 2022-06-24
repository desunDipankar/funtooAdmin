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
} from "react-native";

import { Header } from "../../components";

export default class CompanyScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        }
    }

    render() {
       return (
        <View>
            <Header title="Company"/>
            <Text>Company Master screen</Text>
        </View>
       )
    }
}