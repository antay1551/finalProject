import React from "react";
import * as jwtDecode from 'jwt-decode';
import { GraphQLClient } from 'graphql-request'
const gql = new GraphQLClient("/graphql", { headers: {"Authorization": "Bearer " + localStorage.getItem('authToken')} })

class WatchPosition extends React.Component {

    constructor (props){
        super(props)
        console.log('------');
		this.state = {loader: false, email: "", password: "", token: ""}
	  }
        
    async componentDidMount() {
        if(jwtDecode(localStorage.authToken).role === 'driver'){
            const geo = navigator.geolocation;
            const onChange = (posoition) => {
                //setPosition({latitude, longitude});
                console.log('-------11111111111111111111111');
                console.log(posoition.coords.latitude, posoition.coords.longitude);
                gql.request(`
                mutation updateLocation($latitude: Float!,$longitude: Float!){
                    updateLocation(latitude: $latitude, longitude: $longitude){
                        lat, long
                    }
                }`
                , {latitude: posoition.coords.latitude, longitude: posoition.coords.longitude})
            };
            
            const onError = (error) => {
            console.log(error.message)
            };

            if (!geo) {
            console.log('Геолокация не поддерживается браузером')
            return;
            }

            geo.watchPosition(onChange, onError);
        }
    }

	  render(){
		return (
			<div>
                okkkkkkkk
			</div>
		)
	  }
}

export default WatchPosition;