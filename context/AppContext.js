import React from "react";

export default React.createContext({
	userData: null,
	setUserData: (data) => {},
	unsetUserData: () => {},
	setCartQuantity:(data)=>{},
	unsetCartQuantity:()=>{},
	cartQuantity: [],
	setWishListQuantity:(data)=>{},
	unsetWishListQuantity:()=>{},
	wishListQuantity: []
});