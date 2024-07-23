import MapComponent from "@/components/utils/mapComponent";
import ChangeView from "./changeMapView";//Importing changeview to change the center and zoom of the map
import LandingSideBox from "../landingSideBox";//Importing LandingSideBox for displaying side information
import { Pane, Polygon } from "react-leaflet";//Importing pane and polygon components from react-leaflet
import { Fragment, useEffect, useMemo, useRef } from "react";		
import TooltipMarker from "./tooltipMarker";//Importing tooltip marker to show custom tooltip on markers
import { useAtomValue } from "jotai";//importing useAtom value hook from jotai state management
import { listOfAllOrderDataAtom, mapCenterAtom, mapZoomAtom } from "@/jotai/index";
import "leaflet/dist/leaflet.css";//Importing leaflet css for map styling
// import CycloneMapView from "./cycloneMapView";
import MapToggle from "../mapToggle";//Importing mapToggle for map view toggle
import MapGradientLegend from "../mapGradientLegend";//Importing mapGradientLegend to show gradient legend on the map
import { polygon, union } from "@turf/turf";//Importing turf.js methods for polygon operation
import * as L from "leaflet";
import { useNavigate } from "react-router-dom";//Importing useNavigate from react-router-dom for navigation
import { colorGradientInsight } from "@/constants/index";

function LandingPageMapContainer() {
	// To store and update user's order data
	const ALL_ORDER_DATA = useAtomValue(listOfAllOrderDataAtom);
	// Initial Map zoom
	const MAP_ZOOM_ATOM = useAtomValue(mapZoomAtom);
	// Initial Zoom point of the map
	const MAP_CENTER_ATOM = useAtomValue(mapCenterAtom);

	const navigate = useNavigate();

	// Reference for the Map parent box
	const ref = useRef(null);
	const mapRef = useRef(null);

	//calculating bounding box coordinates to zoom
	const boundingBoxCoordinatesToZoom = useMemo(() => {
		let final_polygon;
		//Iterate through all order data to find active orders
		ALL_ORDER_DATA?.map((item) => {
			if (item.status === "active") {
				const coordinates = item?.insights[0]?.AOI?.polygon?.coordinates;
				//check if coordinates exist and process them
				if (coordinates?.[0]) {
					if (!final_polygon) {
						final_polygon = polygon(coordinates);
					} else {
						final_polygon = union(final_polygon, polygon(coordinates));
					}
				}
			}
		});
		//Get the final polygon coordinates
		const final_polygon_coordinates = final_polygon?.geometry?.coordinates?.[0];
		//convert GeoJSON coordinates to LatLng for LeafLet
		if (final_polygon_coordinates) {
			return L.GeoJSON.coordsToLatLngs(final_polygon_coordinates);
		}
		return null;
	}, [ALL_ORDER_DATA]);
	//Effect to update map view based on bounding box coordinate
	useEffect(() => {
		const map = mapRef.current;
		if (map && boundingBoxCoordinatesToZoom) {
			map.flyToBounds(boundingBoxCoordinatesToZoom, {
				animate: false,
				maxZoom: 15,
				minZoom: 8,
			});
		}
	}, [boundingBoxCoordinatesToZoom]);
	//Calculate the maximum total number of acreage for all orders
	const maxTotalActiveAcreage = useMemo(() => {
		let tempMax = 0;
		//Iterate through all order data to find the maximum acreage for active orders	
		ALL_ORDER_DATA?.map((item) => {
			if (item.status === "active") {
				if (tempMax < item.total_running_acerage) {
					tempMax = item.total_running_acerage;
				}
			}
		});
		//return the maximum acreage round up
		return Math.round(tempMax) + 1;
	}, [ALL_ORDER_DATA]);

	//get gradient colors for the map
	const gradientArray = useMemo(() => {
		return colorGradientInsight.getColors();
	}, []);

	return (
		<MapComponent
			containerRef={ref}
			center={MAP_CENTER_ATOM}
			zoom={MAP_ZOOM_ATOM}
			mapContainerRef={mapRef}
		>
			{/* Component to show gradient legend on the map */}
			<MapGradientLegend
				maxTotalActiveAcreage={maxTotalActiveAcreage}
				gradientArray={gradientArray}
			/>
			<MapToggle />

			{/* To change the center and zoom of the map */}
			<ChangeView center={MAP_CENTER_ATOM} zoom={MAP_ZOOM_ATOM} />

			{/* Sidebox to show the orders and graph data */}
			<LandingSideBox />
			<Pane name="rectanglePane" style={{ zIndex: 401 }}>
				{/* Show the markers for the orders with the custom tooltip */}
				{ALL_ORDER_DATA?.map((item, index) => {
					if (item.status === "active") {
						if (item?.insights[0]?.AOI?.polygon?.coordinates[0]) {
							const colorOption =
								gradientArray[
									Math.round(
										(item?.total_running_acerage / maxTotalActiveAcreage) * 100
									) - 1
								];
							return (
								<Fragment key={index}>
									<Polygon
										positions={item?.insights[0]?.AOI?.polygon?.coordinates[0].map(
											(el) => {
												const test = el.toString().split(",").reverse();
												test.concat();
												return test.map((el) => parseFloat(el));
											}
										)}
										pathOptions={{
											color: colorOption,
										}}
										eventHandlers={{
											click() {
												if (item.can_access) {
													navigate(
														`/region-insight/${item.id}/${item.insights[0].id}`
													);
												}
											},
											mouseover: (e) => {
												e.target.setStyle({ fillOpacity: 1 });
											},
											mouseout: (e) => {
												e.target.setStyle({ fillOpacity: 0.2 });
											},
										}}
									>
										<TooltipMarker region={item} index={index} />
									</Polygon>
								</Fragment>
							);
						} else {
							return <Fragment key={index}></Fragment>;
						}
					}
				})}
			</Pane>
			{/* <CycloneMapView /> */}
		</MapComponent>
	);
}

export default LandingPageMapContainer;
