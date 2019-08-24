import React from "react";
import promiseActionsMaker from '../store/action';
import { store } from '../store/reducer';
import { GraphQLClient } from 'graphql-request';
import { connect } from 'react-redux';
import ReactDataGrid from "react-data-grid";
import { Router, Route, Link, Switch, NavLink, Redirect } from 'react-router-dom';

const gql = new GraphQLClient("/graphql", { headers: { "Authorization": "Bearer " + localStorage.getItem('authToken') } })

const columns = [
  { key: "from", name: "From", editable: true },
  { key: "to", name: "To", editable: true },
  { key: "price", name: "Price", editable: true },
  { key: "status", name: "Status", editable: true },
  { key: "take", name: "Take", editable: true },
];

class Orders extends React.Component {
  constructor(props) {
    super(props)
    this.state = { loader: false, availableTrip: '', rows: '' };
  }
  async componentDidMount() {
    let availableTrip = await gql.request(`query getAvailableTrip {
              getAvailableTrip{
                id, price, lat_from, lat_to, long_to, long_from
                }
            }
            `)
    await this.setState({ availableTrip: availableTrip.getAvailableTrip });
    var row = [];
    for(let i=0; i<availableTrip.getAvailableTrip.length;i++){
      //<Link to={/corpus/${corpusId}/tag}>
      let id = availableTrip.getAvailableTrip[i].id;
      row[i]= await {from: "from", to: "to", price: availableTrip.getAvailableTrip[i].price, status: 'search', take: <Link to={ `/driver/${id}` }>take</Link>}
    }
    //
    //<Link to="/driver/" params={{ id: 111 }}>take it</Link>
    await this.setState({ rows: row });
    await this.setState({ status: true });
  }

  onGridRowsUpdated = ({ fromRow, toRow, updated }) => {
    this.setState(state => {
      const rows = state.rows.slice();
      for (let i = fromRow; i <= toRow; i++) {
        rows[i] = { ...rows[i], ...updated };
      }
      return { rows };
    });
  };

  render() {
    return (
      <div>
        <h1>free Order </h1>
        {this.state.status ? <ReactDataGrid
          columns={columns}
          rowGetter={i => this.state.rows[i]}
          rowsCount={5}
          onGridRowsUpdated={this.onGridRowsUpdated}
          enableCellSelect={true}
        /> : <h3>Loading</h3>}
      </div>
    )
  }
}

export default Orders;