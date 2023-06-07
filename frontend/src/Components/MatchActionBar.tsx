import { MatchAction } from "@/DoggrTypes.ts";
import { useAuth } from "@/Services/Auth.tsx";
import { MatchService } from "@/Services/MatchService.tsx";
import { PassService } from "@/Services/PassService.tsx";
import { ProfileService } from "@/Services/ProfileService.tsx";
import { profileState } from "@/Services/RecoilState.tsx";
import { useNavigate } from "react-router-dom";
import { useRecoilValue, useResetRecoilState, useRecoilState } from "recoil";


export function MatchActionBar() {
	const auth = useAuth();
	const navigate = useNavigate();
	const [currentProfile, setCurrentProfile] = useRecoilState(profileState);


	const handleButtonClick = async (service: MatchAction) => {
		try {
			await service.send(auth.userId, currentProfile.id);
			const newProfile = await ProfileService.getNextProfileFromServer();
			setCurrentProfile(newProfile);
		} catch (err) {
			console.error(err);
			const newProfile = await ProfileService.getNextProfileFromServer();
			setCurrentProfile(newProfile);
		}
	};

	const onLikeButtonClick = () => handleButtonClick(MatchService);
	const onPassButtonClick = () => handleButtonClick(PassService);


	const onMessageButtonClick = () => {
		navigate('/message');
	};

	return(
		<div className={"flex items-center justify-center rounded-b-box bg-neutral w-4/5 mx-auto space-x-8 pt-3 pb-2"}>
			<button className="doggrbtn" onClick={onPassButtonClick}>Pass</button>
			<button className="doggrbtn" onClick={onLikeButtonClick}>Like</button>
			<button className="doggrbtn" onClick={onMessageButtonClick}>Message</button>
		</div>
	);
}
