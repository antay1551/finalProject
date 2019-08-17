import React from "react";

class FormFind extends React.Component {
	constructor (props){
        super(props)
        this.state = {loader: false, from:"", to:""}
      }
      handleSubmit = e => {
		e.preventDefault();
		console.log(this.state.from);
        console.log(this.state.to);	
        console.log(78787);
      }
	  render(){
		return (
			<div>
				
			  <hr/>
			  <h3>form to find</h3>
				  	<label>from</label>
					<input type='text' value={this.state.from} onChange={evt => this.setState({from: evt.target.value})}/>
					<label>to</label>
					<input type='text' value={this.state.to} onChange={evt => this.setState({to: evt.target.value})}/>
			  	<button onClick={this.handleSubmit}>Post...</button>
			  <hr/>
			</div>
		)
	  }
}

export default FormFind;