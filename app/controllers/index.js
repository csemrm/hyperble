var BluetoothLEController = require("co.lujun.lmbluetoothsdk.BluetoothLEController");
var BluetoothListener = require("co.lujun.lmbluetoothsdk.base.BluetoothLEListener");

var Activity = require('android.app.Activity');
var activity = new Activity(Ti.Android.currentActivity);

var BluetoothAdapter = require("android.bluetooth.BluetoothAdapter");
var BluetoothDevice = require("android.bluetooth.BluetoothDevice");
var BluetoothGattCharacteristic = require("android.bluetooth.BluetoothGattCharacteristic");
var mBTController = new BluetoothLEController(); //.getInstance().build(Context context);
var mBluetoothLEListener = new BluetoothListener({
    onActionStateChanged: function(preState, state) {
        console.log("action state");
    },
    onActionDiscoveryStateChanged: function(discoveryState) {
        console.log("action dicovery state");
    },
    onActionScanModeChanged: function(preScanMode, scanMode) {
        console.log("scan mode");
    },
    onBluetoothServiceStateChanged: function(state) {
        console.log("blue state changed: " + state);
    },
    onActionDeviceFound: function(device) {
        console.log("device found: " + device.getName() + " " + device.getAddress());
        btc.cancelScan();
        btc.connect(device.getAddress());
    },
    onReadData: function( data) {
        console.log("data read: " + data );
    },
    onWriteData: function(characteristic) {
        console.log("data write: " + characteristic);
    },
    onDataChanged: function(characteristic) {
        console.log("data changed: " + characteristic);
    }
});

var btc = mBTController.build(activity);
btc.setBluetoothListener(mBluetoothLEListener);

function onClickScan(e) {
    if (btc.isAvailable()) {
        if (btc.isEnabled()) {
            //btc.cancelScan();
            btc.startScan();
        } else {
            alert("Not enabled");
            btc.openBluetooth();
        }
    } else {
        alert("Not available");
    }

}

$.btn_scan.addEventListener("click", onClickScan);
$.index.open();
