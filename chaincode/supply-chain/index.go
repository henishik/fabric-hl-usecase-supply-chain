/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

 package main
 import (
	 "bytes"
	 "encoding/json"
	 "fmt"
	 "strconv"
	 "time"
	 "math/rand"
	 "strings"
 
	 "github.com/hyperledger/fabric/core/chaincode/shim"
	 sc "github.com/hyperledger/fabric/protos/peer"
 )
 
 type SmartContract struct {
 }
 
 type Shipment struct {
	 ObjectType string `json:"docType"`
	 Identity   string `json:"identity"`
	 Name  string `json:"name"`
	 Latitude string `json:"latitude"`
	 Lognitude  string `json:"lognitude"`
	 Value  string `json:"value"`
	 Status  string `json:"status"`
	 ShipperId  string `json:"shipperId"`
	 CarrierId  string `json:"carrierId"`
 }
 
 func (s *SmartContract) Init(APIstub shim.ChaincodeStubInterface) sc.Response {
	 return shim.Success(nil)
 }
 
 func (s *SmartContract) Invoke(APIstub shim.ChaincodeStubInterface) sc.Response {
	 function, args := APIstub.GetFunctionAndParameters()
	 if function == "initShipmentLedger" {
		 return s.initShipmentLedger(APIstub)
	 } else if function == "createShipment" {
		 return s.createShipment(APIstub, args)
	 } else if function == "queryAllShipments" {
		 return s.queryAllShipments(APIstub)
	 } else if function == "assignCarrier" {
		 return s.assignCarrier(APIstub, args)
	 } else if function == "queryShipmentsByCarrierId" {
		 return s.queryShipmentsByCarrierId(APIstub, args)
	 } else if function == "updateShipmentStatus" {
		 return s.updateShipmentStatus(APIstub, args)
	 }
 
	 return shim.Error("Invalid Smart Contract function name.")
 }
 
 func (s *SmartContract) initShipmentLedger(APIstub shim.ChaincodeStubInterface) sc.Response {
	 shipments := []Shipment{
		 Shipment{Identity: "4F30880E84638F3B4F2DCFE3CC53022CCAE10D491689E0DAC13B85C9C3A8F0E7", Name: "very expensive material 100098", Latitude: "50.936508", Lognitude: "6.939782", Value: "200.00", Status: "waiting for carrier", ShipperId: "awesome shipper", CarrierId: ""},
		 Shipment{Identity: "4F30880E84638F3B4F2DCFE3CC53022CCAE10D491689E0DAC13B85C9C3A8F0E7", Name: "very expensive material 100098", Latitude: "50.936508", Lognitude: "6.939782", Value: "200.00", Status: "waiting for carrier", ShipperId: "awesome shipper", CarrierId: ""},
		 Shipment{Identity: "4F30880E84638F3B4F2DCFE3CC53022CCAE10D491689E0DAC13B85C9C3A8F0E7", Name: "very expensive material 100098", Latitude: "50.936508", Lognitude: "6.939782", Value: "200.00", Status: "waiting for carrier", ShipperId: "awesome shipper", CarrierId: ""},
		 Shipment{Identity: "4F30880E84638F3B4F2DCFE3CC53022CCAE10D491689E0DAC13B85C9C3A8F0E7", Name: "very expensive material 100098", Latitude: "50.936508", Lognitude: "6.939782", Value: "200.00", Status: "waiting for carrier", ShipperId: "awesome shipper", CarrierId: ""},
		 Shipment{Identity: "4F30880E84638F3B4F2DCFE3CC53022CCAE10D491689E0DAC13B85C9C3A8F0E7", Name: "very expensive material 100098", Latitude: "50.936508", Lognitude: "6.939782", Value: "200.00", Status: "waiting for carrier", ShipperId: "awesome shipper", CarrierId: ""},
		 Shipment{Identity: "4F30880E84638F3B4F2DCFE3CC53022CCAE10D491689E0DAC13B85C9C3A8F0E7", Name: "very expensive material 100098", Latitude: "50.936508", Lognitude: "6.939782", Value: "200.00", Status: "waiting for carrier", ShipperId: "awesome shipper", CarrierId: ""},
		 Shipment{Identity: "4F30880E84638F3B4F2DCFE3CC53022CCAE10D491689E0DAC13B85C9C3A8F0E7", Name: "very expensive material 100098", Latitude: "50.936508", Lognitude: "6.939782", Value: "200.00", Status: "waiting for carrier", ShipperId: "awesome shipper", CarrierId: ""},
		 Shipment{Identity: "4F30880E84638F3B4F2DCFE3CC53022CCAE10D491689E0DAC13B85C9C3A8F0E7", Name: "very expensive material 100098", Latitude: "50.936508", Lognitude: "6.939782", Value: "200.00", Status: "waiting for carrier", ShipperId: "awesome shipper", CarrierId: ""},
		 Shipment{Identity: "4F30880E84638F3B4F2DCFE3CC53022CCAE10D491689E0DAC13B85C9C3A8F0E7", Name: "very expensive material 100098", Latitude: "50.936508", Lognitude: "6.939782", Value: "200.00", Status: "waiting for carrier", ShipperId: "awesome shipper", CarrierId: ""},
		 Shipment{Identity: "4F30880E84638F3B4F2DCFE3CC53022CCAE10D491689E0DAC13B85C9C3A8F0E7", Name: "very expensive material 100098", Latitude: "50.936508", Lognitude: "6.939782", Value: "200.00", Status: "waiting for carrier", ShipperId: "awesome shipper", CarrierId: ""},
		 Shipment{Identity: "4F30880E84638F3B4F2DCFE3CC53022CCAE10D491689E0DAC13B85C9C3A8F0E7", Name: "very expensive material 100098", Latitude: "50.936508", Lognitude: "6.939782", Value: "200.00", Status: "waiting for carrier", ShipperId: "awesome shipper", CarrierId: ""},
	 }
 
	 i := 0
	 for i < len(shipments) {
		 fmt.Println("i is ", i)
		 shipmentAsBytes, _ := json.Marshal(shipments[i])
		 APIstub.PutState("SHIPMENT"+strconv.Itoa(i), shipmentAsBytes)
		 fmt.Println("Added", shipments[i])
		 i = i + 1
	 }
 
	 return shim.Success(nil)
 }
 
 func random(min, max int) int {
	 rand.Seed(time.Now().Unix())
	 return rand.Intn(max - min) + min
 }
 
 func (s *SmartContract) createShipment(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	 var shipment = Shipment{Identity: "4F30880E84638F3B4F2DCFE3CC53022CCAE10D491689E0DAC13B85C9C3A8F0E7", Name: "very expensive material 100098", Latitude: "50.936508", Lognitude: "6.939782", Value: "200.00", Status: "waiting for carrier", ShipperId: "awesome shipper", CarrierId: ""}
 
	 shipmentAsBytes, _ := json.Marshal(shipment)
 
	 var keyId = random(10, 999)
	 APIstub.PutState("SHIPMENT"+strconv.Itoa(keyId), shipmentAsBytes)
 
	 return shim.Success(nil)
 }
 
 func (s *SmartContract) queryAllShipments(APIstub shim.ChaincodeStubInterface) sc.Response {
	 startKey := "SHIPMENT0"
	 endKey := "SHIPMENT999"
 
	 resultsIterator, err := APIstub.GetStateByRange(startKey, endKey)
	 if err != nil {
		 return shim.Error(err.Error())
	 }
	 defer resultsIterator.Close()
 
	 // buffer is a JSON array containing QueryResults
	 var buffer bytes.Buffer
	 buffer.WriteString("[")
 
	 bArrayMemberAlreadyWritten := false
	 for resultsIterator.HasNext() {
		 queryResponse, err := resultsIterator.Next()
		 if err != nil {
			 return shim.Error(err.Error())
		 }
		 // Add a comma before array members, suppress it for the first array member
		 if bArrayMemberAlreadyWritten == true {
			 buffer.WriteString(",")
		 }
		 buffer.WriteString("{\"Key\":")
		 buffer.WriteString("\"")
		 buffer.WriteString(queryResponse.Key)
		 buffer.WriteString("\"")
 
		 buffer.WriteString(", \"Record\":")
		 // Record is a JSON object, so we write as-is
		 buffer.WriteString(string(queryResponse.Value))
		 buffer.WriteString("}")
		 bArrayMemberAlreadyWritten = true
	 }
	 buffer.WriteString("]")
 
	 fmt.Printf("- queryAllCars:\n%s\n", buffer.String())
 
	 return shim.Success(buffer.Bytes())
 }
 
 func (s *SmartContract) assignCarrier(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	 if len(args) != 1 {
		 return shim.Error("Incorrect number of arguments. Expecting 1")
	 }
 
	 shipmentAsBytes, _ := APIstub.GetState(args[0])
	 shipment := Shipment{}
	 json.Unmarshal(shipmentAsBytes, &shipment)
	 shipment.CarrierId = "carrier_id_921"
 
	 shipmentAsBytes, _ = json.Marshal(shipment)
	 APIstub.PutState(args[0], shipmentAsBytes)
 
	 return shim.Success(nil)
 }
 
 func (s *SmartContract) updateShipmentStatus(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	 if len(args) != 2 {
		 return shim.Error("Incorrect number of arguments. Expecting 2")
	 }
 
	 shipmentAsBytes, _ := APIstub.GetState(args[0])
	 shipment := Shipment{}
	 json.Unmarshal(shipmentAsBytes, &shipment)
	 shipment.Status = args[1]
 
	 shipmentAsBytes, _ = json.Marshal(shipment)
	 APIstub.PutState(args[0], shipmentAsBytes)
 
	 return shim.Success(nil)
 }
 
 func getQueryResultForQueryString(stub shim.ChaincodeStubInterface, queryString string) ([]byte, error) {
 
	 fmt.Printf("- getQueryResultForQueryString queryString:\n%s\n", queryString)
 
	 resultsIterator, err := stub.GetQueryResult(queryString)
	 if err != nil {
		 return nil, err
	 }
	 defer resultsIterator.Close()
 
	 // buffer is a JSON array containing QueryRecords
	 var buffer bytes.Buffer
	 buffer.WriteString("[")
 
	 bArrayMemberAlreadyWritten := false
	 for resultsIterator.HasNext() {
		 queryResponse, err := resultsIterator.Next()
		 if err != nil {
			 return nil, err
		 }
		 // Add a comma before array members, suppress it for the first array member
		 if bArrayMemberAlreadyWritten == true {
			 buffer.WriteString(",")
		 }
		 buffer.WriteString("{\"Key\":")
		 buffer.WriteString("\"")
		 buffer.WriteString(queryResponse.Key)
		 buffer.WriteString("\"")
 
		 buffer.WriteString(", \"Record\":")
		 // Record is a JSON object, so we write as-is
		 buffer.WriteString(string(queryResponse.Value))
		 buffer.WriteString("}")
		 bArrayMemberAlreadyWritten = true
	 }
	 buffer.WriteString("]")
 
	 fmt.Printf("- getQueryResultForQueryString queryResult:\n%s\n", buffer.String())
 
	 return buffer.Bytes(), nil
 }
 
 func (s *SmartContract) queryShipmentsByCarrierId(stub shim.ChaincodeStubInterface, args []string) sc.Response {
 
	 //   0
	 // "carrier_id_921"
	 if len(args) < 1 {
		 return shim.Error("Incorrect number of arguments. Expecting 1")
	 }
 
	 carrier_id := strings.ToLower(args[0])
 
	 queryString := fmt.Sprintf("{\"selector\":{\"carrierId\":\"%s\"}}", carrier_id)
 
	 queryResults, err := getQueryResultForQueryString(stub, queryString)
	 if err != nil {
		 return shim.Error(err.Error())
	 }
	 return shim.Success(queryResults)
 }
 
 func main() {
	 // The main function is only relevant in unit test mode.
	 // Only included here for completeness.
	 err := shim.Start(new(SmartContract))
	 if err != nil {
		 fmt.Printf("Error creating new Smart Contract: %s", err)
	 }
 }
 