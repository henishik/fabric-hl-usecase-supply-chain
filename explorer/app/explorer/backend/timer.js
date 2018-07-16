/*
 Copyright ONECHAIN 2017 All Rights Reserved.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */
var Metrics = require('./metrics')
var BlockListener = require('./BlockListener')
var BlockScanner = require('./BlockScanner')



var blockPerMinMeter = Metrics.blockMetrics
var txnPerSecMeter = Metrics.txnPerSecMeter
var txnPerMinMeter = Metrics.txMetrics

async function start(platform, persistance, broadcaster) {

        blockScanner = new BlockScanner(platform, persistance, broadcaster);
        blockListener = new BlockListener(blockScanner);

        setInterval(function () {
            blockPerMinMeter.push(0)
            txnPerSecMeter.push(0)
            txnPerMinMeter.push(0)
        }, 500);

        //Sync Block
        blockListener.emit('syncChannels');
        blockListener.emit('syncChaincodes');
        blockListener.emit('syncPeerlist');
		// ====================Orderer BE-303=====================================
		blockListener.emit('syncOrdererlist');
		// ====================Orderer BE-303=====================================
        blockListener.emit('syncBlock');
        blockListener.emit('syncChannelEventHubBlock');
}


exports.start = start

