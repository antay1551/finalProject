import React from 'react';
import '../style/home.css';
import '../style/input.css';
import Map from "./Map"
import LocationSearchInput from "./LocationSearch";
import WatchPosition from "./watchPosition";

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
		<Map />
	<div>
		<WatchPosition />
	</div>
	</div>
	
	);
}
}

export default Home; 