import { useMap } from "react-leaflet";

/**
 * This function sets the center and zoom for the map using the hook
 */
function ChangeView({
	center, // Center to zoom in on map
	zoom, // Zoom in number
}) {
	const map = useMap();
	map.setView(center, zoom);// SetView method of the map is used to change the center and zoom level of the map
	return null; // The component doesn't render anything to the DOM, so it returns null
}

export default ChangeView;
