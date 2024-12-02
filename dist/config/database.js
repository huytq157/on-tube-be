"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
async function connectDatabase(url) {
    try {
        await mongoose_1.default.connect(url, {});
        console.log("⚡️[database]: Kết nối cơ sở dữ liệu thành công!");
    }
    catch (error) {
        console.error("⚡️[database]: Kết nối cơ sở dữ liệu thất bại!", error);
    }
}
exports.default = connectDatabase;
