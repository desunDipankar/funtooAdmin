import React from "react";
import {Text, StyleSheet} from "react-native"
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import CustomDrawerContent from "../components/CustomDrawer";
import {
    Ionicons,
    FontAwesome,
    MaterialCommunityIcons,
} from "@expo/vector-icons";

import Colors from "../config/colors";


import MasterMenuScreen from "../screens/master/MasterMenuScreen";
import Home from "../screens/Home";
import ManageEnquiry from "../screens/ManageEnquiry";
import Orders from "../screens/Orders";
import Chat from "../screens/Chat";
import Profile from "../screens/Profile";
import GameDetails from "../screens/GameDetails";
import EventDetails from "../screens/EventDetails";
import Catalog from "../screens/Catalog";
import AddCategory from "../screens/AddCategory";
import editCategory from "../screens/EditCategory";
import SubCategory from "../screens/SubCategory";
import CategoryTagAddScreen from "../screens/CategoryTagAddScreen";
import AddSubCategory from "../screens/AddSubCategory";
import EditSubCategory from "../screens/EditSubCategory";
import Games from "../screens/game/Games";
import GamesByTag from "../screens/game/GamesByTag";
import AddGame from "../screens/game/AddGame";
import EditGame from "../screens/game/EditGame";
import ProductListingDetails from "../screens/game/ProductListingDetails";
import ProductLaunchDetails from "../screens/game/ProductLaunchDetails";
import PartsList from "../screens/game/PartsList";
import GameImageScreen from "../screens/game/GameImageScreen";
import GameTagScreen from "../screens/game/GameTagScreen";
import ManageOrder from "../screens/ManageOrder";
import Logout from "../screens/Logout";
import AppContext from "../context/AppContext";
import SearchScreen from "../screens/SearchScreen";
import TemplateScreen from "../screens/master/TemplateScreen";
import VenderTypeScreen from "../screens/master/VenderTypeScreen";
import PriorityScreen from "../screens/master/PriorityScreen";
import UomScreen from "../screens/master/UomScreen";
import PartScreen from "../screens/master/PartScreen";
import VenderScreen from "../screens/master/VenderScreen";
import VenderAddUpdateScreen from "../screens/master/VenderAddUpdateScreen";
import MaterialScreen from "../screens/master/MaterialScreen";
import StorageAreaMaster from "../screens/master/StorageMaster";
import AddStorageMaster from "../screens/master/AddStorageMaster";
import EditStorageMaster from "../screens/master/EditStorageMaster";
import TagMaster from "../screens/master/TagMaster";
import AddTagMaster from "../screens/master/AddTagMaster";
import EditTagMaster from "../screens/master/EditTagMaster";
import WarehouseScreen from "../screens/master/WarehouseScreen";
import CompanyScreen from "../screens/master/CompanyScreen";
import VenderEnquiryAddUpdateScreen from "../screens/manage-order/VenderEnquiryAddUpdateScreen";
import EventVolunteerAddUpdateScreen from "../screens/manage-order/EventVolunteerAddUpdateScreen";
import OrderVolunteerListScreen from "../screens/manage-order/OrderVolunteerListScreen";
import EventEnquiryDetail from "../screens/manage-order/EventEnquiryDetail";
import PreviewScreen from "../screens/PreviewScreen";
import CallSmsRecordAddUpdateScreen from "../screens/manage-order/CallSmsRecordAddUpdateScreen";
import ManageBill from "../screens/manage-bill/ManageBill";
import EventBillDetail from "../screens/manage-bill/EventBillDetail";
import VolunteerAddUpdateScreen from "../screens/manage-order/VolunteerAddUpdateScreen";
import VehicleAddUpdateScreen from "../screens/manage-order/VehicleAddUpdateScreen";
import VehicleAddUpdateInfoScreen from "../screens/manage-order/VehicleAddUpdateInfoScreen";
import UserChangePasswordScreen from "../screens/user/UserChangePasswordScreen";
import PaymentScreen from "../screens/PaymentScreen";
import AddVehicleInfo from "../screens/vehicle/AddVehicleInfo";
import UpdateVehicleInfo from "../screens/vehicle/UpdateVehicleInfo";
import AddVehicleArrivalEntry from "../screens/vehicle/AddVehicleArrivalEntry";
import UpdateVehicleArrivalEntry from "../screens/vehicle/UpdateVehicleArrivalEntry";
import VehicleArrivalEntry from "../screens/vehicle/VehicleArrivalEntry";
import VehicleUpWordJourneyStartAdd from "../screens/vehicle/VehicleUpWordJourneyStartAdd";
import VehicleUpWordJourneyEndAdd from "../screens/vehicle/VehicleUpWordJourneyEndAdd";
import VehicleDownWordJourneyStartAdd from "../screens/vehicle/VehicleDownWordJourneyStartAdd";
import VehicleDownWordJourneyEndAdd from "../screens/vehicle/VehicleDownWordJourneyEndAdd";
import VehicleBilling from "../screens/vehicle/VehicleBilling";
import Tag from "../screens/Tag";
import VehiclePaymentInfoAdd from "../screens/vehicle/VehiclePaymentInfoAdd";
import OrderVendorVolunteersAdd from "../screens/order/OrderVendorVolunteersAdd";
import OrderVolunteerAdd from "../screens/manage-order/OrderVolunteerAdd";
import OrderVolunteerUpdate from "../screens/manage-order/OrderVolunteerUpdate";
import OrderInvoice from "../screens/manage-order/OrderInvoice";
import OrderSetupPhotos from "../screens/manage-order/OrderSetupPhotos";

const styles = StyleSheet.create({
    drawerItem: {
      marginLeft: -10,
      fontSize: 16,
    },
    activeLabel: {
      fontWeight: "bold",
    },
});

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const activeIconSize = 22;
const inactiveIconSize = 20;


const TabNavigation = () => (
    <Tab.Navigator
        initialRouteName="Home"
        screenOptions={({ route }) => ({
            headerShown: false,
            tabBarShowLabel: true,
            tabBarActiveTintColor: Colors.white,
            tabBarInactiveTintColor: Colors.lightGrey,
            tabBarStyle: { backgroundColor: Colors.primary },
            tabBarLabelStyle: { fontSize: 12, marginBottom: 5 },
            tabBarIcon: ({ focused, color }) => {
                let iconPkg;
                let iconName;
                let iconSize;

                if (route.name === "Home") {
                    iconName = focused ? "home" : "home-outline";
                    iconSize = focused ? activeIconSize : inactiveIconSize;
                } else if (route.name === "Catalog") {
                    iconName = focused ? "book" : "book-outline";
                    iconSize = focused ? activeIconSize : inactiveIconSize;
                } else if (route.name === "Orders") {
                    iconPkg = "MaterialCommunityIcons";
                    iconName = "calendar-clock";
                    iconSize = focused ? activeIconSize : inactiveIconSize;
                } else if (route.name === "Chat") {
                    iconName = focused ? "chatbox" : "chatbox-outline";
                    iconSize = focused ? activeIconSize : inactiveIconSize;
                } else if (route.name === "Profile") {
                    iconName = focused ? "person" : "person-outline";
                    iconSize = focused ? activeIconSize : inactiveIconSize;
                }

                if (iconPkg === "MaterialCommunityIcons") {
                    return (
                        <MaterialCommunityIcons
                            name={iconName}
                            size={iconSize}
                            color={color}
                        />
                    );
                } else {
                    return <Ionicons name={iconName} size={iconSize} color={color} />;
                }
            },
        })}
    >
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Catalog" component={Catalog} />
        <Tab.Screen
            name="Orders"
            component={Orders}
            options={{
                tabBarLabel: "Manage Orders",
            }}
        />
        <Tab.Screen
            name="Chat"
            component={Chat}
            options={{
                tabBarBadge: 1,
                tabBarBadgeStyle: { backgroundColor: Colors.lightGrey },
            }}
        />
        <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
);

const getDrawerLabel = (focused, color, label) => {
    return (
        <Text
            style={[
                { color },
                styles.drawerItem,
                focused ? styles.activeLabel : null,
            ]}
        >
            {label}
        </Text>
    );
};

const DrawerNav = () => (
    <Drawer.Navigator
        initialRouteName={"Home"}
        screenOptions={{
            headerShown: false,
            drawerActiveTintColor: Colors.primary,
            drawerInactiveTintColor: Colors.grey,
            drawerActiveBackgroundColor: Colors.white,
            drawerInactiveBackgroundColor: Colors.white,
            drawerItemStyle: { marginVertical: 5 },
        }}
        drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
        <Drawer.Screen
            name="DrawerHome"
            component={TabNavigation}
            options={{
                drawerLabel: ({ focused, color }) =>
                    getDrawerLabel(focused, color, "Home"),
                drawerIcon: ({ color }) => (
                    <FontAwesome name="home" size={20} color={color} />
                ),
            }}
        />
        <Drawer.Screen
            name="Catalog"
            component={Catalog}
            options={{
                drawerLabel: ({ focused, color }) =>
                    getDrawerLabel(focused, color, "Catalog"),
                drawerIcon: ({ color }) => (
                    <Ionicons name="book" size={20} color={color} />
                ),
            }}
        />
        <Drawer.Screen
            name="ManageEnquiry"
            component={ManageEnquiry}
            options={{
                drawerLabel: ({ focused, color }) =>
                    getDrawerLabel(focused, color, "Manage Enquiry"),
                drawerIcon: ({ color }) => (
                    <MaterialCommunityIcons
                        name="clipboard-list"
                        size={20}
                        color={color}
                    />
                ),
            }}
        />
        <Drawer.Screen
            name="Orders"
            component={Orders}
            options={{
                drawerLabel: ({ focused, color }) =>
                    getDrawerLabel(focused, color, "Manage Orders"),
                drawerIcon: ({ color }) => (
                    <MaterialCommunityIcons
                        name="calendar-clock"
                        size={20}
                        color={color}
                    />
                ),
            }}
        />
        <Drawer.Screen
            name="Billing"
            component={ManageBill}
            options={{
                drawerLabel: ({ focused, color }) =>
                    getDrawerLabel(focused, color, "Billing"),
                drawerIcon: ({ color }) => (
                    <Ionicons name="receipt" size={20} color={color} />
                ),
            }}
        />
        <Drawer.Screen
            name="PaymentScreen"
            component={PaymentScreen}
            options={{
                drawerLabel: ({ focused, color }) =>
                    getDrawerLabel(focused, color, "Payment"),
                drawerIcon: ({ color }) => (
                    <FontAwesome name="money" size={20} color={color} />
                ),
            }}
        />


        <Drawer.Screen
            name="MasterMenuScreen"
            component={MasterMenuScreen}
            options={{
                drawerLabel: ({ focused, color }) =>
                    getDrawerLabel(focused, color, "Masters"),
                drawerIcon: ({ color }) => (
                    <FontAwesome name="cog" size={20} color={color} />
                ),
            }}
        />
    </Drawer.Navigator>
);


export default function AdminNavigation() {
    return (
        <>
            <Stack.Screen name="Home" component={DrawerNav} />
            <Stack.Screen name="UserChangePassword" component={UserChangePasswordScreen} />
            <Stack.Screen name="SearchScreen" component={SearchScreen} />
            <Stack.Screen name="EventDetails" component={EventDetails} />
            <Stack.Screen name="AddCategory" component={AddCategory} />
            <Stack.Screen name="EditCategory" component={editCategory} />
            <Stack.Screen name="SubCategory" component={SubCategory} />
            <Stack.Screen name="CategoryTagAddScreen" component={CategoryTagAddScreen} />
            <Stack.Screen name="AddSubCategory" component={AddSubCategory} />
            <Stack.Screen name="EditSubCategory" component={EditSubCategory} />
            <Stack.Screen name="Games" component={Games} />
            <Stack.Screen name="GamesByTag" component={GamesByTag} />
            <Stack.Screen name="AddGame" component={AddGame} />
            <Stack.Screen name="EditGame" component={EditGame} />
            <Stack.Screen name="GameDetails" component={GameDetails} />
            <Stack.Screen name="PartsList" component={PartsList} />
            <Stack.Screen name="PartScreen" component={PartScreen} />
            <Stack.Screen name="VenderScreen" component={VenderScreen} />
            <Stack.Screen name="VenderAddUpdateScreen" component={VenderAddUpdateScreen} />
            <Stack.Screen name="MaterialScreen" component={MaterialScreen} />
            <Stack.Screen name="GameImageScreen" component={GameImageScreen} />
            <Stack.Screen name="GameTagScreen" component={GameTagScreen} />
            <Stack.Screen name="UomScreen" component={UomScreen} />
            <Stack.Screen name="TemplateScreen" component={TemplateScreen} />
            <Stack.Screen name="PriorityScreen" component={PriorityScreen} />
            <Stack.Screen name="VenderTypeScreen" component={VenderTypeScreen} />
            <Stack.Screen name="TagAreaMaster" component={TagMaster} />
            <Stack.Screen name="StorageAreaMaster" component={StorageAreaMaster} />
            <Stack.Screen name="AddStorageMaster" component={AddStorageMaster} />
            <Stack.Screen name="EditStorageMaster" component={EditStorageMaster} />
            <Stack.Screen name="AddTagMaster" component={AddTagMaster} />
            <Stack.Screen name="EditTagMaster" component={EditTagMaster} />
            <Stack.Screen name="VenderEnquiryAddUpdate" component={VenderEnquiryAddUpdateScreen} />
            <Stack.Screen name="VolunteerAddUpdate" component={VolunteerAddUpdateScreen} />
            <Stack.Screen name="VehicleAddUpdate" component={VehicleAddUpdateScreen} />
            <Stack.Screen name="VehicleAddUpdateInfoScreen" component={VehicleAddUpdateInfoScreen} />
            <Stack.Screen name="Preview" component={PreviewScreen} />
            <Stack.Screen name="WarehouseScreen" component={WarehouseScreen} />
            <Stack.Screen name="CompanyScreen" component={CompanyScreen} />
            <Stack.Screen name="AddVehicleInfo" component={AddVehicleInfo} />
            <Stack.Screen name="UpdateVehicleInfo" component={UpdateVehicleInfo} />
            <Stack.Screen name="AddVehicleArrivalEntry" component={AddVehicleArrivalEntry} />
            <Stack.Screen name="UpdateVehicleArrivalEntry" component={UpdateVehicleArrivalEntry} />
            <Stack.Screen name="VehicleArrivalEntry" component={VehicleArrivalEntry} />
            <Stack.Screen name="VehicleUpWordJourneyStartAdd" component={VehicleUpWordJourneyStartAdd} />
            <Stack.Screen name="VehicleUpWordJourneyEndAdd" component={VehicleUpWordJourneyEndAdd} />
            <Stack.Screen name="VehicleDownWordJourneyStartAdd" component={VehicleDownWordJourneyStartAdd} />
            <Stack.Screen name="VehicleDownWordJourneyEndAdd" component={VehicleDownWordJourneyEndAdd} />
            <Stack.Screen name="VehicleBilling" component={VehicleBilling} />
            <Stack.Screen name="VehiclePaymentInfoAdd" component={VehiclePaymentInfoAdd} />
            <Stack.Screen name="ProductListingDetails" component={ProductListingDetails} />
            <Stack.Screen name="ProductLaunchDetails" component={ProductLaunchDetails} />
            <Stack.Screen name="ManageOrder" component={ManageOrder} />
            <Stack.Screen name="EventVolunteerAddUpdate" component={EventVolunteerAddUpdateScreen} />
            <Stack.Screen name="OrderVolunteerListScreen" component={OrderVolunteerListScreen} />
            <Stack.Screen name="ManageBill" component={ManageBill} />
            <Stack.Screen name="EventEnquiryDetail" component={EventEnquiryDetail} />
            <Stack.Screen name="EventBillDetail" component={EventBillDetail} />
            <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
            <Stack.Screen name="CallSmsRecordAddUpdate" component={CallSmsRecordAddUpdateScreen} />
            <Stack.Screen name="Logout" component={Logout} />
            <Stack.Screen name="Tag" component={Tag} />
            <Stack.Screen name="OrderVendorVolunteersAdd" component={OrderVendorVolunteersAdd} />
            <Stack.Screen name="OrderVolunteerAdd" component={OrderVolunteerAdd} />
            <Stack.Screen name="OrderVolunteerUpdate" component={OrderVolunteerUpdate} />
            <Stack.Screen name="OrderInvoice" component={OrderInvoice} />
            <Stack.Screen name="OrderSetupPhotos" component={OrderSetupPhotos} />
        </>
    )
}