import endpoints from "@/constants/endpoints";//Importing API endpoints constants
import { userAccessTokensAtom } from "@/jotai/index";//Importing user access tokens atom from jotai
import { getDefaultStore } from "jotai";//Importing getDefaultStore function from jotai
import Cookies from "js-cookie";//Importing js-cookie library for handling cookies
import toast from "react-hot-toast";//Importing toast from react-hot-toast for notification
import request_handler from "../request.handler";//Importing request handler for mamking API request
import { history } from "@/constants/index";//Importing history object for navigation

/**
 * This function sends a request for user signing in
 */
export default async function userSignInHandler(request_body) {
	try {
		const store = getDefaultStore();//Get the default jotai store

		//Make a POST request to the sign-in endpoint with the provided request body
		const data = await request_handler({
			method: "post",
			endpoint: endpoints.signedIn,
			data: request_body,
			isAuthenticationRequired: false,
			errorToast: false,
		});
		const accessToken = data.accessToken;//Extract access token from the response data
		//set the access token in ccokies with specified options
		Cookies.set("accessToken", accessToken, {
			expires: 604800,//cookie expirations time in seconds (7 days)
			path: "/",//cookie path
			secure: true,//Secure cookie flag
			sameSite: "Lax",//SameSite attribute
			// domain: window.location.hostname,
			// httpOnly: true,
			// domain: ".galaxeye.space",
		});
		toast.success("Logged in successfully");//Show success toast notification
		store.set(userAccessTokensAtom, accessToken);//Update the access token in jotai store
		history.navigate("/");//Navigate to home page
	} catch (err) {
		console.error(err);//Log any errors to the console
		toast.error("Incorrect Credentials");//Show error toast notification
	}
	return;
}
