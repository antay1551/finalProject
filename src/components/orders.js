import React from "react";

class Orders extends React.Component {
	constructor (props){
		super(props)
      }
      async componentDidMount() {
        // let graphqlPosostThunk = promiseActionsMaker('posts',
        //     gql.request(`query posts {
        //     getPosts{
        //         id, title, text
        //         }
        //     }
        //     `) 
        // );

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