import React from "react";
import {Router, Route, Link, Switch, NavLink, Redirect } from 'react-router-dom';

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
							<li><Link to="/profile/">Profile</Link></li>
							<li><Link to="/about/">About</Link></li>
							<li><Link to="/registration/">Registrtion</Link></li>
							<li><Link to="/auth/">Auth</Link></li>
						</ul>
					</nav>
					<div className="line"></div>
				</div>
				<hr/>
			</div>
		)
	  }
}

export default Header;