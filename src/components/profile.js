import React from "react";
import * as jwt_decode from 'jwt-decode';
import {store} from '../store/reducer';
import promiseActionsMaker from '../store/action';

import { GraphQLClient } from 'graphql-request'
const gql = new GraphQLClient("/graphql", { headers: {"Authorization": "Bearer " + localStorage.getItem('authToken')} })

class Profile extends React.Component {
	constructor (props){
		super(props)
		var decoded = jwt_decode(localStorage.getItem('authToken'));
		this.state = {loader: false, email:"", password:"", role: 'driver', name:"", surname:"", id: decoded.sub}
		console.log(11111);
		console.log(localStorage.getItem('authToken'));
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
		  }`, {id: this.state.id, name: this.state.name, surname: this.state.surname, password: this.state.password, email: this.state.email}
		  )
		);
		store.dispatch(res());
		
		}
	  async componentDidMount(){
		//await store.dispatch(res());
		//var allInformation = store.getState() 
		//if(await allInformation.getcomment.status==="RESOLVED"){
		//  this.setState({loader:true});
		//}
	  }
	  render(){
		return (
			<div>
			  <hr/>
			  <h3>form to change profile</h3>
			  		<label>name</label>
						<input type='text' value={this.state.name} onChange={evt => this.setState({name: evt.target.value})}/>
					<label>surname</label>
						<input type='text' value={this.state.surname} onChange={evt => this.setState({surname: evt.target.value})}/>
				  	<label>email</label>
						<input type='text' value={this.state.email} onChange={evt => this.setState({email: evt.target.value})}/>
					<label>password</label>
						<input type='password' value={this.state.password} onChange={evt => this.setState({password: evt.target.value})}/>
					<select value={this.state.role} onChange={evt => this.setState({role: evt.target.value})}>
						<option value="driver">driver</option>
						<option value="passenger">passenger</option>
					</select>
			  	<button onClick={this.handleSubmit}>Post...</button>
			  <hr/>
			</div>
		)
	  }
}

export default Profile;