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

/**
 * HealthCheck method
 * https://developers.google.com/maps-booking/reference/rest-api-v3/healthcheck-method
 * @param {string} requestBody - HTTP request body
 * @return {string} HTTP response body
 */
function HealthCheck(requestBody) {
  // TO-DO: add any additional server checks, e.g. database status
  // ...
  // Return a response similar to gRPC Health Check
  // https://github.com/grpc/grpc/blob/master/doc/health-checking.md
  var res = {status: 'SERVING'};
  const responseBody = JSON.stringify(res);
  return responseBody;
}


/**
 * BatchAvailabilityLookup method
 * https://developers.google.com/maps-booking/reference/rest-api-v3/batchavailabilitylookup-method
 * @param {string} requestBody - HTTP request body
 * @return {string} HTTP response body
 */
function BatchAvailabilityLookup(requestBody) {
  const req = JSON.parse(requestBody);


  if (!req.slot_time || !req.merchant_id) {
    throw new Error("Invalid request: missing slot_time or merchant_id");
  }

  const availableSlots = [
    {
      service_id: 5,
      start_sec: 50010430,
      duration_sec: 3600,
      availability_tag: "AVAILABLE",
    },
  ];

  // Find matching slots based on the request
  const slot_time_availability = availableSlots
    .filter((slot) => {
      return (
        slot.service_id === req.slot_time.service_id &&
        slot.start_sec === req.slot_time.start_sec &&
        slot.duration_sec === req.slot_time.duration_sec
      );
    })
    .map((slot) => ({ slot_time: slot }));

  const resp = {
    slot_time_availability: slot_time_availability,
  };

  const responseBody = JSON.stringify(resp);
  return responseBody
}

// function BatchAvailabilityLookup(requestBody) {
//   const req = JSON.parse(requestBody);

//   if (!req.slot_time || !req.merchant_id) {
//     throw new Error("Invalid request: missing slot_time or merchant_id");
//   }

//   // Available slots for testing
//   const availableSlots = [
//     {
//       service_id: 5678,
//       start_sec: 1606467600,
//       duration_sec: 1800,
//       availability_tag: "AVAILABLE"
//     },
//     {
//       service_id: 5678,
//       start_sec: 1606469400,
//       duration_sec: 1800,
//       availability_tag: "AVAILABLE"
//     },
//     {
//       service_id: 5678,
//       start_sec: 1606471200,
//       duration_sec: 1800,
//       availability_tag: "AVAILABLE"
//     }
//   ];

//   // Logging the input request and available slots for debugging
//   console.log("Request Slot Times:", req.slot_time);
//   console.log("Available Slots:", availableSlots);

//   // Find matching slots based on the request
//   const slot_time_availability = req.slot_time.map((slot) => {
//     const availableSlot = availableSlots.find((availableSlot) =>
//       availableSlot.service_id === parseInt(slot.service_id) &&
//       availableSlot.start_sec === parseInt(slot.start_sec) &&
//       availableSlot.duration_sec === parseInt(slot.duration_sec)
//     );

//     return {
//       ...slot,
//       availability_tag: availableSlot ? "AVAILABLE" : "UNAVAILABLE"
//     };
//   });

//   const resp = {
//     slot_time_availability: slot_time_availability
//   };

//   const responseBody = JSON.stringify(resp);
//   return responseBody;
// }


/**
 * CheckAvailability method
 * https://developers.google.com/maps-booking/reference/rest-api-v3/checkavailability-method
 * @param {string} requestBody - HTTP request body
 * @return {string} HTTP response body
 */
function CheckAvailability(requestBody) {
  try {
    const req = JSON.parse(requestBody);

    if (!req.slot || !req.slot.merchant_id) {
      throw new Error('Invalid request: missing slot or merchant_id');
    }

    const availability = 1;

    const resp = {
      slot: req.slot,
      count_available: availability,
      duration_requirement: 'DURATION_REQUIREMENT_UNSPECIFIED',
    };
    
    const responseBody = JSON.stringify(resp);
    return responseBody;
  } catch (err) {
    console.error(`CheckAvailability error: ${err}`);
    throw err;
  }
}

/**
 * CreateBooking method
 * https://developers.google.com/maps-booking/reference/rest-api-v3/createbooking-method
 * @param {string} requestBody - HTTP request body
 * @return {string} HTTP response body
 */
function CreateBooking(requestBody) {
  const req = JSON.parse(requestBody);

  if (!req.slot || !req.user_information || !req.payment_information) {
    throw new Error("Invalid request: Missing required fields");
  }

  const bookingId = "1237";

  const resp = {
    booking: {
      booking_id: bookingId,
      slot: req.slot,
      user_information: { user_id: req.user_information.user_id },
      payment_information: req.payment_information,
      status: "CONFIRMED", 
    },
  };

  const responseBody = JSON.stringify(resp);
  return responseBody
}

/**
 * UpdateBooking method
 * https://developers.google.com/maps-booking/reference/rest-api-v3/updatebooking-method
 * @param {string} requestBody - HTTP request body
 * @return {string} HTTP response body
 */
function UpdateBooking(requestBody) {
  // UpdateBookingRequest
  // const req = JSON.parse(requestBody);
  // TO-DO: validate req, e.g.
  //   (req.booking !== null && req.booking.booking_id !== null)
  // TO-DO: add code to update the provided booking
  // ...
  // UpdateBookingResponse
  // e.g
  // var resp = {
  //   booking: {booking_id: req.booking.booking_id, status: req.booking.status}
  // };
  // const responseBody = JSON.stringify(resp);
  // return responseBody;

  throw new Error('Not implemented yet');
}

/**
 * GetBookingStatus method
 * https://developers.google.com/maps-booking/reference/rest-api-v3/getbookingstatus-method
 * @param {string} requestBody - HTTP request body
 * @return {string} HTTP response body
 */
function GetBookingStatus(requestBody) {
  // GetBookingStatusRequest
  // const req = JSON.parse(requestBody);
  // TO-DO: validate req, e.g. (req.booking_id !== null)
  // TO-DO: add code to retrieve the booking status
  // ...
  // GetBookingStatusResponse
  // e.g
  // var resp = {
  //   booking_id: req.booking_id,
  //   booking_status: 'BOOKING_STATUS_UNSPECIFIED'
  // };
  // const responseBody = JSON.stringify(resp);
  // return responseBody;

  throw new Error('Not implemented yet');
}

/**
 * ListBookings method
 * https://developers.google.com/maps-booking/reference/rest-api-v3/listbookings-method
 * @param {string} requestBody - HTTP request body
 * @return {string} HTTP response body
 */
function ListBookings(requestBody) {
  // ListBookingsRequest
  // const req = JSON.parse(requestBody);
  // console.log(`ListBookings() for user_id: ${req.user_id}`);
  // TO-DO: validate req, e.g. (req.user_id !== null)
  // TO-DO: add code to fetch all bookings for the user_id
  // ...
  // ListBookingsResponse
  // e.g
  // var resp = {bookings: [{}]};
  // const responseBody = JSON.stringify(resp);
  // return responseBody;

  throw new Error('Not implemented yet');
}


/**
 * CheckOrderFulfillability method (Order-based Booking Server only)
 * https://developers.google.com/maps-booking/reference/rest-api-v3/checkorderfulfillability-method
 * @param {string} requestBody - HTTP request body
 * @return {string} HTTP response body
 */
function CheckOrderFulfillability(requestBody) {
  // CheckOrderFulfillabilityRequest
  // const req = JSON.parse(requestBody);
  // TO-DO: validate req, e.g. (req.merchant_id !== null)
  // TO-DO: add code to validate individual items and calculate the total price
  // ...
  // CheckOrderFulfillabilityResponse
  // e.g
  // var resp = {
  //   fulfillability: {
  //     result: 'CAN_FULFILL',
  //     item_fulfillability: [{}]  // individual item fullfilability
  //   },
  //   fees_and_taxes: {
  //     price_micros: 1000000,  // total price in micros, e.g. 1USD = 1000000
  //     currency_code: 'USD'
  //   }
  // };
  // const responseBody = JSON.stringify(resp);

  // return responseBody;

  throw new Error('Not implemented yet');
}

/**
 * CreateOrder method (Order-based Booking Server only)
 * https://developers.google.com/maps-booking/reference/rest-api-v3/createorder-method
 * @param {string} requestBody - HTTP request body
 * @return {string} HTTP response body
 */
function CreateOrder(requestBody) {
  // CreateOrderRequest
  // const req = JSON.parse(requestBody);
  // TO-DO: validate req, e.g. (req.user_information !== null)
  // TO-DO: check for req.idempotency_token uniqueness
  // TO-DO: create and process the order
  // ...
  // CreateOrderResponse
  // e.g
  // var resp = {
  //   order: {
  //     order_id: '123',  // new order id
  //     merchant_id: req.order.mercant_id,
  //     item: [{}]  // populate individual LineItems, etc.
  //   }
  // };
  // const responseBody = JSON.stringify(resp);
  // return responseBody;

  throw new Error('Not implemented yet');
}

/**
 * ListOrders method (Order-based Booking Server only)
 * https://developers.google.com/maps-booking/reference/rest-api-v3/listorders-method
 * @param {string} requestBody - HTTP request body
 * @return {string} HTTP response body
 */
function ListOrders(requestBody) {
  // ListOrdersRequest
  // const req = JSON.parse(requestBody);
  // TO-DO: validate req, e.g. if ("user_id" in req || "order_ids" in req)
  // TO-DO: fetch orders for req.user_id or a list of req.order_ids
  // ...
  // ListOrdersResponse
  // e.g
  // var resp = {
  //   order: [{}]  // populate all orders for the user_id or order_ids
  // };
  // const responseBody = JSON.stringify(resp);
  // return responseBody;

  throw new Error('Not implemented yet');
}

/**
 * BatchGetWaitEstimates method (Waitlist Implementation only)
 * https://developers.google.com/maps-booking/reference/rest-api-v3/waitlists/batchgetwaitestimates-method
 * @param {string} requestBody - HTTP request body
 * @return {string} HTTP response body
 */
function BatchGetWaitEstimates(requestBody) {
  // BatchGetWaitEstimatesRequest
  // const req = JSON.parse(requestBody);
  // TO-DO: validate req, e.g. if ("merchant_id" in req || "service_id" in req
  // || "party_size" in req) TO-DO: fetch wait estimates for the relavent
  // merchant, service id, and party size.
  // ...
  // BatchGetWaitEstimatesResponse
  // e.g
  // var resp = {
  //   waitlist_status: 'OPEN',
  //   wait_estimate: [
  //     {
  //       party_size: 5,
  //       wait_length: {
  //         parties_ahead_count: 5,
  //         estimated_seat_time_range: {
  //           start_seconds: 123456,
  //           end_seconds: 123456
  //         }
  //       },
  //       waitlist_confirmation_mode: 'WAITLIST_CONFIRMATION_MODE_SYNCHRONOUS'
  //     }
  //   ]
  // };
  // const responseBody = JSON.stringify(resp);
  // return responseBody;

  throw new Error('Not implemented yet');
}

/**
 * CreateWaitlistEntry method (Waitlist Implementation only)
 * https://developers.google.com/maps-booking/reference/rest-api-v3/waitlists/createwaitlistentry-method
 * @param {string} requestBody - HTTP request body
 * @return {string} HTTP response body
 */
function CreateWaitlistEntry(requestBody) {
  // BatchGetWaitEstimatesRequest
  // const req = JSON.parse(requestBody);
  // TO-DO: validate req, e.g. if ("merchant_id" in req || "service_id" in req
  // || "party_size" in req) TO-DO: create waitlist entry using data provided in
  // request (merchant_id, service_id, )
  // ...
  // CreateWaitlistEntryResponse
  // e.g
  // var resp = {
  //    waitlist_entry_id: '1234', //if waitlist was created successfully
  //    waitlist_business_logic_failure: { // if waitlist entry creation failed
  //     cause: 'EXISTING_WAITLIST_ENTRY',
  //     description: 'lorem impsum'
  //    }
  // };
  // const responseBody = JSON.stringify(resp);
  // return responseBody;

  throw new Error('Not implemented yet');
}

/**
 * GetWaitlistEntry method (Waitlist Implementation only)
 * https://developers.google.com/maps-booking/reference/rest-api-v3/waitlists/getwaitlistentry-method
 * @param {string} requestBody - HTTP request body
 * @return {string} HTTP response body
 */
function GetWaitlistEntry(requestBody) {
  // GetWaitlistEntryRequest
  // const req = JSON.parse(requestBody);
  // TO-DO: validate req, e.g. if ("waitlist_entry_id" in req)
  // TO-DO: fetch wait list entry status from your system.
  // ...
  // GetWaitlistEntryResponse
  // e.g
  // var resp = {
  //    waitlist_entry: {
  //     waitlist_entry_state: 'CANCELED',
  //     waitlist_entry_state_times: {
  //       created_time_seconds: ,
  //       canceled_time_seconds:
  //       ...
  //     },
  //     wait_estimate: {
  //       party_size: 5,
  //       ...
  //     }
  //    }
  // };
  // const responseBody = JSON.stringify(resp);
  // return responseBody;

  throw new Error('Not implemented yet');
}

/**
 * DeleteWaitlistEntry method (Waitlist Implementation only)
 * https://developers.google.com/maps-booking/reference/rest-api-v3/waitlists/deletewaitlistentry-method
 * @param {string} requestBody - HTTP request body
 * @return {string} HTTP response body
 */
function DeleteWaitlistEntry(requestBody) {
  // DeleteWaitlistEntryRequest
  // const req = JSON.parse(requestBody);
  // TO-DO: validate req, e.g. if ("waitlist_entry_id" in req)
  // TO-DO: delete waitlist with relevant waitlist_entry_id
  // ...
  // empty response once deleted.
  // e.g
  // var resp = {
  // }
  // const responseBody = JSON.stringify(resp);
  // return responseBody;

  throw new Error('Not implemented yet');
}

module.exports.HealthCheck = HealthCheck;
// Booking-flow Booking Server methods
module.exports.BatchAvailabilityLookup = BatchAvailabilityLookup;
module.exports.CheckAvailability = CheckAvailability;
module.exports.CreateBooking = CreateBooking;
module.exports.GetBookingStatus = GetBookingStatus;
module.exports.ListBookings = ListBookings;
module.exports.UpdateBooking = UpdateBooking;
// Order-based Booking Server methods
module.exports.CheckOrderFulfillability = CheckOrderFulfillability;
module.exports.CreateOrder = CreateOrder;
module.exports.ListOrders = ListOrders;
// Waitlist-based Server methods
module.exports.BatchGetWaitEstimates = BatchGetWaitEstimates;
module.exports.CreateWaitlistEntry = CreateWaitlistEntry;
module.exports.DeleteWaitlistEntry = DeleteWaitlistEntry;
module.exports.GetWaitlistEntry = GetWaitlistEntry;