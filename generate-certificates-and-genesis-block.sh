#
#!/bin/bash
#

export FABRIC_CFG_PATH=${PWD}

function generateCerts (){
  which cryptogen
  if [ "$?" -ne 0 ]; then
    echo "cryptogen tool not found. exiting"
    exit 1
  fi
  echo
  echo "##### Generate certificates using cryptogen tool #########"

  if [ -d "crypto-config" ]; then
    rm -Rf crypto-config
  fi
  set -x
  cryptogen generate --config=./crypto-config.yaml
  res=$?
  set +x
  if [ $res -ne 0 ]; then
    echo "Failed to generate certificates..."
    exit 1
  fi
  echo
}

function replacePrivateKey () {
  ARCH=`uname -s | grep Darwin`
  if [ "$ARCH" == "Darwin" ]; then
    OPTS="-i"
  else
    OPTS="-i"
  fi

  CURRENT_DIR=$PWD
  cd crypto-config/peerOrganizations/regulator.com/ca/
  PRIV_KEY=$(ls *_sk)
  cd "$CURRENT_DIR"
  sed $OPTS "" "s/CA_PRIVATE_KEY/${PRIV_KEY}/g" docker-compose.yaml

  cd crypto-config/peerOrganizations/shipper.com/ca/
  PRIV_KEY=$(ls *_sk)
  cd "$CURRENT_DIR"
  sed $OPTS "" "s/CA2_PRIVATE_KEY/${PRIV_KEY}/g" docker-compose.yaml

  cd crypto-config/peerOrganizations/carrier.com/ca/
  PRIV_KEY=$(ls *_sk)
  cd "$CURRENT_DIR"
  sed $OPTS "" "s/CA2_PRIVATE_KEY/${PRIV_KEY}/g" docker-compose.yaml

  if [ "$ARCH" == "Darwin" ]; then
    rm docker-compose-e2e.yamlt
  fi
}

function generateChannelArtifacts() {
  which configtxgen
  if [ "$?" -ne 0 ]; then
    echo "configtxgen tool not found. exiting"
    exit 1
  fi

  echo "#########  Generating Orderer Genesis block ##############"
  set -x
  configtxgen -profile GlobalOrdererGenesis -outputBlock ./channel-artifacts/genesis.block
  res=$?
  set +x
  if [ $res -ne 0 ]; then
    echo "Failed to generate orderer genesis block..."
    exit 1
  fi
  echo
  echo "### Generating channel configuration transaction 'channel.tx' ###"
  set -x
  configtxgen -profile GlobalLogisticsChannel -outputCreateChannelTx ./channel-artifacts/channel.tx -channelID $CHANNEL_NAME
  res=$?
  set +x
  if [ $res -ne 0 ]; then
    echo "Failed to generate channel configuration transaction..."
    exit 1
  fi

  echo
  echo "#######    Generating anchor peer update for AuthorityMSP   ##########"
  set -x
  configtxgen -profile GlobalLogisticsChannel -outputAnchorPeersUpdate \
  ./channel-artifacts/RegulatorMSPanchors.tx -channelID $CHANNEL_NAME -asOrg RegulatorMSP
  res=$?
  set +x
  if [ $res -ne 0 ]; then
    echo "Failed to generate anchor peer update for AuthorityMSP..."
    exit 1
  fi

  echo
  echo "#######    Generating anchor peer update for ShipperOrg   ##########"
  set -x
  configtxgen -profile GlobalLogisticsChannel -outputAnchorPeersUpdate \
  ./channel-artifacts/ShipperMSPanchors.tx -channelID $CHANNEL_NAME -asOrg ShipperMSP
  res=$?
  set +x
  if [ $res -ne 0 ]; then
    echo "Failed to generate anchor peer update for ShipperMSP..."
    exit 1
  fi

  echo
  echo "#######    Generating anchor peer update for CarrierOrg   ##########"
  set -x
  configtxgen -profile GlobalLogisticsChannel -outputAnchorPeersUpdate \
  ./channel-artifacts/CarrierMSPanchors.tx -channelID $CHANNEL_NAME -asOrg CarrierMSP
  res=$?
  set +x
  if [ $res -ne 0 ]; then
    echo "Failed to generate anchor peer update for CarrierMSP..."
    exit 1
  fi

  echo
}

OS_ARCH=$(echo "$(uname -s|tr '[:upper:]' '[:lower:]'|sed 's/mingw64_nt.*/windows/')-$(uname -m | sed 's/x86_64/amd64/g')" | awk '{print tolower($0)}')
CLI_TIMEOUT=10
CLI_DELAY=3
CHANNEL_NAME="global-common-channel-layer"
COMPOSE_FILE=docker-compose-cli.yaml
COMPOSE_FILE_COUCH=docker-compose-couch.yaml
LANGUAGE=golang
IMAGETAG="latest"

generateCerts
replacePrivateKey
generateChannelArtifacts