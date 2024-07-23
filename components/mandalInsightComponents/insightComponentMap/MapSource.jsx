import { Source, GeolocateControl } from "react-map-gl/maplibre";//Import components from react-map-gl/maplibre
import { useEffect } from "react";//Import useEffect hook from react
import { geoJSONCurrentlyBeingDisplayedAtom, showLoadingScreenAtom } from "@/jotai/index";//import jotai atoms
import { useAtomValue, useSetAtom } from "jotai";//Import hooks from jotai
import MapGeocoder from "./MapGeocoder";//Import the mapGeoCoder component
import TooltipPopup from "./TooltipPopup";//Import the tooltip popup component
import MapLayer from "./MapLayer";//Import the map layer component

//constants for map source and layer IDs
const MAP_SOURCE_ID = "ponds-map";
const MAP_LAYER_ID = "ponds-polygons";

function MapSource() {
	const GEOJSON_CURRENTLY_BEING_DISPLAYED = useAtomValue(geoJSONCurrentlyBeingDisplayedAtom);//get the current GeoJson data to be displayed
	const SET_LOADING_SCREEN_BOOLEAN = useSetAtom(showLoadingScreenAtom);//Get the function to set the loading screen state

	useEffect(() => {
		if (GEOJSON_CURRENTLY_BEING_DISPLAYED) {
			SET_LOADING_SCREEN_BOOLEAN(false);//Hide the loading screen when GeoJSON data is available
		}
	}, [GEOJSON_CURRENTLY_BEING_DISPLAYED, SET_LOADING_SCREEN_BOOLEAN]);

	return (
		<>
			{GEOJSON_CURRENTLY_BEING_DISPLAYED && (
				<Source
					id={MAP_SOURCE_ID}//Set the source ID
					type="geojson"//set the source type to GeoJSON
					data={GEOJSON_CURRENTLY_BEING_DISPLAYED}//set the geoJSON data to be displayed
					tolerance={0}//set the tolerance for GeoJSON data
				>
					<MapLayer MAP_LAYER_ID={MAP_LAYER_ID} MAP_SOURCE_ID={MAP_SOURCE_ID} />{/* Render the map layer */}
				</Source>
			)}
			<GeolocateControl position="top-left" style={{ maxHeight: "50px" }} />{/* Add Geolocation control */}
			<TooltipPopup MAP_LAYER_ID={MAP_LAYER_ID} />{/* Render the tooltipPopup component */}
			<MapGeocoder />{/* Render the mapGeocoder component */}
		</>
	);
}

	export default MapSource;
