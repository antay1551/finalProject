import React from "react";
import {Router, Route, Link, Switch, NavLink, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import * as jwtDecode from 'jwt-decode';
import { GraphQLClient } from 'graphql-request';
import '../style/startpage.css';
const gql = new GraphQLClient("/graphql", { headers: {"Authorization": "Bearer " + localStorage.getItem('authToken')} })

class Header extends React.Component {
	constructor (props){
		super(props)
		this.state = { status: false, role: '', flag: true };
	}
	handleChange = ({target}) =>{
		this.setState({ status: !this.state.status });
		console.log(this.state.status);
		var role='';
		console.log('for role: ',this.state.status);
		if(this.state.status){
			role = 'passenger';
			console.log(this.state.status);
		} else {
			role = 'driver';
		}
		gql.request(`
		mutation updateRole($role:String!){
			updateRole(role: $role){
				id, role
			}
		}`, { role })
		//this.setState({ flag: true });
	}
	orders(){
		if(localStorage.authToken){
			var role = jwtDecode(localStorage.authToken).role;
			if(role === 'driver')
				return(<li><Link to="/orders/">Orders</Link></li>);
			else
				return(<li><Link to="/myorders/">My orders</Link></li>);
		}
	}

	loadRole(){
		if(localStorage.authToken){
			if((this.state.flag) || (this.state.role !== jwtDecode(localStorage.authToken).role)){
				var role = jwtDecode(localStorage.authToken).role;
				console.log(role);
				if(role === 'driver') {
					this.setState({ status: true });
					this.setState({ role });
					console.log(this.state.status);
				} else {
					this.setState({ status: false });
					console.log(this.state.status);
					this.setState({ role });
					console.log('----------------------');
				}
				this.setState({ flag: false });
			}
		}
		//if(this.state.loadRole)
			//console.log(this.state.loadRole);
			console.log('status::::::::::::::');
			console.log(this.state.status);
			return(
				<div class="check">
					<input id="check" type="checkbox" checked={this.state.status} onClick={this.handleChange}/>
					<label for="check"></label>
				</div>
			);
	}
	render(){
	return (
		<div className="wrapper">
			<div className="header">
				<strong className="logo">
					<Link to="/"><img className="logo" src="https://logobaker.ru/media/uploads/userapi/logos/6437/400_300_4906-slon.jpg"/></Link> 
				</strong>

			{localStorage.authToken ? this.loadRole() : console.log()}
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
			<hr/>
		</div>
	)
	}
}
//export default connect()(Header);
export default connect(st => ({token: st.token, name: st.sub && st.sub.name, surname: st.sub && st.sub.surname}))(Header);