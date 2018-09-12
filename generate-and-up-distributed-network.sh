#
#!/bin/bash
#

export FABRIC_CFG_PATH=${PWD}
# Import Generate certificates and genesis block function 
. generate-certificates-and-genesis-block.sh

function checkPrereqs() {
  # Do some basic sanity checking to make sure that the appropriate versions of fabric
  # binaries/images are available.  In the future, additional checking for the presence
  # of go or other items could be added.
  # Note, we check configtxlator externally because it does not require a config file, and peer in the
  # docker image because of FAB-8551 that makes configtxlator return 'development version' in docker
  LOCAL_VERSION=$(configtxlator version | sed -ne 's/ Version: //p')
  DOCKER_IMAGE_VERSION=$(docker run --rm hyperledger/fabric-tools:$IMAGETAG peer version | sed -ne 's/ Version: //p'|head -1)

  echo "LOCAL_VERSION=$LOCAL_VERSION"
  echo "DOCKER_IMAGE_VERSION=$DOCKER_IMAGE_VERSION"

  if [ "$LOCAL_VERSION" != "$DOCKER_IMAGE_VERSION" ] ; then
     echo "=================== WARNING ==================="
     echo "  Local fabric binaries and docker images are  "
     echo "  out of  sync. This may cause problems.       "
     echo "==============================================="
  fi

  for UNSUPPORTED_VERSION in $BLACKLISTED_VERSIONS ; do
     echo "$LOCAL_VERSION" | grep -q $UNSUPPORTED_VERSION
     if [ $? -eq 0 ] ; then
       echo "ERROR! Local Fabric binary version of $LOCAL_VERSION does not match this newer version of BYFN and is unsupported. Either move to a later version of Fabric or checkout an earlier version of fabric-samples."
       exit 1
     fi

     echo "$DOCKER_IMAGE_VERSION" | grep -q $UNSUPPORTED_VERSION
     if [ $? -eq 0 ] ; then
       echo "ERROR! Fabric Docker image version of $DOCKER_IMAGE_VERSION does not match this newer version of BYFN and is unsupported. Either move to a later version of Fabric or checkout an earlier version of fabric-samples."
       exit 1
     fi
  done
}

function networkUp () {
  checkPrereqs

  if [ ! -d "crypto-config" ]; then
    generateCerts
    replacePrivateKey
    generateChannelArtifacts
  fi

  if [ "${IF_COUCHDB}" == "couchdb" ]; then
    IMAGE_TAG=$IMAGETAG docker-compose -f $COMPOSE_FILE -f $COMPOSE_FILE_COUCH up -d 2>&1
  else
    IMAGE_TAG=$IMAGETAG docker-compose -f $COMPOSE_FILE up -d 2>&1
  fi
  if [ $? -ne 0 ]; then
    echo "ERROR !!!! Unable to start network"
    exit 1
  fi

  docker exec cli scripts/script.sh $CHANNEL_NAME $CLI_DELAY $LANGUAGE $CLI_TIMEOUT

  if [ $? -ne 0 ]; then
    echo "ERROR !!!! Test failed"
    exit 1
  fi

  CURRENT_DIR=$PWD
  cd middleware
  rm -rf hfc-key-store
  kill $(lsof -t -i:8080)

  node enrollAdmin.js
  node registerUser.js
  node index.js &
  open http://localhost:9998/api/list/shipment
}

OS_ARCH=$(echo "$(uname -s|tr '[:upper:]' '[:lower:]'|sed 's/mingw64_nt.*/windows/')-$(uname -m | sed 's/x86_64/amd64/g')" | awk '{print tolower($0)}')
CLI_TIMEOUT=10
CLI_DELAY=3
CHANNEL_NAME="global-common-channel-layer"
COMPOSE_FILE=docker-compose.yaml
LANGUAGE=golang
IMAGETAG="latest"

# Main Function
networkUp