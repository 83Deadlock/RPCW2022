# MUSIC ARCHIVE (HTML Templates & Express Framework)
## RPCW2021/22

## Dataset Treatment
The given dataset didn't contain an id of each entry in the json file. We'll run the script given in this repository to add just that.
```sh
python script.py
```
Running this script will take 'arq-son-EVO.json' as input and output 'arq-son2.json'.

## Start API Service
```sh
json-server --watch arq-son2.json
```

This will start the API service on address 'http://localhost:3000/' and create the necessary routes for getting the different objects on the json file we passed as an argument to the json-server.

## Starting FileServer
```sh
npm start
```
This will start the service and run it on address 'http://localhost:7777/'. The port can be changed on /bin/www.
