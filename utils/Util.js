import * as mime from "react-native-mime-types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import {Text} from 'react-native';
import Colors from "../config/colors";

const FUNTOO_DEVICE_STORAGE_KEY = "@funtoo_admin";

export const getFileData = (obj = {}) => {
	let uri = obj.uri;

	let arr = uri.split("/");
	let fileName = arr[arr.length - 1];

	return {
		uri: uri,
		name: fileName,
		type: mime.lookup(fileName),
	};
};

export const getFormattedDate = (dateStr, formatType = "YYYY-MM-DD") => {
	if(!dateStr){
		return null;
	}
	var d = new Date(dateStr);

	//prepare day
	let day = d.getDate();
	day = day < 10 ? "0" + day : day;

	//prepare month
	let month = d.getMonth() + 1;
	month = month < 10 ? "0" + month : month;

	//prepare year
	let year = d.getFullYear();

	let date = undefined;
	switch (formatType) {
		case "DD/MM/YYYY":
			date = day + "/" + month + "/" + year;
			break;
		default:
			date = year + "-" + month + "-" + day;
	}

	return date;
};

export const renderDate = (date) => {
	if (!date) {
		return "";
	}
	let ab = "th";
	let day = moment(date, "YYYY-MM-DD").format("D");
	if (day == 1) {
		ab = "st";
	}
	if (day == 2) {
		ad = "nd";
	}
	let month = moment(date, "YYYY-MM-DD").format("MMM");
	let year = moment(date, "YYYY-MM-DD").format("YY");
	let day_name = moment(date, "YYYY-MM-DD").format("dddd");
	return `${day}${ab} - ${month} - ${year} (${day_name})`;
}

export const renderTime = (time) => {
	if (!time) {
		return "";
	}
	return  moment(time, "HH:mm").format("hh:mm A");
}

export const isMobile = (no) => {
	let regx = /^\d{10}$/;
	return regx.test(no);
};


export const isEmail = (email) => {
	let regx =  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	return regx.test(email);
};

export const isNumeric = (n) => {
	return !isNaN(parseFloat(n)) && isFinite(n);
};

export const readUserData = async () => {
	try {
		let rawData = await AsyncStorage.getItem(FUNTOO_DEVICE_STORAGE_KEY);
		return rawData !== null ? JSON.parse(rawData) : null;
	} catch (e) {
		throw new Error("failed to retrieve data from storage");
	}
};

export const writeUserData = async (value) => {
	try {
		await AsyncStorage.setItem(
			FUNTOO_DEVICE_STORAGE_KEY,
			JSON.stringify(value)
		);
	} catch (e) {
		throw new Error("failed to write data in storage");
	}
};

export const removeUserData = async () => {
	try {
		await AsyncStorage.removeItem(FUNTOO_DEVICE_STORAGE_KEY);
	} catch (e) {
		throw new Error("failed to remove data from storage");
	}
};

// export const showDateAsClientWant = (date) => {
// 	let m = moment(date);

// 	return m.format("Do - MMM - YY (ddd)");
// }

export const showDateAsClientWant = (date, customStyle={}) => {
	let m = moment(date);
	return (
		<Text style={[ {color: Colors.grey, fontSize: 14, opacity: 0.8}, customStyle ]}>{`${m.format("Do")} `}{`${m.format("MMM")} ${m.format("YY")}`}<Text style={{fontSize: 10}}>{` (${m.format("ddd")}) `}</Text>  </Text>
	)
	// return m.format("D/MMM/YY (ddd)");
}

export const showTimeAsClientWant = (time) => {
	if (!time) {
		return "";
	}

	return  moment(time, "HH:mm").format("hh:mm A");
}