import axios from "axios";
import { getDefaultStore } from "jotai";
import { userAccessTokensAtom } from "../jotai";
import toast from "react-hot-toast";

/**
 * @typedef ResponseObject
 * @property {string} message Error or Success Message.
 * @property {boolean} success True if it is resolved otherwise False.
 * @property {number} code Response Code.
 * @property {object} data Response data.
 */
export const responseObject = {
	message: "",
	success: false,
	code: 400,
	data: {},
};

/**
 * This method is the global method for Calling API request in the frontend
 * @param {object} RequestObject
 * @param {"get"|"put"|"post"|"delete"} [RequestObject.method] - Accepted methods "get", "post", "put", "delete"
 * @param {string} RequestObject.endpoint - API Endpoint.
 * @param {string} [RequestObject.domain] - API Domain.
 * @param {object} [RequestObject.data] - Data to send with Request.
 * @param {boolean} [RequestObject.successToast] - To show success toast.
 * @param {boolean} [RequestObject.errorToast] - To show error toast.
 * @param {object} [RequestObject.headers] - Headers for the request
 * @param {boolean} [RequestObject.isAuthenticationRequired] - Is user access token is required
 *
 * @returns {Promise<ResponseObject>} Promise which resolves or rejects with object
 */
export default async function request_handler({
	method = "get",
	endpoint = "",
	data = {},
	successToast = false,
	errorToast = true,
	headers = {},
	isAuthenticationRequired = true,
}) {
	return new Promise((resolve, reject) => {
		// Handling authentication if required
		if (isAuthenticationRequired) {
			const defaultStore = getDefaultStore();
			const USER_ACCESS_TOKEN_VALUE = defaultStore.get(userAccessTokensAtom);
			if (!USER_ACCESS_TOKEN_VALUE) {
				toast.error("Please log in to continue");
				reject({ ...responseObject, message: "Please log in to continue" });
				return;
			}
			headers.Authorization = USER_ACCESS_TOKEN_VALUE;
		}
		// Prepare the request object
		const req_obj = {
			method: method,
			url: endpoint,
			params: method === "get" ? data : {},
			data: method !== "get" ? data : {},
			responseType: "json", //Response Type must be JSON
			// timeout: 30000,
			headers: {
				"Content-Type": "application/json",
				...headers,
			}, //HEADERS for the server side generated request
		};

		console.log("Sending request", req_obj);
		// Sending the request using axios
		axios
			.request(req_obj)
			.then((res) => {
				const data = res.data;
				/*If success and successToast is true, show the toast message*/
				if (successToast && data.message) {
					//Show toast from the incoming message
					toast.success(data.message, {
						id: new Date().getTime(),
					});
				}
				if (data.status === 400) {
					throw new Error(data.message);
				}
				resolve(data);
			})
			.catch((error) => {
				console.error(error);
				let err = {};
				// Check if the error has a response status of 0 and a message
				// A status code of 0 often indicates a network-level error or a request that couldn't be completed.
				// It can occur due to network connectivity issues, CORS errors, blocked requests, or request abortion.
				if (error && error?.response?.status === 0 && error?.message) {
					// Request that couldn't be completed or Network Error
					err = { ...responseObject };
					err.message = error.message;
				}
				//Or success is false
				else if (error && (error.response?.data?.detail || error.response?.data?.message)) {
					err = error.response.data;
					err.message = error.response?.data?.detail || error.response?.data?.message;
				}
				// Handle any other errors
				else {
					// General error handling
					err = { ...responseObject };
					err.message = `Something went wrong on our side. Please try again. Sorry for the inconvenience`;
				}
				// Log the error and show an error toast
				if (errorToast && err.message) {
					//Show the toast message here
					toast.error(err.message, {
						id: new Date().getTime(),
					});
				}
				reject(err);
			});
	});
}
