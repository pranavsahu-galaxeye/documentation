import { Stack } from "@mui/material";
import { useAtomValue, useSetAtom } from "jotai";
import {
	listOfFilteredOrderDataAtom,
	totalOrdersThatAreEitherInProcessedOrProcessingStateAtom,
} from "@/jotai/index";
import SearchBarForOrders from "../../searchBarForOrders";
import OrderCardElement from "./orderCardElement";
import { useEffect } from "react";

const styles = {
	customScrollbar: {
		"&::-webkit-scrollbar": {
			width: "10px",
		},
		"&::-webkit-scrollbar-thumb": {
			background: "#888",
			borderRadius: "5px",
		},
		"&::-webkit-scrollbar-thumb:hover": {
			background: "#555",
		},
	},
};

/**
 * This component shows the search bar, filters and
 * the filtered orders (in case of no filters, it will be all order data)
 */
function LandingPageOrderData() {
	//Get filtered order data from jotai atom
	const FILTERED_ORDER_DATA = useAtomValue(listOfFilteredOrderDataAtom);
	//Get the setter function to update the total count of processed and procesing orders whenever FILTERED_ORDER_DATA changes
	const SET_TOTAL_ORDERS_THAT_ARE_EITHER_IN_PROCESSED_OR_PROCESSING_STATE = useSetAtom(
		totalOrdersThatAreEitherInProcessedOrProcessingStateAtom
	);
	//Effect to update total processed and processing order count
	useEffect(() => {
		SET_TOTAL_ORDERS_THAT_ARE_EITHER_IN_PROCESSED_OR_PROCESSING_STATE(0);// initialize count
		//Iterate through FILTERED_ORDER_DATA
		FILTERED_ORDER_DATA?.map((item) => {
			console.log(item.insights[0]?.status, "ello");
			//Count orders that are either processed or have noinsights
			if (item.insights[0]?.status == "processed" || !item.insights[0]) {
				SET_TOTAL_ORDERS_THAT_ARE_EITHER_IN_PROCESSED_OR_PROCESSING_STATE(
					(TOTAL_ORDERS_THAT_ARE_EITHER_IN_PROCESSED_OR_PROCESSING_STATE) =>
						TOTAL_ORDERS_THAT_ARE_EITHER_IN_PROCESSED_OR_PROCESSING_STATE + 1
				);
			}
		});
	}, [FILTERED_ORDER_DATA, SET_TOTAL_ORDERS_THAT_ARE_EITHER_IN_PROCESSED_OR_PROCESSING_STATE]);

	return (
		<>
			{/* Assuming SearchBar is a component you have */}
			<Stack
				direction="row"
				className="w-full"
				justifyContent="center"
				alignItems="center"
				spacing={1}
			>
				<SearchBarForOrders />
				{/* <FilterOrders /> */}
			</Stack>

			<Stack
				direction="column"
				spacing={2}
				alignItems="center"
				sx={{
					display: "flex",
					width: "100%",
					height: "100%",
					overflowY: "auto",
					mt: "5px",
					...styles.customScrollbar,
				}}
			>
				{FILTERED_ORDER_DATA?.map((item, index) => {
					console.log(item, "dadadadadadadadad");
					if (item.status === "active") {
						return (
							<OrderCardElement
								key={item.id}
								index={index}
								orderID={item.id}
								orderTitle={item.name}
								status={item.status}
								city="C"
								country="C"
								initialOrderStatus={item.insights[0]?.status}
								runningPonds={item.running_ponds}
								averageDoC={item.avg_doc}
								numberOfPonds={item.total_ponds}
								lastInsightDate={
									item?.insights[0]?.insight_date
										? item.insights[0].insight_date
										: false
								}
								regionCoordinates={item.insights[0]?.AOI?.polygon?.coordinates}
								farmAndPondInfo={item.insights}
								can_access={item.can_access}
								running_acreage={item.total_running_acerage}
							/>
						);
					}
				})}
			</Stack>

			{/* Assuming LandingSideBoxFooterButtons is another component you have */}
			{/* <LandingSideBoxFooterButtons /> */}
		</>
	);
}

export default LandingPageOrderData;
