/**
 *    SPDX-License-Identifier: Apache-2.0
 */
var config = require("./config.json");
var helper = require("../../helper.js");
var logger = helper.getLogger("FabricConfiguration");
var dateUtils = require("../../explorer/rest/logical/utils/dateUtils.js");

var defaultOrg;
var defaultPeer;
var currChannel;

class Configuration {
  constructor(config) {
    this.networkConfig = config["network-config"];
  }

  getDefaultOrg() {
    if (defaultOrg == undefined) {
      defaultOrg = Object.keys(this.networkConfig)[0];
    }

    return defaultOrg;
  }

  getDefaultPeer() {
    if (defaultPeer == undefined) {
      var org = this.getDefaultOrg();
      var orgObj = config["network-config"][org];
      var orgKey = Object.keys(orgObj);
      var index = orgKey.indexOf("peer1");
      defaultPeer = orgKey[index];
    }

    return defaultPeer;
  }

  getOrg(org) {
    return this.networkConfig[org];
  }

  getOrgName(org) {
    return this.networkConfig[org].name;
  }

  getOrgAdmin(org) {
    this.networkConfig[org].admin;
  }

  getKeyStoreForOrg(org) {
    return config.keyValueStore + "_" + org;
  }

  getMspID(org) {
    logger.debug("Msp ID : " + this.networkConfig[org].mspid);
    return this.networkConfig[org].mspid;
  }
  getPeerAddressByName(org, peer) {
    var address = this.networkConfig[org][peer].requests;
    return address;
  }

  getOrgs() {
    let orgList = [];
    for (let key in this.networkConfig) {
      if (key.indexOf("org") === 0) {
        orgList.push(key);
      }
    }
    return orgList;
  }

  getPeersByOrg(org) {
    let peerList = [];
    for (let key in this.networkConfig[org]) {
      if (key.indexOf("peer") === 0) {
        peerList.push(key);
      }
    }
    return peerList;
  }
  //BE -303
  getOrderersByOrg() {
    return config.orderers;
  }
  //BE -303
  getOrgMapFromConfig() {
    var orgs = Object.keys(this.networkConfig);
    var peerlist = [];
    orgs.forEach(ele => {
      var org = this.networkConfig[ele];
      var properties = Object.keys(org);
      properties.forEach(prop => {
        if (
          typeof org[prop] === "object" &&
          "requests" in org[prop] &&
          "events" in org[prop] &&
          "server-hostname" in org[prop] &&
          "tls_cacerts" in org[prop]
        )
          peerlist.push({
            key: ele,
            value: prop
          });
      });
    });
    return peerlist;
  }

  getCurrChannel() {
    if (currChannel == undefined) currChannel = config.channel;
    return currChannel;
  }

  changeChannel(channelName) {
    currChannel = channelName;
  }

  getSyncStartDate() {
    var startSyncMills = null;
    if (config.syncStartDate) {
      console.log("\nProperty config.syncStartDate set to ", config.syncStartDate);
      startSyncMills = dateUtils.toUTCmilliseconds(config.syncStartDate)
    } else {
      logger.error("Property config.syncStartDate missing");
    }
    return startSyncMills;
  }

}
module.exports = new Configuration(config);