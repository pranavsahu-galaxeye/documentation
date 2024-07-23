/**
 * This file contains the API endpoints and their domains
 */

export const awsAPIDomain = "https://03ybm05ec1.execute-api.ap-south-1.amazonaws.com";

export const azureAPIDomain = "https://galaxeye-blue-prod.eastus.cloudapp.azure.com";

const glxBlueEndpoint = "/glx-blue-p";

export default {
	aoi: awsAPIDomain + "/aoi",
	order: awsAPIDomain + "/order",
	getSignedURL: awsAPIDomain + "/get_signed_url",
	signedIn: awsAPIDomain + "/sign-in",
	signedUp: awsAPIDomain + "/sign-up",
	placeOrder: awsAPIDomain + "/place-order",
	blueBot: azureAPIDomain + "/getBotResponse",
	glxBlue: {
		processingOrder: awsAPIDomain + glxBlueEndpoint + "/processingOrders",
		allStats: awsAPIDomain + glxBlueEndpoint + "/allStats",
		gJSon: azureAPIDomain + "/getProcessingGJSON",
		uploadResults: awsAPIDomain + glxBlueEndpoint + "/uploadResults",
	},
};
