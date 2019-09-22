import React from "react";
import { Router, Route, Link, Switch, NavLink, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import * as jwtDecode from 'jwt-decode';
import { GraphQLClient } from 'graphql-request';
import '../style/input.css';
import '../style/startpage.css';

class Header extends React.Component {
	constructor(props) {
		super(props)
		this.state = { status: false, role: '', flag: true };
	}
	handleChange = ({ target }) => {
		this.setState({ status: !this.state.status });
		var role = '';
		if (this.state.status) {
			role = 'passenger';
		} else {
			role = 'driver';
		}
		let gql = new GraphQLClient("/graphql", { headers: { "Authorization": "Bearer " + localStorage.getItem('authToken') } })
		gql.request(`
		mutation updateRole($role:String!){
			updateRole(role: $role){
				role
			}
		}`, { role })
		localStorage.setItem('role', role);
	}
	orders() {
		if (localStorage.role) {
			if (localStorage.role === 'driver')
				return (
					<span className="right">
						<span className="contact">
							<a href="/orders/">Orders</a>
						</span>
					</span>);
			else
				return (
					<span className="right">
						<span className="contact">
							<a href="/myorders/">My orders</a>
						</span>
					</span>);
		}
	}

	loadRole() {
		if ((this.state.flag) || (this.state.role !== localStorage.role)) {
			var role = localStorage.role;
			if (role === 'driver') {
				this.setState({ status: true });
				this.setState({ role });
			} else {
				this.setState({ status: false });
				this.setState({ role });
			}
			this.setState({ flag: false });
		}
		return (
			<div class="check">
				<input id="check" type="checkbox" checked={this.state.status} onClick={this.handleChange} />
				<label for="check"></label>
			</div>
		);
	}
	render() {
		return (
			<div className="wrapper">
				<header>
					<Link to="/"><img className="logo" src="https://images-na.ssl-images-amazon.com/images/I/41lQlHQdj5L._SX450_.jpg" /></Link>
					{localStorage.role ? this.loadRole() : console.log()}
					{this.orders()}
					<span className="right">
						<span className="contact">
							<a href="/" title="Home">Home</a>
						</span>
						<span className="contact">
							<a href="/about/" title="About">About</a>
						</span>
						<span className="contact">
							{localStorage.authToken ? <a href="/profile/">{jwtDecode(localStorage.authToken).name} {jwtDecode(localStorage.authToken).surname}</a> : <a href="/registration/">Registrtion</a>}
						</span>
						<span className="contact">
							{localStorage.authToken ? <a href="/logout/">Log out</a> : <a href="/auth/" title="Auth">Auth</a>}
						</span>
					</span>
				</header>
			</div>

		)
	}
}

export default connect(st => ({ token: st.token, name: st.sub && st.sub.name, surname: st.sub && st.sub.surname }))(Header);