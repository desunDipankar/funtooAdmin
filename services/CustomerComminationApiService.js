import Configs,{ToFormData} from "../config/Configs";

export const CustomerComminationDetail = async (event_id) => {
	let url = Configs.BASE_URL + "admin/CustomerCommination/get_customer_commination_detail?event_id="+event_id;
	let response = await fetch(url);
	return await response.json();
};


export const AddCustomerCommination = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/CustomerCommination/add_customer_commination";

	let requestOptions = {
		method: "POST",
		body: ToFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};


export const UpdateCustomerCommination = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/CustomerCommination/update_customer_commination";

	let requestOptions = {
		method: "POST",
		body: ToFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const AddRecord = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/CustomerCommination/add_record";
	let requestOptions = {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const UpdateRecord = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/CustomerCommination/update_record";
	let requestOptions = {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const DeleteRecord = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/CustomerCommination/delete_record";

	let requestOptions = {
		method: "POST",
		body: ToFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};
