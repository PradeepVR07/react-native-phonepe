import React from 'react';
import { StyleSheet, Text, View, Button, NativeModules, NativeEventEmitter} from 'react-native';
import uuid from 'react-native-uuid';
import {decode as atob, encode as btoa} from 'base-64'
import { Buffer } from 'buffer';
global.Buffer = Buffer; 
import { sha256, sha224 } from 'js-sha256'

class PhonePeCheckout extends React.Component
{
  static open(dataToEncode,checksum,endPoint,successCallback,failureCallback)
  {
    console.log("Data 1 = ", dataToEncode);
    console.log("Data 2 = ", checksum);
    console.log("Data 3 = ", endPoint);

    var redirectURL;
    console.log("Request payload is " +dataToEncode);
    var encodedString = btoa(JSON.stringify(dataToEncode));
    console.log("Encoded payload request "+encodedString);

    var checksum = sha256(encodedString+endPoint+'8289e078-be0b-484d-ae60-052f117f8deb')+'###1';
    console.log("Checksum is "+checksum);

    fetch('https://mercury-uat.phonepe.com/v4/debit', 
    {
      method: "POST",
      body: JSON.stringify({
      request: encodedString
    }),
    headers: 
    {
      'Content-Type': 'application/json',
      'x-verify': checksum
    },
    })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        alert("Something went wrong");
      //  throw new Error('Something went wrong');
      }
    })
    .then((responseJson) => 
    {
      console.log("Redirection url is " +responseJson.data.redirectURL);
      redirectURL = responseJson.data.redirectURL;
      NativeModules.MyModule.navigateToNative(''+redirectURL,successCallback,failureCallback);
    })
    .catch((error) => 
    {
      console.error("Error is "+error);
    });
  }
  render(){
  return (
  <Button title="PhonePe / BHIM UPI" onPress = {() => {
  var transactionId = uuid.v4();
  var phonpeversioncode;
  console.log("UUID 1234 is " + transactionId);
  const eventEmitter = new NativeEventEmitter(NativeModules.MyModule);
    this.eventListener = eventEmitter.addListener('EventReminder', (event) => {
      phonpeversioncode = event.PhonePeVersionCode;
       console.log("PhonePe version code is " +phonpeversioncode) 
    });
  console.log("Outside is = " +phonpeversioncode);
  var dataToEncode = 
  {
    "merchantId": "M2306160483220675579140",
    "transactionId": transactionId,
    "amount": 100,
    "merchantOrderId": "OD1234",
    "paymentScope": "PHONEPE", 
    "deviceContext":
    {  
      "phonePeVersionCode": 303391
    }
  };
  var endPoint = "/v4/debit";
  function successCallback(data)
  {
      console.log("React Native alert : "+data);
      window.alert("React Native alert : "+data);
  }
  function failureCallback(data)
  {
      console.log("React Native alert : "+data);
      window.alert("React Native alert : "+data);
  }
    PhonePeCheckout.open(dataToEncode,"checksum",endPoint,successCallback,failureCallback); 
    }}></Button>
  );
  }
}
export default PhonePeCheckout;