# Booking Server Skeleton for Node.js

This is a reference implementation of
[API v3 Booking Server](https://developers.google.com/maps-booking/guides/partner-implementing-booking-server-1)
based on Node.js

### Prerequisites

Requires an installation of

*   [Node.js](https://nodejs.org/)

## Getting Started

Booking Server is implemented using standard Node.js without any additional
libraries or frameworks for the simplicity of illustration purposes. If you are
using any other frameworks you could easily change this implementation to
Express.js, or MEAN.js, or any other Node.js-based framework of your choice.

The implementation is also not using protocol buffer libraries, but instead
relies on simple JSON serialization and its JSON.parse() and JSON.stringify()
methods.

To download the project execute the following command:

    git clone https://maps-booking.googlesource.com/js-maps-booking-rest-server-v3-skeleton

The entire code base consists of only two JavaScript files: - bookingserver.js -
HTTP server and requests handling logic, including authentication -
apiv3methods.js - methods implementing API v3 interface

After you downloaded the files you can start the Booking Server by running the
command:

    node bookingserver.js

The skeleton writes all incoming and outgoing requests to console so you can
monitor its execution for tracing purposes.

Shoud you need an IDE for code changes or debugging you can use
[Visual Studio Code](https://code.visualstudio.com/) or any other editor of your
choice. Debug the project by starting bookingserver.js in Node.js environment
and set breakpoints where needed.

## Testing your Booking Server

Download
[Booking test utility](https://maps-booking.googlesource.com/maps-booking-v3/).
To install it, follow the provided installation instructions in its README page.

For the tests, you need to create a text file to store your credentials. Put
your username and password there in one line, e.g. cred.txt file:

      username:password

You also need an availability feed for your test merchants. In our sample
commands below, we saved it with the filename avail.json. For Order-based test
client, you also need a services feed.

Now, you can test your Booking Server with these commands:

*   Test calls to HealthCheck method:

        bin/bookingClient -server_addr="localhost:8080" -health_check_test=true -credentials_file="./cred.txt"

*   Test calls to CheckAvailability method:

        bin/bookingClient -server_addr="localhost:8080" -check_availability_test=true -availability_feed="./avail.json" -credentials_file="./cred.txt"

*   Test calls to CreateBooking and UpdateBooking methods:

        bin/bookingClient -server_addr="localhost:8080" -booking_test=true -availability_feed="./avail.json" -credentials_file="./cred.txt"

*   Test calls to CheckOrderFulfillability and CreateOrder methods for
    Order-based Booking Server:

        bin/orderClient -server_addr="localhost:8080" -check_order_test=true -create_order_test=true -output_dir="/tmp" -availability_feed="./availability.json" -service_feed="./services.json" -credentials_file="./cred.txt"

As you are working on implementing your own Booking Server, you may need to run
additional tests against it (e.g. list_bookings_test, rescheduling_test, etc)
with the goal of eventually passing all tests (-all_tests=true).
