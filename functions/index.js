/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {setGlobalOptions} = require("firebase-functions");
const {onRequest} = require("firebase-functions/https");
const logger = require("firebase-functions/logger");

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({ maxInstances: 10 });

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const functions = require("firebase-functions");
const stripe = require("stripe")(functions.config().stripe.secret);

exports.createCheckoutSession = functions.https.onRequest(
  async (req, res) => {

    const { roomType, checkIn, checkOut } = req.body;

    // 💰 price per night
    const prices = {
      "Double Room": 150,
      "Twin Room": 130,
      "Family Room": 180
    };

    const nights =
      (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24);

    if (!prices[roomType] || nights <= 0) {
      return res.status(400).json({ error: "Invalid booking data" });
    }

    const total = prices[roomType] * nights;
    const deposit = Math.round(total * 0.3 * 100); // 30%

    try {
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "gbp",
              product_data: {
                name: `${roomType} – 30% Deposit`
              },
              unit_amount: deposit
            },
            quantity: 1
          }
        ],
        success_url: "./success.html",
        cancel_url: "./cancel.html"
      });

      res.json({ url: session.url });

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Stripe error" });
    }
  }
);
