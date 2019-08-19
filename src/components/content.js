import React from "react";
import createHistory from "history/createBrowserHistory";
import {Router, Route, Link, Switch, NavLink, Redirect } from 'react-router-dom';

import StartPage from "./startpage"
import Home from "./home"
import Profile from "./profile"
import Auth from "./auth"
import Registration from "./registration"
import Header from "./header"
import Footer from "./footer"
import About from "./about"
import Logout from "./logout"

let Content = p =>
    <Router history = {createHistory()}>
        {/* <Switch> */}
          <Header />
          <Route path="/" component = { StartPage } exact />
          <Route path="/about/" component = { About } exact />
          <Route path="/profile/" component = { Profile } exact />
          <Route path="/auth/" component = { Auth } exact />
          <Route path="/home/" component = { Home } exact />
          <Route path="/logout/" component = { Logout } exact />
          <Route path="/registration/" component = { Registration } exact />
          <Footer />
        {/* </Switch> */}
    </Router>

export default Content;