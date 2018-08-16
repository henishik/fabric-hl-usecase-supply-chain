import React, {Component} from 'react';
import {connect} from 'react-redux';
import {fetchAllShipmentListOnCarrier} from '../../action';
import {updateShipmentStatusOnCarrier} from '../../action';
import {logShipmentLocation} from '../../action';

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

        if (value.Record.status === "waiting for carrier") {
          actionButton = <button onClick={this.updateShipmentStatus.bind(this, value.Key, value.Record.status)}>accept</button>
        } else if (value.Record.status === "waiting for pickup") {
          actionButton = <button onClick={this.updateShipmentStatus.bind(this, value.Key, value.Record.status)}>pickup</button>
        } else if (value.Record.status === "waiting for delivery") {
          actionButton = <div>
            <button onClick={this.logLocation.bind(this, value.Key)}>log location</button><br/>
            <button onClick={this.updateShipmentStatus.bind(this, value.Key, value.Record.status)}>delivery</button>
          </div>
        } else {
          actionButton = <p>-</p>
        }

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
            <td>{value.Record.carrierId? value.Record.carrierId: <button>Assing carrier</button>}</td>
            <td>{actionButton}</td>
          </tr>
        )
      })
    }

    return (
      <div classname="scdemo">
        <h1>carrier home dashboard</h1>
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
)(CarrierHomeDashboard);