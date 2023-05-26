import { useAuth } from "@/Services/Auth.tsx";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({children}) => {
	const {token} = useAuth();

	if (!token) {
		return <Navigate to="/login" replace />;
	}

	return children;
};
