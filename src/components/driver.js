import React from "react";

class Driver extends React.Component {
	constructor (props){
        super(props)
        this.state = {id: +props.match.params.id}
	  }
	  render(){
		return (
			<div>
                <p>res: {this.state.id}</p>
                <h1>Driver page </h1>
			</div>
		)
	  }
}

export default Driver;