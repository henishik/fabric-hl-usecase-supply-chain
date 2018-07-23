package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"strconv"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	sc "github.com/hyperledger/fabric/protos/peer"
)

type SmartContract struct {
}

type Customer struct {
	Name    string `json:"name"`
	isBlack string `json:"isBlack"`
}

/*
 * The Init method is called when the Smart Contract "fabcar" is
 * instantiated by the blockchain network
 *
 * Best practice is to have any Ledger initialization in separate function
 * -- see initLedger()
 */
func (s *SmartContract) Init(APIstub shim.ChaincodeStubInterface) sc.Response {
	return shim.Success(nil)
}

func (s *SmartContract) initLedger(APIstub shim.ChaincodeStubInterface) sc.Response {
	customers := []Customer{
		Customer{Name: "Alice", isBlack: "YES"},
		Customer{Name: "Bob", isBlack: "YES"},
		Customer{Name: "Alex", isBlack: "YES"},
		Customer{Name: "Tom", isBlack: "YES"},
		Customer{Name: "Michel", isBlack: "YES"},
	}

	i := 0
	for i < len(customers) {
		fmt.Println("i is ", i)
		carAsBytes, _ := json.Marshal(customers[i])
		APIstub.PutState(strconv.Itoa(i), carAsBytes)

		fmt.Println("Added", customers[i])
		i = i + 1
	}

	return shim.Success(nil)
}

func (s *SmartContract) queryCustomer(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	carAsBytes, _ := APIstub.GetState(args[0])

	return shim.Success(carAsBytes)
}

/*
 * The queryAllTuna method *
allows for assessing all the records added to the ledger(all tuna catches)
This method does not take any arguments. Returns JSON string containing results. 
 */
 func (s *SmartContract) queryAllCustomer(APIstub shim.ChaincodeStubInterface) sc.Response {
	startKey := "0"
	endKey := "999"

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
		// Add comma before array members,suppress it for the first array member
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

	fmt.Printf("- queryAllTuna:\n%s\n", buffer.String())

	return shim.Success(buffer.Bytes())
}

func (s *SmartContract) addCustomer(
	APIstub shim.ChaincodeStubInterface,
	args []string) sc.Response {

	if len(args) != 3 {
		return shim.Error("Incorrect number of arguments. Expecting 3")
	}

	var customer = Customer{Name: args[1],isBlack: args[2]}

	customerAsBytes, _ := json.Marshal(customer)
	APIstub.PutState(args[0], customerAsBytes)

	return shim.Success(nil)
}

func (s *SmartContract) modifyCustomerStatus(
	APIstub shim.ChaincodeStubInterface,
	args []string) sc.Response {

	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments. Expecting 2")
	}

	customerAsBytes, _ := APIstub.GetState(args[0])
	customer := Customer{}

	json.Unmarshal(customerAsBytes, &customer)
	// customer.isBlack = args[1]
	customer.Name = args[1]

	customerAsBytes, _ = json.Marshal(customer)
	APIstub.PutState(args[0], customerAsBytes)

	return shim.Success(nil)
}

/*
 * The Invoke method is called as a result of an application request to run the Smart Contract "fabcar"
 * The calling application program has also specified the particular smart contract function to be called, with arguments
 */
func (s *SmartContract) Invoke(APIstub shim.ChaincodeStubInterface) sc.Response {
	// Retrieve the requested Smart Contract function and arguments
	function, args := APIstub.GetFunctionAndParameters()

	// Route to the appropriate handler function to interact with the ledger appropriately
	if function == "queryCustomer" {
		return s.queryCustomer(APIstub, args)
	} else if function == "initLedger" {
		return s.initLedger(APIstub)
	} else if function == "addCustomerToBlacklist" {
		return s.addCustomer(APIstub, args)
	} else if function == "queryAllCustomer" {
		return s.queryAllCustomer(APIstub)
	} else if function == "modifyCustomerStatus" {
		return s.modifyCustomerStatus(APIstub, args)
	}

	return shim.Error("Invalid Smart Contract function name.")
}

func main() {
	err := shim.Start(new(SmartContract))
	if err != nil {
		fmt.Printf("Error starting Simple chaincode: %s", err)
	}
}
