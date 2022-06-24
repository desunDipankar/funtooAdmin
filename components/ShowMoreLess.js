import React, {Component} from "react";
import {
	Text,
	Pressable
} from "react-native";
import {AntDesign } from "@expo/vector-icons";
import propTypes from "prop-types";

export default class ShowMoreLess extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isShowMoreOpen: false
        }
    }

    render() {
        return (
            <>
                <Pressable
                    style={{
                        padding: 5,
                        backgroundColor: '#63c3a5',
                        width: '50%',
                        justifyContent: 'center',
                        borderRadius: 6,
                        marginTop: 10
                    }}
                    onPress = { ()=> this.setState({isShowMoreOpen: !this.state.isShowMoreOpen}) }
                    >
                    <Text style={{
                        color: '#fff',
                        textAlign: 'center'
                    }}>Show {this.state.isShowMoreOpen ? 'Less' : 'More'} <AntDesign name={ this.state.isShowMoreOpen ? 'upcircleo' : 'downcircleo' } size={16} color="#fff" /></Text>
                </Pressable>

                {/* applying react render props pattern here */}
                { this.state.isShowMoreOpen && this.props.render() }
            </>
        )
    }
}

ShowMoreLess.propTypes = {
    render: propTypes.func
}