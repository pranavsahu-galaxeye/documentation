import { useEffect, useRef } from "react";
import Cookies from "js-cookie";
import { useLocation, useNavigate } from "react-router-dom";
import { useSetAtom } from "jotai";
import jwt_decode from "jwt-decode";
import { H } from "highlight.run";
import PropTypes from "prop-types";
import { authURLs } from "@/constants/index";
import { userAccessTokensAtom, cookiesValuesAtom } from "@/jotai/index";
import toast from "react-hot-toast";

/**
 * This component check cookies and redirect according to the different conditions
 */
const CheckCookies = ({ children }) => {
	// Set user access token
	const setUserAccessToken = useSetAtom(userAccessTokensAtom);
	const setCookies = useSetAtom(cookiesValuesAtom);
	const navigate = useNavigate();
	const location = useLocation();

	// To store the previous access token
	const prevAccessToken = useRef();

	useEffect(() => {
		//fetch accessToken cookie
		console.log("Checking cookies");
		// Get the access token from the cookies
		const accessToken = Cookies?.get("accessToken");
		// If access token does not exist and we are not on authentication pages, redirect to sign in page
		if (!accessToken && !authURLs.includes(location.pathname)) {
			// Update the global access token state to null
			setUserAccessToken(null);
			// Navigate to sign in page
			navigate("/sign-in");
			// Toast message
			toast.error("Please sign in to continue", {
				duration: 5000,
			});
			return;
		}

		// If access token exists
		if (accessToken) {
			console.log("validating", accessToken);
			console.log("setting userAccessToken");
			console.log(accessToken);
			// If the previous access token is not same as the current
			if (prevAccessToken.current !== accessToken) {
				// Set the access token
				setUserAccessToken(accessToken);
				//Update the access token
				prevAccessToken.current = accessToken;
				// Decode the token
				const decoded = jwt_decode(accessToken);
				console.log(decoded);
				// Identify user for monitoring purposes
				H.identify(`${decoded.payload.first_name}`, {
					id: `${decoded.payload.user_id}`,
					email: `${decoded.payload.email}`,
					account_type: `${decoded.payload.account_type}`,
				});
				// Set the user data
				setCookies(decoded.payload);
				// If on the authentication page, redirect to home
				if (authURLs.includes(location.pathname)) {
					navigate("/");
				}
			}
		}
	}, [location.pathname, navigate, setCookies, setUserAccessToken]);

	return <>{children}</>;
};

CheckCookies.propTypes = {
	children: PropTypes.node.isRequired,
};

export default CheckCookies;
