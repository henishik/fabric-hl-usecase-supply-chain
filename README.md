# Fabric Hyperledger Telco Use Case Prototype

This repository is to accomplish a common use case in Telco industry, which aims to share their blacklist customer over across the three biggest organizations with a decent privacies to read and write.

### Basic Requirements
* Shared ledger stores a blacklisted customer information
* An inquery from company A should be anonymous (Company B and C Should not know when and who make an inquery from company A)
* Data input will be totally from each parties Desition Making Data Ware House

### Systems Infrastructure in high level (v1)

<img src='./docs/res/systems-infrastructure-in-high-level-v1.png' width=400>

### Diagram A

<img src='./docs/res/use-case-diagram-brainstorm-a_20180705.jpg' width=400>

### Diagram B

<img src='./docs/res/use-case-diagram-brainstorm-b_20180705.jpg' width=400>


# General Business Process and Operations

* Ability to inquery a customer to see if whether a specific number is on a blacklist or not, along with amout of debt and due date etc.
* How is a data input look like? Only from ETL integration from another system?
  * Who is going to input new data, and from where to where?
  * What's a consensus agreement to add a number to black list?
  * How could it move the data into blockchain?
* How is a data change look like? Only from ETL integration from another system?
  * Who is going to modify data, and from where to where?
  * What's a consensus agreement to change a number off from black list?
  * How could it move the data into blockchain?
* How to identify the customer?
  * Is there any general agreement among the three parties at this point?
  * What's a mapping mechanism to match the same customer?
  * Is there any legal obstacles we may need to get over?
* How is the organization structure look like?
  * is there only three organizations at first?
  * How many roughly phone network operators within an organization?
  * is it necessary to give a specific permission to a specific role?
    * e.g.) only a specific person could input&modify data on ledger
* General Business Values?
  * Why they want to share a blacklist? if it's high demand, why there is no existed general system?


# Busienss Estimations
* Data Integration Design and Implementation
  * General
    * Analyze Data Definitions for each Data Input source (RTDM)
  * Initial Data Population

# Todos

- [ ] Design General DLT Network Design based on business requirements
- [ ] Build-up Distributed Ledger Business network based on general design
- [ ] Launch network; create channels; join peers to channles
- [ ] Define Assets Data Definitions
- [ ] Implement Data Assets on Smart Contract
- [ ] Design General functionalities and business logics on smart contracts
- [ ] Implement business logics on smart contract
- [ ] Install and Instantiate smart contract
- [ ] Implement an application with CLI SDK
- [ ] Implement an user-faced application with node SDK