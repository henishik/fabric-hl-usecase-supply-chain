const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
const port = process.env.PORT || 9998
const router = express.Router()

var Fabric_Client = require('fabric-client');
var path = require('path');
var util = require('util');
var os = require('os');
var fabric_client = new Fabric_Client();
var channel = fabric_client.newChannel('global-common-channel-layer');
var peer = fabric_client.newPeer('grpc://localhost:7051');
channel.addPeer(peer);
var member_user = null;
var store_path = path.join(__dirname, 'hfc-key-store');
var order = fabric_client.newOrderer('grpc://localhost:7050')
channel.addOrderer(order);
var tx_id = null;

router.get('/', function(req, res) {
  res.json({ message: 'hooray! welcome to our api!' })
});

router.get('/shipment/status/update/:id/:current_status', function(req, res) {
	// UPDATE
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:9999');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Credentials', true);

	var target_shipment_id = req.params.id
	var currentStatus = req.params.current_status

	Fabric_Client.newDefaultKeyValueStore(
		// create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting
		{ path: store_path }).then((state_store) => {

		// assign the store to the fabric client
		fabric_client.setStateStore(state_store);
		var crypto_suite = Fabric_Client.newCryptoSuite();
		// use the same location for the state store (where the users' certificate are kept)
		// and the crypto store (where the users' keys are kept)
		var crypto_store = Fabric_Client.newCryptoKeyStore({path: store_path});
		crypto_suite.setCryptoKeyStore(crypto_store);
		fabric_client.setCryptoSuite(crypto_suite);
	
		// get the enrolled user from persistence, this user will sign all requests
		return fabric_client.getUserContext('user1', true);
	}).then((user_from_store) => {

		if (user_from_store && user_from_store.isEnrolled()) {
			console.log('Successfully loaded user1 from persistence');
			member_user = user_from_store;
		} else {
			throw new Error('Failed to get user1.... run registerUser.js');
		}
	
		// get a transaction id object based on the current user assigned to fabric client
		tx_id = fabric_client.newTransactionID();

		var nextStatusString = ""
    if (currentStatus === "waiting for carrier") {
			nextStatusString = "waiting for pickup"
    } else if (currentStatus === "waiting for pickup") {
			nextStatusString = "waiting for delivery"
    } else if (currentStatus === "waiting for delivery") {
			nextStatusString = "waiting for confirm POD"
    } else if (currentStatus === "waiting for confirm POD") {
			nextStatusString = "waiting for authority approval"
    } else if (currentStatus === "waiting for authority approval") {
			nextStatusString = "waiting for payment"
    } else if (currentStatus === "waiting for payment") {
			nextStatusString = "TRANSACTION DONE"
		}
	
		var request = {
			//targets: let default to the peer assigned to the client
			chaincodeId: 'mycc',
			fcn: 'updateShipmentStatus',
			args: [target_shipment_id+'', nextStatusString],
			chainId: 'global-common-channel-layer',
			txId: tx_id
		};
	
		// send the transaction proposal to the peers
		return channel.sendTransactionProposal(request);
	}).then((results) => {

		var proposalResponses = results[0];
		var proposal = results[1];
		let isProposalGood = false;

		if (proposalResponses && proposalResponses[0].response &&
			proposalResponses[0].response.status === 200) {
				isProposalGood = true;
				console.log('Transaction proposal was good');
			} else {
				console.error('Transaction proposal was bad');
			}
		if (isProposalGood) {
			console.log(util.format(
				'Successfully sent Proposal and received ProposalResponse: Status - %s, message - "%s"',
				proposalResponses[0].response.status, proposalResponses[0].response.message));
			
			// build up the request for the orderer to have the transaction committed
			var request = {
				proposalResponses: proposalResponses,
				proposal: proposal
			};
		
			// set the transaction listener and set a timeout of 30 sec
			// if the transaction did not get committed within the timeout period,
			// report a TIMEOUT status
			var transaction_id_string = tx_id.getTransactionID(); //Get the transaction ID string to be used by the event processing
			var promises = [];
		
			var sendPromise = channel.sendTransaction(request);
			promises.push(sendPromise);
			//we want the send transaction first, so that we know where to check status
		
			// get an eventhub once the fabric client has a user assigned. The user
			// is required bacause the event registration must be signed
			let event_hub = fabric_client.newEventHub();
			event_hub.setPeerAddr('grpc://localhost:7053');
		
			// using resolve the promise so that result status may be processed
			// under the then clause rather than having the catch clause process
			// the status
			let txPromise = new Promise((resolve, reject) => {
				let handle = setTimeout(() => {
					event_hub.disconnect();
					resolve({event_status : 'TIMEOUT'}); //we could use reject(new Error('Trnasaction did not complete within 30 seconds'));
				}, 3000);
				event_hub.connect();

				event_hub.registerTxEvent(transaction_id_string, (tx, code) => {
					// this is the callback for transaction event status
					// first some clean up of event listener
					clearTimeout(handle);
					event_hub.unregisterTxEvent(transaction_id_string);
					event_hub.disconnect();
				
					// now let the application know what happened
					var return_status = {event_status : code, tx_id : transaction_id_string};
					if (code !== 'VALID') {
						console.error('The transaction was invalid, code = ' + code);
						resolve(return_status); // we could use reject(new Error('Problem with the tranaction, event status ::'+code));
					} else {
						console.log('The transaction has been committed on peer ' + event_hub._ep._endpoint.addr);
						resolve(return_status);
					}
				}, (err) => {
					//this is the callback if something goes wrong with the event registration or processing
					reject(new Error('There was a problem with the eventhub ::'+err));
				});
			});
			promises.push(txPromise);
		
			return Promise.all(promises);

		} else {
			console.error('Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...');
			throw new Error('Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...');
		}
	}).then((results) => {

		console.log('Send transaction promise and event listener promise have completed');
		// check the results in the order the promises were added to the promise all list
		if (results && results[0] && results[0].status === 'SUCCESS') {
			console.log('Successfully sent transaction to the orderer.');
		} else {
			console.error('Failed to order the transaction. Error code: ' + response.status);
		}
	
		if(results && results[1] && results[1].event_status === 'VALID') {
			console.log('Successfully committed the change to the ledger by the peer');
			console.log(results)

  		res.json(results)
		} else {
			console.log('Transaction failed to be committed to the ledger due to ::'+results[1].event_status);
		}

	}).catch((err) => {
		console.error('Failed to invoke successfully :: ' + err);
	});
});

router.get('/shipment/assigncarrier/:id', function(req, res) {
	// UPDATE
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:9999');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Credentials', true);

	var target_shipment_id = req.params.id

	Fabric_Client.newDefaultKeyValueStore({ path: store_path
	}).then((state_store) => {
		fabric_client.setStateStore(state_store);
		var crypto_suite = Fabric_Client.newCryptoSuite();
		var crypto_store = Fabric_Client.newCryptoKeyStore({path: store_path});
		crypto_suite.setCryptoKeyStore(crypto_store);
		fabric_client.setCryptoSuite(crypto_suite);
	
		return fabric_client.getUserContext('user1', true);
	}).then((user_from_store) => {

		if (user_from_store && user_from_store.isEnrolled()) {
			console.log('Successfully loaded user1 from persistence');
			member_user = user_from_store;
		} else {
			throw new Error('Failed to get user1.... run registerUser.js');
		}
	
		tx_id = fabric_client.newTransactionID();
		var request = {
			chaincodeId: 'mycc',
			fcn: 'assignCarrier',
			args: [target_shipment_id+''],
			chainId: 'global-common-channel-layer',
			txId: tx_id
		};
	
		return channel.sendTransactionProposal(request);
	}).then((results) => {

		var proposalResponses = results[0];
		var proposal = results[1];
		let isProposalGood = false;
		if (proposalResponses && proposalResponses[0].response &&
			proposalResponses[0].response.status === 200) {
				isProposalGood = true;
				console.log('Transaction proposal was good');
			} else {
				console.error('Transaction proposal was bad');
			}
		if (isProposalGood) {
			console.log(util.format(
				'Successfully sent Proposal and received ProposalResponse: Status - %s, message - "%s"',
				proposalResponses[0].response.status, proposalResponses[0].response.message));
			
			var request = {
				proposalResponses: proposalResponses,
				proposal: proposal
			};
		
			var transaction_id_string = tx_id.getTransactionID();
			var promises = [];
		
			var sendPromise = channel.sendTransaction(request);
			promises.push(sendPromise);
			let event_hub = fabric_client.newEventHub();
			event_hub.setPeerAddr('grpc://localhost:7053');
		
			let txPromise = new Promise((resolve, reject) => {
				let handle = setTimeout(() => {
					event_hub.disconnect();
					resolve({event_status : 'TIMEOUT'});
				}, 3000);
				event_hub.connect();
				event_hub.registerTxEvent(transaction_id_string, (tx, code) => {
					clearTimeout(handle);
					event_hub.unregisterTxEvent(transaction_id_string);
					event_hub.disconnect();
				
					var return_status = {event_status : code, tx_id : transaction_id_string};
					if (code !== 'VALID') {
						console.error('The transaction was invalid, code = ' + code);
						resolve(return_status);
					} else {
						console.log('The transaction has been committed on peer ' + event_hub._ep._endpoint.addr);
						resolve(return_status);
					}
				}, (err) => {
					reject(new Error('There was a problem with the eventhub ::'+err));
				});
			});
			promises.push(txPromise);
		
			return Promise.all(promises);
		} else {
			console.error('Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...');
			throw new Error('Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...');
		}
	}).then((results) => {
		console.log('Send transaction promise and event listener promise have completed');
		if (results && results[0] && results[0].status === 'SUCCESS') {
			console.log('Successfully sent transaction to the orderer.');
		} else {
			console.error('Failed to order the transaction. Error code: ' + response.status);
		}
	
		if(results && results[1] && results[1].event_status === 'VALID') {
			console.log('Successfully committed the change to the ledger by the peer');
			console.log(results)
  		res.json(results)
		} else {
			console.log('Transaction failed to be committed to the ledger due to ::'+results[1].event_status);
		}
	}).catch((err) => {
		console.error('Failed to invoke successfully :: ' + err);
	});
})


router.get('/shipment/create', function(req, res) {
	// UPDATE
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:9999');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Credentials', true);

	Fabric_Client.newDefaultKeyValueStore({ path: store_path
	}).then((state_store) => {
		fabric_client.setStateStore(state_store);
		var crypto_suite = Fabric_Client.newCryptoSuite();
		var crypto_store = Fabric_Client.newCryptoKeyStore({path: store_path});
		crypto_suite.setCryptoKeyStore(crypto_store);
		fabric_client.setCryptoSuite(crypto_suite);
	
		return fabric_client.getUserContext('user1', true);
	}).then((user_from_store) => {

		if (user_from_store && user_from_store.isEnrolled()) {
			console.log('Successfully loaded user1 from persistence');
			member_user = user_from_store;
		} else {
			throw new Error('Failed to get user1.... run registerUser.js');
		}
	
		tx_id = fabric_client.newTransactionID();
		console.log("Assigning transaction_id: ", tx_id._transaction_id);
		var request = {
			chaincodeId: 'mycc',
			fcn: 'createShipment',
			args: [''],
			chainId: 'global-common-channel-layer',
			txId: tx_id
		};
	
		return channel.sendTransactionProposal(request);
	}).then((results) => {

		var proposalResponses = results[0];
		var proposal = results[1];
		let isProposalGood = false;
		if (proposalResponses && proposalResponses[0].response &&
			proposalResponses[0].response.status === 200) {
				isProposalGood = true;
				console.log('Transaction proposal was good');
			} else {
				console.error('Transaction proposal was bad');
			}
		if (isProposalGood) {
			console.log(util.format(
				'Successfully sent Proposal and received ProposalResponse: Status - %s, message - "%s"',
				proposalResponses[0].response.status, proposalResponses[0].response.message));
			
			var request = {
				proposalResponses: proposalResponses,
				proposal: proposal
			};
		
			var transaction_id_string = tx_id.getTransactionID();
			var promises = [];
			var sendPromise = channel.sendTransaction(request);
			promises.push(sendPromise);
		
			let event_hub = fabric_client.newEventHub();
			event_hub.setPeerAddr('grpc://localhost:7053');
		
			let txPromise = new Promise((resolve, reject) => {
				let handle = setTimeout(() => {
					event_hub.disconnect();
					resolve({event_status : 'TIMEOUT'});
				}, 3000);
				event_hub.connect();
				event_hub.registerTxEvent(transaction_id_string, (tx, code) => {
					clearTimeout(handle);
					event_hub.unregisterTxEvent(transaction_id_string);
					event_hub.disconnect();
				
					var return_status = {event_status : code, tx_id : transaction_id_string};
					if (code !== 'VALID') {
						console.error('The transaction was invalid, code = ' + code);
						resolve(return_status);
					} else {
						console.log('The transaction has been committed on peer ' + event_hub._ep._endpoint.addr);
						resolve(return_status);
					}
				}, (err) => {
					reject(new Error('There was a problem with the eventhub ::'+err));
				});
			});
			promises.push(txPromise);
		
			return Promise.all(promises);
		} else {
			console.error('Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...');
			throw new Error('Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...');
		}
	}).then((results) => {
		console.log('Send transaction promise and event listener promise have completed');
		if (results && results[0] && results[0].status === 'SUCCESS') {
			console.log('Successfully sent transaction to the orderer.');
		} else {
			console.error('Failed to order the transaction. Error code: ' + response.status);
		}
	
		if(results && results[1] && results[1].event_status === 'VALID') {
			console.log('Successfully committed the change to the ledger by the peer');
			console.log(results)
  		res.json(results)
		} else {
			console.log('Transaction failed to be committed to the ledger due to ::'+results[1].event_status);
		}
	}).catch((err) => {
		console.error('Failed to invoke successfully :: ' + err);
	});
});

function queryMain(args, funcName, res) {
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:9999');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Credentials', true);

  Fabric_Client.newDefaultKeyValueStore({ path: store_path
  }).then((state_store) => {
    // create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting
  	// assign the store to the fabric client
  	fabric_client.setStateStore(state_store);
  	var crypto_suite = Fabric_Client.newCryptoSuite();
  	// use the same location for the state store (where the users' certificate are kept)
  	// and the crypto store (where the users' keys are kept)
  	var crypto_store = Fabric_Client.newCryptoKeyStore({path: store_path});
  	crypto_suite.setCryptoKeyStore(crypto_store);
  	fabric_client.setCryptoSuite(crypto_suite);

  	// get the enrolled user from persistence, this user will sign all requests
  	return fabric_client.getUserContext('user1', true);
  }).then((user_from_store) => {
  	if (user_from_store && user_from_store.isEnrolled()) {
  		console.log('Successfully loaded user1 from persistence');
  		member_user = user_from_store;
  	} else {
  		throw new Error('Failed to get user1.... run registerUser.js');
		}

  	const request = {
  		chaincodeId: 'mycc',
  		fcn: funcName,
  		args: [args]
  	};

  	// send the query proposal to the peer
  	return channel.queryByChaincode(request);
  }).then((query_responses) => {
    console.log("Query has completed, checking results");

  	if (query_responses && query_responses.length == 1) {
  	  // query_responses could have more than one  results if there multiple peers were used as targets
  		if (query_responses[0] instanceof Error) {
  			console.error("error from query = ", query_responses[0]);
  		} else {
  			console.log("Response is ", query_responses[0].toString());
  			res.json(JSON.parse(query_responses[0].toString()))
  		}
  	} else {
  		console.log("No payloads were returned from query");
  	}
  }).catch((err) => {
  	console.error('Failed to query successfully :: ' + err);
  });
}

router.get('/shipment/list/shipper/:id', function(req, res) {
	// QUERY
	var shipper_id = req.params.id;
	queryMain(shipper_id+'', 'queryShipmentsByShipperId', res)
})

router.get('/location/log/:shipment_id', function(req, res) {
	// UPDATE
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:9999');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Credentials', true);

	Fabric_Client.newDefaultKeyValueStore({ path: store_path
	}).then((state_store) => {
		fabric_client.setStateStore(state_store);
		var crypto_suite = Fabric_Client.newCryptoSuite();
		var crypto_store = Fabric_Client.newCryptoKeyStore({path: store_path});
		crypto_suite.setCryptoKeyStore(crypto_store);
		fabric_client.setCryptoSuite(crypto_suite);
	
		return fabric_client.getUserContext('user1', true);
	}).then((user_from_store) => {

		if (user_from_store && user_from_store.isEnrolled()) {
			console.log('Successfully loaded user1 from persistence');
			member_user = user_from_store;
		} else {
			throw new Error('Failed to get user1.... run registerUser.js');
		}
	
		tx_id = fabric_client.newTransactionID();
		console.log("Assigning transaction_id: ", tx_id._transaction_id);
		var request = {
			chaincodeId: 'mycc',
			fcn: 'logLocationForShipment',
			args: ['1', '1', '1'],
			chainId: 'global-common-channel-layer',
			txId: tx_id
		};
	
		return channel.sendTransactionProposal(request);
	}).then((results) => {
		var proposalResponses = results[0];
		var proposal = results[1];
		let isProposalGood = false;
		if (proposalResponses && proposalResponses[0].response &&
			proposalResponses[0].response.status === 200) {
				isProposalGood = true;
				console.log('Transaction proposal was good');
			} else {
				console.error('Transaction proposal was bad');
			}
		if (isProposalGood) {
			console.log(util.format(
				'Successfully sent Proposal and received ProposalResponse: Status - %s, message - "%s"',
				proposalResponses[0].response.status, proposalResponses[0].response.message));
			
			var request = {
				proposalResponses: proposalResponses,
				proposal: proposal
			};
		
			var transaction_id_string = tx_id.getTransactionID();
			var promises = [];
		
			var sendPromise = channel.sendTransaction(request);
			promises.push(sendPromise);
		
			let event_hub = fabric_client.newEventHub();
			event_hub.setPeerAddr('grpc://localhost:7053');
		
			let txPromise = new Promise((resolve, reject) => {
				let handle = setTimeout(() => {
					event_hub.disconnect();
					resolve({event_status : 'TIMEOUT'});
				}, 3000);
				event_hub.connect();
				event_hub.registerTxEvent(transaction_id_string, (tx, code) => {
					clearTimeout(handle);
					event_hub.unregisterTxEvent(transaction_id_string);
					event_hub.disconnect();
				
					var return_status = {event_status : code, tx_id : transaction_id_string};
					if (code !== 'VALID') {
						console.error('The transaction was invalid, code = ' + code);
						resolve(return_status);
					} else {
						console.log('The transaction has been committed on peer ' + event_hub._ep._endpoint.addr);
						resolve(return_status);
					}
				}, (err) => {
					reject(new Error('There was a problem with the eventhub ::'+err));
				});
			});
			promises.push(txPromise);
		
			return Promise.all(promises);
		} else {
			console.error('Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...');
			throw new Error('Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...');
		}
	}).then((results) => {
		console.log('Send transaction promise and event listener promise have completed');
		if (results && results[0] && results[0].status === 'SUCCESS') {
			console.log('Successfully sent transaction to the orderer.');
		} else {
			console.error('Failed to order the transaction. Error code: ' + response.status);
		}
	
		if(results && results[1] && results[1].event_status === 'VALID') {
			console.log('Successfully committed the change to the ledger by the peer');
			console.log(results)
  		res.json(results)
		} else {
			console.log('Transaction failed to be committed to the ledger due to ::'+results[1].event_status);
		}
	}).catch((err) => {
		console.error('Failed to invoke successfully :: ' + err);
	});
}
)
router.get('/location/get/:shipmentKey', function(req, res) {
	queryMain('1', 'queryAllLocationsForShipment', res)
})

router.get('/shipment/list/carrier', function(req, res) {
	queryMain('carrier_id_921', 'queryShipmentsByCarrierId', res)
})

router.get('/list/shipment', function(req, res) {
	queryMain('', 'queryAllShipments', res)
});

app.use('/api', router)
app.listen(port)