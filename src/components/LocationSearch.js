import React from 'react';
import { store } from '../store/reducer';
import { connect } from 'react-redux';
import PlacesAutocomplete, { geocodeByAddress, getLatLng, } from 'react-places-autocomplete';
import '../style/home.css';

class LocationSearchInput extends React.Component {
	constructor(props) {
		super(props);
		this.state = { from: '', to: '', latLng: '' };
		console.log('heh');
	}

	handleChangeAdress = from => {
		this.setState({ from });
	};

	handleChange = to => {
		this.setState({ to });
	};

	async handleSelectFrom(address) {
		let results = await geocodeByAddress(address)
		let latLng = await getLatLng(results[0])
		const data = await {
			latLng,
		};
		const res = {
			type: 'COORDINATES',
			payload: data,
			name: 'latLngFrom',
		}
		store.dispatch(res);
	}
	async handleSelectTo(address) {
		let results = await geocodeByAddress(address)
		let latLng = await getLatLng(results[0])
		const data = await {
			latLng,
		};
		const res = {
			type: 'COORDINATES',
			payload: data,
			name: 'latLngTo',
		}
		store.dispatch(res);
	}


	render() {
		return (
			<div>
				<PlacesAutocomplete
					value={this.state.from}
					onChange={this.handleChangeAdress}
					onSelect={this.handleSelectFrom}
				>
					{({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
						<div>
							<label>From</label>
							<input
								{...getInputProps({
									placeholder: 'from',
									className: 'location-search-input',
								})}
							/>
							<div className="autocomplete-dropdown-container">
								{loading && <div>Loading...</div>}
								{suggestions.map(suggestion => {
									const className = suggestion.active
										? 'suggestion-item--active'
										: 'suggestion-item';
									// inline style for demonstration purpose
									const style = suggestion.active
										? { backgroundColor: '#fafafa', cursor: 'pointer' }
										: { backgroundColor: '#ffffff', cursor: 'pointer' };
									return (
										<div
											{...getSuggestionItemProps(suggestion, {
												className,
												style,
											})}
										>
											<span>{suggestion.description}</span>
										</div>
									);
								})}
							</div>
						</div>
					)}
				</PlacesAutocomplete>


				<PlacesAutocomplete
					value={this.state.to}
					onChange={this.handleChange}
					onSelect={this.handleSelectTo}
				>
					{({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
						<div>
							<label>To</label>
							<input
								{...getInputProps({
									placeholder: 'to',
									className: 'location-search-input',
								})}
							/>
							<div className="autocomplete-dropdown-container">
								{loading && <div>Loading...</div>}
								{suggestions.map(suggestion => {
									const className = suggestion.active
										? 'suggestion-item--active'
										: 'suggestion-item';
									// inline style for demonstration purpose
									const style = suggestion.active
										? { backgroundColor: '#fafafa', cursor: 'pointer' }
										: { backgroundColor: '#ffffff', cursor: 'pointer' };
									return (
										<div
											{...getSuggestionItemProps(suggestion, {
												className,
												style,
											})}
										>
											<span>{suggestion.description}</span>
										</div>
									);
								})}
							</div>
						</div>
					)}
				</PlacesAutocomplete>
			</div>

		);
	}
}


export default connect()(LocationSearchInput)