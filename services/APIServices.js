import Configs from "../config/Configs";

const getFormData = (obj) => {
	let formdata = new FormData();
	for (let key in obj) {
		formdata.append(key, obj[key]);
	}
	return formdata;
};

export const authenticateAdmin = async (requestObj) => {
	let url = Configs.BASE_URL + "adminApi/authenticate/";
	let requestOptions = {
		method: "POST",
		body: getFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};
export const update_admin_details = async (requestObj) => {
	let url = Configs.BASE_URL + "adminApi/update_admin_details/";

	let requestOptions = {
		method: "POST",
		body: getFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const getNewArrivalsDetails = async () => {
	let url = Configs.BASE_URL + "adminApi/new_arrival_details";
	let response = await fetch(url);
	
	return await response.json();
};
export const update_user_profile = async (requestObj) => {
	let url = Configs.BASE_URL + "adminApi/update_user_profile/";

	let requestOptions = {
		method: "POST",
		body: getFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const getCategory = async (catId = null) => {
	let url = catId ? Configs.BASE_URL + "adminApi/getcategory?cat_id="+catId : Configs.BASE_URL + "adminApi/getcategory";
	let response = await fetch(url);
	return await response.json();
};
export const getSubCategory = async (parent_id) => {
	let url = Configs.BASE_URL + "adminApi/getsubcategory?parent_id="+parent_id;
	let response = await fetch(url);
	return await response.json();
};

// export const gamelist_by_sub_category = async (cat_id, sortBy) => {
// 	let url = Configs.BASE_URL + "adminApi/gamelist_by_sub_category?cat_id="+cat_id+"&sort_by="+`${sortBy}`;
// 	//console.log(url)
// 	let response = await fetch(url);
// 	return await response.json();
// };
export const gamedetails = async (id,cust_code) => {
	let url = Configs.BASE_URL + "adminApi/gamedetails?id="+id+"&cust_code="+cust_code;
	let response = await fetch(url);
	return await response.json();
};

export const getAdminInfo = async (phone) => {
	let url = Configs.BASE_URL + "adminApi/admin_info/?mobile=" + phone;
	let response = await fetch(url);
	return await response.json();
};
export const addWishList = async (game_code,cust_code) => {
	let url = Configs.BASE_URL + "adminApi/addwishlist/?game_code=" + game_code+"&cust_code="+cust_code;
	let response = await fetch(url);
	return await response.json();
};

export const getWishList = async (cust_code) => {
	let url = Configs.BASE_URL + "adminApi/getwishlist/?cust_code="+cust_code;
	let response = await fetch(url);
	return await response.json();
};

export const removeWishlistItem = async (game_code,cust_code) => {
	let url = Configs.BASE_URL + "adminApi/removewishlist/?game_code=" + game_code+"&cust_code="+cust_code;
	let response = await fetch(url);
	return await response.json();
};

export const placeOrder = async (requestObj) => {
	let url = Configs.BASE_URL + "adminApi/placeorder/";

	let requestOptions = {
		method: "POST",
		body: getFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const addToCart = async (cust_id,game_id,total,qty) => {
	let url = Configs.BASE_URL + "adminApi/addcart/?game_id=" + game_id+"&cust_id="+cust_id+"&price="+total+"&qty="+qty;
	let response = await fetch(url);
	return await response.json();
};

export const getCart = async (cust_id) => {
	let url = Configs.BASE_URL + "adminApi/getcart/?cust_id="+cust_id;
	let response = await fetch(url);
	return await response.json();
};

export const clearCart = async (cust_id) => {
	let url = Configs.BASE_URL + "adminApi/clearcart/?cust_id="+cust_id;
	let response = await fetch(url);
	return await response.json();
};
export const getEnquiryDetails = async (cust_id) => {
	let url = Configs.BASE_URL + "adminApi/get_event_details";
	let response = await fetch(url);
	return await response.json();

};
export const getOrderDetails = async (cust_id) => {
	let url = Configs.BASE_URL + "adminApi/get_event_order_confirmed_details?cust_id="+cust_id;
	let response = await fetch(url);
	return await response.json();

};

export const getSlider = async () => {
	let url = Configs.BASE_URL + "adminApi/get_slider";
	let response = await fetch(url);
	return await response.json();
};



export const getProfile = async (studentCode) => {
	let url = Configs.BASE_URL + "adminApi/profile/" + studentCode;
	let response = await fetch(url);
	return await response.json();
};

export const editProfile = async (requestObj) => {
	let url = Configs.BASE_URL + "adminApi/edit_profile/";

	let requestOptions = {
		method: "POST",
		headers: {
			"Content-Type": "multipart/form-data",
		},
		body: getFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const addCategory = async (requestObj) => {
	let url = Configs.BASE_URL + "adminApi/addCategory/";
	let requestOptions = {
		method: "POST",
		headers: {
			"Content-Type": "multipart/form-data",
		},
		body: getFormData(requestObj),
	};
	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const editCategory = async (requestObj) => {
	let url = Configs.BASE_URL + "adminApi/editCategory/";
	let requestOptions = {
		method: "POST",
		headers: {
			"Content-Type": "multipart/form-data",
		},
		body: getFormData(requestObj),
	};
	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const addSubCategory = async (requestObj) => {
	let url = Configs.BASE_URL + "adminApi/addSubCategory/";
	let requestOptions = {
		method: "POST",
		body: getFormData(requestObj),
	};
	let response = await fetch(url, requestOptions);
	return await response.json();
};


export const editSubCategory = async (requestObj) => {
	let url = Configs.BASE_URL + "adminApi/editSubCategory/";
	let requestOptions = {
		method: "POST",
		headers: {
			"Content-Type": "multipart/form-data",
		},
		body: getFormData(requestObj),
	};
	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const GameListBySubCategory = async (cat_id, sortBy) => {
	let url = Configs.BASE_URL + "admin/game/game_list_by_sub_category?cat_id="+cat_id+"&sort_by="+`${sortBy}`;
	let response = await fetch(url);
	return await response.json();
};

export const GameListByTag= async (tag_id, sortBy,cat_id) => {
	let url = Configs.BASE_URL + "admin/game/game_list_by_tag?tag_id="+tag_id+"&cat_id="+`${cat_id}`+"&sort_by="+`${sortBy}`;
	let response = await fetch(url);
	return await response.json();
};

export async function SendOrderBillingInfoUpdatePush(data) {
	let url = Configs.BASE_URL + "admin/push/send_push_notification";
	let requestOptions = {
		method: "POST",
		headers: {
			"Content-Type": "multipart/form-data",
		},
		body: getFormData(data),
	};
	
	await fetch(url, requestOptions);
}