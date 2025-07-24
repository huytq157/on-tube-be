"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFiles = void 0;
const multer_1 = __importDefault(require("multer"));
const googleapis_1 = require("googleapis");
const fs_1 = __importDefault(require("fs"));
// Cấu hình Multer: Lưu file tạm vào thư mục "uploads/"
const upload = (0, multer_1.default)({ dest: 'uploads/' });
// Load thông tin Google Drive từ môi trường
const CLIENT_EMAIL = process.env.GOOGLE_DRIVE_CLIENT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_DRIVE_PRIVATE_KEY?.replace(/\\n/g, '\n');
const DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID;
if (!CLIENT_EMAIL || !PRIVATE_KEY || !DRIVE_FOLDER_ID) {
    throw new Error('Missing Google Drive configuration (CLIENT_EMAIL, PRIVATE_KEY, DRIVE_FOLDER_ID).');
}
// Tạo Google Auth
const auth = new googleapis_1.google.auth.GoogleAuth({
    credentials: {
        client_email: CLIENT_EMAIL,
        private_key: PRIVATE_KEY,
    },
    scopes: ['https://www.googleapis.com/auth/drive.file'],
});
// Tạo đối tượng Drive API
const drive = googleapis_1.google.drive({ version: 'v3', auth });
const uploadFiles = async (req, res) => {
    try {
        const files = req.files;
        if (!files || files.length === 0) {
            res.status(400).json({ success: false, message: 'No files uploaded.' });
            return;
        }
        // Mảng chứa thông tin của tất cả các file đã upload
        const uploadedFiles = [];
        for (const file of files) {
            const fileMetadata = {
                name: file.originalname,
                parents: [DRIVE_FOLDER_ID],
            };
            const media = {
                mimeType: file.mimetype,
                body: fs_1.default.createReadStream(file.path), // Sử dụng stream để upload
            };
            // Upload file lên Google Drive
            const response = await drive.files.create({
                requestBody: fileMetadata,
                media: media,
                fields: 'id, name, webViewLink, webContentLink',
            });
            // Thêm thông tin file vào mảng
            uploadedFiles.push({
                fileId: response.data.id,
                fileName: response.data.name,
                webViewLink: response.data.webViewLink,
                webContentLink: response.data.webContentLink,
            });
            // Xóa file tạm sau khi upload
            fs_1.default.unlinkSync(file.path);
        }
        // Trả về thông tin của tất cả các file đã upload
        res.status(200).json({
            success: true,
            files: uploadedFiles,
        });
    }
    catch (error) {
        console.error('Error uploading files:', error.message || error);
        res.status(500).json({ success: false, message: 'File upload failed.', error });
    }
};
exports.uploadFiles = uploadFiles;
