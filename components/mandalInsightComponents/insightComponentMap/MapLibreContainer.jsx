import Map from "react-map-gl/maplibre";//Import the map component from react-map-gl/maplibre
import { mapCenterAtom, mapZoomAtom } from "@/jotai/index";//Import jotai atom for map center and zoom
import { useAtomValue } from "jotai";//Import useAtomValue hook from jotai
import "maplibre-gl/dist/maplibre-gl.css";//Import the mapLibre css for styling
import MapSource from "./MapSource";//Import the Mapsource component 

function MapLibreContainer({ children }) {
	const MAP_ZOOM_ATOM = useAtomValue(mapZoomAtom);//Get the map zoom value from atom 
	const MAP_CENTER_ATOM = useAtomValue(mapCenterAtom);//get the map center coordinates from the atom

	return (
		<>
			{/* Render the map component with initial view state and style */}
			<Map
				initialViewState={{
					longitude: MAP_CENTER_ATOM[0],//set the initial longitude from the atom
					latitude: MAP_CENTER_ATOM[1],//set the initial latitude from the atom
					zoom: MAP_ZOOM_ATOM,//set the initial map zoom level from the atom
				}}
				mapStyle={`https://api.maptiler.com/maps/6bbcb0ed-e224-4b59-83ce-fd7846b5697a/style.json?key=${
					import.meta.env.VITE_API_KEY_MAPTILER_SATELLITE//set the map style using MapTiler API key from environment variable
				}`}
				style={{
					height: "88vh",//Set the height of the map
					width: "100%",//set the width of the map
					position: "relative",//set the position to relaltive
				}}
			>
				<MapSource />{/* Render the Mapsource component */}
				{children} {/* Render any children pass through this component */}
			</Map>
		</>
	);
}

export default MapLibreContainer;
