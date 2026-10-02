import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailPayload {
  type: "welcome" | "order_confirmation";
  email: string;
  name: string;
  orderNumber?: string;
  totalAmount?: number;
  items?: Array<{ name: string; quantity: number; unitPrice: number }>;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const payload: EmailPayload = await req.json();
    const { type, email, name, orderNumber, totalAmount, items } = payload;

    if (!email || !type) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const MAILGUN_API_KEY = Deno.env.get("MAILGUN_API_KEY");
    const MAILGUN_DOMAIN = Deno.env.get("MAILGUN_DOMAIN");
    const MAILGUN_FROM_EMAIL = Deno.env.get("MAILGUN_FROM_EMAIL") || `NOVA & CO. <mail@${MAILGUN_DOMAIN}>`;

    if (!MAILGUN_API_KEY || !MAILGUN_DOMAIN) {
      console.warn("Mailgun secrets missing in Edge Function environment variables.");
      return new Response(
        JSON.stringify({ message: "Email endpoint called but Mailgun secrets not configured." }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let subject = "";
    let htmlContent = "";

    if (type === "welcome") {
      subject = "Welcome to NOVA & CO. 🌿";
      htmlContent = `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #A7C4B5; padding: 30px; background-color: #F8FAF7;">
          <h1 style="color: #064E3B; font-size: 24px; margin-bottom: 20px;">NOVA & CO.</h1>
          <p style="color: #1F2933; font-size: 16px; line-height: 1.5;">Hello ${name},</p>
          <p style="color: #1F2933; font-size: 15px; line-height: 1.6;">
            Welcome to NOVA & CO. We curate everyday wardrobe pieces, handcrafted leather goods, and lifestyle objects created with intention for modern living.
          </p>
          <div style="margin: 30px 0;">
            <a href="https://nova-and-co.vercel.app/shop" style="background-color: #064E3B; color: #ffffff; text-decoration: none; padding: 12px 24px; font-size: 13px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase; display: inline-block;">
              Explore Collection
            </a>
          </div>
          <p style="color: #1F2933; font-size: 14px;">Thoughtfully chosen. Made for everyday life.</p>
        </div>
      `;
    } else if (type === "order_confirmation") {
      subject = `Your NOVA & CO. order ${orderNumber} is confirmed`;
      
      const itemsListHtml = (items || [])
        .map(
          (item) => `
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #ECFDF5; color: #1F2933;">${item.name} (x${item.quantity})</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #ECFDF5; text-align: right; font-weight: bold; color: #064E3B;">₦${(item.unitPrice * item.quantity).toLocaleString()}</td>
          </tr>`
        )
        .join("");

      htmlContent = `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #A7C4B5; padding: 30px; background-color: #F8FAF7;">
          <h1 style="color: #064E3B; font-size: 24px; margin-bottom: 5px;">NOVA & CO.</h1>
          <p style="color: #047857; font-size: 12px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 25px;">Order Confirmation</p>
          
          <p style="color: #1F2933; font-size: 15px;">Hello ${name},</p>
          <p style="color: #1F2933; font-size: 14px; line-height: 1.5;">
            Thank you for your order! We have received your request and are preparing your pieces for delivery.
          </p>
          
          <div style="background-color: #ffffff; border: 1px solid #A7C4B5; padding: 20px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0; font-size: 13px; color: #1F2933;"><strong>Order Reference:</strong> ${orderNumber}</p>
            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
              ${itemsListHtml}
            </table>
            <div style="margin-top: 15px; border-top: 2px solid #064E3B; padding-top: 10px; text-align: right;">
              <span style="font-size: 15px; font-weight: bold; color: #064E3B;">Total: ₦${(totalAmount || 0).toLocaleString()}</span>
            </div>
          </div>

          <p style="color: #1F2933; font-size: 13px; line-height: 1.5;">
            We will send another notification once your courier dispatch has been dispatched.
          </p>
        </div>
      `;
    }

    // Send email using Mailgun API
    const formData = new FormData();
    formData.append("from", MAILGUN_FROM_EMAIL);
    formData.append("to", email);
    formData.append("subject", subject);
    formData.append("html", htmlContent);

    const authHeader = "Basic " + btoa(`api:${MAILGUN_API_KEY}`);

    const mailgunRes = await fetch(
      `https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: authHeader,
        },
        body: formData,
      }
    );

    if (!mailgunRes.ok) {
      const errText = await mailgunRes.text();
      console.error("Mailgun API Error:", errText);
      return new Response(
        JSON.stringify({ error: "Failed to dispatch email via Mailgun API" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ message: "Email sent successfully" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Edge Function error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
