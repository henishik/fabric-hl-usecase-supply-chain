# Telco Use Case Prototype

## How to access ancher peer in Regulator via CLI command and check basic functionalities

### Procedures
```
$ docker exec -it 'cli' bash

$ printenv
CORE_PEER_ADDRESS=peer0.regulator.com:7051
CORE_PEER_TLS_ENABLED=true
CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/regulator.com/users/Admin@regulator.com/msp
CORE_PEER_TLS_CERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/regulator.com/peers/peer0.regulator.com/tls/server.crt
CORE_PEER_LOCALMSPID=RegulatorMSP
CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/regulator.com/peers/peer0.regulator.com/tls/ca.crt
CORE_PEER_TLS_KEY_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/regulator.com/peers/peer0.regulator.com/tls/server.key

$ peer chaincode invoke -o orderer.ki-decentralized.de:7050 --tls true --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/ki-decentralized.de/orderers/orderer.ki-decentralized.de/msp/tlscacerts/tlsca.ki-decentralized.de-cert.pem -C global-common-channel-layer -n mycc -c '{"Args":["initLedger"]}'
-> OUTPUT
[chaincodeCmd] chaincodeInvokeOrQuery -> INFO 001 Chaincode invoke successful. result: status:200

$ peer chaincode invoke -o orderer.ki-decentralized.de:7050 --tls true --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/ki-decentralized.de/orderers/orderer.ki-decentralized.de/msp/tlscacerts/tlsca.ki-decentralized.de-cert.pem -C global-common-channel-layer -n mycc -c '{"Args":["queryAllCustomer"]}'
-> OUTPUT
[chaincodeCmd] chaincodeInvokeOrQuery -> INFO 001 Chaincode invoke successful. result: status:200 payload:"[{\"Key\":\"0\", \"Record\":{\"name\":\"Alice\"}},{\"Key\":\"1\", \"Record\":{\"name\":\"Bob\"}},{\"Key\":\"2\", \"Record\":{\"name\":\"Alex\"}},{\"Key\":\"3\", \"Record\":{\"name\":\"Tom\"}},{\"Key\":\"4\", \"Record\":{\"name\":\"Michel\"}}]"

$ peer chaincode invoke -o orderer.ki-decentralized.de:7050 --tls true --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/ki-decentralized.de/orderers/orderer.ki-decentralized.de/msp/tlscacerts/tlsca.ki-decentralized.de-cert.pem -C global-common-channel-layer -n mycc -c '{"Args":["addCustomerToBlacklist", "99", "NAME", "YES"]}'

$ peer chaincode invoke -o orderer.ki-decentralized.de:7050 --tls true --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/ki-decentralized.de/orderers/orderer.ki-decentralized.de/msp/tlscacerts/tlsca.ki-decentralized.de-cert.pem -C global-common-channel-layer -n mycc -c '{"Args":["modifyCustomerStatus", "99", "NAMEMODIFY"]}'
```

### Things to check

- [x] Ability to invoke `InitLedger` and see how does it response in cases of:
  - [ ] running only one peer of myself
  - [ ] running only two peers of myself and another
  - [x] running all peers
- [x] Ability to invoke `queryAllCustomers`
  - [ ] running only one peer of myself
  - [ ] running only two peers of myself and another
  - [x] running all peers
- [x] Ability to invoke `addCustomer`
  - [ ] running only one peer of myself
  - [ ] running only two peers of myself and another
  - [x] running all peers
- [x] Ability to invoke `modifyCustomer`
  - [ ] running only one peer of myself
  - [ ] running only two peers of myself and another
  - [x] running all peers

## How to access ancher peer in Shipper via CLI command and check basic functionalities
### Procedures
```
...
```

### Things to check

- [ ] Ability to invoke `InitLedger`
  - [ ] running only one peer of myself
  - [ ] running only two peers of myself and another
  - [ ] running all peers
- [x] Ability to invoke `queryAllCustomer`
  - [ ] running only one peer of myself
  - [ ] running only two peers of myself and another
  - [x] running all peers
- [ ] Ability to invoke `addCustomer`
  - [ ] running only one peer of myself
  - [ ] running only two peers of myself and another
  - [ ] running all peers
- [ ] Ability to invoke `modifyCustomer`
  - [ ] running only one peer of myself
  - [ ] running only two peers of myself and another
  - [ ] running all peers

## How to access ancher peer in Carrier via CLI command and check basic functionalities
### Procedures
```
...
```

### Things to check

- [ ] Ability to invoke `InitLedger`
  - [ ] running only one peer of myself
  - [ ] running only two peers of myself and another
  - [ ] running all peers
- [x] Ability to invoke `queryAllCustomer`
  - [ ] running only one peer of myself
  - [ ] running only two peers of myself and another
  - [x] running all peers
- [ ] Ability to invoke `addCustomer`
  - [ ] running only one peer of myself
  - [ ] running only two peers of myself and another
  - [ ] running all peers
- [ ] Ability to invoke `modifyCustomer`
  - [ ] running only one peer of myself
  - [ ] running only two peers of myself and another
  - [ ] running all peers

## Operations Guide

### How to add/remove participants during netwrok life cycle?

**Scenario use case**

```
At a point, it runs a dlt network which consists of a channel, three organizations each has two peers internaly
```


### How to configure channel settings during network life cycle?


### How to Update a chaincode (WIP)
#### Procedures
```
$ docker exec -it 'cli' bash

$ peer chaincode update -o orderer.ki-decentralized.de:7050 --tls true --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/ki-decentralized.de/orderers/orderer.ki-decentralized.de/msp/tlscacerts/tlsca.ki-decentralized.de-cert.pem -C turktelcomchannel -n mycc -c '{"Args":["wrong function", "0"]}'
```


## Systems Architecture (Details)

[Details in separate page](./docs/syste-architecture-in-details/)

## Busienss Estimations

[Product Road Map in separate page](./docs/product-road-map/)

## Todos Note

- [ ] Network Bootstrap script
  - [ ] Create two peers for writing responsibility within a give organization
  - [ ] Create two peers for reading responsibility within a give organization
  - [ ] Instantiate a chaincode with populating initial five blacklist records (On two channels, which means 
  - [ ] Design General DLT Network Design based on business requirements
  - [ ] Build-up Distributed Ledger Business network based on general design
  - [ ] Launch network; create channels; join peers to channles
  - [ ] Install and Instantiate smart contract
- [ ] Core Smart contract
  - [ ] Define Assets Data Definitions
  - [ ] Implement Data Assets on Smart Contract
  - [ ] Design General functionalities and business logics on smart contracts
  - [ ] Implement business logics on smart contract
- [ ] Setup Explore Hyperledger
  - [ ] 
- [ ] Setup Client SDK application
  - [ ] Implement an user-faced application with node SDK
  - [ ] Implement an application with CLI SDK