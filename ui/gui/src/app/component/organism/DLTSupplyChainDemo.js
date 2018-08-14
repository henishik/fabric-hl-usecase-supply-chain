import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import Grid from '@material-ui/core/Grid';

function mapStateToProps(state) {
  return {
    visualizeData: state.visualizeData
  };
}
const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchInitialData: () => dispatch(fetchInitialData())
});

class SupplyChainDemoScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {}

  render() {
    return (
      <div className="scdemo">
        <h1>Supply Chain DEMO</h1>
        <Grid container spacing={24}>
          <Grid item xs={4}>
            <Link to="/shipper-home">
              <button>Shipper</button>
            </Link>
          </Grid>
          <Grid item xs={4}>
            <Link to="/regulator-home">
              <button>Regulator</button>
            </Link>
          </Grid>
          <Grid item xs={4}>
            <Link to="/carrier-home">
              <button>Career</button>
            </Link>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SupplyChainDemoScreen);