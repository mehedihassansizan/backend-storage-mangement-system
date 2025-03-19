import crypto from "crypto";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { transporter } from "../utils/nodemailer.js";

const generateAccessAndRefreshToken = async(userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken =user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false});

        return { accessToken, refreshToken };
    } 
    catch (error) {
        throw new ApiError(500, "something went wrong while generating refresh and access token");
    }
}

const registerUser = asyncHandler(async (req, res) => {
    // get user details from frontend
    // validation -not empty
    // check if user already exists: username, email
    // create user object -create entry in db
    // remove password and refresh token fields from response
    // check for user creation
    // return response

    const {fullName, email, username, password, confirmPassword } = req.body;

    // console.log('email:', email);
    
    if (
        [email, username, password, fullName, confirmPassword].some((field) => 
            field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    };

    if (password !== confirmPassword) {
        return res.status(401).json(
            new ApiResponse(401, "Password and confirm password do not match")
        )
      }
    

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    };

    function safeToLowerCase(value) {
        if (value && typeof value === 'string') {
          return value.toLowerCase();
        }
        return '';  // Return empty string if the value is invalid
      }

    const user = await User.create({
        fullName,
        email,
        password,
        username: safeToLowerCase(username)
    });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "user registered successfully")
    )


});

const loginUser = asyncHandler(async (req, res) => {
    // req body -> data 
    // username or email
    // find the user
    // password check
    // access token or refresh token 
    // send cookie

    const { username, email, password} = req.body;

    if (!username && !email) {
        throw new ApiError(400, "username or email is required")
    }

    const user = await User.findOne(
        {
            $or: [{ username }, { email }]
        }
    );

    if (!user) {
        throw new ApiError(404, "user does not exist")
    };

    const isPasswordVaild = await user.isPasswordCorrect(password);

    if (!isPasswordVaild) {
        throw new ApiError(401, "Invalid user credentials")
    };

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id);

    const loggedUser = await User.findById(user._id).select("-password -refreshToken");

    // cokkie

    const options = {
        httpOnly : true,
        secure: true
    }

    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedUser, accessToken, refreshToken
            },
            "user logged in successfully"
        )
    )

});

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset:{
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly : true,
        secure: true
    }

    return res.status(200)
   .clearCookie("accessToken", options)
   .clearCookie("refreshToken", options)
   .json(
        new ApiResponse(
            200, 
            {},
            "user logged out successfully"
        )
    )
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    // which way to get refresh token (req.body or cookie)
    const incomingRefreshToken = req.cookies.refreshToken ||req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );
    
        const user = await User.findById(decodedToken?._id);
        
        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        };
        
        if (incomingRefreshToken !== user.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefreshToken(user._id);
    
        const options = {
            httpOnly : true,
            secure: true
        };
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200, 
                {accessToken, refreshToken: newRefreshToken},
                "access token refreshed successfully"
            )
        );
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
        
    }

});


const getCurrentUser = asyncHandler(async(req, res)=>{
    return res
    .status(200)
    .json(new ApiResponse(200, req.user, "current user fetched successfully"))
});

const updateAccountDetails = asyncHandler(async(req, res)=>{
    const { fullName, email } = req.body;
    
    if (!fullName || !email) {
        throw new ApiError(400, "All fields are required");
    }
    
    const user = await User.findByIdAndUpdate(
        req.user?._id, 
        {
            $set:{
                fullName,
                email
            }
        }, 
        {new: true}
    ).select("-password");
    
    return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details update successfully"))
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const {oldPassword, newPassword} = req.body;
    const user = await User.findById(req.user?._id);
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
    
    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password")
    }

    user.password = newPassword;
    await user.save({validateBeforeSave: false});

    return res
    .status(200)
    .json(
        new ApiResponse(
            200, 
            {},
            "Password changed successfully"
        )
    )
});

const forgetpassword = asyncHandler(async(req, res)=>{
    const { email } = req.body;
    
    try {
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(400).json(
            new ApiResponse(400, "User with this email does not exist")
        )
      }
  
      // Generate a reset token and set its expiration
      const resetToken = crypto.randomBytes(20).toString("hex");
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = Date.now() + 3600000; 
  
      // Save the user with the reset token
      await user.save();
  
      // send email
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Password Reset Request",
        text: `Please use the following code to reset your password: ${resetToken}`,
      };
  

      // Send the email
      transporter.sendMail(mailOptions, (error, info) => {
        
        if (error) {
            return res.status(500).json(
                new ApiResponse(500, "Error sending in email")
            )
        }
        return res.status(201).json(
            new ApiResponse(200, "Email sent successfully")
        )
      });


    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
});

const resetPassword = asyncHandler(async(req, res)=>{
    const { email, resetToken, newPassword, confirmPassword} = req.body;

    if (newPassword !== confirmPassword) {
        return res.status(401).json(
            new ApiResponse(401, "Password and confirm password do not match")
        )
      }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "No user found with that email" });
    }

    // Check if the reset token is valid and not expired
    if (
      user.resetPasswordToken !== resetToken ||
      user.resetPasswordExpires < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined; // Clear the reset token
    user.resetPasswordExpires = undefined; // Clear the expiration time

    await user.save();

    res.status(200).json({ message: "Password updated successfully!" });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
})

export {
    changeCurrentPassword, forgetpassword, getCurrentUser, loginUser,
    logoutUser,
    refreshAccessToken,
    registerUser, resetPassword, updateAccountDetails
};

