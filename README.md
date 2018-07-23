# Fabric Hyperledger Telco Use Case Prototype

This repository is to accomplish a common use case in Telco industry, which aims to share their blacklist customer over across the three biggest organizations with a decent privacies to read and write.

## Project Overview

### Purposes/Motivations

1. Build a quick runable prototype with some basic business requirements and functionalities to support building a robust product road-map in the beginning
2. Build a bootstrap script to bootstrap common overraped system structure
3. Build a benchmark tool to measure and simulate technical scalabilities

### Network Structure

* Channel
* Endorsement Policy

### Systems Infrastructure in high level

<img src='./docs/res/systems-infrastructure-in-high-level-v2.png' width=760>

<!-- ### Diagram A

<img src='./docs/res/use-case-diagram-brainstorm-a_20180705.JPG' width=400>

### Diagram B

<img src='./docs/res/use-case-diagram-brainstorm-b_20180705.JPG' width=400> -->

### Basic Requirements (MVP1)
* Store `blacklisted customer information` as a digital asset on a global distributed shared ledger
  * Maintain the shared customer information (digital assets) cooperately among across three organizations (Competitor/Non-trusted)
* Each organiaztion can inquery to a ledger to fetch customer information by an unique customer identify

### Internal Benchmark Tool (MVP2)

* Build a benchmark system by building some infrastructure stress scenario to eliminate scalable uncertainties

### Advanced Requirements (MVP3)

* An inquery from company A should be anonymous (Company B and C Should not know when and who make an inquery from company A)
* Each organiaztion can inquery to a ledger to see if it is a specific customer blacklisted by an unique customer identify.
* Data input will be totally from each parties Desition Making Data Ware House

### Network Visualization and logging tool (MVP4)

* Explore Blockchain
* System reliability dashboard

## How to Run-up basic fabric network

Use a single bootstrap script which automates fundamental procedures to define and build a basic fabric network, in which procedures consist of:

1. Generate each `crypto-config` based on a [config file](./crypto-config.yaml)
2. Generate channel artifacts and genesis block
3. Build and up each docker containers based on a [config file](./docker-compose.yaml)
4. Basic channel configurations (Create/Join/AncherPeers)
5. Basic chaincode configurations (Install/Instantiate)

```
$ git clone https://github.kigroup.de/t-ishikawa/dlt-fabric-use-case-telco/tree/develop
$ cd dlt-fabric-use-case-telco
$ ./generate-and-up-distributed-network.sh
```

## How to access ancher peer in TurkTelekom via CLI command and check basic functionalities

### Procedures
```
$ docker exec -it 'cli' bash

$ printenv
CORE_PEER_ADDRESS=peer0.turktelekom.com:7051
CORE_PEER_TLS_ENABLED=true
CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/turktelekom.com/users/Admin@turktelekom.com/msp
CORE_PEER_TLS_CERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/turktelekom.com/peers/peer0.turktelekom.com/tls/server.crt
CORE_PEER_LOCALMSPID=TurkTelekomMSP
CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/turktelekom.com/peers/peer0.turktelekom.com/tls/ca.crt
CORE_PEER_TLS_KEY_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/turktelekom.com/peers/peer0.turktelekom.com/tls/server.key

$ peer chaincode invoke -o orderer.ki-decentralized.de:7050 --tls true --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/ki-decentralized.de/orderers/orderer.ki-decentralized.de/msp/tlscacerts/tlsca.ki-decentralized.de-cert.pem -C turktelecomechannel -n mycc -c '{"Args":["initLedger"]}'
-> OUTPUT
[chaincodeCmd] chaincodeInvokeOrQuery -> INFO 001 Chaincode invoke successful. result: status:200

$ peer chaincode invoke -o orderer.ki-decentralized.de:7050 --tls true --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/ki-decentralized.de/orderers/orderer.ki-decentralized.de/msp/tlscacerts/tlsca.ki-decentralized.de-cert.pem -C turktelecomechannel -n mycc -c '{"Args":["queryAllCustomer"]}'
-> OUTPUT
[chaincodeCmd] chaincodeInvokeOrQuery -> INFO 001 Chaincode invoke successful. result: status:200 payload:"[{\"Key\":\"0\", \"Record\":{\"name\":\"Alice\"}},{\"Key\":\"1\", \"Record\":{\"name\":\"Bob\"}},{\"Key\":\"2\", \"Record\":{\"name\":\"Alex\"}},{\"Key\":\"3\", \"Record\":{\"name\":\"Tom\"}},{\"Key\":\"4\", \"Record\":{\"name\":\"Michel\"}}]"

$ peer chaincode invoke -o orderer.ki-decentralized.de:7050 --tls true --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/ki-decentralized.de/orderers/orderer.ki-decentralized.de/msp/tlscacerts/tlsca.ki-decentralized.de-cert.pem -C turktelecomechannel -n mycc -c '{"Args":["addCustomerToBlacklist", "99", "NAME", "YES"]}'

$ modifyCustomer
-> Modify isBlacklisted status for a specific customer
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
  - [ ] running all peers
- [ ] Ability to invoke `modifyCustomer`
  - [ ] running only one peer of myself
  - [ ] running only two peers of myself and another
  - [ ] running all peers

## How to access ancher peer in Organization B via CLI command
### Procedures
```
...
```

### Things to check

- [ ] Ability to invoke `InitLedger`
  - [ ] running only one peer of myself
  - [ ] running only two peers of myself and another
  - [ ] running all peers
- [ ] Ability to invoke `queryAllCustomer`
  - [ ] running only one peer of myself
  - [ ] running only two peers of myself and another
  - [ ] running all peers
- [ ] Ability to invoke `addCustomer`
  - [ ] running only one peer of myself
  - [ ] running only two peers of myself and another
  - [ ] running all peers
- [ ] Ability to invoke `modifyCustomer`
  - [ ] running only one peer of myself
  - [ ] running only two peers of myself and another
  - [ ] running all peers

## How to access ancher peer in Organization C via CLI command
### Procedures
```
...
```

### Things to check

- [ ] Ability to invoke `InitLedger`
  - [ ] running only one peer of myself
  - [ ] running only two peers of myself and another
  - [ ] running all peers
- [ ] Ability to invoke `queryAllCustomer`
  - [ ] running only one peer of myself
  - [ ] running only two peers of myself and another
  - [ ] running all peers
- [ ] Ability to invoke `addCustomer`
  - [ ] running only one peer of myself
  - [ ] running only two peers of myself and another
  - [ ] running all peers
- [ ] Ability to invoke `modifyCustomer`
  - [ ] running only one peer of myself
  - [ ] running only two peers of myself and another
  - [ ] running all peers

## How to Update a chaincode (WIP)
### Procedures
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