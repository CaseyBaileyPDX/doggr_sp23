
import { Profile } from "@/Components/Profile.tsx";
import { MatchActionBar } from "@/Components/MatchActionBar.tsx";
import { ProfileType } from "@/DoggrTypes.ts";
import { useAuth } from "@/Services/Auth.tsx";
import { MatchService } from "@/Services/MatchService.tsx";
import { PassService } from "@/Services/PassService.tsx";
import { ProfileService } from "@/Services/ProfileService.tsx";
import { useContext, useEffect, useState } from "react";

export const Match = () => {
	const [currentProfile, setCurrentProfile] = useState<ProfileType>();

	const auth = useAuth();

	// const fetchProfile = () => {
	// 	ProfileService.getNextProfileFromServer()
	// 		.then((response) => setCurrentProfile(response))
	// 		.catch( (err) => console.log("Error in fetch profile", err));
	// };
	//
	// useEffect(() => {
	// 	fetchProfile();
	// }, []);
	//


	return (<>
		<Profile />
		<MatchActionBar/>
		</>
	);
};
