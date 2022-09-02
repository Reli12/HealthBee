import React, { Component } from "react";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

import Home from "./Home";
import Dashboard from "./Dashboard";
import MapScreen from "./MapScreen";
const NavigationStack = createStackNavigator({
  HealthBee: {
    screen: Home,
  },
  Dashboard: {
    screen: Dashboard,
  },
  Directions: {
    screen: MapScreen,
  },
});

const Container = createAppContainer(NavigationStack);

export default Container;
