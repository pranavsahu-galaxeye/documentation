import { cookiesValuesAtom, graphDataForLandingPageAtom } from "@/jotai/index";
import { getDefaultStore } from "jotai";
import request_handler from "../request.handler";
import endpoints from "@/constants/endpoints";

// To load the all the stats of the user which contains how many farms are "Empty", "Harvested", "Just Pumped", "Running"
export default async function getAllStatsHandler() {
	const store = getDefaultStore();//Get the jotai default store
	const graphDataForLandingPage = store.get(graphDataForLandingPageAtom);//Get graph data from the store
	//If graph data is already available in the store, return it
	if (graphDataForLandingPage) {
		return graphDataForLandingPage;
	}
	const COOKIES = store.get(cookiesValuesAtom);//Get cookie values from the store
	// Send the request with userID from the user data we stored in the global state and access token
	const graphData = await request_handler({
		method: "post",
		endpoint: endpoints.glxBlue.allStats,
		data: {
			userId: COOKIES.user_id,//UserID from the cookies
		},
		successToast: false,//Disable success toast notification
	});
	console.log(graphData, "graphData");//Log the received graph data
	return graphData;//Return the graph Data
}
