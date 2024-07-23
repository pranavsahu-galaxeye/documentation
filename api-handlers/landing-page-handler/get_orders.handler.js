import { cookiesValuesAtom, listOfAllOrderDataAtom } from "@/jotai/index";
import { getDefaultStore } from "jotai";
import request_handler from "../request.handler";
import endpoints from "@/constants/endpoints";

//To get the user's orders
export default async function GetOrderDataHandler() {
	const store = getDefaultStore();
	const listOfAllOrderData = store.get(listOfAllOrderDataAtom);
	if (listOfAllOrderData) {
		return listOfAllOrderData;
	}
	const COOKIES = store.get(cookiesValuesAtom);
	// Send the request with userID from the user data we stored in the global state and access token
	const outputOrder = await request_handler({
		method: "POST",
		endpoint: endpoints.glxBlue.processingOrder,
		data: {
			userId: COOKIES.user_id,
		},
		successToast: false,
	});
	// Extract the order information from response
	const allInfoOrders = outputOrder?.order;
	console.log(allInfoOrders, "allInfoOrders");
	return allInfoOrders;
}
