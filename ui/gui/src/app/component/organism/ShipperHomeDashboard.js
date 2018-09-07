// DATA
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {createShipment} from '../../action';
import {fetchAllShipmentListOnShipper} from '../../action';
import {updateShipmentStatusOnShipper} from '../../action';
import {makePayment} from '../../action';
// UI
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Chip from '@material-ui/core/Chip';

function mapStateToProps(state) {
  return {
    shipmentList: state.shipperReducer.shipmentList
  };
}
const mapDispatchToProps = (dispatch, ownProps) => ({
  createShipment: () => dispatch(createShipment()),
  fetchAllShipmentListOnShipper: (shipper_id) => dispatch(fetchAllShipmentListOnShipper(shipper_id)),
  updateShipmentStatus: (id, currentStatus) => dispatch(updateShipmentStatusOnShipper(id, currentStatus)),
  makePayment: (id, currentStatus) => dispatch(makePayment(id, currentStatus)),
});

class ShipperHomeDashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  onCreateShipment() {
    this.props.createShipment();
  }

  onMakePayment(shipment_id, current_shipment_status) {
    this.props.makePayment(shipment_id, current_shipment_status);
  }

  updateShipmentStatus(id, currentStatus) {
    this.props.updateShipmentStatus(id, currentStatus)
  }

  componentDidMount() {
    this.props.fetchAllShipmentListOnShipper("awesome shipper");
  }

  render() {
    const shipmentListArray = this.props.shipmentList
    let shipmentCells = ""
    if (shipmentListArray) {
      shipmentCells = shipmentListArray.map((value, key) => {

        let actionButton = "-"
        let chipColorStype = "default"

        if (value.Record.status === "waiting for confirm POD") {
          actionButton = <button onClick={this.updateShipmentStatus.bind(this, value.Key, value.Record.status)}>Confirm POD</button>
          chipColorStype = "secondary"
        } else if (value.Record.status === "waiting for payment") {
          actionButton = <button onClick={this.onMakePayment.bind(this, value.Key, value.Record.status)}>Payment</button>
          chipColorStype = "secondary"
        } else if (value.Record.status === "waiting for pickup") {
          chipColorStype = "secondary"
        } else if (value.Record.status === "waiting for delivery") {
          chipColorStype = "secondary"
        } else if (value.Record.status === "waiting for authority approval") {
          chipColorStype = "secondary"
        } else if (value.Record.status === "TRANSACTION DONE") {
          chipColorStype = "primary"
        }

        return (
          <TableRow>
            <TableCell>{value.Key}</TableCell>
            <TableCell>{value.Record.identity}</TableCell>
            <TableCell>{value.Record.name}</TableCell>
            <TableCell><Chip label={value.Record.status} color={chipColorStype}></Chip></TableCell>
            <TableCell>{value.Record.value}</TableCell>
            <TableCell>{value.Record.latitude}</TableCell>
            <TableCell>{value.Record.lognitude}</TableCell>
            <TableCell>{value.Record.shipperId}</TableCell>
            <TableCell>{value.Record.carrierId? value.Record.carrierId: "-"}</TableCell>
            <TableCell>{actionButton}</TableCell>
          </TableRow>
        )
      })
    }

    return (
      <div className="scdemo">
        <h1>Hi awesome shipper! How can I help you? <button onClick={this.onCreateShipment.bind(this)}>Create new shipment</button></h1>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ledger key</TableCell>
              <TableCell>shipment identity</TableCell>
              <TableCell>shipment name</TableCell>
              <TableCell>status</TableCell>
              <TableCell>value</TableCell>
              <TableCell>latitude</TableCell>
              <TableCell>lognitude</TableCell>
              <TableCell>shipper</TableCell>
              <TableCell>carrier</TableCell>
              <TableCell>action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shipmentCells}
          </TableBody>
        </Table>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ShipperHomeDashboard);