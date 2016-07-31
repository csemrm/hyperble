var BluetoothLEController = require("co.lujun.lmbluetoothsdk.BluetoothLEController");
var BluetoothListener = require("co.lujun.lmbluetoothsdk.base.BluetoothLEListener");
var Activity = require('android.app.Activity');
var activity = new Activity(Ti.Android.currentActivity);
var BluetoothAdapter = require("android.bluetooth.BluetoothAdapter");
var BluetoothDevice = require("android.bluetooth.BluetoothDevice");
var BluetoothGattCharacteristic = require("android.bluetooth.BluetoothGattCharacteristic");
var mBTController = new BluetoothLEController();
var btc = mBTController.build(activity);
var mBluetoothLEListener = new BluetoothListener({
    onActionStateChanged: onActionStateChanged,
    onActionDiscoveryStateChanged: onActionDiscoveryStateChanged,
    onActionScanModeChanged: onActionScanModeChanged,
    onBluetoothServiceStateChanged: onBluetoothServiceStateChanged,
    onActionDeviceFound: onActionDeviceFound,
    onReadData: onReadData,
    onWriteData: onWriteData,
    onDataChanged: onDataChanged
});

function onActionStateChanged(preState, state) {
    console.log("action state");
}

function onActionDiscoveryStateChanged(discoveryState) {
    console.log("action dicovery state");
}

function onActionScanModeChanged(preScanMode, scanMode) {
    console.log("scan mode");
}

function onBluetoothServiceStateChanged(state) {
    console.log("blue state changed: " + state);
}

function onActionDeviceFound(device) {
    var l = Ti.UI.createLabel({
        text: "Found: " + device.getName() + " " + device.getAddress(),
        color:"#000"
    });
    $.view_scroller.add(l);
    console.log("device found: " + device.getName() + " " + device.getAddress());
    btc.cancelScan();
    btc.connect(device.getAddress());
}

function onReadData(characteristic) {
    console.log("data read: " + characteristic.getUuid() + " data: " + characteristic.getValue());
    console.log("data flag: " + characteristic.getProperties());
}

function onWriteData(characteristic) {
    console.log("data write: " + characteristic);
}

function onDataChanged(characteristic) {
    console.log("data changed: " + characteristic);
}

btc.setBluetoothListener(mBluetoothLEListener);

function onClickScan(e) {
    if (btc.isAvailable()) {
        if (btc.isEnabled()) {
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
