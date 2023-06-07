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

export const UploadFileToMinio = async (file: any): Promise<boolean> => {
	try {
		await new Promise((resolve, reject) => {
			minioClient.putObject('doggr', file.filename, file.file, (error: any, etag: any) => {
				if (error) {
					console.log('Minio client saving failed', error);
					reject(error);
				} else {
					console.log('Minio saved file successfully');
					resolve(etag);
				}
			});
		});
		return true;
	} catch (err) {
		console.error(err);
		return false;
	}
};
