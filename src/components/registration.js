import React from "react";
import { GraphQLClient } from 'graphql-request'
import '../style/input.css';
const gql = new GraphQLClient("/graphql", { headers: {} })

class Registration extends React.Component {
	constructor(props) {
		super(props)
		this.state = { loader: false, email: "", password: "", name: "", surname: "", phone: "" }
	}
	handleSubmit = e => {
		var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
		if(this.state.email.match(mailformat))
		{
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
				, { email: this.state.email, password: this.state.password, name: this.state.name, surname: this.state.surname, phone: this.state.phone })
			this.setState({ name: '' })
			this.setState({ surname: '' })
			this.setState({ phone: '' })
			this.setState({ email: '' })
			this.setState({ password: '' })
			this.setState({ password: '' })
		}
		else
		{
			alert("You have entered an invalid email address!");
		}

	}
	render() {
		return (
			<div>
				<div id="wrapper">
					<div id="articles">
						<div id="form-registration">
							<label>name</label>
							<input type='text' value={this.state.name} placeholder="Your name" onChange={evt => this.setState({ name: evt.target.value })} />
							<label>surname</label>
							<input type='text' value={this.state.surname} placeholder="Your surname" onChange={evt => this.setState({ surname: evt.target.value })} />
							<label>phone</label>
							<input type='email' value={this.state.phone} placeholder="Your phone" onChange={evt => this.setState({ phone: evt.target.value })} />
							<label>email</label>
							<input type='text' value={this.state.email} placeholder="adress@example.com" onChange={evt => this.setState({ email: evt.target.value })} />
							<label>password</label>
							<input type='password' value={this.state.password} placeholder="Create password" onChange={evt => this.setState({ password: evt.target.value })} />
							<button onClick={this.handleSubmit} id="send">Registration</button>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default Registration;