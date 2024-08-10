require("dotenv").config();
const port = process.env.PORT || 8080;
const usernamePassword = "bitbooker:bitbooker";

const http = require("http");
const apiv3 = require("./apiv3methods.js");

const server = http.createServer((request, response) => {
    const { headers, method, url } = request;

    let decodedString = "";
    const authorization = headers["authorization"];
    if (authorization) {
        const encodedString = authorization.replace("Basic ", "");
        const decodedBuffer = Buffer.from(encodedString, "base64");
        decodedString = decodedBuffer.toString(); 
    }

    if (decodedString !== usernamePassword) {
        response.statusCode = 401; 
        response.setHeader("Content-Type", "text/plain");
        response.end("Unauthorized Request");
        return;
    }

    const path = url.endsWith("/") ? url.slice(0, -1).toLowerCase() : url.toLowerCase();
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

            let httpCode = 200; 
            let responseBody = "";
            let contentType = "application/json";

            if (method === "GET") {
                if (path === "/v3/healthcheck") {
                    try {
                        responseBody = apiv3.HealthCheck();
                    } catch (e) {
                        httpCode = 500; 
                        console.log(`Error: ${e}`);
                    }
                } else {
                    httpCode = 400; 
                    contentType = "text/plain";
                    responseBody = "Request Not Supported";
                }
            } else if (method === "POST") {
                try {
                    switch (path) {
                        case "/v3/batchavailabilitylookup":
                            responseBody = apiv3.BatchAvailabilityLookup(requestBody);
                            break;
                        case "/v3/createbooking":
                            responseBody = apiv3.CreateBooking(requestBody);
                            break;
                        case "/v3/updatebooking":
                            responseBody = apiv3.UpdateBooking(requestBody);
                            break;
                        default:
                            httpCode = 400; 
                            contentType = "text/plain";
                            responseBody = "Request Not Supported";
                            break;
                    }
                } catch (e) {
                    httpCode = 500; 
                    console.log(`Error: ${e}`);
                }
            } else {
                httpCode = 405; 
                contentType = "text/plain";
                responseBody = "Request Not Supported";
            }
            console.log("response", responseBody);

            response.statusCode = httpCode;
            response.setHeader("text/plain");
            response.end(responseBody);
        });
});

server.listen(port, () => {
    console.log(`Server running at ${port}/`);
});
