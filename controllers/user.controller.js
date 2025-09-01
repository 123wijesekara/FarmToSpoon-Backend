 
import UserModel from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import verifyEmailTemplate from "../utils/verifyEmailTemplate.js";
import sendEmail from "../config/sendEmail.js";
import generatedAccessToken from "../utils/generatedAccessToken.js";
import generatedRefreshToken from "../utils/generatedRefreshToken.js";
import uploadImageClodinary from "../utils/uploadImageClodinary.js";
import generatedOtp from "../utils/generatedOtp.js";
import forgotPasswordTemplate from "../utils/forgotPassowordTemplate.js";
import AddressModel from "../models/address.model.js";

export async function registerUserController(request, response) {
    try {
        const { name, email, password, phone, district, address_line, role, distribution_location } = request.body;
 
        // Role validation
        if (!role || !["ADMIN", "FARMER", "USER"].includes(role)) {
            return response.status(400).json({
                message: "Invalid role",
                error: true,
                success: false,
            });
        }

        // Check if user already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return response.json({
                message: "Email is already registered",
                error: true,
                success: false,
            });
        }

        // Password hashing
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        // Create new user object
        const newUser = new UserModel({
            name,
            email,
            password: hashedPassword,
            mobile: phone,
            district,
            role,
            distribution_location
        });

         
        if (role === "FARMER") {
            const lastFarmer = await UserModel.findOne({ role: "FARMER" })
                .sort({ createdAt: -1 })
                .select("farmerId");

            let newFarmerId = "FARMER001";
            if (lastFarmer && lastFarmer.farmerId) {
                const lastNumber = parseInt(lastFarmer.farmerId.replace("FARMER", ""));
                const nextNumber = lastNumber + 1;
                newFarmerId = `FARMER${String(nextNumber).padStart(3, "0")}`;
            }
            newUser.farmerId = newFarmerId;
        } else if (role === "USER") {
            const lastUser = await UserModel.findOne({ role: "USER" })
                .sort({ createdAt: -1 })
                .select("userId");

            let newUserId = "USER001";
            if (lastUser && lastUser.userId) {
                const lastNumber = parseInt(lastUser.userId.replace("USER", ""));
                const nextNumber = lastNumber + 1;
                newUserId = `USER${String(nextNumber).padStart(3, "0")}`;
            }
            newUser.userId = newUserId;
        }

        // Save user to DB
        const savedUser = await newUser.save();

        // Save address if provided
        if (address_line && district && phone) {
            const createAddress = new AddressModel({
                address_line,
                city: district,
                mobile: phone,
            });

            const saveAddress = await createAddress.save();

            await UserModel.findByIdAndUpdate(savedUser._id, {
                $push: {
                    address_details: saveAddress._id,
                },
            });
        }

        // Send verification email
        const verifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${savedUser._id}`;
        await sendEmail({
            sendTo: email,
            subject: "Verify your email from Farm To Spoon",
            html: verifyEmailTemplate({ name, url: verifyEmailUrl }),
        });

        return response.json({
            message: "User registered successfully",
            error: false,
            success: true,
            data: savedUser,
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
}

 
export async function verifyEmailController(request, response) {
    try {
        const { code } = request.body;
     
        const user = await UserModel.findOne({ _id: code });

        if (!user) {
            return response.status(400).json({
                message: "Invalid code",
                error: true,
                success: false,
            });
        }

      
        await UserModel.updateOne({ _id: code }, { verify_email: true });

        return response.json({
            message: "Verify email done",
            success: true,
            error: false,
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
}

// Login controller
// export async function loginController(request, response) {
//     try {
//         const { email, password } = request.body;

//         if (!email || !password) {
//             return response.status(400).json({
//                 message: "Provide email, password",
//                 error: true,
//                 success: false,
//             });
//         }

//         const user = await UserModel.findOne({ email });
//         if (!user) {
//             return response.status(400).json({
//                 message: "User not registered",
//                 error: true,
//                 success: false,
//             });
//         }

//         if (user.status !== "Active") {
//             return response.status(400).json({
//                 message: "Contact To Farmer",
//                 error: true,
//                 success: false,
//             });
//         }

//         const checkPassword = await bcryptjs.compare(password, user.password);
//         if (!checkPassword) {
//             return response.status(400).json({
//                 message: "Check your password",
//                 error: true,
//                 success: false,
//             });
//         }

//         // Generate access token and refresh token
//         const accessToken = await generatedAccessToken(user._id);
//         const refreshToken = await generatedRefreshToken(user._id);

//         // Update last login date
//         await UserModel.findByIdAndUpdate(user?._id, {
//             last_login_date: new Date(),
//         });

//         // Set cookies
//         const cookiesOption = {
//             httpOnly: true,
//             secure: true,
//             sameSite: "None",
//         };

//         response.cookie("accessToken", accessToken, cookiesOption);
//         response.cookie("refreshToken", refreshToken, cookiesOption);

//         return response.json({
//             message: "Login successfully",
//             error: false,
//             success: true,
//             data: {
//                 accessToken,
//                 refreshToken,
//                 userId: user._id
//             },
            
//         });
        
//     } catch (error) {
//         return response.status(500).json({
//             message: error.message || error,
//             error: true,
//             success: false,
//         });
//     }
// }

export async function loginController(request, response) {
    try {
        const { email, password } = request.body;

        if (!email || !password) {
            return response.status(400).json({
                message: "Provide email, password",
                error: true,
                success: false,
            });
        }

        const user = await UserModel.findOne({ email });
        if (!user) {
            return response.status(400).json({
                message: "User not registered",
                error: true,
                success: false,
            });
        }


        if (!user.verify_email) {
            return response.status(403).json({
                message: "Please verify your email ",
                error: true,
                success: false,
                unverified: true, 
                userId: user._id  
            });
        }

        if (user.status !== "Active") {
            return response.status(400).json({
                message: "Your account has been suspended or deactivated. Please contact support for assistance.",
                error: true,
                success: false,
            });
        }

        const checkPassword = await bcryptjs.compare(password, user.password);
        if (!checkPassword) {
            return response.status(400).json({
                message: "Check your password",
                error: true,
                success: false,
            });
        }

        // Generate access token and refresh token
        const accessToken = await generatedAccessToken(user._id);
        const refreshToken = await generatedRefreshToken(user._id);
    
        // Update last login date
        await UserModel.findByIdAndUpdate(user?._id, {
            last_login_date: new Date(),
        });
        
        const cookiesOption = {
            httpOnly: true,
            secure: true,
            sameSite: "None",
        };

        response.cookie("accessToken", accessToken, cookiesOption);
        response.cookie("refreshToken", refreshToken, cookiesOption);
        response.cookie("userId", user._id.toString(), cookiesOption);
        response.cookie("name", user.name, cookiesOption);
        return response.json({
            message: "Login successfully",
            error: false,
            success: true,
           
            data: {
                accessToken,
                refreshToken,
                userId: user._id,
                name: user.name,
            },
        });
       
        
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
    
}

// Logout controller
export async function logoutController(request, response) {
    try {
        const userId = request.userId;
        const cookiesOption = {
            httpOnly: true,
            secure: true,
            sameSite: "None",
        };

        response.clearCookie("accessToken", cookiesOption);
        response.clearCookie("refreshToken", cookiesOption);

        await UserModel.findByIdAndUpdate(userId, { refresh_token: "" });

        return response.json({
            message: "Logout successfully",
            error: false,
            success: true,
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
}

// Avatar upload controller
export async function uploadAvatar(request, response) {
    try {
        const userId = request.userId;  
        const image = request.file;  

        const upload = await uploadImageClodinary(image);

        await UserModel.findByIdAndUpdate(userId, { avatar: upload.url });

        return response.json({
            message: "Upload profile",
            success: true,
            error: false,
            data: {
                _id: userId,
                avatar: upload.url,
            },
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
}

// User details update controller
export async function updateUserDetails(request, response) {
    try {
        const userId = request.userId; // auth middleware
        const { name, email, mobile, password } = request.body;

        let hashPassword = "";

        if (password) {
            const salt = await bcryptjs.genSalt(10);
            hashPassword = await bcryptjs.hash(password, salt);
        }

        await UserModel.updateOne(
            { _id: userId },
            {
                ...(name && { name }),
                ...(email && { email }),
                ...(mobile && { mobile }),
                ...(password && { password: hashPassword }),
            }
        );

        return response.json({
            message: "Updated successfully",
            error: false,
            success: true,
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
}

// Password reset and OTP-related controllers here...


// export async function forgotPasswordController(request,response) {
//     try {
//         const { email } = request.body 

//         const user = await UserModel.findOne({ email })

//         if(!user){
//             return response.status(400).json({
//                 message : "Email not available",
//                 error : true,
//                 success : false
//             })
//         }

//         const otp = generatedOtp()
//         const expireTime = new Date() + 60 * 60 * 1000 // 1hr

//         const update = await UserModel.findByIdAndUpdate(user._id,{
//             forgot_password_otp : otp,
//             forgot_password_expiry : new Date(expireTime).toISOString()
//         })

//         await sendEmail({
//             sendTo : email,
//             subject : "Forgot password from FarmToSpoon",
//             html : forgotPasswordTemplate({
//                 name : user.name,
//                 otp : otp
//             })
//         })

//         return response.json({
//             message : "check your email",
//             error : false,
//             success : true
//         })

//     } catch (error) {
//         return response.status(500).json({
//             message : error.message || error,
//             error : true,
//             success : false
//         })
//     }
// }
// export async function verifyForgotPasswordOtp(request,response){
//     try {
//         const { email , otp }  = request.body

//         if(!email || !otp){
//             return response.status(400).json({
//                 message : "Provide required field email, otp.",
//                 error : true,
//                 success : false
//             })
//         }

//         const user = await UserModel.findOne({ email })

//         if(!user){
//             return response.status(400).json({
//                 message : "Email not available",
//                 error : true,
//                 success : false
//             })
//         }

//         const currentTime = new Date().toISOString()

//         if(user.forgot_password_expiry < currentTime  ){
//             return response.status(400).json({
//                 message : "Otp is expired",
//                 error : true,
//                 success : false
//             })
//         }

//         if(otp !== user.forgot_password_otp){
//             return response.status(400).json({
//                 message : "Invalid otp",
//                 error : true,
//                 success : false
//             })
//         }

//         //if otp is not expired
//         //otp === user.forgot_password_otp

//         const updateUser = await UserModel.findByIdAndUpdate(user?._id,{
//             forgot_password_otp : "",
//             forgot_password_expiry : ""
//         })
        
//         return response.json({
//             message : "Verify otp successfully",
//             error : false,
//             success : true
//         })

//     } catch (error) {
//         return response.status(500).json({
//             message : error.message || error,
//             error : true,
//             success : false
//         })
//     }
// }

export async function forgotPasswordController(request, response) {
    try {
        const { email } = request.body;
      // console.log("➡️ sendTo received in sendEmail:", email);


        const user = await UserModel.findOne({ email });
        


        if (!user) {
            return response.status(400).json({ message: "Email not available", error: true, success: false });
        }

        const otp = generatedOtp();
        const expireTime = new Date(Date.now() + 60 * 60 * 1000);

        await UserModel.findByIdAndUpdate(user._id, {
            forgot_password_otp: otp,
            forgot_password_expiry: expireTime.toISOString()
        });

        await sendEmail({
            sendTo: email,
            subject: "Forgot password from FarmToSpoon",
            html: forgotPasswordTemplate({ name: user.name, otp })
        });

        return response.json({ message: "Check your email", error: false, success: true });

    } catch (error) {
        return response.status(500).json({ message: error.message || error, error: true, success: false });
    }
}

export async function verifyForgotPasswordOtp(request, response) {
    try {
        const { email, otp } = request.body;

        if (!email || !otp) {
            return response.status(400).json({
                message: "Provide required field email, otp.",
                error: true,
                success: false
            });
        }

        const user = await UserModel.findOne({ email });

        if (!user) {
            return response.status(400).json({ message: "Email not available", error: true, success: false });
        }

        const now = new Date();

        if (!user.forgot_password_expiry || user.forgot_password_expiry < now) {
            return response.status(400).json({ message: "Otp is expired", error: true, success: false });
        }

        if (otp !== user.forgot_password_otp) {
            return response.status(400).json({ message: "Invalid otp", error: true, success: false });
        }

        await UserModel.findByIdAndUpdate(user._id, {
            forgot_password_otp: null,
            forgot_password_expiry: null
        });

        return response.json({ message: "Verify otp successfully", error: false, success: true });

    } catch (error) {
        return response.status(500).json({ message: error.message || error, error: true, success: false });
    }
}

export async function resetpassword(request,response){
    try {
        const { email , newPassword, confirmPassword } = request.body 

        if(!email || !newPassword || !confirmPassword){
            return response.status(400).json({
                message : "provide required fields email, newPassword, confirmPassword"
            })
        }

        const user = await UserModel.findOne({ email })

        if(!user){
            return response.status(400).json({
                message : "Email is not available",
                error : true,
                success : false
            })
        }

        if(newPassword !== confirmPassword){
            return response.status(400).json({
                message : "newPassword and confirmPassword must be same.",
                error : true,
                success : false,
            })
        }

        const salt = await bcryptjs.genSalt(10)
        const hashPassword = await bcryptjs.hash(newPassword,salt)

        const update = await UserModel.findOneAndUpdate(user._id,{
            password : hashPassword
        })

        return response.json({
            message : "Password updated successfully.",
            error : false,
            success : true
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}
export async function refreshToken(request,response){
    try {
        const refreshToken = request.cookies.refreshToken || request?.headers?.authorization?.split(" ")[1]  /// [ Bearer token]

        if(!refreshToken){
            return response.status(401).json({
                message : "Invalid token",
                error  : true,
                success : false
            })
        }

        const verifyToken = await jwt.verify(refreshToken,process.env.SECRET_KEY_REFRESH_TOKEN)

        if(!verifyToken){
            return response.status(401).json({
                message : "token is expired",
                error : true,
                success : false
            })
        }

        const userId = verifyToken?._id

        const newAccessToken = await generatedAccessToken(userId)

        const cookiesOption = {
            httpOnly : true,
            secure : true,
            sameSite : "None"
        }

        response.cookie('accessToken',newAccessToken,cookiesOption)

        return response.json({
            message : "New Access token generated",
            error : false,
            success : true,
            data : {
                accessToken : newAccessToken
            }
        })


    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export async function userDetails(request,response){
    try{
const userId =request.userId

const user = await UserModel.findById(userId).select('-password -refresh_token')

return response.json({
    message :'user details',
    data :user,
    error :false,
    success:true
})
    } catch (error){
return response.status(500).json({
    message:"something is wrong",
    error : true,
    success:false
})  
    }
    
}


export async function getAllFarmersController(req, res) {
    try {
      // Fetch only FARMER role users
      const farmers = await UserModel.find({ role: "FARMER" })
        .select("farmerId name mobile district avatar status"); // choose fields to send
  
      if (!farmers || farmers.length === 0) {
        return res.json({
          success: true,
          data: [],
          message: "No farmers found"
        });
      }
  
      // Format data for frontend
      const formattedFarmers = farmers.map(farmer => ({
        farmerId: farmer.farmerId,
        name: farmer.name,
        image: farmer.avatar || "",    
        district: farmer.district || "",  
        contact: farmer.mobile || "",  
        status: farmer.status ||""
                  
      }));
      console.log("response",formattedFarmers)
      return res.json({
        success: true,
        data: formattedFarmers,
      });
  
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: true,
        message: error.message || "Error fetching farmers",
      });
    }
  }

  export const getFarmerById = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Validate ID exists
      if (!id) {
        return res.status(400).json({ 
          success: false, 
          message: "Farmer ID is required" 
        });
      }
  
      // Find by farmerId instead of _id and populate address details
      const farmer = await UserModel.findOne({ farmerId: id })
        .select('-password -refresh_token')
        .populate({
          path: 'address_details',   // field in UserModel holding ObjectId refs
          model: 'address',          // Address collection
          select: 'address_line city mobile -_id', // select only required fields
        });
  
      if (!farmer) {
        return res.status(404).json({ 
          success: false, 
          message: "Farmer not found" 
        });
      }
  
      // Verify the user is actually a farmer
      if (farmer.role !== "FARMER") {
        return res.status(403).json({ 
          success: false, 
          message: "Requested user is not a farmer" 
        });
      }
  
      console.log("Retrieved farmer:", farmer);
      res.json({ 
        success: true, 
        farmer 
      });
  
    } catch (error) {
      console.error("Error in getFarmerById:", error);
      res.status(500).json({ 
        success: false, 
        message: "Internal server error",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  };
  
  export const deleteFarmer = async (req, res) => {
    try {
      const { id } = req.params;
      console.log("id", id);
  
      if (!id) {
        return res.status(400).json({ 
          success: false, 
          message: "Farmer ID is required" 
        });
      }
  
      // Find the farmer by farmerId first
      const farmer = await UserModel.findOne({ farmerId: id });
      
      if (!farmer || farmer.role !== "FARMER") {
        return res.status(404).json({ success: false, message: "Farmer not found" });
      }
  
      // Delete using the _id we found
      await UserModel.findByIdAndDelete(farmer._id);
  
      res.json({ success: true, message: "Farmer deleted" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };

  export const suspendFarmer = async (req, res) => {
    try {
      const { id } = req.params;
  
      if (!id) {
        return res.status(400).json({ 
          success: false, 
          message: "Farmer ID is required" 
        });
      }
  
      const farmer = await UserModel.findOne({ farmerId: id });
  
      if (!farmer || farmer.role !== "FARMER") {
        return res.status(404).json({ success: false, message: "Farmer not found" });
      }
  
      // Update status using the enum values
      farmer.status = farmer.status === 'Suspended' ? 'Active' : 'Suspended';
      await farmer.save();
  
      res.json({ 
        success: true, 
        farmer, 
        message: `Farmer ${farmer.status === 'Suspended' ? 'suspended' : 'activated'}` 
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Server error" });
    }
};



 
export async function getAllBuyerController(req, res) {
    try {
      const users = await UserModel.find({ role: "USER" })
        .select("userId name mobile district avatar status");
  
      if (!users || users.length === 0) {
        return res.json({
          success: true,
          data: [],
          message: "No Buyer found"
        });
      }
  
      const formattedBuyers = users.map(user => ({
        buyerId: user.userId,
        name: user.name,
        image: user.avatar || "",
        district: user.district || "",
        contact: user.mobile || "",
        status: user.status || ""
      }));
      console.log("response",formattedBuyers)
      return res.json({
        success: true,
        data: formattedBuyers,
      });
  
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: true,
        message: error.message || "Error fetching buyers",
      });
    }
  }
  

  export const getBuyerById = async (req, res) => {
    try {
      const { id } = req.params;
  
      if (!id) {
        return res.status(400).json({ success: false, message: "Buyer ID is required" });
      }
      const buyer = await UserModel.findOne({ userId: id })
      .select('-password -refresh_token')
      .populate({
        path: 'address_details',   
        model: 'address',          
        select: 'address_line city mobile -_id', 
      });
      
         
  
      if (!buyer) {
        return res.status(404).json({ success: false, message: "Buyer not found" });
      }
  
      if (buyer.role !== "USER") {
        return res.status(403).json({ success: false, message: "Requested user is not a buyer" });
      }
  console.log("Retrieved buyer:", buyer);
      res.json({ success: true, buyer });
    } catch (error) {
      console.error("Error in getBuyerById:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };
  
  export const deleteBuyer = async (req, res) => {
    try {
      const { id } = req.params;
  
      if (!id) return res.status(400).json({ success: false, message: "Buyer ID is required" });
  
      const buyer = await UserModel.findOne({ userId: id });
  
      if (!buyer || buyer.role !== "USER") {
        return res.status(404).json({ success: false, message: "Buyer not found" });
      }
  
      await UserModel.findByIdAndDelete(buyer._id);
  
      res.json({ success: true, message: "Buyer deleted" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };
  
  export const suspendBuyer = async (req, res) => {
    try {
      const { id } = req.params;
  
      if (!id) return res.status(400).json({ success: false, message: "Buyer ID is required" });
  
      const buyer = await UserModel.findOne({ userId: id });
  
      if (!buyer || buyer.role !== "USER") {
        return res.status(404).json({ success: false, message: "Buyer not found" });
      }
  
      buyer.status = buyer.status === 'Suspended' ? 'Active' : 'Suspended';
      await buyer.save();
  
      res.json({
        success: true,
        buyer,
        message: `Buyer ${buyer.status === 'Suspended' ? 'suspended' : 'activated'}`
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };
  