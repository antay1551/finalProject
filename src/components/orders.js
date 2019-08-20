import React from "react";
import promiseActionsMaker from '../store/action';
import {store} from '../store/reducer';
import { GraphQLClient } from 'graphql-request';
const gql = new GraphQLClient("/graphql", { headers: {"Authorization": "Bearer " + localStorage.getItem('authToken')} })

class Orders extends React.Component {
	constructor (props){
		super(props)
      }
      async componentDidMount() {
        //let availableTrip = await promiseActionsMaker('getAvailableTrip',
        let availableTrip = await gql.request(`query getAvailableTrip {
              getAvailableTrip{
                id
                }
            }
            `) 
        //  );
        console.log('here');
       /// await store.dispatch(availableTrip());

      console.log(await availableTrip);
      }
	  render(){
		return (
			<div>
                <h1>free Order </h1>
			</div>
		)
	  }
}

export default Orders;