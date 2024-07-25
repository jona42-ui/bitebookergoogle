// apiv3methods.js

function HealthCheck() {
  const resp = {
      status: "Healthy",
  };

  return JSON.stringify(resp);
}

function BatchAvailabilityLookup(requestBody) {
  const req = JSON.parse(requestBody);

  if (!req.slots || !Array.isArray(req.slots)) {
      throw new Error("Invalid request: missing or invalid slots");
  }

  const resp = {
      slots: req.slots.map((slot) => ({
          slot,
          count_available: 1,
          duration_requirement: "DURATION_REQUIREMENT_UNSPECIFIED",
      })),
  };

  return JSON.stringify(resp);
}

function CheckAvailability(requestBody) {
  const req = JSON.parse(requestBody);

  if (!req.slot || !req.slot.merchant_id) {
      throw new Error("Invalid request: missing slot or merchant_id");
  }

  const resp = {
      slot: req.slot,
      count_available: 1,
      duration_requirement: "DURATION_REQUIREMENT_UNSPECIFIED",
  };

  return JSON.stringify(resp);
}

function CreateBooking(requestBody) {
  const req = JSON.parse(requestBody);

  if (!req.user_information) {
      throw new Error("Invalid request: missing user_information");
  }

  const resp = {
      booking: {
          booking_id: "1234",
          slot: req.slot,
          user_information: { user_id: req.user_information.user_id },
          payment_information: req.payment_information,
          status: "CONFIRMED",
      },
  };

  return JSON.stringify(resp);
}

function UpdateBooking(requestBody) {
  const req = JSON.parse(requestBody);

  if (!req.booking || !req.booking.booking_id) {
      throw new Error("Invalid request: missing booking or booking_id");
  }

  const resp = {
      booking: {
          booking_id: req.booking.booking_id,
          status: req.booking.status,
      },
  };

  return JSON.stringify(resp);
}

function GetBookingStatus(requestBody) {
  const req = JSON.parse(requestBody);

  if (!req.booking_id) {
      throw new Error("Invalid request: missing booking_id");
  }

  const resp = {
      booking_id: req.booking_id,
      booking_status: "BOOKING_STATUS_UNSPECIFIED",
  };

  return JSON.stringify(resp);
}

function ListBookings(requestBody) {
  const req = JSON.parse(requestBody);

  if (!req.user_id) {
      throw new Error("Invalid request: missing user_id");
  }

  const resp = { bookings: [{ booking_id: "1234", status: "CONFIRMED" }] };

  return JSON.stringify(resp);
}

function CheckOrderFulfillability(requestBody) {
  const req = JSON.parse(requestBody);

  if (!req.merchant_id) {
      throw new Error("Invalid request: missing merchant_id");
  }

  const resp = {
      fulfillability: {
          result: "CAN_FULFILL",
          item_fulfillability: [{}],
      },
      fees_and_taxes: {
          price_micros: 1000000,
          currency_code: "USD",
      },
  };

  return JSON.stringify(resp);
}

function CreateOrder(requestBody) {
  const req = JSON.parse(requestBody);

  if (!req.user_information) {
      throw new Error("Invalid request: missing user_information");
  }

  const resp = {
      order: {
          order_id: "123",
          merchant_id: req.order.merchant_id,
          item: [{}],
      },
  };

  return JSON.stringify(resp);
}

function ListOrders(requestBody) {
  const req = JSON.parse(requestBody);

  if (!req.user_id && !req.order_ids) {
      throw new Error("Invalid request: missing user_id or order_ids");
  }

  const resp = {
      order: [{}],
  };

  return JSON.stringify(resp);
}

function BatchGetWaitEstimates(requestBody) {
  const req = JSON.parse(requestBody);

  if (!req.merchant_id || !req.service_id || !req.party_size) {
      throw new Error(
          "Invalid request: missing merchant_id, service_id or party_size"
      );
  }

  const resp = {
      waitlist_status: "OPEN",
      wait_estimate: [
          {
              party_size: req.party_size,
              wait_length: {
                  parties_ahead_count: 5,
                  estimated_seat_time_range: {
                      start_seconds: 123456,
                      end_seconds: 123456,
                  },
              },
              waitlist_confirmation_mode:
                  "WAITLIST_CONFIRMATION_MODE_SYNCHRONOUS",
          },
      ],
  };

  return JSON.stringify(resp);
}

function CreateWaitlistEntry(requestBody) {
  const req = JSON.parse(requestBody);

  if (!req.merchant_id || !req.service_id || !req.party_size) {
      throw new Error(
          "Invalid request: missing merchant_id, service_id or party_size"
      );
  }

  const resp = {
      waitlist_entry_id: "1234",
      waitlist_business_logic_failure: null,
  };

  return JSON.stringify(resp);
}

function DeleteWaitlistEntry(requestBody) {
  const req = JSON.parse(requestBody);

  if (!req.waitlist_entry_id) {
      throw new Error("Invalid request: missing waitlist_entry_id");
  }

  const resp = {};

  return JSON.stringify(resp);
}

function GetWaitlistEntry(requestBody) {
  const req = JSON.parse(requestBody);

  if (!req.waitlist_entry_id) {
      throw new Error("Invalid request: missing waitlist_entry_id");
  }

  const resp = {
      waitlist_entry: {
          waitlist_entry_state: "CANCELED",
          waitlist_entry_state_times: {
              created_time_seconds: 123456,
              canceled_time_seconds: 123456,
          },
          wait_estimate: {
              party_size: 5,
          },
      },
  };

  return JSON.stringify(resp);
}

module.exports.HealthCheck = HealthCheck;
module.exports.BatchAvailabilityLookup = BatchAvailabilityLookup;
module.exports.CheckAvailability = CheckAvailability;
module.exports.CreateBooking = CreateBooking;
module.exports.GetBookingStatus = GetBookingStatus;
module.exports.ListBookings = ListBookings;
module.exports.UpdateBooking = UpdateBooking;
module.exports.CheckOrderFulfillability = CheckOrderFulfillability;
module.exports.CreateOrder = CreateOrder;
module.exports.ListOrders = ListOrders;
module.exports.BatchGetWaitEstimates = BatchGetWaitEstimates;
module.exports.CreateWaitlistEntry = CreateWaitlistEntry;
module.exports.DeleteWaitlistEntry = DeleteWaitlistEntry;
module.exports.GetWaitlistEntry = GetWaitlistEntry;