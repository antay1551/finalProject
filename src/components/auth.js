import React from "react";
import { GraphQLClient } from 'graphql-request'
import { Redirect } from 'react-router-dom'
import { store } from "../store/reducer";
import '../style/input.css';

const gql = new GraphQLClient("/graphql", { headers: {} })

class Auth extends React.Component {
	handleSubmit = this.handleSubmit.bind(this);
	constructor(props) {
		super(props)
		this.state = { loader: false, email: "", password: "", token: "" }
	}
	async handleSubmit(e) {
		var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
		if (this.state.email.match(mailformat)) {
			e.preventDefault();
			await fetch('/users/authenticate', {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email: this.state.email, password: this.state.password })
			}).then(res => (console.log(res, res.headers), res.json()))
				.then(json => this.setState({ token: json.token }))
			var token = this.state.token;
			if (await this.state.token !== "") {
				function actionLogIn(token) {
					console.log(1111111);
					return { type: 'LOGIN', token };
				}
				store.dispatch(actionLogIn(this.state.token));
			}
			//fetch = (url, params={headers:{}}) => { 
			//    params.headers.Authorization = "Bearer " + localStorage.getItem('authToken')
			//    return originalFetch(url, params)
			//}
			this.setState({ loader: true });
		}
		else {
			alert("You have entered an invalid email address!");
		}
	}
	renderRedirect = () => {
		if (localStorage.role === 'driver') {
			return <Redirect to='/orders/' />
		} else if (this.state.loader) {
			return <Redirect to='/home' />
		}
	}
	render() {
		if (localStorage.role === 'driver') {
			return <Redirect to='/orders/' />
		} else if (localStorage.getItem('authToken'))
			return <Redirect to='/home' />
		return (
			<div>
				{this.renderRedirect()}
				<div id="wrapper">
					<div id="articles">
						<div id="form-registration">
							<label>email</label>
							<input type='email' placeholder="adress@example.com" value={this.state.email} onChange={evt => this.setState({ email: evt.target.value })} />
							<label>password</label>
							<input type='password' placeholder="Type your password" value={this.state.password} onChange={evt => this.setState({ password: evt.target.value })} />
							<button onClick={this.handleSubmit} id="send">Login</button>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default Auth;