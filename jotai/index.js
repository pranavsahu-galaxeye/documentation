import { atom } from "jotai";

// Selected tab for the landing page sidebox either "Order" or  "Graph"
const selectedToggleInLandingPageSideBoxAtom = atom("summary");
// To store the master data for the order insights
const masterGeoJSONAtom = atom(null);
// To store the current GeoJSON object to display
const geoJSONCurrentlyBeingDisplayedAtom = atom(null);
// To store the GeoJSON according to the status i.e. Harvested, Running, Empty, Recently Pumped
const geoJSONSeperatedByStatusAsKeysAtom = atom(null);
// Not using
const dataToShowAtom = atom("all");
// To toggle the loader
const showLoadingScreenAtom = atom(false);
// To store the access token
const userAccessTokensAtom = atom(null);
// To store user details
const cookiesValuesAtom = atom({});
// Not using
const geoDataRefAtom = atom(null);
// To add a highlight around selected pond on the region insights page
const showPondInsightPageAtom = atom(false);
// To show the sidebar containing the region insights
const showRegionInsightPageAtom = atom(true);
// Selected pond details
const selectedPondDataAtom = atom(null);
// To check if user is on the landing page
const isUserOnLandingPageAtom = atom(false);
// To show the time series graph of the selected pond
const showGraphBoxAtom = atom(false);
// To show the time series graph of which property e.g. pH, Ammonia, Calcium
const currentPondInsightPropertyAtom = atom("pH");
// To store the user's orders
const listOfAllOrderDataAtom = atom(null);
// To store the filtered order according to selected DoC raange
const listOfFilteredOrderDataAtom = atom(null);
// To store the map's initial center
const mapCenterAtom = atom([15.8847193, 78.1198494]);
// To store the map's initial zoom
const mapZoomAtom = atom(4);
// To store the map's bounding box for insights
const boundingBoxCoordinatesToZoomAtom = atom(null);
// To store the selected order details including order id and insight id
const regionDataGatheredFromLandingPageAtom = atom(null);
// To store the meta data for the order
const metaDataForOrderAtom = atom(null);
// To store the graph data/all stats of the data
const graphDataForLandingPageAtom = atom(null);
// To enable/disable the map zooming on the scroll wheel
const mapScrollWheelZoomAtom = atom(true);
// To show the graph at the bottom side of the region insights in full width or in auto
const graphFullSizeAtom = atom(false);
// To store the current selected status for displaying the polygons related to status
const currentSelectedStatusOnRegionInsightAtom = atom("all");
// Units of the Water Quality Analysis
const unitOfParametersAtom = atom({
	pH: "",
	Salinity: "ppt",
	Hardness: "ppt",
	Alkalinity: "ppm",
	Magnesium: "ppt",
	Calcium: "ppt",
	Carbonate: "ppm",
	BiCarbonate: "ppm",
	Ammonia: "ppm",
	TAN: "ppm",
});

export const cycloneBoundryAtom = atom({});

export const currentFarmerNameAtom = atom(null);
export const currentPondNameAtom = atom(null);
export const FSMDataForCurrentOrderAtom = atom(null);
export const WQADataForCurrentOrderAtom = atom(null);
export const metaDataChangesForCurrentPondAtom = atom({});
export const isOrderLimitSetBooleanAtom = atom(true);
export const totalOrdersThatAreEitherInProcessedOrProcessingStateAtom = atom(0);

// Add Ponds States
export const textAtom = atom("hello");
export const areaexcededAtom = atom(false);
export const drawingAtom = atom(false);
export const polygonAtom = atom([]);
export const formDataAtom = atom({});
export const farmPolygonAtom = atom(null);
export const latLngAtom = atom(null);
export const showModalAtom = atom(null);
export const dataAtom = atom({
	type: "FeatureCollection",
	features: [],
});
export const pondsAtom = atom(true);
export const farmAtom = atom(false);
export const typeAtom = atom("pond");
export const orderPlacedAtom = atom(false);
export const selectedFarmIndexAtom = atom(null);
export const filteredFarmDataAtom = atom(null);

export const currentButtonTypeAtom = atom(null);
// export const changeViewAtom = atom([14.445223221626392, 79.95684790542299]);
export const changeViewAtom = atom([14.717769346413837, 80.11696678813337]);
export const feedSupplyAtom = atom("");
export const villageNameAtom = atom("");
export const farmerNameAtom = atom("");
export const localPolygonAtom = atom(null);
export const editModeAtom = atom(false);
export const editFarmIdAtom = atom(null);
export const pondsIdsEditAtom = atom([]);
export const addPondEditAtom = atom([]);
export const onPondDeleteAtom = atom(false);
export const pondNamesAtom = atom([]);
export const deleteIndexAtom = atom(null);
export const currentDeleteAtomPolygon = atom();
export const farmDataAtom = atom(null);
export const exitClickAtom = atom(false);
export const pondInfoAtom = atom(null);
export const orderIDAtom = atom(null);
export const insightIDAtom = atom(null);
export const currentBaseMapAtom = atom("weather");
export const pondDateArrayAtom = atom([]);
export const currentSelectedPondDateAtom = atom(null);
export const barChartTypeAtom = atom("count");
export const currentLineChartDropdownValueAtom = atom("");
export const currentPondsToShowAccordingToCountAtom = atom([]);
export const currentOrderDataAtom = atom("");

export const currentHighestCountRegionInsightAtom = atom(0);

export {
	selectedToggleInLandingPageSideBoxAtom,
	masterGeoJSONAtom,
	geoJSONCurrentlyBeingDisplayedAtom,
	geoJSONSeperatedByStatusAsKeysAtom,
	dataToShowAtom,
	showLoadingScreenAtom,
	userAccessTokensAtom,
	cookiesValuesAtom,
	geoDataRefAtom,
	showPondInsightPageAtom,
	showRegionInsightPageAtom,
	selectedPondDataAtom,
	isUserOnLandingPageAtom,
	showGraphBoxAtom,
	currentPondInsightPropertyAtom,
	listOfAllOrderDataAtom,
	listOfFilteredOrderDataAtom,
	mapCenterAtom,
	mapZoomAtom,
	regionDataGatheredFromLandingPageAtom,
	metaDataForOrderAtom,
	graphDataForLandingPageAtom,
	mapScrollWheelZoomAtom,
	graphFullSizeAtom,
	currentSelectedStatusOnRegionInsightAtom,
	unitOfParametersAtom,
	boundingBoxCoordinatesToZoomAtom,
};
