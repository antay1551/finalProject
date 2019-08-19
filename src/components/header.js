import React from "react";
import {Router, Route, Link, Switch, NavLink, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import * as jwtDecode from 'jwt-decode';
import '../style/startpage.css';

class Header extends React.Component {
	constructor (props){
		super(props)
		this.state = { status: true };
	}
	  handleChange = ({target}) =>{
		this.setState({ status: !this.state.status });
		console.log(this.state.status);
		
	  }
	  render(){
		return (
			<div className="wrapper">
				<div className="header">
					<strong className="logo">
						<Link to="/"><img className="logo" src="https://logobaker.ru/media/uploads/userapi/logos/6437/400_300_4906-slon.jpg"/></Link> 
					</strong>

				<div class="check">
					<input id="check" type="checkbox"  onClick={this.handleChange}/>
					<label for="check"></label>
				</div>

					<nav className="main-nav">
						<ul className="">
							<li><Link to="/">Home</Link></li>
							<li><Link to="/about/">About</Link></li>
							{localStorage.authToken ? <li><Link to="/profile/">{jwtDecode(localStorage.authToken).name} {jwtDecode(localStorage.authToken).surname}</Link></li> : <li><Link to="/registration/">Registrtion</Link></li>}
							{jwtDecode(localStorage.authToken).role === 'driver' ? <li><Link to="/orders/">Orders</Link></li> : <li><Link to="/myorders/">My orders</Link></li>}
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