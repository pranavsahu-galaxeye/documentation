import request_handler from "../request.handler";
import endpoints from "@/constants/endpoints";

// This function is made to get an answer from the bot based on the questionId and regionId
export default async function getBotAnswer(questionID, regionID) {
	// send an asynchronous post request to the "bluebot" endpoint
	const answerByBot = await request_handler({
		method: "POST",
		endpoint: endpoints.blueBot,
		data: {
			question: questionID.toString(),
			orderid: regionID.toString(),
			version: "1.0.0",
		},
		successToast: false, // Disable toast notification for successful request
	});
	console.log(answerByBot, "regionID");
	return answerByBot;
}
