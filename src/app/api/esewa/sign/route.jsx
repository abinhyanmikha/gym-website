import crypto from "crypto";

export async function POST(req) {
  try {
    const { total_amount, transaction_uuid, product_code } = await req.json();

    if (total_amount === undefined || !transaction_uuid || !product_code) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
      });
    }

    const secretKey = process.env.ESEWA_SECRET_KEY; // put in .env.local

    // IMPORTANT: order must match signed_field_names (below)
    const message = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;

    const hmac = crypto.createHmac("sha256", secretKey);
    hmac.update(message);
    const signature = hmac.digest("base64");

    return new Response(JSON.stringify({ signature, message }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
