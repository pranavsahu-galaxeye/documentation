import { cycloneBoundryAtom } from "@/jotai/index";
import { GeoJSON } from "react-leaflet";
import { useAtomValue } from "jotai";

/**
 * Function sets the style of each polygon based on the cyclone status property of the feature
 */

const setColorForEachPolygonBasedOnCurrentFeatureForCyclone = (feature, layer) => {
	//Styles for the polygon
	const style = {
		color: "#00ac46",
		stroke: "#00ac46",
		fillColor: "#00ac46",
		weight: 2,
		opacity: 0.5,
		fillOpacity: 0.2,
		strokeDasharray: [8, 2],
	};
	//change fill color based on the cyclone status
	switch (feature.properties?.cyclone_status) {
		case "noimpact":
			style.fillColor = "#00ac46";
			break;
		case "low":
			style.fillColor = "#00ac46";
			break;
		case "medium":
			style.fillColor = "#fd8c00";
			break;
		case "high":
			style.fillColor = "#780000";
			break;
		default:
			break;
	}
	//set border and stroke colors to match the fill color
	style.color = style.fillColor;
	style.stroke = style.color;
	layer.setStyle(style);// Apply style to the current layer
};

/**
 * CycloneMapView component renders the GeoJSON data on the map using react-leaflet library
 */
function CycloneMapView() {
	const CYCLONE_BOUNDRY = useAtomValue(cycloneBoundryAtom);
	//Retreive cyclone data from jotai atom
	return (
		<>
			{CYCLONE_BOUNDRY && (
				<GeoJSON
					key={JSON.stringify(CYCLONE_BOUNDRY)}
					data={CYCLONE_BOUNDRY}// Data for cyclone boundary
					onEachFeature={setColorForEachPolygonBasedOnCurrentFeatureForCyclone}// Function to style key feature
				/>
			)}
		</>
	);
}

export default CycloneMapView;
