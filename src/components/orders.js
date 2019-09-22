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
  { key: "take", name: "Take", editable: true },
];

class Orders extends React.Component {
  constructor(props) {
    super(props)
    this.state = { loader: false, availableTrip: '', rows: '', endpoint: ':5000', update: false };
    //let socket = socketIOClient('http://localhost:5000', {
    //  query: {
    //    Token: localStorage.getItem('authToken'),
    //  },
    //});
    // If you refresh your token, update it upon reconnection attempt
    // socket.on('get_trips', () => {
    //       this.socket.io.opts.query = {
    //         token: localStorage.getItem('authToken')
    //       };
    //     });
    //let socket = socketIOClient(this.state.endpoint);
    //socket.emit("msg");
    let timerId = setInterval(async () => {
      let availableTrip = await gql.request(`query getAvailableTrip {
      getAvailableTrip{
        id, price, lat_from, lat_to, long_to, long_from, from, to
        }
      }
    `); await console.log('okkkk', availableTrip)
        await this.setState({ availableTrip: availableTrip.getAvailableTrip });
        let row = await [];
        for (let i = 0; i < availableTrip.getAvailableTrip.length; i++) {
          let id = availableTrip.getAvailableTrip[i].id;
          row[i] = await { from: availableTrip.getAvailableTrip[i].from, to: availableTrip.getAvailableTrip[i].to, price: availableTrip.getAvailableTrip[i].price, status: 'search', take: <Link to={`/driver/${id}`}>take</Link> }
        }
        await this.setState({ rows: row });
        await this.setState({ update: true });
    }, 5000);
  }
  async componentDidMount() {
    let availableTrip = await gql.request(`query getAvailableTrip {
              getAvailableTrip{
                id, price, lat_from, lat_to, long_to, long_from, from, to
                }
            }
            `)
    await console.log('111', availableTrip);
    await this.setState({ availableTrip: availableTrip.getAvailableTrip });
    var row = [];
    for (let i = 0; i < availableTrip.getAvailableTrip.length; i++) {
      //<Link to={/corpus/${corpusId}/tag}>
      let id = availableTrip.getAvailableTrip[i].id;
      row[i] = await { from: availableTrip.getAvailableTrip[i].from, to: availableTrip.getAvailableTrip[i].to, price: availableTrip.getAvailableTrip[i].price, status: 'search', take: <Link to={`/driver/${id}`}>take</Link> }
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
      <div className="free-order">
        <div className="free-order-title">
          <h3>Free orders</h3>
        </div>
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

export default Orders;