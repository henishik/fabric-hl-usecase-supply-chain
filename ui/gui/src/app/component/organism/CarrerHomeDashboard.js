// DATA
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {fetchAllShipmentListOnCarrier} from '../../action';
import {updateShipmentStatusOnCarrier} from '../../action';
import {logShipmentLocation} from '../../action';
// UI
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Chip from '@material-ui/core/Chip';

function mapStateToProps(state) {
  return {
    shipmentList: state.shipmentListCarrier.shipmentList
  };
}
const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchAllShipmentListOnCarrier: () => dispatch(fetchAllShipmentListOnCarrier()),
  logShipmentLocation: (shipper_id) => dispatch(logShipmentLocation(shipper_id)),
  updateShipmentStatusOnCarrier: (id, currentStatus) => dispatch(
    updateShipmentStatusOnCarrier(id, currentStatus)
  )
});

class CarrierHomeDashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    this.props.fetchAllShipmentListOnCarrier();
  }

  updateShipmentStatus(id, currentStatus) {
    this.props.updateShipmentStatusOnCarrier(id, currentStatus)
  }

  logLocation(shipment_id) {
    this.props.logShipmentLocation(shipment_id)
  }

  render() {
    const shipmentListArray = this.props.shipmentList
    let shipmentCells = ""
    if (shipmentListArray) {
      shipmentCells = shipmentListArray.map((value, key) => {

        let actionButton = ""
        let chipColorStype = "default"

        if (value.Record.status === "waiting for carrier") {
          actionButton = <button onClick={this.updateShipmentStatus.bind(this, value.Key, value.Record.status)}>accept</button>
        } else if (value.Record.status === "waiting for pickup") {
          chipColorStype = "secondary"
          actionButton = <button onClick={this.updateShipmentStatus.bind(this, value.Key, value.Record.status)}>pickup</button>
        } else if (value.Record.status === "waiting for delivery") {
          chipColorStype = "secondary"
          actionButton = <div>
            <button onClick={this.logLocation.bind(this, value.Key)}>log location</button><br/>
            <button onClick={this.updateShipmentStatus.bind(this, value.Key, value.Record.status)}>delivery</button>
          </div>
        } else if (value.Record.status === "waiting for confirm POD") {
          chipColorStype = "secondary"
        } else if (value.Record.status === "waiting for authority approval") {
          chipColorStype = "secondary"
        } else if (value.Record.status === "waiting for payment") {
          chipColorStype = "secondary"
        } else if (value.Record.status === "TRANSACTION DONE") {
          chipColorStype = "primary"
        } else {
          actionButton = <p>-</p>
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
            <TableCell>{value.Record.carrierId? value.Record.carrierId: <button>Assing carrier</button>}</TableCell>
            <TableCell>{actionButton}</TableCell>
          </TableRow>
        )
      })
    }

    return (
      <div classname="scdemo">
        <h1>carrier home dashboard</h1>
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
)(CarrierHomeDashboard);