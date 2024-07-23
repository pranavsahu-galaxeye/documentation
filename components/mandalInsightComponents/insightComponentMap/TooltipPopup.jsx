import { useMemo, useEffect, useRef } from "react";//Import hooks from react
import { centroid, multiPolygon, polygon } from "@turf/turf";//Import turf.js function
import { Popup } from "maplibre-gl";//Import popup from maplibre-gl
import { renderToString } from "react-dom/server";// Import renderToString from sever side rendering
import { useMap } from "react-map-gl/maplibre";//Import useMap from react-map-gl/maplibre
import { useNavigate } from "react-router-dom";//Import useNavigate from react router dom

//TooltipHTML component to display properties and coordinates in the popup
function TooltipHTML({ properties, coordinates }) {
	const farm_centroid = useMemo(() => {
		//Reverse and format the coordinates
		const reverseCoordinates = coordinates?.reverse().map((c) => c.toFixed(4));
		return reverseCoordinates[0]
			? `${reverseCoordinates[0]} (Lat), ${reverseCoordinates[1]} (Long)`
			: "";
	}, [coordinates]);

	const propertiesToShow = useMemo(() => {
		//Prepare the properties to show in the group
		const dataToShow = [];
		if (properties.village_name) {
			dataToShow.push({
				title: "Village Name",
				value: properties.village_name,
			});
		}
		if (properties.sub_district_name) {
			dataToShow.push({
				title: "Mandal Name",
				value: properties.sub_district_name,
			});
		}
		if (properties.villages_count) {
			dataToShow.push({
				title: "Villages",
				value: properties.villages_count,
			});
		}
		if (properties.ponds_count !== undefined && !isNaN(properties.ponds_count)) {
			dataToShow.push({
				title: "Ponds",
				value: properties.ponds_count,
			});
		}
		return dataToShow;
	}, [properties]);

	return (
		<div className="text-sm text-black font-semibold text-wrap">
			{propertiesToShow.map((property, index) => (
				<div key={index}>
					<span
						className="font-medium"
						style={{
							textTransform: "capitalize",
						}}
					>
						{property.title}:{" "}
					</span>
					{property.value}
				</div>
			))}
			<div className="flex items-center gap-1">
				<span className="font-medium">Coordinates: </span>
				{farm_centroid}
			</div>
		</div>
	);
}
//component to handle map interactions and display popups with tooltips
function TooltipPopup({ MAP_LAYER_ID }) {
	const popupRef = useRef(true);//Ref to manage popup state
	const { current: map } = useMap();//Get the current map instance using useMap hook
	const navigate = useNavigate();//Hook to navigate to different routes

	useEffect(() => {
		if (map && popupRef.current) {
			// Create a popup, but don't add it to the map yet.
			const popup = new Popup({
				closeButton: false,
				closeOnClick: false,
			});
			//Event listener of mouse entering the map layer
			map.on("mouseenter", MAP_LAYER_ID, (e) => {
				console.log(e);
				// Change the cursor style as a UI indicator.
				map.getCanvas().style.cursor = "pointer";

				//Calculate the centroid of the feature
				const coordinates = centroid(
					e.features[0].geometry.type.toLowerCase() == "polygon"
						? polygon(e.features[0].geometry.coordinates)
						: multiPolygon(e.features[0].geometry.coordinates)
				).geometry.coordinates.slice();
				const properties = e.features[0].properties;

				// Ensure that if the map is zoomed out such that multiple
				// copies of the feature are visible, the popup appears
				// over the copy being pointed to.
				while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
					coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
				}
				//Display the popup if the feature is not currently selected
				if (!e.features[0].properties.current_selected) {
					popup
						.setLngLat(coordinates)
						.setHTML(
							renderToString(
								<TooltipHTML properties={properties} coordinates={coordinates} />
							)
						)
						.addTo(map.getMap());
				}
			});

			//Event listener for mouse leaving the map layer
			map.on("mouseleave", MAP_LAYER_ID, () => {
				map.getCanvas().style.cursor = "";//Reset the cursor style
				popup?.remove();//Remove the pop
			});

			//Event listener for click on the map layer
			map.on("click", MAP_LAYER_ID, (e) => {
				console.log(e, e.features);
				const coordinates = centroid(polygon(e.features[0].geometry.coordinates))
					.geometry.coordinates.slice()
					.reverse()
					.map((c) => c.toFixed(4))
					.join(", ");
				//Copy coordinates to clipboard
				navigator.permissions.query({ name: "clipboard-write" }).then(async (result) => {
					if (result.state == "granted" || result.state == "prompt") {
						try {
							await navigator.clipboard.writeText(coordinates);
							console.log("Content copied to clipboard");
						} catch (err) {
							console.error("Failed to copy: ", err);
						}
					}
				});
				//Navigate to the region insight page if there are ponds in the future
				if (e.features[0].properties.ponds_count > 0) {
					const request_data = JSON.parse(e.features[0].properties.request_data);
					if (request_data.orderId && request_data.insightId) {
						const mandalURL = `/region-insight/${request_data.orderId}/${request_data.insightId}`;
						if (e.features[0].properties.mandal) {
							navigate(`${mandalURL}/${e.features[0].properties.id}`);
						} else if (e.features[0].properties.village) {
							navigate(
								`${mandalURL}/${request_data.mandalId}/${e.features[0].properties.id}`
							);
						}
					}
				}
			});

			//Ensure popup is only initialized once
			popupRef.current = false;
		}
	}, [map, MAP_LAYER_ID, navigate]);

	//return empty fragment as the component does not render any direct outputl
	return <></>;
}

export default TooltipPopup;
