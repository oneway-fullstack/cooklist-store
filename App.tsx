/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {StyleSheet, useColorScheme, View} from 'react-native';

import WebView, {WebViewMessageEvent} from 'react-native-webview';
import CookieManager from '@react-native-cookies/cookies';

const ORDER_DETAIL_API_ENDPOINT =
  process.env.ORDER_DETAIL_API_ENDPOINT ||
  'https://api-gateway.walmart.com/v3/orders/';

function App(): React.JSX.Element {
  const INJECTED_JAVASCRIPT = `(function() {
    var oldOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function() {
        this.addEventListener("load", function() {
            var message = {"status" : this.status, "response" : this.response, "responseURL" : this.responseURL}
            window.ReactNativeWebView.postMessage(JSON.stringify(message));
        });
        oldOpen.apply(this, arguments);
    };
  })();`;

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [uri, setUri] = useState('https://www.walmart.com/account/login');
  const [orders, setOrders] = useState([]);
  const [orderFullInfos, setFullOrderInfo] = useState<any[]>([]);

  useEffect(() => {
    const checkLogin = async () => {
      const cookies = await CookieManager.get('https://www.walmart.com');
      const isLoggedIn = Object.keys(cookies).some(
        cookieKey => cookies[cookieKey].name === 'customer',
      );
      setIsLoggedIn(isLoggedIn);
    };

    checkLogin();
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      console.log('# LOGGED IN #');
      // redirect to /orders
      setUri('https://www.walmart.com/orders');
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const getFullOrdersInfo = async (orders: any[]) => {
      const fullData = [];
      for await (const order of orders) {
        try {
          const response = await fetch(
            `${ORDER_DETAIL_API_ENDPOINT}/${order['purchaseOrderId']}/?shipNode=${order['shipNode']}`,
          );
          const fullRes = await response.json();
          console.log('# ORDER DETAILS #', fullRes);
          fullData.push(fullRes);
        } catch (error) {
          console.error(error);
        }
      }
      console.log('# END OF ORDER LIST #', fullData);
      setFullOrderInfo(fullData);
    };

    getFullOrdersInfo(orders);
  }, [orders]);

  const handleWebViewNavigationStateChange = async (navState: any) => {
    const cookies = await CookieManager.get('https://www.walmart.com');
    const isLoggedIn = Object.keys(cookies).some(
      cookieKey => cookies[cookieKey].name === 'customer',
    );

    setIsLoggedIn(isLoggedIn);
  };

  const handleWebViewOnMessage = (event: WebViewMessageEvent) => {
    const {data} = event.nativeEvent;
    const {response, responseURL, status} = JSON.parse(data);
    if (responseURL?.indexOf('purchaseHistory') > -1 && status === 200) {
      console.log('# ORDER LIST #', response);
      setOrders(response);
    }
  };

  return (
    <View style={{flex: 1}}>
      <WebView
        source={{uri}}
        onNavigationStateChange={handleWebViewNavigationStateChange}
        javaScriptEnabledAndroid={true}
        injectedJavaScript={INJECTED_JAVASCRIPT}
        onMessage={handleWebViewOnMessage}
      />
    </View>
  );
}

export default App;
