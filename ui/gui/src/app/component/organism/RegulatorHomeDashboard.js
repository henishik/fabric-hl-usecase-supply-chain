// DATA
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {fetchInitialData} from '../../action';
import {assignCarrier} from '../../action';
import {authorizeTransaction} from '../../action';
// UI
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Chip from '@material-ui/core/Chip';

function mapStateToProps(state) {
  return {
    shipmentList: state.shipmentListRegulator.shipmentList
  };
}
const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchInitialData: () => dispatch(fetchInitialData()),
  assignCarrier: (target_shipment_id) => dispatch(assignCarrier(target_shipment_id)),
  authorizeTransaction: (target_shipment_id, current_shipment_status) => dispatch(
    authorizeTransaction(target_shipment_id, current_shipment_status))
});

class RegulatorHomeDashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  onAssignCarrier(target_shipment_id) {
    this.props.assignCarrier(target_shipment_id);
  }

  onAuthorizeTransaction(target_shipment_id, current_shipment_status) {
    this.props.authorizeTransaction(target_shipment_id, current_shipment_status);
  }

  componentDidMount() {
    this.props.fetchInitialData();
  }

  render() {
    const shipmentListArray = this.props.shipmentList
    let shipmentCells = ""
    if (shipmentListArray) {
      shipmentCells = shipmentListArray.map((value, key) => {
        let chipColorStype = "default"
        if (value.Record.status === "waiting for carrier") {
        } else if (value.Record.status === "waiting for pickup") {
          chipColorStype = "secondary"
        } else if (value.Record.status === "waiting for delivery") {
          chipColorStype = "secondary"
        } else if (value.Record.status === "waiting for confirm POD") {
          chipColorStype = "secondary"
        } else if (value.Record.status === "waiting for authority approval") {
          chipColorStype = "secondary"
        } else if (value.Record.status === "waiting for payment") {
          chipColorStype = "secondary"
        } else if (value.Record.status === "TRANSACTION DONE") {
          chipColorStype = "primary"
        } else {
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
            <TableCell>
            {value.Record.carrierId?
              value.Record.carrierId:
              <button onClick={this.onAssignCarrier.bind(this, value.Key)}>Assing carrier</button>}
            </TableCell>
            <TableCell>
            {value.Record.status === "waiting for authority approval"?
              <button onClick={this.onAuthorizeTransaction.bind(this, value.Key, value.Record.status)}>
                Authorize Transaction
              </button> : "-"}
            </TableCell>
          </TableRow>
        )
      })
    }

    return (
      <div className="scdemo">
        <h1>Hi Regulator! How can I help you?</h1>
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
)(RegulatorHomeDashboard);