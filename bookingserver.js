
// booking-server.js
require("dotenv").config();
const port = process.env.PORT | 8080;
const usernamePassword = "bitbooker:bitebooker";

const http = require("http");
const apiv3 = require("./apiv3methods.js");

const server = http.createServer((request, response) => {
    const { headers, method, url } = request;

    let decodedString = "";
    const authorization = headers["authorization"];
    if (authorization) {
        const encodedString = authorization.replace("Basic ", "");
        const decodedBuffer = Buffer.from(encodedString, "base64");
        decodedString = decodedBuffer.toString(); // "username:password"
    }

    if (decodedString !== usernamePassword) {
        response.statusCode = 401; // Unauthorized
        response.setHeader("Content-Type", "text/plain");
        response.end("Unauthorized Request");
        return;
    }

    const path = url.endsWith("/")
        ? url.slice(0, -1).toLowerCase()
        : url.toLowerCase();

    console.log(`HTTP Request ${method} ${path}`);

    let requestBody = [];
    request
        .on("error", (err) => {
            console.error(err);
        })
        .on("data", (chunk) => {
            requestBody.push(chunk);
        })
        .on("end", () => {
            requestBody = Buffer.concat(requestBody).toString();

            let httpCode = 200; // OK
            let responseBody = "";
            let contentType = "application/json";

            if (method === "GET") {
                if (path === "/v3/healthcheck") {
                    try {
                        responseBody = apiv3.HealthCheck(requestBody);
                    } catch (e) {
                        httpCode = 500; // Internal Server Error
                        console.log(`Error: ${e}`);
                    }
                } else {
                    httpCode = 400; // Bad Request
                    contentType = "text/plain";
                    responseBody = "Request Not Supported";
                }
            } else if (method === "POST") {
                try {
                    switch (path) {
                        case "/v3/batchavailabilitylookup":
                            responseBody =
                                apiv3.BatchAvailabilityLookup(
                                    requestBody
                                );
                            break;
                        case "/v3/checkavailability":
                            responseBody =
                                apiv3.CheckAvailability(requestBody);
                            break;
                        case "/v3/createbooking":
                            responseBody =
                                apiv3.CreateBooking(requestBody);
                            break;
                        case "/v3/updatebooking":
                            responseBody =
                                apiv3.UpdateBooking(requestBody);
                            break;
                        case "/v3/getbookingstatus":
                            responseBody =
                                apiv3.GetBookingStatus(requestBody);
                            break;
                        case "/v3/listbookings":
                            responseBody =
                                apiv3.ListBookings(requestBody);
                            break;
                        case "/v3/checkorderfulfillability":
                            responseBody =
                                apiv3.CheckOrderFulfillability(
                                    requestBody
                                );
                            break;
                        case "/v3/createorder":
                            responseBody =
                                apiv3.CreateOrder(requestBody);
                            break;
                        case "/v3/listorders":
                            responseBody = apiv3.ListOrders(requestBody);
                            break;
                        case "/v3/batchgetwaitestimates":
                            responseBody =
                                apiv3.BatchGetWaitEstimates(
                                    requestBody
                                );
                            break;
                        case "/v3/createwaitlistentry":
                            responseBody =
                                apiv3.CreateWaitlistEntry(requestBody);
                            break;
                        case "/v3/deletewaitlistentry":
                            responseBody =
                                apiv3.DeleteWaitlistEntry(requestBody);
                            break;
                        case "/v3/getwaitlistentry":
                            responseBody =
                                apiv3.GetWaitlistEntry(requestBody);
                            break;
                        default:
                            httpCode = 400; // Bad Request
                            contentType = "text/plain";
                            responseBody = "Request Not Supported";
                            break;
                    }
                } catch (e) {
                    httpCode = 500; // Internal Server Error
                    console.log(`Error: ${e}`);
                }
            } else {
                httpCode = 405; // Method Not Allowed
                contentType = "text/plain";
                responseBody = "Request Not Supported";
            }

            response.statusCode = httpCode;
            response.setHeader("Content-Type", contentType);
            response.end(responseBody);
        });
});

server.listen(port, () => {
    console.log(`Server running at ${port}/`);
});