import { Layer, useMap } from "react-map-gl/maplibre";
import {
	boundingBoxCoordinatesToZoomAtom,
	currentPondsToShowAccordingToCountAtom,
} from "@/jotai/index";
import { useAtomValue } from "jotai";
import { useEffect } from "react";

function MapLayer({ MAP_LAYER_ID, MAP_SOURCE_ID }) {
	const { current: map } = useMap();//Get the current map instance using useMap hook
	const boundingBoxCoordinatesToZoom = useAtomValue(boundingBoxCoordinatesToZoomAtom);//Get bounding box coordinates from jotai atom
	const CURRENT_PONDS_TO_SHOW_VALUE = useAtomValue(currentPondsToShowAccordingToCountAtom);//Get current ponds to show according to the count from jotai atom

	//Fit the map to the bounding box coordinates when they change
	useEffect(() => {
		if (map && boundingBoxCoordinatesToZoom) {
			map.fitBounds(boundingBoxCoordinatesToZoom, {
				animate: false,
				maxZoom: 9,
				minZoom: 3,
			});
		}
	}, [map, boundingBoxCoordinatesToZoom]);

	return (
		<>
		{/* Fill layer for displaying regions with pond data */}
			<Layer
				{...{
					id: MAP_LAYER_ID,//Layer ID
					type: "fill",//Layer type
					source: MAP_SOURCE_ID,//Data source ID
					paint: {
						"fill-color": [
							"case",
							[
								"all",
								["==", ["get", "ponds_count"], 0],
								["==", ["get", "mandal"], true],
							],
							"#FF0000",//Red for empty Mandals
							[
								"all",
								["==", ["get", "ponds_count"], 0],
								["==", ["get", "village"], true],
							],
							"#ffcc00",//yellow for empty villages
							[
								"all",
								["==", ["get", "current_selected"], false],
								["==", ["get", "mandal"], true],
							],
							"#fc8803",//Orange for non-empty mandals
							[
								"all",
								["==", ["get", "current_selected"], false],
								["==", ["get", "village"], true],
							],
							"#2DFF00",//Green for non selected villages
							["to-color", ["get", "color"]],
						],
						"fill-outline-color": "#000000",//Black outline colour
						"fill-opacity": [
							"case",
							[
								"all",
								["==", ["get", "ponds_count"], 0],
								["==", ["get", "mandal"], true],
								["==", CURRENT_PONDS_TO_SHOW_VALUE.includes("EmptyMandals"), true],
							],
							0.1,//Low opacity for empty mandals
							[
								"all",
								["==", ["get", "ponds_count"], 0],
								["==", ["get", "village"], true],
								["==", CURRENT_PONDS_TO_SHOW_VALUE.includes("EmptyVillages"), true],
							],
							1,//Full opacity for empty villages
							[
								"all",
								[">", ["get", "ponds_count"], 0],
								["==", ["get", "mandal"], true],
								["==", ["get", "current_selected"], false],
								["==", CURRENT_PONDS_TO_SHOW_VALUE.includes("OtherMandals"), true],
							],
							0.5,//Medium opacity for other mandals
							[
								"all",
								[">", ["get", "ponds_count"], 0],
								["==", ["get", "village"], true],
								["==", ["get", "current_selected"], false],
								["==", CURRENT_PONDS_TO_SHOW_VALUE.includes("OtherVillages"), true],
							],
							1,//Full opacity for other villages
							[
								"all",
								[">", ["get", "ponds_count"], 0],
								["!=", ["get", "current_selected"], false],
							],
							1,//Full opacity for Selected regions
							0,//No opacity otherwise
						],
					},
				}}
			/>
			{/* Line layer for displaying boundaries with specific colors and widths */}
			<Layer
				{...{
					id: MAP_LAYER_ID + "_line",//Line layerID
					type: "line",//Layer type
					source: MAP_SOURCE_ID,//Data Source ID
					paint: {
						"line-color": [
							"case",
							["==", ["get", "current_selected"], true],
							"#ff0000",//Red for selected regions
							"#000000",//Black otherWise
						],
						"line-width": [
							"case",
							["==", ["get", "current_selected"], true],
							3,//Width Of selected regions
							["==", ["get", "village"], true],
							2,//Width of villages
							1,//Default width
						],
						"line-opacity": [
							"case",
							[
								"any",
								[
									"all",
									["==", ["get", "ponds_count"], 0],
									["==", ["get", "mandal"], true],
									[
										"==",
										CURRENT_PONDS_TO_SHOW_VALUE.includes("EmptyMandals"),
										true,
									],
								],
								[
									"all",
									[">", ["get", "ponds_count"], 0],
									["==", ["get", "mandal"], true],
									[
										"==",
										CURRENT_PONDS_TO_SHOW_VALUE.includes("OtherMandals"),
										true,
									],
								],
								[
									"all",
									["==", ["get", "ponds_count"], 0],
									["==", ["get", "village"], true],
									[
										"==",
										CURRENT_PONDS_TO_SHOW_VALUE.includes("EmptyVillages"),
										true,
									],
								],
								[
									"all",
									[">", ["get", "ponds_count"], 0],
									["==", ["get", "current_selected"], false],
									["==", ["get", "village"], true],
									[
										"==",
										CURRENT_PONDS_TO_SHOW_VALUE.includes("OtherVillages"),
										true,
									],
								],
								[
									"all",
									[">", ["get", "ponds_count"], 0],
									["!=", ["get", "current_selected"], false],
								],
							],
							1,//Full opacity for specific cases
							0,//No opacity otherwise	
						],
					},
				}}
			/>
		</>
	);
}

export default MapLayer;
