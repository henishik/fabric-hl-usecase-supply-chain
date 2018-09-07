// Data
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
// UI
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

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
        <h1>Who are you?</h1>
        <Grid container spacing={24}>
          <Grid item xs={4}>
            <Card>
              <CardContent>
                <Link to="/shipper-home">
                  <button>Shipper</button>
                </Link>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card>
              <CardContent>
                <Link to="/regulator-home">
                  <button>Regulator</button>
                </Link>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card>
              <CardContent>
                <Link to="/carrier-home">
                  <button>Career</button>
                </Link>
              </CardContent>
            </Card>
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