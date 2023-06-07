import { CreateProfile } from "@/Components/CreateProfile.tsx";
import { Home } from "@/Components/HomePage.tsx";
import { Login } from "@/Components/Login.tsx";
import { Logout } from "@/Components/Logout.tsx";
import { MatchPage } from "@/Components/MatchPage.tsx";
import { MessagePage } from "@/Components/Message.tsx";
import { MessageHistory } from "@/Components/MessageHistory.tsx";
import { NavBar } from "@/Components/Navigation.tsx";
import { ProtectedRoute } from "@/Components/ProtectedRoute.tsx";
import { useAuth } from "@/Services/Auth.tsx";
import { useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import "@css/DoggrStyles.css";

export function DoggrRouter() {
	return (
		<div className={"doggrfancy"}>
			<NavBar />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/match" element={<ProtectedRoute><MatchPage /></ProtectedRoute>} />
				<Route path="/create" element={<CreateProfile/>}/>
				<Route path={"/message"} element={<MessagePage/>}/>
				<Route path={"/messagehistory"} element={<MessageHistory/>}/>
				<Route path="/login" element={<Login />} />
				<Route path="/logout" element={<Logout />} />
			</Routes>
		</div>
	);
}

