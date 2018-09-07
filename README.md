# Fabric HL SupplyChain Usecase example

A bootstrap project for a common use case in Telco industry, which aims to share their blacklist customer over across multiple organizations with aiming some private-data requirements. This activity is a part of [IDPP#22](https://github.kigroup.de/ki-decentralized/IDPPs/issues/22)

## Project Overview

### Purposes/Motivations

1. Build a quick runable prototype with some basic business requirements and functionalities to support building a robust product road-map in the beginning
2. Build a bootstrap script to bootstrap common overraped system structure
3. Build a benchmark tool to measure and simulate technical scalabilities

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
* Proof of Concepts on how to define endorsement policies by designing query test-guideline and fulfilling them

### Supply Chain User Interface showcase (MVP2)

#### Architecture Overview
<img src='./docs/res/supply-chain-showcase-concept-diagram.png' width=760>

#### Shipper Dashboard

<img src='./docs/res/shipper-dashboard.png' width=760>

#### Authority Dashboard
<img src='./docs/res/authority-dashboard.png' width=760>

#### Carrier Dashboard
<img src='./docs/res/carrier-dashboard.png' width=760>

### Internal Benchmark Tool (MVP3)

* Build a benchmark system by building some infrastructure stress scenario to eliminate scalable uncertainties

***A simple inserting benchmark***

```
1. Determine x(10 to 60, no duplications) numbers(seconds to make a query) to input within a minute
2. Insert a blacklist record at a specific second which was defined in phase 1
3. Repeat phase 1 and 2 for y(5 to 30) times(minutes) 
4. See a transaction log to reconcile the transactions to have an inserting benchmark
```

***Figure out how to see transaction logs and world state in given place:***

- [ ] Global Shared Ledger
- [ ] Channel
- [ ] Peer 0 Organization A
- [ ] Peer 1 Organization A
- [ ] Peer 0 Organization B
- [ ] Peer 1 Organization B
- [ ] Peer 0 Organization C
- [ ] Peer 1 Organization C

### Network Visualization and logging tool (MVP4)

* Explore Blockchain
* System reliability dashboard

### Advanced Requirements (MVP5)

* An inquery from company A should be anonymous (Company B and C Should not know when and who make an inquery from company A)
* Each organiaztion can inquery to a ledger to see if it is a specific customer blacklisted by an unique customer identify.
* Data input will be totally from each parties Desition Making Data Ware House


## How to Run

Use a single bootstrap script which automates fundamental procedures to define and build a basic fabric network, in which procedures consist of:
### Pre Requirement
```
$ git clone https://github.kigroup.de/t-ishikawa/fabric-hl-usecase-supply-chain.git
```

### DLT Network
```
$ ./generate-and-up-distributed-network.sh
```

### Middleware
```
$ cd middleware
$ npm install
$ node enrollAdmin.js
$ node registerUser.js
$ node index.js
$ open localhost:9998
```

### UI
```
$ cd ui/gui
$ npm install
$ node bin/dev-server.js
$ open localhost:9999
```