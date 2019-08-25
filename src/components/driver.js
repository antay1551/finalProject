import React from "react";
import { GraphQLClient } from 'graphql-request';
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';

const gql = new GraphQLClient("/graphql", { headers: { "Authorization": "Bearer " + localStorage.getItem('authToken') } })

class Driver extends React.Component {
	constructor(props) {
		super(props)
		this.state = { id: +props.match.params.id, loader: false, coordinateFrom: '', coordinateTo: '' }
	}
	async componentDidMount() {
		let coordinateTo = await gql.request(`
			  mutation changeTrip($id: Int!){
				changeTrip(id: $id){
				  lat_from, long_from
				}
			  }`, { id: this.state.id }
		);
		await this.setState({ coordinateTo: coordinateTo.changeTrip });
		let coordinateFrom = await gql.request(`query getUserCoordinate {
			getUserCoordinate{
			  lat, long
			  }
		  }
		  `)
		await this.setState({ coordinateFrom: coordinateFrom.getUserCoordinate[0] });
		await this.setState({ loader: true });
	}
	render() {
		return (
			<div>
				{this.state.loader ? <Map google={this.props.google} zoom={14}
					initialCenter={{
						lat: 49.9935,
						lng: 36.2304
					}}>
					{this.state.loader ? <Marker label="A" position={{ lat: this.state.coordinateFrom.lat, lng: this.state.coordinateFrom.long }} /> : <p>not yet</p>}
					{this.state.loader ? <Marker label="B" position={{ lat: this.state.coordinateTo.lat_from, lng: this.state.coordinateTo.long_from }} /> : console.log(99999999999999)}
				</Map> : console.log(111)}
			</div>
		)
	}
}

export default (GoogleApiWrapper({
	apiKey: ("AIzaSyBhZNdBlfHjvqdPZ4z5Uk3hGeyZYCaXzZY")
})(Driver))