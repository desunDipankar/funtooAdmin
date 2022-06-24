import React from "react";
import Navigation from "./navigation/Navigation";
import AppLoading from "expo-app-loading";
import GlobalState from "./context/GlobalState";
import {
	readUserData,
	writeUserData,
	removeUserData,
} from "./utils/Util";
import { getAdminInfo } from "./services/APIServices";

export default class App extends React.Component {
	state = {
		isReady: false,
		persistantData: null,
	};

	loadPersistantData = () => {
		readUserData().then((data) => {
			if (data !== null) {
				getAdminInfo(data.phone)
					.then((response) => {
						let persistObj = null;
						if (response !== null) {
							persistObj = { ...data, ...response };
							writeUserData(persistObj);
						} else {
							removeUserData();
						}

						this.setState({
							persistantData: persistObj,
							isReady: true,
						});
					})
					.catch((error) => console.log(error));
			} else {
				this.setState({
					persistantData: data,
					isReady: true,
				});
			}
		});
	};

	onFinish = () => null;

	render = () =>
		!this.state.isReady ? (
			<AppLoading
				startAsync={this.loadPersistantData}
				onFinish={this.onFinish}
				onError={(err) => console.log(err)}
			/>
		) : (
			<GlobalState persistantData={this.state.persistantData}>
				<Navigation />
			</GlobalState>
		);
}