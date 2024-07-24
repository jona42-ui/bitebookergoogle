const hostname = '127.0.0.1';
const port = 8080;
const usernamePassword = "bitebooker:bitebooker2";

const https = require('https');
const fs = require('fs');
const apiv3 = require('./apiv3methods.js');

// Load SSL certificate and key
const options = {
  key: fs.readFileSync('./keys/booking-server-key.pem'),
  cert: fs.readFileSync('./keys/booking-server-cert.pem')
};

const server = https.createServer(options, (request, response) => {
  const {headers, method, url} = request;

  // Parsing basic authentication to extract base64 encoded username:password
  var decodedString = '';
  const authorization = headers['authorization'];
  if (authorization) {
    const encodedString = authorization.replace('Basic ', '');
    const decodedBuffer = Buffer.from(encodedString, 'base64');
    decodedString = decodedBuffer.toString();  // "username:password"
  }

  if (decodedString !== usernamePassword) {
    response.statusCode = 401;  // Unauthorized
    response.setHeader('Content-Type', 'text/plain');
    response.end('Unauthorized Request');
    return;
  }

  // convert url to lower case and remove trailing '/' if there's one
  var path = url.endsWith('/') ? url.slice(0, -1).toLowerCase() : url.toLowerCase();

  console.log(`HTTP Request ${method} ${path}`);

  // retrieving request body and processing it
  let requestBody = [];
  request
      .on('error', (err) => {
        console.error(err);
      })
      .on('data', (chunk) => {
        requestBody.push(chunk);
      })
      .on('end', () => {
        requestBody = Buffer.concat(requestBody).toString();

        var httpCode = 200;  // OK
        var responseBody = '';
        var contentType = 'application/json';

        if (method === 'GET') {
          // GET /v3/HealthCheck/
          if (path === '/v3/healthcheck') {
            try {
              responseBody = apiv3.HealthCheck(requestBody);
            } catch (e) {
              httpCode = 500;  // Internal Server Error
              console.log(`Error: ${e}`);
            }
          } else {
            httpCode = 400;  // Bad Request
            contentType = 'text/plain';
            responseBody = 'Request Not Supported';
          }
        } else if (method === 'POST') {
          switch (path) {
            case '/v3/batchavailabilitylookup':
              try {
                responseBody = apiv3.BatchAvailabilityLookup(requestBody);
              } catch (e) {
                httpCode = 500;  // Internal Server Error
                console.log(`Error: ${e}`);
              }
              break;
            case '/v3/checkavailability':
              try {
                responseBody = apiv3.CheckAvailability(requestBody);
              } catch (e) {
                httpCode = 500;  // Internal Server Error
                console.log(`Error: ${e}`);
              }
              break;
            case '/v3/createbooking':
              try {
                responseBody = apiv3.CreateBooking(requestBody);
              } catch (e) {
                httpCode = 500;  // Internal Server Error
                console.log(`Error: ${e}`);
              }
              break;
            case '/v3/updatebooking':
              try {
                responseBody = apiv3.UpdateBooking(requestBody);
              } catch (e) {
                httpCode = 500;  // Internal Server Error
                console.log(`Error: ${e}`);
              }
              break;
            case '/v3/getbookingstatus':
              try {
                responseBody = apiv3.GetBookingStatus(requestBody);
              } catch (e) {
                httpCode = 500;  // Internal Server Error
                console.log(`Error: ${e}`);
              }
              break;
            case '/v3/listbookings':
              try {
                responseBody = apiv3.ListBookings(requestBody);
              } catch (e) {
                httpCode = 500;  // Internal Server Error
                console.log(`Error: ${e}`);
              }
              break;
            case '/v3/checkorderfulfillability':
              try {
                responseBody = apiv3.CheckOrderFulfillability(requestBody);
              } catch (e) {
                httpCode = 500;  // Internal Server Error
                console.log(`Error: ${e}`);
              }
              break;
            case '/v3/createorder':
              try {
                responseBody = apiv3.CreateOrder(requestBody);
              } catch (e) {
                httpCode = 500;  // Internal Server Error
                console.log(`Error: ${e}`);
              }
              break;
            case '/v3/listorders':
              try {
                responseBody = apiv3.ListOrders(requestBody);
              } catch (e) {
                httpCode = 500;  // Internal Server Error
                console.log(`Error: ${e}`);
              }
              break;
            case '/v3/batchgetwaitestimates':
              try {
                responseBody = apiv3.BatchGetWaitEstimates(requestBody);
              } catch (e) {
                httpCode = 500;  // Internal Server Error
                console.log(`Error: ${e}`);
              }
              break;
            case '/v3/createwaitlistentry':
              try {
                responseBody = apiv3.CreateWaitlistEntry(requestBody);
              } catch (e) {
                httpCode = 500;  // Internal Server Error
                console.log(`Error: ${e}`);
              }
              break;
            case '/v3/getwaitlistentry':
              try {
                responseBody = apiv3.GetWaitlistEntry(requestBody);
              } catch (e) {
                httpCode = 500;  // Internal Server Error
                console.log(`Error: ${e}`);
              }
              break;
            case '/v3/deletewaitlistentry':
              try {
                responseBody = apiv3.DeleteWaitlistEntry(requestBody);
              } catch (e) {
                httpCode = 500;  // Internal Server Error
                console.log(`Error: ${e}`);
              }
              break;
            default:
              httpCode = 400;  // Bad Request
              contentType = 'text/plain';
              responseBody = 'Request Not Supported';
          }
        }

        console.log(`HTTP Response ${httpCode} ${responseBody}`);
        response.statusCode = httpCode;
        response.setHeader('Content-Type', contentType);
        response.end(responseBody);
      });
});

server.listen(port, hostname, () => {
  console.log(`Booking Server is running at https://${hostname}:${port}`);
});