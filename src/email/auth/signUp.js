import transport from "../../config/nodemailer.js";
import env from "dotenv";
env.config();

const signUp = (userName, userEmail, otp) => {
  console.log(
    `{ Email Parameters Nodemail--->  name: ${userName} ,email: ${userName}, otp: ${otp} }`
  );
  if (otp && userEmail) {
    const option = {
      from: process.env.EMAIL_SENDER,
      to: userEmail,
      subject: "Search Trek Registration ",
      text: "Hey , Nice you have on our Platform ",
      html: `

      
    <p style="font-size: 16px; line-height: 1.5;">
    Hey <b>${userName}</b>,
</p>

<p style="font-size: 16px; line-height: 1.5;">
    Welcome to <b>Search Trek!</b> 🌍
</p>

<p style="font-size: 16px; line-height: 1.5;">
    We're thrilled to have you on board and excited that you're embarking on the journey of discovery with us.
</p>

<p style="font-size: 16px; line-height: 1.5;">
    Here's your One-Time Password (OTP) for Account Confirmation: <b>${otp}</b>
</p>

<p style="font-size: 16px; line-height: 1.5;">
    Please use this OTP to complete your registration and unlock the full potential of our platform. If you didn't request this OTP, no worries – your account information is safe and sound.
</p>

<p style="font-size: 16px; line-height: 1.5;">
    Thanks for choosing Search Trek! If you have any questions or need assistance, feel free to reach out to our support team.
</p>

<p style="font-size: 16px; line-height: 1.5;">
    Happy searching and trekking!
</p>

<p style="font-size: 16px; line-height: 1.5;">
    Best regards,<br>
    The Search Trek Team
</p>`,
    };

    transport.sendMail(option, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log("Message sent: ", info.messageId);
    });
  } else {
    console.log(`OTP is ${otp} and Email to ${userEmail}`);
  }
};

export default signUp;
