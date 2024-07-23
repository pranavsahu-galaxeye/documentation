import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { Box, Button, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { useAtom, useAtomValue } from "jotai";
import {
	cookiesValuesAtom,
	isOrderLimitSetBooleanAtom,
	totalOrdersThatAreEitherInProcessedOrProcessingStateAtom,
} from "../../../jotai";
import AddPondNameDialog from "@/components/utils/AddPondNameDialog";
import { useMap } from "react-leaflet";

/**
 * This component shows a list of button (currently only Add New Region) and form
 * for adding new region. We take a name from user for the new region
 */
function LandingSideBoxFooterButtons() {
	// State to control the dialog open/close
	const [open, setOpen] = useState(false);
	// State to save local centroid position
	const [localCentroid, setLocalCentroid] = useState(null);
	// Get and Set atoms from Jotai
	const [IS_ORDER_LIMIT_SET_BOOLEAN, SET_IS_ORDER_LIMIT_SET_BOOLEAN] = useAtom(
		isOrderLimitSetBooleanAtom
	);
	const TOTAL_ORDERS_THAT_ARE_EITHER_IN_PROCESSED_OR_PROCESSING_STATE = useAtomValue(
		totalOrdersThatAreEitherInProcessedOrProcessingStateAtom
	);
	// Get cookiesValueAtom from Jotai
	const COOKIES = useAtomValue(cookiesValuesAtom);
	const map = useMap(); // Interact with map

	// Function to handle opening the dialog
	const handleDialogClickOpen = () => {
		setOpen(true);
		const centroid = map.getCenter();
		//set the centroid position and zoom level
		setLocalCentroid({
			centroid: [centroid.lat, centroid.lng],
			zoom: map.getZoom(),
		});
	};

	// Function to handle closing the dialog
	const handleDialogClose = () => {
		setOpen(false);
		setLocalCentroid(null);
	};
	// Effect to check the order limit and update the state accordingly
	useEffect(() => {
		console.log(
			COOKIES?.allowed?.order?.limit,
			TOTAL_ORDERS_THAT_ARE_EITHER_IN_PROCESSED_OR_PROCESSING_STATE,
			"yupppp"
		);
		if (
			COOKIES?.allowed?.order?.limit <=
			TOTAL_ORDERS_THAT_ARE_EITHER_IN_PROCESSED_OR_PROCESSING_STATE
		) {
			console.log("set");
			SET_IS_ORDER_LIMIT_SET_BOOLEAN(true);
		} else {
			SET_IS_ORDER_LIMIT_SET_BOOLEAN(false);
		}
	}, [
		COOKIES,
		TOTAL_ORDERS_THAT_ARE_EITHER_IN_PROCESSED_OR_PROCESSING_STATE,
		SET_IS_ORDER_LIMIT_SET_BOOLEAN,
	]);
	//Render the component
	return (
		<Box
			sx={{
				width: "100%",
			}}
			
		>
			{/* Conditionally Render the button with the tooltip if the order limit is exceeded */}
			{IS_ORDER_LIMIT_SET_BOOLEAN ? (
				<Tooltip title="You have exceeded your order quota">
					<span>
						<Button
							variant="outlined"
							startIcon={<AddOutlinedIcon />}
							sx={{ width: "100%", padding: 1, color: "white" }}
							onClick={handleDialogClickOpen}
							disabled
						>
							New region
						</Button>
					</span>
				</Tooltip>
			) : (
				<Button
					variant="outlined"
					startIcon={<AddOutlinedIcon />}
					sx={{ width: "100%", padding: 1, color: "white" }}
					onClick={handleDialogClickOpen}
				>
					New region
				</Button>
			)}
			{/* Dialog for adding a new pond name */}
			<AddPondNameDialog
				open={open}
				handleDialogClose={handleDialogClose}
				localCentroid={localCentroid}
			/>
		</Box>
	);
}

export default LandingSideBoxFooterButtons;
