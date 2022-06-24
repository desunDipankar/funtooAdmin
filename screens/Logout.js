import React from "react";
import  Loader  from "../components/Loader";
import { removeUserData } from "../utils/Util";
import AppContext from "../context/AppContext";

export default class Logout extends React.Component {
	static contextType = AppContext;

	componentDidMount = () => {
		removeUserData();
		this.context.unsetUserData();
	};

	render(){
		return(
			<></>
		)
	}
}
