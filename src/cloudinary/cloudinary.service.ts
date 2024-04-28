import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import sharp from "sharp";

@Injectable()
export class CloudinaryService {
  private readonly cloudinary: typeof cloudinary;
  constructor(private config: ConfigService) {
    this.cloudinary = cloudinary;
    this.cloudinary.config({
      secure: false,
      cloud_name: this.config.getOrThrow("cloudinary.cloud_name"),
      api_key: this.config.getOrThrow("cloudinary.api_key"),
      api_secret: this.config.getOrThrow("cloudinary.api_secret"),
    });
  }
  async uploader(file: Express.Multer.File) {
    try {
      const image = await sharp(file.buffer)
        .resize({
          width: 200,
          height: 200,
          fit: sharp.fit.inside,
          withoutEnlargement: true,
        })
        .jpeg({ quality: 100 })
        .toBuffer();
      const upload = await new Promise<UploadApiResponse>((resolve, reject) => {
        this.cloudinary.uploader
          .upload_stream(
            {
              resource_type: "image",
              folder: "profile-photo",
            },
            (error, uploadResult) => {
              if (error) {
                return reject(error);
              }
              return resolve(uploadResult);
            },
          )
          .end(image);
      });
      return upload.secure_url || upload.url;
    } catch (error) {
      Logger.error(error);
    }
  }
}
