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
type Location struct {
	ObjectType string `json:"docType"`
	LocationShipmentKey   string `json:"locationShipmentKey"`
	LocationShipmentIdentity   string `json:"locationShipmentIdentity"`
	Latitude string `json:"latitude"`
	Lognitude  string `json:"lognitude"`
	LocationDatetimeUtc  string `json:"locationDatetimeUtc"`
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
	} else if function == "queryShipmentsByShipperId" {
		return s.queryShipmentsByShipperId(APIstub, args)
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

func getQueryResultForQueryString(stub shim.ChaincodeStubInterface, queryString string) ([]byte, error) {
	// =========================================================================================
	// getQueryResultForQueryString executes the passed in query string.
	// Result set is built and returned as a byte array containing the JSON results.
	// =========================================================================================
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

func (s *SmartContract) queryShipmentsByShipperId(stub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) < 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	shipper_id := strings.ToLower(args[0])
	queryString := fmt.Sprintf("{\"selector\":{\"shipperId\":\"%s\"}}", shipper_id)
	queryResults, err := getQueryResultForQueryString(stub, queryString)

	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(queryResults)
}

func (s *SmartContract) logLocationForShipment(stub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) < 3 {
		return shim.Error("Incorrect number of arguments. Expecting 3")
	}

	var location = Location{
		LocationShipmentKey: args[0],
		LocationShipmentIdentity: "",
		Latitude: "50.000000",
		Lognitude: "6.000000",
		LocationDatetimeUtc: time.Now().UTC().String()}

	locaitionAsBytes, _ := json.Marshal(location)

	var keyid = random(10, 999)
	stub.PutState("LOCATION"+strconv.Itoa(keyid), locaitionAsBytes)

	return shim.Success(nil)
}

func (s *SmartContract) queryAllLocationsForShipment(stub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) < 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	// shipper_id := strings.ToLower(args[0])
	queryString := fmt.Sprintf("{\"selector\":{\"locationShipmentKey\":\"%s\"}}", args[0])
	queryResults, err := getQueryResultForQueryString(stub, queryString)

	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(queryResults)
}

func main() {
	err := shim.Start(new(SmartContract))
	if err != nil {
		fmt.Printf("Error creating new Smart Contract: %s", err)
	}
}