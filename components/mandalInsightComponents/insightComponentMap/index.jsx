import PropTypes from "prop-types";//Importing prop-types for type checking
import { Box } from "@mui/material";//Importing box component from material UI
import MapLibreContainer from "./MapLibreContainer";//Importing custom MaplibreContainer container
import MapGradientLegend from "@/components/landingPageComponents/mapGradientLegend";//Importing MapGradientLegend component
import { colorGradientInsight } from "@/constants/index";//Importing color gradient constants
import { currentHighestCountRegionInsightAtom } from "@/jotai/index";//Importing Jotai atoms for currenthighest count region insight
import { useAtomValue } from "jotai";//Importing useAtomValue hook from jotai state management
import { useParams } from "react-router-dom";//Importing useParams from react-router-dom for accessing URL paramenters

/**
 * This component shows the ponds in the selected order on the map
 */
function InsightMap({ children }) {
	const { villageId } = useParams();//Extracting villageId parameter from URL
	const currentHighestCountRegionInsight = useAtomValue(currentHighestCountRegionInsightAtom);
	return (
		<>
			<Box
				sx={{
					width: "auto",// set width to auto
					border: "1px solid grey",// Grey border
					borderRadius: "2",//border radius
					height: "100%",//Full height
				}}
			>
				{/* show the MapGradientLegend component only if there is no village ID */}
				{!villageId && (
					<MapGradientLegend
						maxTotalActiveAcreage={currentHighestCountRegionInsight + 1}// setting the maximum total active acreage for the legend	
						gradientArray={colorGradientInsight.getColors()}//Setting the color gradient array
						style={{
							height: "40vh",//Height of the legend
							top: "10vh",//Top offset
							left: "1.4vw",//Left offset
						}}
						title="No. of Ponds"//Title of the legend
					/>
				)}
				{/* Rendering the MapLibreContainer with children inside */}
				<MapLibreContainer>{children}</MapLibreContainer>
			</Box>
		</>
	);
}

InsightMap.propTypes = {
	children: PropTypes.node.isRequired,
};

export default InsightMap;
