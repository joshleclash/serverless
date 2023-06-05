# Serverless Framework Node Express API on AWS

Service to use test on Stafaniny.



## Usage

Install dependencies with:

```
npm install
```
```
serverless offline start
```
POST
```
curl --location 'http://localhost:3000/empleado' \
--header 'Content-Type: application/json' \
--data '{
    "employeeid":"14",
    "name":"juan",
    "cargo":"Employee cargo 2",
    "age":"37"
}'
```
GET
```
curl --location 'http://localhost:3000/empleado/'
```
GETBYID
```
curl --location 'http://localhost:3000/empleado/1'
```