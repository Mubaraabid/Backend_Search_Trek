import Transport from "../../config/nodemailer.js";
import env from "dotenv";
env.config();

const regenerateotpMail= ({email , otp}) => {
  console.log(email , "OTP email Function Called")
  let option = {
    from: process.env.EMAIL_SENDER,
    to: email,
    subject: "Re-generate OTP",
    text: `Otp is ${otp}`,
    html: `  <p style="font-size: 16px; line-height: 1.5;">
    Hi,
</p>

<p style="font-size: 16px; line-height: 1.5;">
    We noticed that you requested a new OTP for your Search Trek account.
</p>

<p style="font-size: 16px; line-height: 1.5;">
    Your new One-Time Password (OTP) is: <b>${otp}</b>
</p>`,
  };

  Transport.sendMail(option, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message sent: ", info);
  });
};

export default regenerateotpMail;
