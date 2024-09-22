import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email address is required"],
      validate: {
        validator: function (email: string) {
          const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
          return re.test(email);
        },
        message: "Please fill a valid email address",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    avatar: {
      type: String,
      default:
        "https://res.cloudinary.com/dkbothcn5/image/upload/v1726651538/h-tube-image/computed-filename-using-request.jpg",
    },
    roleId: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
    background: {
      type: String,
      default:
        "https://res.cloudinary.com/dkbothcn5/image/upload/v1727019261/t%E1%BA%A3i_xu%E1%BB%91ng_i2b6sd.jpg",
    },
    description: {
      type: String,
      default: "This is the user description.",
    },
  },
  {
    timestamps: true,
  }
);

export const UserModel = mongoose.model("User", UserSchema);
