import "@css/DoggrStyles.css";
import { profileState } from "@/Services/RecoilState.tsx";
import { useRecoilValue } from "recoil";

const minioHost = import.meta.env.MINIO_HOST;
const minioPort = import.meta.env.MINIO_PORT;

const minioBaseUrl = "http://" + minioHost + ":" + minioPort + "/doggr/";

export function Profile() {
	const currentProfile = useRecoilValue(profileState);
	const minioUrl = minioBaseUrl + currentProfile.imgUri;

	return (
		<div className={"flex flex-col items-center rounded-t-box bg-slate-700 w-4/5 mx-auto"}>
			<img className="rounded w-128 h-128 mt-4" src={minioUrl} alt="Profile of pet" />
			<div className={"text-4xl text-blue-600"}>{currentProfile.name}</div>
			<div className={"text-2xl text-blue-300"}>Pet Type: {currentProfile.petType}</div>

		</div>
	);
}
