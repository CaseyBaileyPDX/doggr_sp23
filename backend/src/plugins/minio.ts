import {Client} from "minio";

export const minioClient = new Client({
	endPoint: "127.0.0.1",
	port: 9000,
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
