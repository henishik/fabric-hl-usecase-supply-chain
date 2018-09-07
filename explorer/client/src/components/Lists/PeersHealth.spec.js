/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import PeersHealth from "./PeersHealth";
import ReactTable from 'react-table';
import nock from 'nock';

const setup = () => {
  const props = {
    peerStatus: [
      {
        status: "UP",
        server_hostname: "peer0.org1.example.com"
      },
      {
        status: "UP",
        server_hostname: "peer1.org1.example.com"
      },
      {
       status: "UP",
        server_hostname: "peer0.org2.example.com"
      },
      {
        status: "DOWN",
        server_hostname: "peer1.org2.example.com"
      }
    ]
  };

  const wrapper = mount(<PeersHealth {...props} />);

  return {
    props,
    wrapper
  }
};

describe("PeersHealth", () => {
  test("PeersHealth and ReactTable components should render", () => {
    const { wrapper } = setup();
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find(ReactTable).exists()).toBe(true);
  });
});
