import { Box, Stack, Typography } from "@mui/material";//Import components from material-UI
import { useAtomValue } from "jotai";//Import useAtomValue hook form jotai for state management
import { metaDataForOrderAtom } from "../../../../jotai";//Import specific atom from jotai 
import RegionInsightBarChart from "../regionInsightBarChart";//Import RegionInsightBarChart component
import RegionInsightHeaderButtons from "../regionInsightHeaderButtons";//Import regionInsighgtHeaderButtons component
import RegionInsightToggleButton from "../regionInsightToggleButton";//Import regionInsightToggleButton component

/**
 * This component renders a meta data for the order as well
 * as Bar graph in case the pond selected is in running state
 * or Pie chart
 */
function RegionInsightData() {
	const METADATA_FOR_ORDER = useAtomValue(metaDataForOrderAtom); //Get the current value of metaDataOrderAtom

	return (
		<Stack direction="column" spacing={1} sx={{ height: "100%", width: "100%" }}>{/* main container stack */}
			<RegionInsightHeaderButtons />{/* Render header buttons component */}
			<Stack direction="row" justifyContent="center" alignItems="flex-start" spacing={2}>{/* inner stack for running acreage and ponds info */}
				<Box
					component="section"
					sx={{
						px: 2,
						py: 1,
						borderRadius: 1,
						backgroundColor: "#00FF7F",
						color: "black",
					}}
				>
					{/* Display running acreage */}
					<Typography variant="subtitle2" component="div">
						Running Acreage
					</Typography>
					<Typography variant="h6" component="div">
						{METADATA_FOR_ORDER?.total_running_acerage}&nbsp;
						<Typography variant="subtitle2" display="inline">
							acres
						</Typography>
					</Typography>
				</Box>
				<Box
					component="section"
					sx={{
						px: 2,
						py: 1,
						borderRadius: 1,
						backgroundColor: "#00FF7F",
						color: "black",
					}}
				>
					{/* Display running ponds */}
					<Typography variant="subtitle2" component="div">
						Running Ponds
					</Typography>
					<Typography variant="h6" component="div">
						{METADATA_FOR_ORDER?.Running + (METADATA_FOR_ORDER?.["Just Pumped"] || 0)}
					</Typography>
				</Box>
			</Stack>
			<RegionInsightToggleButton />{/* Render toggle button component */}
			<RegionInsightBarChart />{/* Render bar chart component */}
		</Stack>
	);
}

export default RegionInsightData;
