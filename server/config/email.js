const Brevo = require("@getbrevo/brevo");

const client = Brevo.ApiClient.instance;
client.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

const sendOTP = async (email, otp) => {
  const apiInstance = new Brevo.TransactionalEmailsApi();
  
  await apiInstance.sendTransacEmail({
    sender: { name: "Giftbow 🌈", email: "noreply@giftbow.com" },
    to: [{ email }],
    subject: "Your Giftbow OTP Code",
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto; padding: 20px; border-radius: 12px; border: 1px solid #F26076;">
        <h2 style="color: #F26076;">Giftbow 🌈</h2>
        <p>Your OTP is:</p>
        <h1 style="letter-spacing: 8px; color: #458B73; font-size: 36px;">${otp}</h1>
        <p style="color: #666;">This code is valid for 10 minutes only.</p>
        <p style="color: #666; font-size: 12px;">Ignore if not requested</p>
      </div>
    `,
  });
};

module.exports = { sendOTP };