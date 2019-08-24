import React from "react";
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
//import FormFind from "./FormFind"
import { connect } from 'react-redux';
import { store } from '../store/reducer';
//import { stat } from "fs";git init
import { GraphQLClient } from 'graphql-request'
import actionsMaker from '../store/actionCalculate';
import promiseActionsMaker from '../store/action';

const gql = new GraphQLClient("/graphql", { headers: { "Authorization": "Bearer " + localStorage.getItem('authToken') } })


class Home extends React.Component {
	constructor(props) {
		super(props)
		this.state = { latitude: 0, longitude: 0, distanceDuration: '', price: 0 }
		//this.calculete = this.calculete.bind(this);
	}
	componentDidMount() {
		/*this.watchId = navigator.geolocation.watchPosition(
			(position) => {
				this.setState({
					latitude: position.coords.latitude, longitude: position.coords.longitude
				});
			}
		);*/
	}
	price = (distance) => {
		distance = +distance.substring(0, distance.length - 2);
		var price = 30 + distance * 3.5;
		if (price < 50)
			price = 50;
		this.price = price; 
		//this.setState({ price });
		return price;
	}
	information = () => {
		return (
			<div>
				distance: {this.props.distance ? this.props.distance.text : <h3>esche rano</h3>}
				time: {this.props.duration ? this.props.duration.text : <h3>esche rano</h3>}
				price: {this.props.distance ? this.price(this.props.distance.text) : <h3>esche rano</h3>}
			</div>
		);
	}
	handleSubmit = e => {
		e.preventDefault();
		console.log('okkkkk');
		console.log(this.props.latLngFrom.lat);
		console.log(this.props.latLngFrom.lng);

		console.log(this.props.latLngTo.lng);
		console.log(this.props.latLngTo.lat);

		console.log(this.state.price);
		let addTrips = promiseActionsMaker('addTrips',
			gql.request(`
			  mutation addTrips($price: Float!, $latFrom:Float!, $longFrom:Float!, $latTo:Float!, $longTo:Float!){
				addTrips(price: $price, latFrom: $latFrom, longFrom: $longFrom, latTo: $latTo, longTo: $longTo){
				  id,
				}
			  }`, { price: this.price, latFrom: this.props.latLngFrom.lat, longFrom: this.props.latLngFrom.lng, latTo: this.props.latLngTo.lat, longTo: this.props.latLngTo.lng }
			)
		);
		store.dispatch(addTrips());
	}
	newButton = () => {
		return (
			<div>
				<button onClick={this.handleSubmit}>Find cars</button>
			</div>

		);
	}
	newButtonSend = () => {
		return (
			<div>
				<button onClick={() => this.props.onPost('distanceDuration', this.props.latLngFrom, this.props.latLngTo)}>Post...</button>
			</div>
		);
	}

	render() {
		return (
			<div>
				<div>
					{this.props.distance && this.props.duration ? this.information() : console.log('no yet')}
					{this.props.distance && this.props.duration ? this.newButton() : console.log('no yet')}
				</div>

				{this.props.latLngFrom ? this.newButtonSend() : <p>not yet</p>}
				<Map google={this.props.google} zoom={14}
					initialCenter={{
						lat: 49.9935,
						lng: 36.2304
					}}>
					{this.props.latLngFrom ? <Marker position={{ lat: this.props.latLngFrom.lat, lng: this.props.latLngFrom.lng }} /> : <p>not yet</p>}
					{this.props.latLngTo ? <Marker position={{ lat: this.props.latLngTo.lat, lng: this.props.latLngTo.lng }} /> : <p>not yet</p>}
					{/* <Marker  position={{ lat: this.state.latitude, lng: this.state.longitude }}/> */}
				</Map>
			</div>
		)
	}
}

const mapStateToProps = state => {
	return {
		info: state
	};
};
//export default connect(st => ({latLngFrom: st.latLngFrom && st.latLngTo && st.latLngFrom.payload.latLng, latLngTo: st.latLngTo && st.latLngFrom && st.latLngTo.payload.latLng, distance: st.DistanceDuration && st.DistanceDuration.payload.distance, duration: st.DistanceDuration && st.DistanceDuration.payload.duration}))(GoogleApiWrapper({

//export default connect(st => ({latLngFrom: st.latLngFrom && st.latLngTo && st.latLngFrom.payload.latLng, latLngTo: st.latLngTo && st.latLngFrom && st.latLngTo.payload.latLng }))(Home);

export default connect(st => ({ latLngFrom: st.latLngFrom && st.latLngTo && st.latLngFrom.payload.latLng, latLngTo: st.latLngTo && st.latLngFrom && st.latLngTo.payload.latLng, distance: st.distanceDuration && st.distanceDuration.status === 'RESOLVED' && st.distanceDuration.payload.distance, duration: st.distanceDuration && st.distanceDuration.status === 'RESOLVED' && st.distanceDuration.payload.duration }), { onPost: actionsMaker })(GoogleApiWrapper({
	apiKey: ("AIzaSyBhZNdBlfHjvqdPZ4z5Uk3hGeyZYCaXzZY")
})(Home))