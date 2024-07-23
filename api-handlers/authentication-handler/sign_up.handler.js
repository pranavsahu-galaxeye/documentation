import endpoints from "@/constants/endpoints";
import { userAccessTokensAtom } from "@/jotai/index";
import { getDefaultStore } from "jotai";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import request_handler from "../request.handler";
import { history } from "@/constants/index";

/**
 * This function sends a request for user signing up
 */
export default async function userSignUpHandler(request_body) {
	try {
		const store = getDefaultStore();//Get the default jotai store

		//Make a Post request to the sign-up endpoint with the provided request body
		const data = await request_handler({
			method: "post",
			endpoint: endpoints.signedUp,
			data: request_body,
			isAuthenticationRequired: false,
			errorToast: false,
		});
		const accessToken = data.accessToken;//Extract access token from the response data

		//set the access token in cookies with specified options
		Cookies.set("accessToken", accessToken, {
			expires: 604800,//Cookie expiration time in second (7 days)
			path: "/",//Cookiepath
			secure: true,//Secure cookie flag
			sameSite: "Lax",//Samesite attribute
			// domain: window.location.hostname,
			// httpOnly: true,
			// domain: ".galaxeye.space",
		});
		toast.success("Logged in successfully");//Show success toast notification
		store.set(userAccessTokensAtom, accessToken);//Update the access token in jotai store
		history.navigate("/");//Navigate to the home page
	} catch (err) {
		console.error(err);
		toast.error("Something went wrong! Please try again or contact support");//Show error toast notification
	}
	return;
}
