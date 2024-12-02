import mongoose, { ConnectOptions } from "mongoose";

async function connectDatabase(url: string) {
  try {
    await mongoose.connect(url, {} as ConnectOptions);
    console.log("⚡️[database]: Kết nối cơ sở dữ liệu thành công!");
  } catch (error) {
    console.error("⚡️[database]: Kết nối cơ sở dữ liệu thất bại!", error);
  }
}

export default connectDatabase;
