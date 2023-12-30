import EHttpStatusCode from "../enums/HttpStatusCode.js";
import bcrypt from "bcrypt";
import userModel from "../model/user.js";
import signIn from "../email/auth/signIn.js";
import signUp from "../email/auth/signUp.js";
import jwt from "jsonwebtoken";
import otpModel from "../model/otp.js";
import regenerateotpMail from "../email/auth/otp.js";

const refreshTokens = [];

function otpGenerator() {
  let otp = "";
  const digits = "0123456789";
  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * 10); // Use 10 instead of 9
    otp += digits[randomIndex];
  }
  return otp;
}

const userController = {

  signUp: async (req, res) => {
    try {
      const { email, userName } = req.body;
      console.log(email, "email");
      console.log(userName, "userName");

      // Check if email or username is already taken
      const existingUser = await userModel.findOne({
        $or: [{ email }, { userName }],
      });

      console.log(existingUser, "existing User");

      if (existingUser) {
        if (existingUser.email == email) {
          return res
            .status(EHttpStatusCode.BAD_REQUEST)
            .json({ message: "This Email is already Registered" });
        } else {
          return res
            .status(EHttpStatusCode.BAD_REQUEST)  
            .json({ message: "This Username is already taken" });
        }
      }
      // If both email and username are unique, create the user
      const user = new userModel({
        userName:req.body.userName,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 12),
        phone:req.body.phone,
        DOB:req.body.DOB,
        institute:req.body.institute,
        degree:req.body.degree
      });
      await user.save();     
      const otp = otpGenerator();

      const otpPost = await otpModel.create({ email, otp });
      if (!otpPost) {
        return res.status(400).json({
          success: false,
          message: "Error in Generating OTP , Please Try Later",
        });
      }

      // console.log(
      //   `{ Email Parameters--->  name: ${userName} ,email: ${email}, otp: ${otp} }`
      // );
      signUp(userName, email, otp);
      return res
        .status(EHttpStatusCode.SUCCESS)
        .json({ message: "Registration Successful!" });
    } catch (error) {
      console.log(error);
      return res
        .status(EHttpStatusCode.INTERNAL_SERVER)
        .json({ message: "Internal Server Error!" });
    }
  },
  //Handler Function to Login
  Login: async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log(email);
      console.log(password);
      const user = await userModel.findOne({ email });
      console.log(user);
      if (!user) {
        return res
          .status(EHttpStatusCode.NOT_FOUND)
          .json({ message: "User Not Found!" });
      } else {
        const isValidPassword = await bcrypt.compare(password, user.password);
        console.log(isValidPassword);
        if (!isValidPassword) {
          return res
            .status(EHttpStatusCode.BAD_REQUEST)
            .json({ message: "Wrong Password, Enter Password Again" });
        } else {
          const userWithoutPassword = { ...user._doc };
          delete userWithoutPassword.password;

          const accessToken = jwt.sign(
            userWithoutPassword,
            process.env.SECRET_KEY,
            {
              expiresIn: 4102444800, // expires in 2100 hour
            }
          );
          console.log(`Access Token ${accessToken}`);

          // Sending an email on Successful login
          signIn(user.userName, user.email);
          const refreshToken = jwt.sign(
            userWithoutPassword,
            process.env.SECRET_KEY
          );
          console.log(`Refresh Token ${refreshToken}`);

          refreshTokens.push(refreshToken);

          return res.status(EHttpStatusCode.SUCCESS).json({
            message: "User Successfully Logged In!",
            token: accessToken,
            refreshToken,
            user: userWithoutPassword,
          });
        }
      }
    } catch (error) {
      console.log(error);
      return res
        .status(EHttpStatusCode.INTERNAL_SERVER)
        .json({ message: "Internal Server Error!" });
    }
  },

  checkOtp: async (req, res) => {
    try {
      const { email, otp } = req.body;
      const findUser = await otpModel.findOne({ email }).sort("-createdAt");
      console.log(`User Find through email: ${findUser}`);
      if (!findUser) {
        return res.status(400).json({
          success: false,
          message: "Error in Generating OTP , Please Try Later",
        });
      }
      const creationTime = findUser.createdAt;
      console.log(`creation time otp: ${creationTime}`);
      const currentTime = Date.now();
      const TimeDifference = Math.abs(creationTime - currentTime);
      const fiveMinutes = 5 * 60 * 1000;
      console.log(`generated otp: ${findUser.otp}`);
      if (findUser.otp != otp) {
        return res.status(400).json({ success: false, message: "Wrong OTP" });
      } else if (TimeDifference > fiveMinutes) {
        return res.status(400).json({ success: false, message: "OTP Expires" });
      }
      return res.status(200).json({
        success: true,
        message: "OTP verified!",
      });
    } catch (e) {
      return res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  },

  regenerateOtp: async (req, res) => {
    try {
      const { email } = req.body;
      console.log(email);
      const otp = otpGenerator();
      const otpPost = await otpModel.create({ email, otp });
      console.log(otpPost);
      if (!otpPost) {
        return res.status(400).json({
          success: false,
          message: "Error in Generating OTP , Please Try Later",
        });
      }
      regenerateotpMail({ email: email, otp: otp })
      return res
        .status(200)
        .json({ success: true, message: "OTP Regenerated" });
    } catch (e) {
      return res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  },

 
  
};

export default userController;
