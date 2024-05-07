# React Native App

## Introduction

This repository contains a React Native app that [briefly describe what your app does or its purpose].

## Prerequisites

Before running the app, ensure you have the following installed:

- Node.js
- npm (Node Package Manager)
- React Native CLI
- Android Studio (for Android development)

Please refer to this guide to setup the environment.
https://reactnative.dev/docs/environment-setup?guide=native

## Installation

1. Clone this repository to your local machine:

2. Navigate to the project directory:

3. Install dependencies:

4. Run the project

yarn start

It will display command lines to choose which devices you want to run the project on.

## Achievements

1. Set up the project with react-native-webview and react-native-community/cookies.
2. Display Walmart in webview.
3. Detect the login and write the login in the console.
4. Redirect to the orders page in webview.
5. Intercept the webview cookies and orders API (purchaseHistory) to get the orders list.
6. Based on the retrieved orders list, call the orders detail API endpoint to retrieve the detailed info of the order.
7. After retrieving the last order info, write the full orders data in the console.

## Issues

1. Pagination feature is missing.
   For this test purpose, I created a new customer account, and it doesn't have the paginated orders history.
   This can be achieved by injecting JavaScript into the webview, especially clicking pagination controls, which is basic scraping functionality.

2. Parsing the cookies
   Walmart might use a specific algorithm to determine URL path params and payload to retrieve the orders list.
   It's tricky to analyze the cookies for such a short term, and I was not able to get the exact logic for such an issue.

3. Scalability Issue
   Sometimes, users can have a large list of orders in their account, and it will definitely affect the performance, even our app will get stuck with getting orders detail.
   This can be mitigated by executing the detail API endpoint in the background.
   Additionally, we must have a backend server to execute the background jobs.
