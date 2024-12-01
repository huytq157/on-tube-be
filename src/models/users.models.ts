import mongoose, { Schema } from "mongoose";

export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  avatar?: string;
  roleId: "USER" | "ADMIN";
  background?: string;
  description?: string;
  watchedVideos?: {
    video: mongoose.Types.ObjectId;
    watchTime: number;
    watchedAt: Date;
  }[];
  googleId?: string;
  [key: string]: any;
}

const UserSchema = new mongoose.Schema<IUser>(
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
    },
    avatar: {
      type: String,
      default:
        "https://res.cloudinary.com/dkbothcn5/image/upload/v1727074201/images.jpg",
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
    watchedVideos: [
      {
        video: { type: Schema.Types.ObjectId, ref: "Video" },
        watchTime: { type: Number },
        watchedAt: { type: Date, default: Date.now },
      },
    ],
    googleId: { type: String, unique: true },
  },
  {
    timestamps: true,
  }
);

export const UserModel = mongoose.model<IUser>("User", UserSchema);
