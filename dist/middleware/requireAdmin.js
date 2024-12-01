"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const users_models_1 = require("../models/users.models");
const requireAdmin = async (req, res, next) => {
    try {
        const user = await users_models_1.UserModel.findById(req.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found!",
            });
        }
        if (user.roleId !== "ADMIN") {
            return res.status(403).json({
                success: false,
                message: "Bạn không có quyền thực hiện hành động này.",
            });
        }
        next();
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error!",
        });
    }
};
exports.default = requireAdmin;
