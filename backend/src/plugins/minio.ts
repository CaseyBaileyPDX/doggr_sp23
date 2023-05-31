import dotenv from "dotenv";
dotenv.config();
import {Client} from "minio";

export const minioClient = new Client({
	endPoint: process.env.MINIO_HOST,
	port: Number(process.env.MINIO_PORT),
	useSSL: false,
	accessKey: "minioUser",
	secretKey: "minioPass",
})

export const UploadFileToMinio = async(file: any): Promise<boolean> => {
	let success = false;

	try {
		await minioClient.putObject("doggr", file.filename, file.file, (error: any, etag: any) => {
			if (error) {
				console.log("Minio client saving failed", error);
				success = false;
			} else {
				success = true;
				console.log("Minio saved file successfully")
			}
		})
	} catch (err) {
		success= false;
		console.error(err);
	}

	return success;
}
