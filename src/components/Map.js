import React from "react";
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
//import FormFind from "./FormFind"
import { connect } from 'react-redux';
import { store } from '../store/reducer';
//import { stat } from "fs";git init
import { GraphQLClient } from 'graphql-request'
import actionsMaker from '../store/actionCalculate';
import promiseActionsMaker from '../store/action';
import { tsThisType } from "@babel/types";
import '../style/input.css';

const gql = new GraphQLClient("/graphql", { headers: { "Authorization": "Bearer " + localStorage.getItem('authToken') } })


class Home extends React.Component {
	constructor(props) {
		super(props)
		//this.state = { latitude: 0, longitude: 0, distanceDuration: '', price: 0 }
		this.state = { latitude: 0, longitude: 0, distanceDuration: '', price: 0, id_driver: '', infoTrip: '', lastTrip: '', getDriver: true }
		this.toUpdate = true;
		//this.calculete = this.calculete.bind(this);
	}
	componentDidMount() {
		let timerId = setInterval(async () => {
			let infoTrip = await gql.request(`query getInfoTrip {
			getInfoTrip{
			  	id_driver
			  }
			}
		  `); await console.log(infoTrip);
			this.infoTrip = infoTrip.getInfoTrip.length;
			this.id_driver = infoTrip.getInfoTrip[infoTrip.getInfoTrip.length - 1].id_driver;

			if (await this.toUpdate) {
				this.toUpdate = !this.toUpdate;
				this.countTrip = infoTrip.getInfoTrip.length;
			}
			await console.log('ressss');

			await console.log(this.countTrip);
			await console.log(this.infoTrip);

			if (await (this.id_driver !== null) && (this.countTrip != this.infoTrip)) {
				let coordinateDriver = await gql.request(`mutation getDriverCoordinate($idDriver:Int!){
						getDriverCoordinate(idDriver: $idDriver){
							lat, long
						}
					}`
					, { idDriver: +this.id_driver });
				let coordinateTrip = await gql.request(`query getTripsCoordinate($idDriver:Int!){
					getTripsCoordinate(idDriver: $idDriver){
						lat_from, long_from, lat_to, long_to, status 
					}
				}`
					, { idDriver: +this.id_driver });
				await console.log('ressssss', coordinateTrip);
				await console.log('status', coordinateTrip.getTripsCoordinate[coordinateTrip.getTripsCoordinate.length - 1].status);
				//await console.log(coordinateTrip);
				this.latFrom = await coordinateTrip.getTripsCoordinate[coordinateTrip.getTripsCoordinate.length - 1].lat_from;
				this.latTo = await coordinateTrip.getTripsCoordinate[coordinateTrip.getTripsCoordinate.length - 1].lat_to;
				this.longFrom = await coordinateTrip.getTripsCoordinate[coordinateTrip.getTripsCoordinate.length - 1].long_from;
				this.longTo = await coordinateTrip.getTripsCoordinate[coordinateTrip.getTripsCoordinate.length - 1].long_to;

				this.latDriver = coordinateDriver.getDriverCoordinate.lat;
				this.lngDriver = coordinateDriver.getDriverCoordinate.long;
				if (await coordinateTrip.getTripsCoordinate[coordinateTrip.getTripsCoordinate.length - 1].status == 'wait') {
					this.setState({ driverWait: true });
				}

				await this.setState({ getDriver: false });
				await this.setState({ id_driver: this.id_driver });
			}

		}, 7000);

	}
	price = (distance) => {
		console.log(distance);
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
			  mutation addTrips($price: Float!, $latFrom:Float!, $longFrom:Float!, $latTo:Float!, $longTo:Float!, $from:String!, $to:String!){
				addTrips(price: $price, latFrom: $latFrom, longFrom: $longFrom, latTo: $latTo, longTo: $longTo, from: $from, to: $to){
				  id,
				}
			  }`, { price: this.price, latFrom: this.props.latLngFrom.lat, longFrom: this.props.latLngFrom.lng, latTo: this.props.latLngTo.lat, longTo: this.props.latLngTo.lng, from: this.props.fromAdress, to: this.props.toAdress }
			)
		);
		store.dispatch(addTrips());
	}
	newButton = () => {
		return (
			<div>
				<button onClick={this.handleSubmit} id="send" >Find cars</button>
			</div>

		);
	}
	newButtonSend = () => {
		return (
			<div className="search-input">
				<button onClick={() => this.props.onPost('distanceDuration', this.props.latLngFrom, this.props.latLngTo)} id="search-input-button" >Send</button>
			</div>
		);
	}

	render() {
		return (
			<div>
				<div>
					{this.props.distance && this.props.duration && this.state.getDriver ? this.information() : console.log('')}
					{this.props.distance && this.props.duration && this.state.getDriver ? this.newButton() : console.log('')}
				</div>
				{this.state.getDriver ? <p></p> : <p>driver take Your trip</p>}
				{this.state.driverWait ? <p>driver wait you</p> : <p></p>}
				{this.props.latLngFrom && this.props.latLngFrom ? this.newButtonSend() : <p></p>}
				<div id="map">
					<Map google={this.props.google} zoom={14}
						initialCenter={{
							lat: 49.9935,
							lng: 36.2304
						}}>
						{this.state.getDriver ? <p>no driver</p> : <Marker label="Driver" position={{ lat: this.latDriver, lng: this.lngDriver }} />}
						{this.state.getDriver ? <p>no driver</p> : <Marker label="A" position={{ lat: this.latFrom, lng: this.longFrom }} />}
						{this.state.getDriver ? <p>no driver</p> : <Marker label="B" position={{ lat: this.latTo, lng: this.longTo }} />}

						{this.props.latLngFrom && this.state.getDriver ? <Marker position={{ lat: this.props.latLngFrom.lat, lng: this.props.latLngFrom.lng }} /> : <p></p>}
						{this.props.latLngTo && this.state.getDriver ? <Marker position={{ lat: this.props.latLngTo.lat, lng: this.props.latLngTo.lng }} /> : <p></p>}
						{this.props.fromAdress && this.state.getDriver ? console.log('propppps', this.props.fromAdress) : console.log('fromAdress noo')}
						{/* <Marker  position={{ lat: this.state.latitude, lng: this.state.longitude }}/> */}
					</Map>
				</div>
			</div>
		)
	}
}

const mapStateToProps = state => {
	return {
		info: state
	};
};

export default connect(st => ({ latLngFrom: st.latLngFrom && st.latLngTo && st.latLngFrom.payload.latLng, latLngTo: st.latLngTo && st.latLngFrom && st.latLngTo.payload.latLng, distance: st.distanceDuration && st.distanceDuration.status === 'RESOLVED' && st.distanceDuration.payload.distance, duration: st.distanceDuration && st.distanceDuration.status === 'RESOLVED' && st.distanceDuration.payload.duration, fromAdress: st.distanceDuration && st.distanceDuration.status === 'RESOLVED' && st.distanceDuration.payload.fromAdress[0], toAdress: st.distanceDuration && st.distanceDuration.status === 'RESOLVED' && st.distanceDuration.payload.toAdress[0] }), { onPost: actionsMaker })(GoogleApiWrapper({
	apiKey: ("AIzaSyBhZNdBlfHjvqdPZ4z5Uk3hGeyZYCaXzZY")
})(Home))