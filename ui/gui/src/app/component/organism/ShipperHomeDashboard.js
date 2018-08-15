import React, {Component} from 'react';
import {connect} from 'react-redux';
import {createShipment} from '../../action';
import {fetchAllShipmentListOnShipper} from '../../action';
import {updateShipmentStatusOnShipper} from '../../action';

function mapStateToProps(state) {
  return {
    shipmentList: state.shipperReducer.shipmentList
  };
}
const mapDispatchToProps = (dispatch, ownProps) => ({
  createShipment: () => dispatch(createShipment()),
  fetchAllShipmentListOnShipper: (shipper_id) => dispatch(fetchAllShipmentListOnShipper(shipper_id)),
  updateShipmentStatus: (id, currentStatus) => dispatch(updateShipmentStatusOnShipper(id, currentStatus)),
});

class ShipperHomeDashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  onCreateShipment() {
    this.props.createShipment();
  }

  updateShipmentStatus(id, currentStatus) {
    this.props.updateShipmentStatus(id, currentStatus)
  }

  componentDidMount() {
    this.props.fetchAllShipmentListOnShipper("awesome shipper");
  }

  render() {
    console.log("RENDER")
    console.log(this.props.shipmentList)

    const shipmentListArray = this.props.shipmentList
    let shipmentCells = ""
    if (shipmentListArray) {
      shipmentCells = shipmentListArray.map((value, key) => {

        let actionButton = "-"

        if (value.Record.status === "waiting for confirm POD") {
          actionButton = <button onClick={this.updateShipmentStatus.bind(this, value.Key, value.Record.status)}>Confirm POD</button>
        } else if (value.Record.status === "waiting for payment") {
          actionButton = <button>Payment</button>
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
            <td>{value.Record.carrierId? value.Record.carrierId: "-"}</td>
            <td>{actionButton}</td>
          </tr>
        )
      })
    }

    return (
      <div className="scdemo">
        <h1>Shipper Home Dashboard</h1>
        <h2>CREATE NEW SHIPMENT</h2>
        <button onClick={this.onCreateShipment.bind(this)}>Create new shipment</button>
        <h2>MANAGE SHIPMENTS</h2>
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
)(ShipperHomeDashboard);