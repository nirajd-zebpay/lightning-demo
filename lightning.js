var Request = require("request");
var CryptoJS = require("crypto-js");
var uuidv1 = require("uuid/v1");
var jsonData = require("./config.json");

var url = jsonData.baseUrl;
var zebpay_subscription_key = jsonData.zebpay_subscription_key;
var client_id = jsonData.client_id;
var client_secret_key = jsonData.client_secret_key;
var api_secret_key = jsonData.api_secret_key;
var content_type = "application/json";

function createAPISignature(timestamp, url, data) {
  var separator = "\n";
  payLoadMessage =
    "POST" +
    separator +
    timestamp +
    separator +
    url +
    separator +
    JSON.stringify(data) +
    separator +
    "client_Id:" +
    client_id;
  //console.log(payLoadMessage);
  var hash = CryptoJS.HmacSHA256(
    CryptoJS.enc.Utf8.parse(payLoadMessage),
    CryptoJS.enc.Utf8.parse(api_secret_key)
  );
  return CryptoJS.enc.Base64.stringify(hash);
}

function decodeInvoicePromiseFn(invoice) {
  var decode_data = {
    invoice: invoice
  };

  var decode_url = url + "lightning/decode";
  var timestamp = new Date().getTime();
  var headers = {
    [jsonData.zebpay_subscription_key_header]: zebpay_subscription_key,
    client_id: client_id,
    timestamp: timestamp,
    "Content-Type": content_type,
    ApiSignature: createAPISignature(timestamp, decode_url, decode_data),
    RequestId: uuidv1()
  };

  return new Promise((resolve, reject) => {
    Request.post(
      {
        headers: headers,
        url: decode_url,
        body: JSON.stringify(decode_data)
      },
      (error, response, body) => {
        if (error) {
          return reject(error);
        }
        var return_data = JSON.parse(body);
        return resolve(return_data);
      }
    );
  });
}

module.exports.decodeInvoice = async function(invoice) {
  try {
    return await decodeInvoicePromiseFn(invoice);
  } catch (e) {
    throw e;
  }
};