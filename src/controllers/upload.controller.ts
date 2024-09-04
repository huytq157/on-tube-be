import multer, { Multer } from "multer";
import {
  v2 as cloudinary,
  UploadApiErrorResponse,
  UploadApiResponse,
} from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { Request, Response } from "express";

cloudinary.config({
  cloud_name: process.env.YOUR_CLOUD_NAME as string,
  api_key: process.env.YOUR_API_KEY as string,
  api_secret: process.env.YOUR_API_SECRET as string,
});

interface CloudinaryParams {
  folder?: string;
  format?: (
    req: Request,
    file: Express.Multer.File
  ) => Promise<string> | string;
  public_id?: (req: Request, file: Express.Multer.File) => string;
}

const storageImage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "h-tube",
    format: async (req, file): Promise<string> => {
      const ext = file.originalname.split(".").pop();
      switch (ext) {
        case "jpg":
        case "jpeg":
          return "jpg";
        case "png":
          return "png";
        case "gif":
          return "gif";
        default:
          return "png";
      }
    },
    public_id: (req, file): string => "computed-filename-using-request",
  } as CloudinaryParams,
});

const upload = multer({ storage: storageImage }).array("images", 10);

const uploadImages = (req: Request, res: Response): void => {
  upload(req, res, function (err: any) {
    if (err) {
      return res
        .status(500)
        .json({ code: "500", message: "Error", error: err.message });
    }

    const files = req.files as Express.Multer.File[];

    const data = files.map((file) => ({
      fileName: file.filename,
      size: file.size,
      url: file.path,
    }));

    res.status(200).json({ code: "200", message: "Done", data });
  });
};

const getImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const fileName = req.params.fileName;
    const result = await cloudinary.api.resource(fileName);
    const fileDetails = {
      fileName: result.public_id,
      format: result.format,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
      url: result.secure_url,
      created_at: result.created_at,
    };
    res.status(200).json({ code: "200", message: "Done", data: fileDetails });
  } catch (err: any) {
    res.status(500).json({ code: "500", message: "Error", error: err.message });
  }
};

const storageVideo = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "h-tube",
    format: async (req, file): Promise<string> => {
      const ext = file.originalname.split(".").pop();
      switch (ext) {
        case "mp4":
          return "mp4";
        case "webm":
          return "webm";
        case "ogv":
          return "ogv";
        default:
          return "mp4";
      }
    },
    public_id: (req, file): string =>
      `videos/${Date.now()}-${file.originalname.split(".")[0]}`,
    resource_type: "video",
  } as CloudinaryParams,
});

const uploadVideo = multer({ storage: storageVideo }).array("videos", 10);

const uploadVideos = (req: Request, res: Response): void => {
  uploadVideo(req, res, function (err: any) {
    if (err) {
      return res
        .status(500)
        .json({ code: "500", message: "Error", error: err.message });
    }

    const files = req.files as Express.Multer.File[];

    const data = files.map((file) => ({
      fileName: file.filename,
      size: file.size,
      url: file.path,
    }));

    res.status(200).json({ code: "200", message: "Done", data });
  });
};

const getVideo = async (req: Request, res: Response): Promise<void> => {
  try {
    const fileName = req.params.fileName;
    const result = await cloudinary.api.resource(fileName, {
      resource_type: "video",
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
    res.status(200).json({ code: "200", message: "Done", data: videoDetails });
  } catch (err: any) {
    res.status(500).json({ code: "500", message: "Error", error: err.message });
  }
};

const storageAudio = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "h-tube",
    format: async (
      req: Request,
      file: Express.Multer.File
    ): Promise<string> => {
      const ext = file.originalname.split(".").pop();
      switch (ext) {
        case "mp3":
          return "mp3";
        case "wav":
          return "wav";
        case "ogg":
          return "ogg";
        default:
          return "mp3";
      }
    },
    public_id: (req: Request, file: Express.Multer.File): string =>
      `audio/${Date.now()}-${file.originalname.split(".")[0]}`,
    resource_type: "raw",
  } as CloudinaryParams,
});

const uploadAudio = multer({ storage: storageAudio }).array("audios", 10);

const uploadAudios = (req: Request, res: Response): void => {
  uploadAudio(req, res, function (err: any) {
    if (err) {
      return res
        .status(500)
        .json({ code: "500", message: "Error", error: err.message });
    }

    const files = req.files as Express.Multer.File[];

    const data = files.map((file) => ({
      fileName: file.filename,
      size: file.size,
      url: file.path,
    }));

    res.status(200).json({ code: "200", message: "Done", data });
  });
};

const getAudio = async (req: Request, res: Response): Promise<void> => {
  try {
    const fileName = req.params.fileName;
    const result = await cloudinary.api.resource(fileName, {
      resource_type: "raw",
    });
    const audioDetails = {
      fileName: result.public_id,
      format: result.format,
      bytes: result.bytes,
      url: result.secure_url,
      created_at: result.created_at,
    };
    res.status(200).json({ code: "200", message: "Done", data: audioDetails });
  } catch (err: any) {
    res.status(500).json({ code: "500", message: "Error", error: err.message });
  }
};

export {
  uploadImages,
  getImage,
  uploadVideos,
  getVideo,
  uploadAudios,
  getAudio,
};
