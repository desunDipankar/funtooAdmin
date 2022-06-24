import Configs,{ BuildSeachParams, ToFormData } from "../config/Configs";

export const GetOrders = async (status) => {
	let url = `${Configs.BASE_URL}admin/order/get_orders?status=${status}`;
	let response = await fetch(url);

	return await response.json();
};

export const GetOrderSetupPhotos = async (queryParams) => {
	let url = `${Configs.BASE_URL}admin/order/get_order_setup_photos?${ BuildSeachParams(queryParams)}`;
	let response = await fetch(url);

	return await response.json();
};

export const GetOrder = async (queryParams) => {
	let url = `${Configs.BASE_URL}admin/order/get_order?${ BuildSeachParams(queryParams) }`;
	let response = await fetch(url);

	return await response.json();
};

export const ChangeOrderStatus = async (data) => {
	let url = `${Configs.BASE_URL}admin/order/update_order_status`;
	let response = await fetch(url, {
		method: 'POST',
		body: ToFormData(data)
	});

	return await response.json();
}

export const AddOrderVolunteerVendorDetails = async (data) => {
	let url = `${Configs.BASE_URL}admin/order/create_order_vendor_volunteers`;
	let response = await fetch(url, {
		method: 'POST',
		body: ToFormData(data)
	});

	return await response.json();
}

export const GetAllOrderVolunteerVendorDetails = async (queryParams) => {
	let url = `${Configs.BASE_URL}admin/order/get_all_order_vendor_volunteers?${BuildSeachParams(queryParams)}`;
	let response = await fetch(url);

	return await response.json();
}

export const DeleteOrderVolunteerVendorDetails = async (data) => {
	let url = `${Configs.BASE_URL}admin/order/delete_order_vendor_volunteers`;
	let response = await fetch(url, {
		method: 'POST',
		body: ToFormData(data)
	});

	return await response.json();
}

export const AddOrderCommunicationDetails = async (data) => {
	let url = `${Configs.BASE_URL}admin/order/add_communication_records`;
	let response = await fetch(url, {
		method: 'POST',
		body: ToFormData(data)
	});

	return await response.json();
}

export const GetAllOrderCommunicationDetails = async (data) => {
	let url = `${Configs.BASE_URL}admin/order/get_all_communication_records?${BuildSeachParams(data)}`;
	let response = await fetch(url);

	return await response.json();
}

export const DeleteOrderCommunicationDetails = async (data) => {
	let url = `${Configs.BASE_URL}admin/order/delete_communication_records`;
	let response = await fetch(url, {
		method: 'POST',
		body: ToFormData(data)
	});

	return await response.json();
}

export const GetAllOrderGameParts = async (queryParams) => {
	let url = `${Configs.BASE_URL}admin/order/get_all_order_game_parts?${BuildSeachParams(queryParams)}`;
	let response = await fetch(url);

	return await response.json();
}

export const GetOrderGameCommonParts = async (queryParams) => {
	let url = `${Configs.BASE_URL}admin/order/get_common_parts?${BuildSeachParams(queryParams)}`;
	let response = await fetch(url);

	return await response.json();
}

export const AddGameCommonPartsForOrder = async (data) => {
	let url = `${Configs.BASE_URL}admin/order/add_order_common_game_parts`;
	let response = await fetch(url, {
		method: 'POST',
		body: ToFormData(data)
	});

	return await response.json();
}

export const GetAllSingleGameParts = async (queryParams) => {
	let url = `${Configs.BASE_URL}admin/order/get_all_parts_for_game_for_order?${BuildSeachParams(queryParams)}`;
	let response = await fetch(url);

	return await response.json();
}

export const GetOrderPoofDetails = async (queryParams) => {
	let url = `${Configs.BASE_URL}admin/order/proof_details?${BuildSeachParams(queryParams)}`;
	let response = await fetch(url);

	return await response.json();
}

export const AddGamePartsForOrder = async (data) => {
	let url = `${Configs.BASE_URL}admin/order/add_order_game_parts`;
	let response = await fetch(url, {
		method: 'POST',
		body: ToFormData(data)
	});

	return await response.json();
}

export const SaveOrderGamePhotoProof = async (data) => {
	let url = `${Configs.BASE_URL}admin/order/save_order_game_photo_proof`;
	let response = await fetch(url, {
		method: 'POST',
		body: ToFormData(data)
	});

	return await response.json();
}

export const GetOrderGamePhotoProof = async (queryParams) => {
	let url = `${Configs.BASE_URL}admin/order/get_order_game_photo_proof?${BuildSeachParams(queryParams)}`;
	let response = await fetch(url);

	return await response.json();
}

export const GetOrderVenderLists = async (queryParams) => {
	let url = `${Configs.BASE_URL}admin/order/get_order_venders?${BuildSeachParams(queryParams)}`;
	let response = await fetch(url);

	return await response.json();
}

export const GetOrderDeliveryVolunteerList = async (queryParams) => {
	let url = `${Configs.BASE_URL}admin/order/get_order_vender_volunteers?${BuildSeachParams(queryParams)}`;
	let response = await fetch(url);

	return await response.json();
}

export const AddOrderVenderVolunteer = async (data) => {
	let url = `${Configs.BASE_URL}admin/order/create_order_vender_volunteer`;
	let response = await fetch(url, {
		method: 'POST',
		body: ToFormData(data)
	});

	return await response.json();
}

export const UpdateOrderVenderVolunteer = async (data) => {
	let url = `${Configs.BASE_URL}admin/order/update_order_vender_volunteer`;
	let response = await fetch(url, {
		method: 'POST',
		body: ToFormData(data)
	});

	return await response.json();
}

export const DeleteOrderVenderVolunteer = async (data) => {
	let url = `${Configs.BASE_URL}admin/order/delete_order_vender_volunteer`;
	let response = await fetch(url, {
		method: 'POST',
		body: ToFormData(data)
	});

	return await response.json();
}

export const CreateInvoice = async (data) => {
	let url = `${Configs.BASE_URL}admin/invoice/create`;
	let response = await fetch(url, {
		method: 'POST',
		body: ToFormData(data)
	});

	return await response.json();
}

export const UpdateInvoice = async (data) => {
	let url = `${Configs.BASE_URL}admin/invoice/update`;
	let response = await fetch(url, {
		method: 'POST',
		body: ToFormData(data)
	});

	return await response.json();
}

export const GetInvoice = async (queryParams) => {
	let url = `${Configs.BASE_URL}admin/invoice/get?${BuildSeachParams(queryParams)}`;
	let response = await fetch(url);

	return await response.json();
}

export const GetAllInvoice = async () => {
	let url = `${Configs.BASE_URL}admin/invoice/get_all`;
	let response = await fetch(url);

	return await response.json();
}

export const MakeInvoicePayment = async (data) => {
	let url = `${Configs.BASE_URL}admin/invoice/add_payments`;
	let response = await fetch(url, {
		method: 'POST',
		body: ToFormData(data)
	});

	return await response.json();
}

export const GetAllOrderInvoicePayments = async (queryParams) => {
	let url = `${Configs.BASE_URL}admin/invoice/payments?${BuildSeachParams(queryParams)}`;
	let response = await fetch(url);

	return await response.json();
}