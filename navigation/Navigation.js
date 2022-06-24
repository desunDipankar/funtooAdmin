import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import {
	createStackNavigator,
	CardStyleInterpolators,
} from "@react-navigation/stack";

import MobileVerification from "../screens/MobileVerification";
import OtpVerification from "../screens/OtpVerification";
import UpdateAccount from "../screens/UpdateAccount";
import AppContext from "../context/AppContext";
import UserLoginScreen from "../screens/user/UserLoginScreen";
import UserForgotPasswordScreen from "../screens/user/UserForgotPasswordScreen";

import AdminNavigation from "./AdminNavigation";
import VendorNavigation from "./VendorNavigation";

const Stack = createStackNavigator();

export default class Navigation extends React.Component {
	static contextType = AppContext;

	render = () => {

		if(this.context.userData === null) {
			return (
				<NavigationContainer>
				<Stack.Navigator
					initialRouteName={'UserLogin'}
					screenOptions={{
						headerShown: false,
						cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
					}}
				>
					<Stack.Screen name="UserLogin" component={UserLoginScreen} />
					<Stack.Screen name="MobileVerification" component={MobileVerification} />
					<Stack.Screen name="OtpVerification" component={OtpVerification} />
					<Stack.Screen name="UserForgotPassword" component={UserForgotPasswordScreen} />
				</Stack.Navigator>
				</NavigationContainer>
			)
		} else if(this.context.userData.name.length == 0 || this.context.userData.email.length == 0) {
			return (
				<NavigationContainer>
					<Stack.Navigator
						initialRouteName={'UpdateAccount'}
						screenOptions={{
							headerShown: false,
							cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
						}}
						>
						<Stack.Screen name="UpdateAccount" component={UpdateAccount} />
					</Stack.Navigator>
				</NavigationContainer>
			)
		} else if(this.context.userData.type == 'admin') {
			return (
				<NavigationContainer>
					<Stack.Navigator
						screenOptions={{
							headerShown: false,
							cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
						}}>
						{ (() => AdminNavigation())() }
					</Stack.Navigator>
				</NavigationContainer>
			)
		} else if(this.context.userData.type == 'vender') {
			return (
				<NavigationContainer>
					<Stack.Navigator
						screenOptions={{
							headerShown: false,
							cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
						}}>
						{ (() => VendorNavigation())() }
					</Stack.Navigator>
				</NavigationContainer>
			)
		}
	}
}