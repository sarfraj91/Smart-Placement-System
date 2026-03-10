// import { Webhook } from "svix";
// import User from "../models/User.js";

// export const clerkWebhooks = async (req, res) => {
//   try {
//     const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
//     const reqBody = req.body;
//     if (!reqBody) {
//       return res.status(400).json({ error: "Missing request body" });
//     }
//     const { data, type } = reqBody;
//     if (!data || !type) {
//       return res.status(400).json({ error: "Invalid request body" });
//     }
//     await webhook.verify(JSON.stringify(reqBody), {
//       "svix-id": req.headers["svix-id"],
//       "svix-timestamp": req.headers["svix-timestamp"],
//       "svix-signature": req.headers["svix-signature"],
//     });

//     switch (type) {
//       case "user.created": {
//         const userData = {
//           _id: data.id,
//           email: data.email_addresses[0]?.email_address || "",
//           name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
//           image: data.image_url,
//           resume: "",
//         };
//         await User.create(userData);
//         res.json({});
//         break;
//       }
//       case "user.updated": {
//         const userData = {
//           email: data.email_addresses[0]?.email_address || "",
//           name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
//           image: data.image_url,
//         };
//         await User.findByIdAndUpdate(data.id, userData);
//         res.json({});
//         break;
//       }
//       case "user.deleted": {
//         await User.findByIdAndDelete(data.id);
//         res.json({});
//         break;
//       }
//       default:
//         res.status(400).json({ error: "Unhandled event type" });
//         break;
//     }
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).json({ success: false, message: "Webhooks Error" });
//   }
// };



import { Webhook } from "svix";
import User from "../models/User.js";

export const clerkWebhooks = async (req, res) => {
  try {
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    const payload = req.body; // RAW BODY BUFFER
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    const evt = wh.verify(payload, headers);
    const { data, type } = evt;

    if (type === "user.created") {
      await User.create({
        _id: data.id,
        email: data.email_addresses[0].email_address,
        name: `${data.first_name} ${data.last_name}`.trim(),
        image: data.image_url,
      });
    }

    if (type === "user.updated") {
      await User.findByIdAndUpdate(data.id, {
        email: data.email_addresses[0].email_address,
        name: `${data.first_name} ${data.last_name}`.trim(),
        image: data.image_url,
      });
    }

    if (type === "user.deleted") {
      await User.findByIdAndDelete(data.id);
    }

    res.json({ success: true });
  } catch (err) {
    console.log("Webhook Error:", err.message);
    res.status(400).json({ error: "Invalid webhook signature" });
  }
};
