import { useLocation } from 'react-router-dom';
import { getCurrentProfileFromServer,postMessageToServer } from "@/Services/HttpClient.tsx";
import { useContext, useEffect, useState } from "react";
import { useAuth } from "@/Services/Auth.tsx";
import { ProfileType } from "@/DoggrTypes.ts";
import "../assets/css/Message.css"
export const Message= () => {
    const location = useLocation()
    const { from } = location.state

    const [currentProfile, setCurrentProfile] = useState<ProfileType>();
    const [message, setMessage] = useState("");

	const auth = useAuth();

    const fetchProfile = () => {
		getCurrentProfileFromServer()
			.then((response) => setCurrentProfile(response))
			.catch( (err) => console.log("Error in fetch profile", err));
	};

    const setCurrentId = () => {
        if (currentProfile) {
            for (let i= 0; i < currentProfile.length; i++){
                if ( currentProfile[i].id == from){
                    setCurrentProfile(currentProfile[i])
                }
            }
        }
    }
    const showMessage = () => {
        console.log(message)
        postMessageToServer(auth.userId, currentProfile.id, message);
        setMessage("")
    }

	useEffect(() => {
		fetchProfile();
	}, []);

    setCurrentId();
    console.log(auth.userId)

    if (currentProfile){
        return (
        <div className = "Message">
            <div> Name: {currentProfile.name}</div>
            <div> Pet Type: {currentProfile.petType}</div>
            <form>
            <label>Enter Message:
                <input
                type="text" 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                />
            </label>
            </form>
        <button onClick = { showMessage}>Send Message</button>
        </div>)
    }
    else {
    return(
        <div></div>
        )
    }

}