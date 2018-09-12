# Fabric HL SupplyChain Usecase example

An example usecase project in supply chain/logistics. This activity is a part of [IDPP#22](https://github.kigroup.de/ki-decentralized/IDPPs/issues/22)

## Project Overview

### Initial Purposes/Motivations

1. Build a quick bootstrap distributed ledger network with Fabric HL 
2. PoC on common basic requirements
3. Build a benchmark tool to measure and simulate technical scalabilities


### General Architecture Overview
<img src='./docs/res/supply-chain-showcase-concept-diagram.png' width=760>

### Shipper Dashboard

<img src='./docs/res/shipper-dashboard.png' width=760>

### Authority Dashboard
<img src='./docs/res/authority-dashboard.png' width=760>

### Carrier Dashboard
<img src='./docs/res/carrier-dashboard.png' width=760>

## How to Run

Use a single bootstrap script for DL Network and middleware. Follow manual procedure for UI component.

### Pre Requirement

* NodeJS is properly installed
* Clone repository `https://github.kigroup.de/t-ishikawa/fabric-hl-usecase-supply-chain.git`
* Well-tested on MacOS/Linux

### DLT Network / Middleware
```
$ ./generate-and-up-distributed-network.sh
```

### UI
```
$ cd ui/gui
$ npm install
$ node bin/dev-server.js
$ open localhost:9999
```