import React, {Component} from 'react';
import {connect} from 'react-redux';
import {fetchInitialData} from '../../action';
import {assignCarrier} from '../../action';
import {authorizeTransaction} from '../../action';

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
        return (
          <tr>
            <td>{value.Key}</td>
            <td>{value.Record.identity}</td>
            <td>{value.Record.name}</td>
            <td>{value.Record.status}</td>
            <td>{value.Record.value}</td>
            <td>{value.Record.latitude}</td>
            <td>{value.Record.lognitude}</td>
            <td>{value.Record.shipperId}</td>
            <td>
            {value.Record.carrierId?
              value.Record.carrierId:
              <button onClick={this.onAssignCarrier.bind(this, value.Key)}>Assing carrier</button>}
            </td>
            <td>
            {value.Record.status === "waiting for authority approval"?
              <button onClick={this.onAuthorizeTransaction.bind(this, value.Key, value.Record.status)}>
                Authorize Transaction
              </button> : "-"}
            </td>
          </tr>
        )
      })
    }

    return (
      <div className="scdemo">
        <h1>Regulator Home Dashboard</h1>
        <h2>INDUSTRIAL SHIPMENTS</h2>
        <table>
          <tr>
            <td>ledger key</td>
            <td>shipment identity</td>
            <td>shipment name</td>
            <td>status</td>
            <td>value</td>
            <td>latitude</td>
            <td>lognitude</td>
            <td>shipper</td>
            <td>carrier</td>
            <td>action</td>
          </tr>
          {shipmentCells}
        </table>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RegulatorHomeDashboard);