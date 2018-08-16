// 'Container Components'
// http://redux.js.org/docs/basics/UsageWithReact.html
import React, {Component} from 'react';
import {connect} from 'react-redux';

const mapStateToProps = (state, ownProps) => ({
  // state is an Immutable object
});

// The available actions for the component
const mapDispatchToProps = (dispatch, ownProps) => ({
});

class rootContainer extends Component {
  render() {
    return (
      <div className="rootContainer">
        <div className="rootContainer__sidebar">
          <h2 className="rootContainer__sidebar__title">Supply Chain Distributed Shipment Management (Fabric Hyperledger)</h2>
        </div>
        <div className="rootContainer__main">
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(rootContainer);
