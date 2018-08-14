import React, {Component} from 'react';
import {connect} from 'react-redux';
import {createShipment} from '../../action';

function mapStateToProps(state) {
  return {
    shipmentList: state.shipperReducer.shipmentList
  };
}
const mapDispatchToProps = (dispatch, ownProps) => ({
  createShipment: () => dispatch(createShipment())
});

class ShipperHomeDashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  onCreateShipment() {
    this.props.createShipment();
  }

  componentDidMount() {}

  render() {
    return (
      <div className="scdemo">
        <h1>Shipper Home Dashboard</h1>
        <h2>CREATE NEW SHIPMENT</h2>
        <button onClick={this.onCreateShipment.bind(this)}>Create new shipment</button>
        <h2>MANAGE SHIPMENTS</h2>
        <table>
          <tr>
            <td>shipment identity</td>
            <td>shipment name</td>
            <td>latitude</td>
            <td>lognitude</td>
            <td>value</td>
            <td>status</td>
            <td>action</td>
          </tr>
          <tr>
            <td>4F30880E84638F3B4F2DCFE3CC53022CCAE10D491689E0DAC13B85C9C3A8F0E7</td>
            <td>very expensive material 100098</td>
            <td>50.936508</td>
            <td>6.939782</td>
            <td>200.00</td>
            <td>waiting for carrier</td>
            <td>-</td>
          </tr>
          <tr>
            <td>4F30880E84638F3B4F2DCFE3CC53022CCAE10D491689E0DAC13B85C9C3A8F0E7</td>
            <td>very expensive material 100098</td>
            <td>50.936508</td>
            <td>6.939782</td>
            <td>200.00</td>
            <td>waiting for carrier</td>
            <td><button>Accept POD</button></td>
          </tr>
          <tr>
            <td>4F30880E84638F3B4F2DCFE3CC53022CCAE10D491689E0DAC13B85C9C3A8F0E7</td>
            <td>very expensive material 100098</td>
            <td>50.936508</td>
            <td>6.939782</td>
            <td>200.00</td>
            <td>waiting for carrier</td>
            <td><button>Make a Payment</button></td>
          </tr>
        </table>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ShipperHomeDashboard);