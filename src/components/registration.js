import React from "react";
//import { GraphQLClient } from 'graphql-request'

//const gql = new GraphQLClient("/graphql", { headers: {} })


class Registration extends React.Component {
	constructor (props){
		super(props)
		this.state = {loader: false, login:"", password:"", name:"", surname:""}
	  }
	handleSubmit = e => {
		e.preventDefault();
		console.log(this.state.login);
		console.log(this.state.password);
		console.log(this.state.username);
		// createUser(login: String!, password: String!, username: String!): User
		//console.log(this.props);
		// return this.props.promiseActionsMaker('newuser', 
		// gql.request(`
		// 	mutation createUser($login:String!,$password: String!, $username: String!){
		// 		createUser(login: $login,password: $password, username: $username){
		// 			username, login
		// 		}
		// 	}`
		// , {login: this.state.login, password:  this.state.password, username: this.state.username})
		// );
	}
	  render(){
		return (
			<div>
			  <hr/>
			  <h3>form to Registration</h3>
			  		<label>name</label>
					<input type='text' value={this.state.name} onChange={evt => this.setState({name: evt.target.value})}/>
					<label>surname</label>
					<input type='text' value={this.state.surname} onChange={evt => this.setState({surname: evt.target.value})}/>
				  	<label>login</label>
					<input type='text' value={this.state.login} onChange={evt => this.setState({login: evt.target.value})}/>
					<label>password</label>
					<input type='password' value={this.state.password} onChange={evt => this.setState({password: evt.target.value})}/>
			  	<button onClick={this.handleSubmit}>Post...</button>
			  <hr/>
			</div>
		)
	  }
}

export default Registration;