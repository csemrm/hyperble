(function(container) {
    var BluetoothLEController = require("co.lujun.lmbluetoothsdk.BluetoothLEController");
    var BluetoothListener = require("co.lujun.lmbluetoothsdk.base.BluetoothLEListener");
    var Activity = require('android.app.Activity');
    var activity = new Activity(Ti.Android.currentActivity);
    var BluetoothAdapter = require("android.bluetooth.BluetoothAdapter");
    var BluetoothDevice = require("android.bluetooth.BluetoothDevice");
    var BluetoothGattCharacteristic = require("android.bluetooth.BluetoothGattCharacteristic");
    var mBTController = new BluetoothLEController();
    var btc = mBTController.build(activity);
    var isRunning = false;
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
    var devices = [];

    btc.setBluetoothListener(mBluetoothLEListener);
    
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
    
    function onWriteData(characteristic) {
        console.log("data write: " + characteristic);
    }

    function onDataChanged(characteristic) {
        console.log("data changed: " + characteristic);
    }

    

    function onActionDeviceFound(device) {
        if (devices.indexOf(device.getAddress()) == -1) {
            var v = Ti.UI.createView({
                height: 40,
                left: 0,
                right: 0,
                udid: device.getAddress(),
                borderColor: "#999",
                borderWidth: 1,
                borderRadius: 4
            });
            var l = Ti.UI.createLabel({
                text: "Found: " + device.getName() + " " + device.getAddress(),
                color: "#000",
                touchEnabled: false
            });
            v.add(l);
            $.view_scroller.add(v);
            devices.push(device.getAddress());
        }
    }

    function onReadData(characteristic) {
        var l = Ti.UI.createLabel({
            text: "UDID: " + characteristic.getUuid() + " - Data: " + characteristic.getValue(),
            color: "#000"
        });
        $.view_scroller_char.add(l);

        console.log("data flag: " + characteristic.getProperties());
    }



    function onClickScan(e) {
        if (btc.isAvailable()) {
            if (btc.isEnabled()) {
                if (!isRunning) {
                    btc.startScan();
                    $.btn_scan.title = "Stop";
                } else {
                    $.btn_scan.title = "Start";
                    btc.cancelScan();
                }
                isRunning = !isRunning;
            } else {
                alert("Not enabled");
                btc.openBluetooth();
            }
        } else {
            alert("Not available");
        }

    }

    function onClickDevice(e) {
        if (e.source.udid) {
            $.view_scroller_char.removeAllChildren();
            btc.cancelScan();
            $.btn_scan.title = "Start";
            btc.connect(e.source.udid);
            isRunning = false;
        }
    }

    $.view_scroller.addEventListener("click", onClickDevice);
    $.btn_scan.addEventListener("click", onClickScan);
    $.index.open();
})();
