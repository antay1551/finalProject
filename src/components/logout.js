import React from "react";
import { GraphQLClient } from 'graphql-request'
import  { Redirect } from 'react-router-dom'
import { store } from "../store/reducer";

const gql = new GraphQLClient("/graphql", { headers: {} })

class Logout extends React.Component {
	constructor (props){
		super(props)
		this.state = {loader: false}
	  }
	async componentDidMount() {
		if(await localStorage.authToken){
			function actionLogOut() {
				console.log('logout ok');
				return {type: 'LOGOUT'};
			}
			store.dispatch(actionLogOut());
		}
		await this.setState({loader:true});
	}
	renderRedirect = () => {
		if (this.state.loader) {
		  return <Redirect to='/'/>
		}
	  }
	  render(){
		return (
			<div>
                {this.state.loader? <Redirect to='/'/> : console.log(1111)}
            </div>
		)
	  }
}

export default Logout;