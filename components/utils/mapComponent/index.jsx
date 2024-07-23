import { Box } from "@mui/material";
import PropTypes from "prop-types";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import MapSearch from "../mapSearch";
import ReactLeafletGoogleLayer from "react-leaflet-google-layer";
import { useAtomValue } from "jotai";
import { currentBaseMapAtom, mapScrollWheelZoomAtom } from "@/jotai/index";

/**
 * This function is used to enable/disable the zooming with scroll wheel on the map
 */
function MapScrollWheelZoom({ scrollWheelZoom }) {
	const map = useMap();
	console.log(map.options.scrollWheelZoom, "map.options");
	if (scrollWheelZoom !== map.options.scrollWheelZoom) {
		map.options.scrollWheelZoom = scrollWheelZoom;
		if (scrollWheelZoom) {
			map.scrollWheelZoom.enable();
		} else {
			map.scrollWheelZoom.disable();
		}
	}
	return null;
}

/**
 * This component renders a map using the react leaflet which contains
 * search bar (to search for location), Google layer for show the google map
 */
const MapComponent = ({ containerRef, children, center, zoom, mapContainerRef }) => {
	const MAP_SCROLL_WHEEL_ZOOM_BOOLEAN = useAtomValue(mapScrollWheelZoomAtom);
	const CURRENT_BASEMAP = useAtomValue(currentBaseMapAtom);

	return (
		<Box
			ref={containerRef}
			sx={{
				width: "auto",
				border: "1px solid grey",
				borderRadius: "2",
			}}
		>
			<MapContainer
				center={Array.isArray(center) ? center : []}
				zoom={zoom}
				style={{
					height: "89.5vh",
					width: "100%",
				}}
				ref={mapContainerRef}
			>
				<MapScrollWheelZoom scrollWheelZoom={MAP_SCROLL_WHEEL_ZOOM_BOOLEAN} />
				{CURRENT_BASEMAP == "satellite" && (
					<ReactLeafletGoogleLayer
						apiKey={import.meta.env.VITE_API_KEY_GOOGLE_LAYER}
						type={"hybrid"}
					/>
				)}
				{CURRENT_BASEMAP == "weather" && (
					<>
						<TileLayer
							attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
							url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
						/>
						<TileLayer
							attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
							url="https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=2a7c1bf1b7bcb86762cce4304d64ef5a"
						/>
						<TileLayer
							attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
							url="https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=2a7c1bf1b7bcb86762cce4304d64ef5a"
						/>
					</>
				)}

				{children}
				<MapSearch />
			</MapContainer>
		</Box>
	);
};

MapComponent.propTypes = {
	children: PropTypes.node.isRequired,
	center: PropTypes.array,
	zoom: Number,
	containerRef: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
	]),
};

export default MapComponent;
