import { useAuth } from "@/Services/Auth.tsx";
import { MatchService } from "@/Services/MatchService.tsx";
import { PassService } from "@/Services/PassService.tsx";
import { ProfileService } from "@/Services/ProfileService.tsx";
import { profileState } from "@/Services/RecoilState.tsx";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";


export function MatchActionBar() {
	const auth = useAuth();
	const navigate = useNavigate();
	const [currentProfile, setCurrentProfile] = useRecoilState(profileState);

	const onLikeButtonClick = () => {
		console.log("In like button click");
		MatchService.send(auth.userId, currentProfile.id)
			.then(ProfileService.getNextProfileFromServer)
			.then(setCurrentProfile)
			.catch(async (err) => {
				console.error(err);
				const newProfile = await ProfileService.getNextProfileFromServer();
				setCurrentProfile(newProfile);
			});
	};

	const onPassButtonClick = () => {
		PassService.send(auth.userId, currentProfile.id)
			.then(ProfileService.getNextProfileFromServer)
			.then(setCurrentProfile)
			.catch(async (err) => {
				console.error(err);
				const newProfile = await ProfileService.getNextProfileFromServer();
				setCurrentProfile(newProfile);
			});
	};

	const onMessageButtonClick = () => {
		navigate('/message');
	};

	return(
		<div className={"flex items-center justify-center rounded-b-box bg-slate-700 w-4/5 mx-auto space-x-8 pt-3 pb-2"}>
			<button className="btn btn-circle" onClick={onPassButtonClick}>Pass</button>
			<button className="btn btn-circle" onClick={onLikeButtonClick}>Like</button>
			<button className="btn btn-circle" onClick={onMessageButtonClick}>Message</button>
		</div>
	);
}
