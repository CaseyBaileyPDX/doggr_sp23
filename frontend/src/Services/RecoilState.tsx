import { ProfileService } from "@/Services/ProfileService.tsx";
import { atom } from "recoil";


export const profileState = atom({
	key: 'profileState',
	default: ProfileService.getNextProfileFromServer(),
});



