import React from "react";
import AppContext from "./AppContext";

export default class State extends React.Component {
  constructor(props) {
    super(props);

    this.setUserData = (data) => this.setState({ userData: data });

    this.unsetUserData = () => this.setState({ userData: null });

    this.setCartQuantity = (data) => this.setState({ cartQuantity: data });

    this.unsetCartQuantity = () => this.setState({ cartQuantity: [] });

    this.setWishListQuantity = (data) => this.setState({ wishListQuantity: data });

    this.unsetWishListQuantity = () => this.setState({ wishListQuantity: [] });

    this.state = {
      userData: props.persistantData,
      setUserData: this.setUserData,
      unsetUserData: this.unsetUserData,
      // quantity:props.persistantData,
      unsetCartQuantity: this.unsetCartQuantity,
      setCartQuantity: this.setCartQuantity,
      cartQuantity: [],
      unsetWishListQuantity: this.unsetWishListQuantity,
      setWishListQuantity: this.setWishListQuantity,
      wishListQuantity: [],
    };
  }

  render = () => {
    return (
      <AppContext.Provider value={this.state}>
        {this.props.children}
      </AppContext.Provider>
    );
  };
}