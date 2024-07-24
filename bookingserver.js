/*
 * Copyright 2018, Google Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *     * Neither the name of Google Inc. nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

require('dotenv').config();
const usernamePassword = 'bitebooker:bitebooker2';

const http = require('http');
const apiv3 = require('./apiv3methods.js');
const port = process.env.PORT || 8080;



// TO-DO: implement SSL server using https module
// for more info: https://nodejs.org/api/https.html
// const https = require('https');
// const fs = require('fs');
// const options = {
//  key: fs.readFileSync('./keys/booking-server-key.pem'),
//  cert: fs.readFileSync('./keys/booking-server-cert.pem')
// };
// const server = https.createServer(options, (request, response) => {...

const server = http.createServer((request, response) => {
  const {headers, method, url} = request;

  // Parsing basic authentication to extract base64 encoded username:password
  // Authorization:Basic dXNlcm5hbWU6cGFzc3dvcmQ=
  var decodedString = '';
  const authorization = headers['authorization'];
  if (authorization) {
    const encodedString = authorization.replace('Basic ', '');
    const decodedBuffer = new Buffer(encodedString, 'base64');
    decodedString = decodedBuffer.toString();  // "username:password"
  }

  if (decodedString !== usernamePassword) {
    response.statusCode = 401;  // Unauthorized
    response.setHeader('Content-Type', 'text/plain');
    response.end('Unauthorized Request');
    return;
  }

  // convert url to lower case and remove trailing '/' if there's one
  // you can also remove prefixed URL, if your server is hosted on
  // server/somepath/
  var path =
      url.endsWith('/') ? url.slice(0, -1).toLowerCase() : url.toLowerCase();

  console.log(`HTTP Request ${method} ${path}`);

  // retrieving request body and processing it
  // for more info:
  // https://nodejs.org/en/docs/guides/anatomy-of-an-http-transaction/
  let requestBody = [];
  request
      .on('error',
          (err) => {
            console.error(err);
          })
      .on('data',
          (chunk) => {
            // when a large request come in chunks
            requestBody.push(chunk);
          })
      .on('end', () => {
        // reconstructing entire request body in the string requestBody
        requestBody = Buffer.concat(requestBody).toString();

        // if there is an error return one of the HTTP error codes
        // https://developers.google.com/maps-booking/reference/rest-api-v3/status_codes
        var httpCode = 200;  // OK
        var responseBody = '';
        var contentType = 'application/json';

        if (method === 'GET') {
          // GET /v3/HealthCheck/
          if (path === '/v3/healthcheck') {
            try {
              responseBody = apiv3.HealthCheck(requestBody);
              console.log(requestBody);
            } catch (e) {
              // TO-DO: add a specific error handling if necessary
              httpCode = 500;  // Internal Server Error
              console.log(`Error: ${e}`);
            }
          } else  // some unknown request
          {
            httpCode = 400;  // Bad Request
            contentType = 'text/plain';
            responseBody = 'Request Not Supported';
          }
        } else if (method === 'POST') {
          switch (path) {
            // POST /v3/CheckAvailability/
            case '/v3/batchavailabilitylookup':
              try {
                console.log(`Received request for /v3/batchavailabilitylookup: ${requestBody}`);
                responseBody = apiv3.BatchAvailabilityLookup(requestBody);
              } catch (e) {
                // TO-DO: add a specific error handling if necessary
                httpCode = 500;  // Internal Server Error
                console.log(`Error: ${e}`);
              }
              break;
            // POST /v3/CheckAvailability/
            case '/v3/checkavailability':
              try {
                responseBody = apiv3.CheckAvailability(requestBody);
              } catch (e) {
                // TO-DO: add a specific error handling if necessary
                httpCode = 500;  // Internal Server Error
                console.log(`Error: ${e}`);
              }
              break;
            // POST /v3/CreateBooking/
            case '/v3/createbooking':
              try {
                responseBody = apiv3.CreateBooking(requestBody);
              } catch (e) {
                // TO-DO: add a specific error handling if necessary
                httpCode = 500;  // Internal Server Error
                console.log(`Error: ${e}`);
              }
              break;
            // POST /v3/UpdateBooking/
            case '/v3/updatebooking':
              try {
                responseBody = apiv3.UpdateBooking(requestBody);
              } catch (e) {
                // TO-DO: add a specific error handling if necessary
                httpCode = 500;  // Internal Server Error
                console.log(`Error: ${e}`);
              }
              break;
            // POST /v3/GetBookingStatus/
            case '/v3/getbookingstatus':
              try {
                responseBody = apiv3.GetBookingStatus(requestBody);
              } catch (e) {
                // TO-DO: add a specific error handling if necessary
                httpCode = 500;  // Internal Server Error
                console.log(`Error: ${e}`);
              }
              break;
            // POST /v3/ListBookings/
            case '/v3/listbookings':
              try {
                responseBody = apiv3.ListBookings(requestBody);
              } catch (e) {
                // TO-DO: add a specific error handling if necessary
                httpCode = 500;  // Internal Server Error
                console.log(`Error: ${e}`);
              }
              break;
            // POST /v3/CheckOrderFulfillability/
            // (this method is only for Order-based Booking Server)
            case '/v3/checkorderfulfillability':
              try {
                responseBody = apiv3.CheckOrderFulfillability(requestBody);
              } catch (e) {
                // TO-DO: add a specific error handling if necessary
                httpCode = 500;  // Internal Server Error
                console.log(`Error: ${e}`);
              }
              break;
            // POST /v3/CreateOrder/
            // (this method is only for Order-based Booking Server)
            case '/v3/createorder':
              try {
                responseBody = apiv3.CreateOrder(requestBody);
              } catch (e) {
                // TO-DO: add a specific error handling if necessary
                httpCode = 500;  // Internal Server Error
                console.log(`Error: ${e}`);
              }
              break;
            // POST /v3/ListOrders/
            // (this method is only for Order-based Booking Server)
            case '/v3/listorders':
              try {
                responseBody = apiv3.ListOrders(requestBody);
              } catch (e) {
                // TO-DO: add a specific error handling if necessary
                httpCode = 500;  // Internal Server Error
                console.log(`Error: ${e}`);
              }
              break;
            // POST /v3/BatchGetWaitEstimates/
            // (this method is only for Waitlist functionality)
            case '/v3/batchgetwaitestimates':
              try {
                responseBody = apiv3.BatchGetWaitEstimates(requestBody);
              } catch (e) {
                // TO-DO: add a specific error handling if necessary
                httpCode = 500;  // Internal Server Error
                console.log(`Error: ${e}`);
              }
              break;
            // POST /v3/CreateWaitlistEntry/
            // (this method is only for Waitlist functionality)
            case '/v3/createwaitlistentry':
              try {
                responseBody = apiv3.CreateWaitlistEntry(requestBody);
              } catch (e) {
                // TO-DO: add a specific error handling if necessary
                httpCode = 500;  // Internal Server Error
                console.log(`Error: ${e}`);
              }
              break;
            // POST /v3/GetWaitlistEntry/
            // (this method is only for Waitlist functionality)
            case '/v3/getwaitlistentry':
              try {
                responseBody = apiv3.GetWaitlistEntry(requestBody);
              } catch (e) {
                // TO-DO: add a specific error handling if necessary
                httpCode = 500;  // Internal Server Error
                console.log(`Error: ${e}`);
              }
              break;
            // POST /v3/DeleteWaitlistEntry/
            // (this method is only for Waitlist functionality)
            case '/v3/deletewaitlistentry':
              try {
                responseBody = apiv3.DeleteWaitlistEntry(requestBody);
              } catch (e) {
                // TO-DO: add a specific error handling if necessary
                httpCode = 500;  // Internal Server Error
                console.log(`Error: ${e}`);
              }
              break;
            // some unknown request
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

server.listen(port, () => {
  console.log(`Booking Server is running at ${port}`);
});




