import Configs,{ToFormData} from "../config/Configs";

export const UserLogin = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/user/login";

	let requestOptions = {
		method: "POST",
		body: ToFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const UserForgotPassword = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/user/forgot_password";

	let requestOptions = {
		method: "POST",
		body: ToFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const FindUser = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/user/find_user";

	let requestOptions = {
		method: "POST",
		body: ToFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};


export const UserChangePassword = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/user/change_password";
	let requestOptions = {
		method: "POST",
		body: ToFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};