import { Box, Button, Stack, Typography } from "@mui/material";//Import necessary components from material-UI
import UndoIcon from "@mui/icons-material/Undo";//Import Undo icon from material UI icons
import { useAtomValue } from "jotai";//useAtomValue hook from jotai state management
import { useNavigate, useParams } from "react-router-dom";//Import hooks react router dom for navigation and URL parameters
import { currentOrderDataAtom } from "@/jotai/index";//Import specific atom from jotai
import { useMemo } from "react";//Import useMemo hook from React


//This component renders the header buttons and title for the region insight page
function RegionInsightHeaderButtons() {
	const { mandalId, villageId } = useParams();//Extract mandalId and villageId from the URL parameters
	const CURRENT_ORDER_DATA = useAtomValue(currentOrderDataAtom);//Get the current order data from the jotai atom
	const navigate = useNavigate();//get the navigate function for the navigation

	//Memoize the type of name based on the preference of mandalID and villageID
	const typeOfName = useMemo(() => {
		if (mandalId) {
			if (villageId) {
				return "Village";//If villageID is present, return "Village"
			}
			return "Mandal";//If Only mandlaID is present, return "Mandal"
		}
		return "District";//If neither is present, return "District"
	}, [mandalId, villageId]);

	return (
		<Stack
			direction="row"//Arrange Item in a row
			justifyContent="space-between"//Distribute state between Items
			alignItems="center"//Align items vertically centered
			spacing={2}//Add space between Items
			sx={{ width: "100%", marginBottom: 5 }}//set the width to 100% and add both bottom margin
		>
			{/* Title displaying the current order data name and type of name */}
			<Typography variant="h5" sx={{ lineHeight: 1 }}>
				{CURRENT_ORDER_DATA.name}{" "}
				{CURRENT_ORDER_DATA.name && <span className="text-sm">({typeOfName})</span>}
			</Typography>
			<Box
				m={0.5}
				//margin
				display="flex" 
			> {/* Box to contain the back button */}
				<Button
					variant="outlined" //set button variant to outlined
					startIcon={<UndoIcon />}//add undo icon at the start of the button
					sx={{
						width: 90,
						padding: 1,
						color: "white",
						borderColor: "grey",
						alignItems: "left",
						alignContent: "left",
					}}
					onClick={() => {
						navigate(-1);//navigate back to the previous page
					}}
				>
					Back
				</Button>
			</Box>
		</Stack>
	);
}

export default RegionInsightHeaderButtons;
