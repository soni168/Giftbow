const SibApiV3Sdk = require("sib-api-v3-sdk");

const defaultClient = SibApiV3Sdk.ApiClient.instance;
defaultClient.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

const sendOTP = async (email, otp) => {
  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

  await apiInstance.sendTransacEmail({
    sender: { name: "Giftbow 🎁", email: "noreply@giftbow.com" },
    to: [{ email }],
    subject: "Your Giftbow OTP Code",
    htmlContent: `
      <!DOCTYPE html>
      <html>
        <body style="margin:0; padding:0; background-color:#FFF8F5;">
          <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #F26076; box-shadow: 0 4px 24px rgba(242,96,118,0.08);">
            <div style="background: linear-gradient(135deg, #F26076, #ff8fa3); padding: 32px; text-align: center;">
              <h1 style="margin:0; color:#ffffff; font-size: 28px; letter-spacing: 1px;">Giftbow 🎁</h1>
              <p style="margin: 8px 0 0; color: rgba(255,255,255,0.85); font-size: 14px;">The Perfect Gift, Every Time</p>
            </div>
            <div style="padding: 36px 32px; text-align: center;">
              <p style="color: #444; font-size: 16px; margin: 0 0 8px;">Your One-Time Password is:</p>
              <div style="background: #FFF0F3; border: 2px dashed #F26076; border-radius: 12px; padding: 24px; margin: 24px 0;">
                <h2 style="margin: 0; letter-spacing: 12px; color: #F26076; font-size: 40px; font-weight: 800;">${otp}</h2>
              </div>
              <p style="color: #888; font-size: 13px; margin: 0 0 6px;">⏱ Valid for <strong>10 minutes</strong> only.</p>
              <p style="color: #aaa; font-size: 12px; margin: 0;">If you didn't request this, please ignore this email.</p>
            </div>
            <div style="background: #FFF8F5; padding: 20px 32px; text-align: center; border-top: 1px solid #f0e0e3;">
              <p style="margin: 0; color: #bbb; font-size: 11px;">© ${new Date().getFullYear()} Giftbow. Made with ❤️ in India</p>
            </div>
          </div>
        </body>
      </html>
    `,
  });
};

module.exports = { sendOTP };