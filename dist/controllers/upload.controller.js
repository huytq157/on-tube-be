"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAudio = exports.uploadAudios = exports.getVideo = exports.uploadVideos = exports.getImage = exports.uploadImages = void 0;
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = require("cloudinary");
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const storageImage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: {
        folder: 'h-tube-image',
        format: async (req, file) => {
            const ext = file.originalname.split('.').pop();
            switch (ext) {
                case 'jpg':
                case 'jpeg':
                    return 'jpg';
                case 'png':
                    return 'png';
                case 'gif':
                    return 'gif';
                default:
                    return 'png';
            }
        },
        public_id: (req, file) => {
            const timestamp = Date.now();
            const ext = file.originalname.split('.').pop();
            return `h-tube-image-${timestamp}-${file.originalname.replace(`.${ext}`, '')}`;
        },
        transformation: [{ width: 600, crop: 'limit' }, { quality: 'auto' }, { fetch_format: 'webp' }],
    },
});
const upload = (0, multer_1.default)({ storage: storageImage }).array('images', 10);
const uploadImages = (req, res) => {
    upload(req, res, function (err) {
        if (err) {
            return res.status(500).json({ code: '500', message: 'Error', error: err.message });
        }
        const files = req.files;
        const data = files.map((file) => ({
            fileName: file.filename,
            size: file.size,
            url: file.path,
        }));
        res.status(200).json({ code: '200', message: 'Done', data });
    });
};
exports.uploadImages = uploadImages;
const getImage = async (req, res) => {
    try {
        const fileName = req.params.fileName;
        const result = await cloudinary_1.v2.api.resource(fileName);
        const fileDetails = {
            fileName: result.public_id,
            format: result.format,
            width: result.width,
            height: result.height,
            bytes: result.bytes,
            url: result.secure_url,
            created_at: result.created_at,
        };
        res.status(200).json({ code: '200', message: 'Done', data: fileDetails });
    }
    catch (err) {
        res.status(500).json({ code: '500', message: 'Error', error: err.message });
    }
};
exports.getImage = getImage;
const storageVideo = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: {
        folder: 'h-tube-video',
        format: async (req, file) => {
            const ext = file.originalname.split('.').pop();
            switch (ext) {
                case 'mp4':
                    return 'mp4';
                case 'webm':
                    return 'webm';
                case 'ogv':
                    return 'ogv';
                default:
                    return 'mp4';
            }
        },
        public_id: (req, file) => `videos/${Date.now()}-${file.originalname.split('.')[0]}`,
        resource_type: 'video',
        eager_async: true,
        eager: [
            { width: 800, crop: 'scale' },
            { width: 500, height: 500, crop: 'crop', gravity: 'center' },
        ],
    },
});
const uploadVideo = (0, multer_1.default)({ storage: storageVideo }).array('videos', 10);
const uploadVideos = (req, res) => {
    uploadVideo(req, res, function (err) {
        if (err) {
            return res.status(500).json({ code: '500', message: 'Error', error: err.message });
        }
        const files = req.files;
        const data = files.map((file) => ({
            fileName: file.filename,
            size: file.size,
            url: file.path,
        }));
        res.status(200).json({ code: '200', message: 'Done', data });
    });
};
exports.uploadVideos = uploadVideos;
const getVideo = async (req, res) => {
    try {
        const fileName = req.params.fileName;
        const result = await cloudinary_1.v2.api.resource(fileName, {
            resource_type: 'video',
        });
        const videoDetails = {
            fileName: result.public_id,
            format: result.format,
            duration: result.duration,
            width: result.width,
            height: result.height,
            bytes: result.bytes,
            url: result.secure_url,
            created_at: result.created_at,
        };
        res.status(200).json({ code: '200', message: 'Done', data: videoDetails });
    }
    catch (err) {
        res.status(500).json({ code: '500', message: 'Error', error: err.message });
    }
};
exports.getVideo = getVideo;
const storageAudio = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: {
        folder: 'h-tube',
        format: async (req, file) => {
            const ext = file.originalname.split('.').pop();
            switch (ext) {
                case 'mp3':
                    return 'mp3';
                case 'wav':
                    return 'wav';
                case 'ogg':
                    return 'ogg';
                default:
                    return 'mp3';
            }
        },
        public_id: (req, file) => `audio/${Date.now()}-${file.originalname.split('.')[0]}`,
        resource_type: 'raw',
    },
});
const uploadAudio = (0, multer_1.default)({ storage: storageAudio }).array('audios', 10);
const uploadAudios = (req, res) => {
    uploadAudio(req, res, function (err) {
        if (err) {
            return res.status(500).json({ code: '500', message: 'Error', error: err.message });
        }
        const files = req.files;
        const data = files.map((file) => ({
            fileName: file.filename,
            size: file.size,
            url: file.path,
        }));
        res.status(200).json({ code: '200', message: 'Done', data });
    });
};
exports.uploadAudios = uploadAudios;
const getAudio = async (req, res) => {
    try {
        const fileName = req.params.fileName;
        const result = await cloudinary_1.v2.api.resource(fileName, {
            resource_type: 'raw',
        });
        const audioDetails = {
            fileName: result.public_id,
            format: result.format,
            bytes: result.bytes,
            url: result.secure_url,
            created_at: result.created_at,
        };
        res.status(200).json({ code: '200', message: 'Done', data: audioDetails });
    }
    catch (err) {
        res.status(500).json({ code: '500', message: 'Error', error: err.message });
    }
};
exports.getAudio = getAudio;
