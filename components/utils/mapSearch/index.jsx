import { GeoSearchControl, MapBoxProvider } from "leaflet-geosearch";
import { useEffect, useMemo } from "react";
import { useMap } from "react-leaflet";
import "leaflet-geosearch/dist/geosearch.css";

/**
 * This component helps to search the location using MapBoxProvider
 */
function MapSearch() {
	// @ts-ignore
	//useMemo to create a memoized GeoSearchControl instance to avoid unnecessary re-renders	
	const searchControl = useMemo(() => {
		//Initialize the MapBoxProvider with the necessary parameters including the access token
		const provider = new MapBoxProvider({
			params: {
				access_token: import.meta.env.VITE_MAP_BOX_PROVIDER_ACCESS_TOKEN,
				placeholder: "Search region of interest",
			},
		});
		//Create a new GeoSearchControl with customized options
		return new GeoSearchControl({
			notFoundMessage: "Sorry, that address could not be found.",//Custom message for no result
			provider: provider,//Use the mapBoxProvider for searching
			style: "bar",//Style of the search bar
			showPopUp: false,//Do not show the Pop-up on the map for the search result
			showMarker: false,//Do not show the marker of the map for the search result
			autoClose: true,//Auto close the search bar after a search
		});
	}, []);

	//Event Search for geoSearch/Showlocation event
	const yourEventHandler = (e) => {
		console.log(e, "geosearch");
	};
	//Get the map instance using useMap hook for react-leaflet
	const map = useMap();

	// Whenever map gets loaded, add search bar
	useEffect(() => {
		//Add search control to the map
		map.addControl(searchControl);
		//Attach event handler for the geoSearch/showLocation event
		map.on("geosearch/showlocation", yourEventHandler);
		//Modify the placeholder text of the search Input
		document.querySelector(".glass").placeholder = "Search Region of Interest";
		//Cleanup function to remove the search control from the map when the component is unmounted
		return () => map.removeControl(searchControl);
	}, [map, searchControl]);

	return null;//This component doesnot render any jsx
}

export default MapSearch;
