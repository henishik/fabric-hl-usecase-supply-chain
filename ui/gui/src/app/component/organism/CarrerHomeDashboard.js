import React, {Component} from 'react';
import {connect} from 'react-redux';
import {fetchAllShipmentListOnCarrier} from '../../action';

function mapStateToProps(state) {
  return {
    shipmentList: state.shipmentListCarrier.shipmentList
  };
}
const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchAllShipmentListOnCarrier: () => dispatch(fetchAllShipmentListOnCarrier())
});

class CarrierHomeDashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    this.props.fetchAllShipmentListOnCarrier();
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
            <td>{value.Record.carrierId? value.Record.carrierId: <button>Assing carrier</button>}</td>
          </tr>
        )
      })
    }

    return (
      <div className="scdemo">
        <h1>Carrier Home Dashboard</h1>
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
          </tr>
          {/* <tr>
            <td>4F30880E84638F3B4F2DCFE3CC53022CCAE10D491689E0DAC13B85C9C3A8F0E7</td>
            <td>very expensive material 100098</td>
            <td>50.936508</td>
            <td>6.939782</td>
            <td>200.00</td>
            <td>waiting for carrier</td>
            <td>awesome shipper</td>
            <td>
              <button>Accept</button>
              <button>Decline</button>
              </td>
          </tr>
          <tr>
            <td>4F30880E84638F3B4F2DCFE3CC53022CCAE10D491689E0DAC13B85C9C3A8F0E7</td>
            <td>very expensive material 100098</td>
            <td>50.936508</td>
            <td>6.939782</td>
            <td>200.00</td>
            <td>waiting for carrier</td>
            <td>awesome shipper</td>
            <td>
              <button>Pickup</button>
              </td>
          </tr>
          <tr>
            <td>4F30880E84638F3B4F2DCFE3CC53022CCAE10D491689E0DAC13B85C9C3A8F0E7</td>
            <td>very expensive material 100098</td>
            <td>50.936508</td>
            <td>6.939782</td>
            <td>200.00</td>
            <td>waiting for carrier</td>
            <td>awesome shipper</td>
            <td>
              <button>Log location</button>
              </td>
          </tr>
          <tr>
            <td>4F30880E84638F3B4F2DCFE3CC53022CCAE10D491689E0DAC13B85C9C3A8F0E7</td>
            <td>very expensive material 100098</td>
            <td>50.936508</td>
            <td>6.939782</td>
            <td>200.00</td>
            <td>waiting for carrier</td>
            <td>awesome shipper</td>
            <td>
              <button>delivery</button>
              </td>
          </tr> */}
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