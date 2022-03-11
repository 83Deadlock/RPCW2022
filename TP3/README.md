# REST API and FileServer Example 
## RPCW2021/22

## __Pre-requisites__
```sh
npm install axios
```

## Start API Service
```sh
json-server --watch db.json
```

This will start the API service on address 'http://localhost:3000/' and create the necessary routes for getting the different objects on the json file we passed as an argument to the json-server.

## Starting web fileServer
```sh
node fileServer.js
```

This will start the service and run it on address 'http://localhost:4000/'
