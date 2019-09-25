import React from "react";
import * as jwt_decode from 'jwt-decode';
import { store } from '../store/reducer';
import promiseActionsMaker from '../store/action';

import { GraphQLClient } from 'graphql-request'
const gql = new GraphQLClient("/graphql", { headers: { "Authorization": "Bearer " + localStorage.getItem('authToken') } })

class DriverProfile extends React.Component {
	constructor(props) {
		super(props)
		this.state = { loader: false, email: "", password: "", name: "", surname: "", id: +props.match.params.id }
	}
	async componentDidMount() {
        let userInfo = await gql.request(`
				query getDriver($id:Int!){
					getDriver(id: $id){
					name, surname, email, password
					}
			  }`, { id: this.state.id }
		);
		console.log(await userInfo);
		await this.setState({ name: userInfo.getDriver[0].name });
		await this.setState({ surname: userInfo.getDriver[0].surname });
		await this.setState({ email: userInfo.getDriver[0].email });
		await this.setState({ password: userInfo.getDriver[0].password });
		await this.setState({ loader: true });
	}
	render() {
		return (
			<div>
				<div id="wrapper">
					<div id="articles">
						<div id="form-registration">
							<h3>Driver profile</h3>
							<label>name</label>
							<input type='text' value={this.state.name} readonly="readonly" onChange={evt => this.setState({ name: evt.target.value })} />
							<label>surname</label>
							<input type='text' value={this.state.surname} readonly="readonly" onChange={evt => this.setState({ surname: evt.target.value })} />
							<label>email</label>
							<input type='text' value={this.state.email} readonly="readonly" onChange={evt => this.setState({ email: evt.target.value })} />
							<label>password</label>
							<input type='password' value={this.state.password} readonly="readonly" onChange={evt => this.setState({ password: evt.target.value })} />
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default DriverProfile;