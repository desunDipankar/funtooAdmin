import Configs, {ToFormData} from "../config/Configs";

/**
 * Add a warehouse
 * @param {object} data 
 * @returns 
 */
export async function AddWareHouse(data) {
    let url = Configs.BASE_URL + 'admin/Warehouse/insert';
    let requestOptions = {
		method: "POST",
		body: ToFormData(data),
	};

    let response = await fetch(url, requestOptions);

    return await response.json();
}

export async function GetAllWareHouses() {
    let url = Configs.BASE_URL + 'admin/Warehouse/index';
    let response = await fetch(url);

    return await response.json();
}

export async function UpdateWareHouse(data) {
    let url = Configs.BASE_URL + 'admin/Warehouse/update';
    let requestOptions = {
		method: "POST",
		body: ToFormData(data),
	};

    let response = await fetch(url, requestOptions);

    return await response.json();
}

export async function DeleteWareHouse(data) {
    let url = Configs.BASE_URL + 'admin/Warehouse/delete';
    let requestOptions = {
		method: "POST",
		body: ToFormData(data),
	};

    let response = await fetch(url, requestOptions);

    return await response.json();
} 