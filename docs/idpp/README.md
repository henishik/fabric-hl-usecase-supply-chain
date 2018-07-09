## Preamble
```
IDPP: xxx
Title: Build key proof of concepts in Telco industry use case with Fabric Hyperledger
Author: @t-ishikawa
Status: Draft
Size: Medium (5-15 days)
Created: 2018-04-07
```

## Abstract

The primary objective is to have some proof of concepts on specific requirements in Telco industry by building a quick prototype.

The secondary objective is to understand fundamental principal of Fabric Hyperledger Framework to explain each concepts clearly so that it could have an eco-system for a typical industrial enterprise blockchain use-case project in a long run.

## Motivation

**Building a quick prototype:**

* Have more confidences with product roadmap estimations
* Help futhre's pre-sales communication by showing a prototype, rather than showing a documentation

**Having deeper understandings on Fabric Hyperledger:**

* Help future's pre-sales pitch to customer to explain key technical fundamental principals more clearly
* Have an eco-system to design on a specific business network by creating some patterns from essential principal

## Artifacts and Links

...


## Specification

### General Requiremets

* Having a shared global ledger across three organizations
* An organization can create an inquery to see a status for a specific customer
* An inquery from company A should be anonymous (e.g. Company B and C Should not know when and who make an inquery by company A)
* Additional data population / Modifying status could be done by ETL batch scripts in a given period.

### Basic Design

***Network***

* Three organizations
* N peers for each organizations (TBD)
* One || Two channel (TBD) to handle transaction transparencies
* One Orderer Service
* MSP/CA service for each organizations (user authentications)

***Smart Contract***

* Query a specific customer to get a result of isBlacklisted or not.
* Add new blacklisted customer
* Modify a status of blacklisted for a specific customer

***Off Chain***

* User-friendly Interface to see a result of an inquery
* ETL data-pipeline to customer's DWH for each organizations for data-inputs