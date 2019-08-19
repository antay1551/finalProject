import React from "react";
import { GraphQLClient } from 'graphql-request'
const gql = new GraphQLClient("/graphql", { headers: {} })

class Registration extends React.Component {
	constructor (props){
		super(props)
		this.state = {loader: false, email:"", password:"", name:"", surname:"", phone:""}
	  }
	handleSubmit = e => {
		e.preventDefault();
		console.log(this.state.email);
		console.log(this.state.password);
		console.log(this.state.name);
     	 gql.request(`
		 	mutation createUser($email:String!,$password: String!, $name: String!, $surname: String!, $phone: String!){
		 		createUser(email: $email,password: $password, name: $name, surname: $surname, phone: $phone){
		 			name, email
		 		}
		 	}`
		 , {email: this.state.email, password:  this.state.password, name: this.state.name, surname: this.state.surname, phone: this.state.phone})
		 this.setState({name: ''})
		 this.setState({surname: ''})
		 this.setState({phone: ''})
		 this.setState({email: ''})
		 this.setState({password: ''})
		 this.setState({password: ''})
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
					<label>phone</label>
					<input type='text' value={this.state.phone} onChange={evt => this.setState({phone: evt.target.value})}/>
				  	<label>email</label>
					<input type='text' value={this.state.email} onChange={evt => this.setState({email: evt.target.value})}/>
					<label>password</label>
					<input type='password' value={this.state.password} onChange={evt => this.setState({password: evt.target.value})}/>
			  	<button onClick={this.handleSubmit}>Post...</button>
			  <hr/>
			</div>
		)
	  }
}

export default Registration;