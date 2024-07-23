import { currentBaseMapAtom } from "@/jotai/index";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useAtom } from "jotai";
// import ReportProblemIcon from "@mui/icons-material/ReportProblem";

// The component provide toggle button to switch between different map views
function MapToggle() {
	// Using Jotai atoms to manage the current base map state
	const [CURRENT_BASEMAP, SET_CURRENT_BASEMAP] = useAtom(currentBaseMapAtom);

	// Handle the change event when a toggle button is clicked
	const handleChange = (event) => {
		SET_CURRENT_BASEMAP(event.target.value); // Update the current base map state
	};

	return (
		<ToggleButtonGroup
			color="primary"
			value={CURRENT_BASEMAP}
			exclusive
			onChange={handleChange}
			aria-label="Platform"
			sx={{
				position: "absolute",
				left: "1vh",
				bottom: "2vh",
				zIndex: "400",
				backgroundColor: "black",
			}}
		>
			{/* Toggle Button for satellite view */}
			<ToggleButton value="satellite">Satellite View</ToggleButton>
			{/* Toggle Button for Weather Map */}
			<ToggleButton value="weather">
				Weather Map
				{/* <Tooltip
					title={
						<span className="font-normal text-[13px]">
							Cyclone Michaung
							<br></br>
							Location: <b className="capitalize">Andhra Pradesh</b>
						</span>
					}
					placement="right"
				>
					<IconButton>
						<ReportProblemIcon
							sx={{
								color: "red",
							}}
						/>
					</IconButton>
				</Tooltip> */}
			</ToggleButton>
		</ToggleButtonGroup>
	);
}

export default MapToggle;
