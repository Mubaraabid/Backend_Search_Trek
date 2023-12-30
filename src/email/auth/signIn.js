import transport from "../../config/nodemailer.js";
import env from "dotenv";
env.config();

const signIn= (userName, email) => {
  console.log("Sign in email Function Called")
  let option = {
    from: process.env.EMAIL_SENDER,
    to: `${email}`,
    subject: "Welcome Back to Search Trek",
    text: "Hey , it’s our first message sent with Nodemailer after login ",
    html: `<p style="font-size: 16px; line-height: 1.5;">
    Welcome back, <b>${userName}</b>!
</p>

<p style="font-size: 16px; line-height: 1.5;">
    We're delighted to see you again on <b>Search Trek</b>. Get ready for more exciting journeys and discoveries!
</p>

<p style="font-size: 16px; line-height: 1.5;">
    If you have any questions or need assistance, feel free to explore our help center or reach out to our support team.
</p>

<p style="font-size: 16px; line-height: 1.5;">
    Happy exploring!
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
    console.log("Message sent: ", info);
  });
};

export default signIn;
