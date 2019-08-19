import React from 'react';
import '../style/home.css';
import Map from "./Map"
import LocationSearchInput from "./LocationSearch";

class Home extends React.Component {
constructor(props) {
	super(props);
}

render() {
	return (
	<div>
	<div className="search-input">
		<LocationSearchInput />
	</div>
	<div className="map-content">
		<Map/>
	</div>
	</div>
	
	);
}
}

export default Home; 