import React from "react";
import { Router, Route, Link, Switch, NavLink, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import * as jwtDecode from 'jwt-decode';
import { GraphQLClient } from 'graphql-request';
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
				return (<li><Link to="/orders/">Orders</Link></li>);
			else
				return (<li><Link to="/myorders/">My orders</Link></li>);
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
				<div className="header">
					<strong className="logo">
						<Link to="/"><img className="logo" src="https://logobaker.ru/media/uploads/userapi/logos/6437/400_300_4906-slon.jpg" /></Link>
					</strong>

					{localStorage.role ? this.loadRole() : console.log()}
					<nav className="main-nav">
						<ul className="">
							<li><Link to="/">Home</Link></li>
							<li><Link to="/about/">About</Link></li>
							{localStorage.authToken ? <li><Link to="/profile/">{jwtDecode(localStorage.authToken).name} {jwtDecode(localStorage.authToken).surname}</Link></li> : <li><Link to="/registration/">Registrtion</Link></li>}
							{this.orders()}
							{localStorage.authToken ? <li><Link to="/logout/">Log out</Link></li> : <li><Link to="/auth/">Auth</Link></li>}
						</ul>
					</nav>
					<div className="line"></div>
				</div>
				<hr />
			</div>
		)
	}
}

export default connect(st => ({ token: st.token, name: st.sub && st.sub.name, surname: st.sub && st.sub.surname }))(Header);