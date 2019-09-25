import React from "react";
import promiseActionsMaker from '../store/action';
import { store } from '../store/reducer';
import { GraphQLClient } from 'graphql-request';
import { connect } from 'react-redux';
import ReactDataGrid from "react-data-grid";
import { Router, Route, Link, Switch, NavLink, Redirect } from 'react-router-dom';
import { Socket } from "dgram";
import socketIOClient from "socket.io-client";

const gql = new GraphQLClient("/graphql", { headers: { "Authorization": "Bearer " + localStorage.getItem('authToken') } })

const columns = [
  { key: "from", name: "From", editable: true },
  { key: "to", name: "To", editable: true },
  { key: "price", name: "Price", editable: true },
  { key: "status", name: "Status", editable: true },
  { key: "driver", name: "Driver", editable: true },
];

class MyOrders extends React.Component {
  constructor(props) {
    super(props)
    this.state = { loader: false, myTrips: '', rows: '', update: false, status: false };
  }
  async componentDidMount() {
    let myTrips = await gql.request(`query myTrips {
            myTrips{
                id, price, from, to, id_driver, status
                }
            }
            `)
    await this.setState({ myTrips: myTrips.myTrips });
    var row = [];
    for (let i = 0; i < this.state.myTrips.length; i++) {
      row[i] = await { from: this.state.myTrips[i].from, to: this.state.myTrips[i].to, price: this.state.myTrips[i].price, status: this.state.myTrips[i].status, driver: <Link to={`/driverProfile/${this.state.myTrips[i].id_driver}`}>show driver profile</Link> }
    }
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
      <div className="free-order">
        <h3>My orders: </h3>
        {this.state.status ? <ReactDataGrid
          columns={columns}
          rowGetter={i => this.state.rows[i]}
          rowsCount={50}
          onGridRowsUpdated={this.onGridRowsUpdated}
          enableCellSelect={true}
        /> : <h3>Loading</h3>}
      </div>
    )
  }
}

export default MyOrders;