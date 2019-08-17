import React from "react";
import { GraphQLClient } from 'graphql-request'
import  { Redirect } from 'react-router-dom'
		
const gql = new GraphQLClient("/graphql", { headers: {} })


class Auth extends React.Component {
	constructor (props){
		super(props)
		this.state = {loader: false, email:"", password:""}
	  }
	handleSubmit = e => {
		e.preventDefault();
		console.log(this.state.email);
		console.log(55555555);
		console.log(this.state.password);
        fetch('/users/authenticate', {
            method: 'POST',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({email: this.state.email, password: this.state.password}) 
        }).then(res => (console.log(res, res.headers), res.json()))
			.then(json => localStorage.setItem('authToken', json.token))
        const originalFetch = fetch;
        fetch = (url, params={headers:{}}) => { 
            params.headers.Authorization = "Bearer " + localStorage.getItem('authToken')
            return originalFetch(url, params)
		}
		console.log(localStorage.getItem('authToken'), '===eeeeeeeeeeeeeeeeeeeeeeee');
		this.setState({loader:true});
	}
	renderRedirect = () => {
		if (this.state.loader) {
		  return <Redirect to='/home'/>
		}
	  }
	  render(){
		if (localStorage.getItem('authToken'))
			return <Redirect to='/home'  />
		return (
			<div>
			{this.renderRedirect()}
			  <hr/>
			  <h3>form to auth</h3>
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

export default Auth;