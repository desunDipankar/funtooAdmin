import Configs,{ToFormData} from "../config/Configs";

export const UpdateGstNumber = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/Customer/update_gst_number";

	let requestOptions = {
		method: "POST",
		body: ToFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};