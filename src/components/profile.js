import React from "react";
import * as jwt_decode from 'jwt-decode';
import { store } from '../store/reducer';
import promiseActionsMaker from '../store/action';

import { GraphQLClient } from 'graphql-request'
const gql = new GraphQLClient("/graphql", { headers: { "Authorization": "Bearer " + localStorage.getItem('authToken') } })

class Profile extends React.Component {
	constructor(props) {
		super(props)
		var decoded = jwt_decode(localStorage.getItem('authToken'));
		this.state = { loader: false, email: "", password: "", name: "", surname: "", id: decoded.sub }
		console.log(11111);
		console.log(localStorage.getItem('authToken'));
	}
	async componentDidMount() {
		let userInfo = await gql.request(`
				query getUser{
					getUser{
					name, surname, email, password
					}
			  }`
		);
		console.log(await userInfo);
		await this.setState({ name: userInfo.getUser[0].name });
		await this.setState({ surname: userInfo.getUser[0].surname });
		await this.setState({ email: userInfo.getUser[0].email });
		await this.setState({ password: userInfo.getUser[0].password });
		await this.setState({ loader: true });
	}
	handleSubmit = e => {
		e.preventDefault();
		console.log(this.state.name);
		console.log(this.state.password);
		console.log(this.state.surname);
		let res = promiseActionsMaker('changeProgfile',
			gql.request(`
		  mutation changeProgfile($id:Int!, $name:String!, $surname:String!, $password:String!, $email:String!){
			changeProgfile(id: $id, name: $name, surname: $surname, password: $password, email: $email){
			  id,
			}
		  }`, { id: this.state.id, name: this.state.name, surname: this.state.surname, password: this.state.password, email: this.state.email }
			)
		);
		store.dispatch(res());
	}
	render() {
		return (
			<div>
				<div id="wrapper">
					<div id="articles">
						<div id="form-registration">
							<h3>Your profile</h3>
							<label>name</label>
							<input type='text' value={this.state.name} onChange={evt => this.setState({ name: evt.target.value })} />
							<label>surname</label>
							<input type='text' value={this.state.surname} onChange={evt => this.setState({ surname: evt.target.value })} />
							<label>email</label>
							<input type='text' value={this.state.email} onChange={evt => this.setState({ email: evt.target.value })} />
							<label>password</label>
							<input type='password' value={this.state.password} onChange={evt => this.setState({ password: evt.target.value })} />
							<button onClick={this.handleSubmit} id="send">Update</button>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default Profile;