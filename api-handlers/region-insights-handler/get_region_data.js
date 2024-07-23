import endpoints from "@/constants/endpoints";
import request_handler from "../request.handler";
import * as turf from "@turf/turf";
import { getDefaultStore } from "jotai";
import {
	boundingBoxCoordinatesToZoomAtom,
	currentHighestCountRegionInsightAtom,
	currentOrderDataAtom,
	geoJSONCurrentlyBeingDisplayedAtom,
	metaDataForOrderAtom,
	showLoadingScreenAtom,
} from "@/jotai/index";
import maplibregl from "maplibre-gl";
import { colorGradientInsight } from "@/constants/index";

// const MAXLIMITFORPONDS = 5000;

// const getNextBatchesInBackground = async (data, batches) => {
// 	console.log("Getting batches", batches);
// 	const promises = [];

// 	for (let index = 1; index <= batches; index++) {
// 		promises.push(
// 			request_handler({
// 				method: "post",
// 				endpoint: endpoints.glxBlue.gJSon,
// 				data: {
// 					orderId: data.orderId,
// 					insightId: data.insightId,
// 					limit: MAXLIMITFORPONDS,
// 					offset: index,
// 				},
// 			})
// 		);
// 	}
// 	const batchResponse = await Promise.allSettled(promises);

// 	const store = getDefaultStore();
// 	const current_fsm = store.get(geoJSONCurrentlyBeingDisplayedAtom);

// 	let final_fsm_features = [];
// 	let fsm = {};
// 	if (current_fsm) {
// 		fsm = { ...current_fsm };
// 		if (current_fsm?.features?.length > 0) {
// 			final_fsm_features = [...current_fsm.features];
// 		}
// 	}

// 	batchResponse.map((response) => {
// 		if (response.status === "fulfilled") {
// 			const fsmData = response.value.fsm;
// 			fsmData?.features?.map((feature) => {
// 				const currentPondCount = Object.values(feature.properties?.count || {}).pop();
// 				feature.properties.count_status = currentPondCount;
// 			});
// 			final_fsm_features = [...final_fsm_features, ...fsmData.features];
// 		}
// 	});
// 	console.log("final_fsm_features length", final_fsm_features.length);

// 	fsm.features = final_fsm_features;

// 	console.log("After loading batches", fsm);
// 	store.set(geoJSONCurrentlyBeingDisplayedAtom, fsm);
// };

// Get the data required to show for the order details

const GetRegionData = async (
	data,
	SET_MASTER_GEO_JSON,
	SET_GEOJSON_CURRENTLY_BEING_DISPLAYED,
	_SET_MAP_ZOOM_ATOM,
	SET_MAP_CENTER_ATOM,
	SET_METADATA_FOR_ORDER,
	SET_CURRENT_ORDER_DATA
	// SET_FSM_DATA_FOR_CURRENT_ORDER,
	// SET_WQA_DATA_FOR_CURRENT_ORDER
) => {
	const store = getDefaultStore();
	const current_order = store.get(currentOrderDataAtom);

	console.log(data);
	// checking if current order data matches the new report
	if (
		current_order?.orderId == data.orderId &&
		current_order?.mandalId == data.mandalId &&
		current_order?.villageId == data.villageId
	) {
		console.log("Already have the data");
		return;
	}
	// Reseting for fresh data loading
	store.set(geoJSONCurrentlyBeingDisplayedAtom, null);
	store.set(metaDataForOrderAtom, null);
	store.set(currentOrderDataAtom, "");
	store.set(showLoadingScreenAtom, true);
	// Get the GeoJSON data containing FSM (farms status management) using order id and insight id and access token
	const request_data = {
		orderId: data.orderId,
		insightId: data.insightId,
		mandalId: data.mandalId,
		villageId: data.villageId,
	};
	// sending request to get all data using request handler
	const getAllData = request_handler({
		method: "post",
		endpoint: endpoints.glxBlue.gJSon,
		data: request_data,
	});

	const AllDataForOrder = await Promise.allSettled([getAllData]);

	console.log(AllDataForOrder, "AllDataForOrder");

	let finalGJSON = {};
	// Update the master geo json with order
	const mandalsData = AllDataForOrder[0].value.mandals;

	const metaData = AllDataForOrder[0].value.meta;
	const orderInfo = AllDataForOrder[0].value.order_details;

	// Initializing the highest ponds count among mandals
	let currentHighestCountRegionInsight = 0;
	// Calculating highest pond counts among mandals
	mandalsData?.features.map(function (feature) {
		if (feature.properties.ponds_count > currentHighestCountRegionInsight) {
			currentHighestCountRegionInsight = feature.properties.ponds_count;
		}
	});

	// Updating the mandal properties such as count_status and color based on the ponds count
	mandalsData?.features?.map((feature) => {
		const currentPondCount = Object.values(feature.properties?.count || {}).pop();
		feature.properties.count_status = currentPondCount;
		feature.properties.color = colorGradientInsight.getColor(
			feature.properties.ponds_count
				? Math.round(
						(feature.properties.ponds_count / currentHighestCountRegionInsight) * 100
				  ) + 1
				: 1
		);
		feature.properties.mandal = true;
		// Mark the current selected mandal if it matches the provided mandalId
		if (data.mandalId) {
			feature.properties.current_selected = feature.properties.id === parseInt(data.mandalId);
			if (feature.properties.current_selected) {
				orderInfo.name = feature.properties.name;
			}
		}
	});
	// filter out the currently selected mandal
	mandalsData.features = mandalsData.features.filter((a) => !a.properties.current_selected);

	let boundingBox;
	if (!data) {
		boundingBox = turf.polygon(data.regionCoordinates); // Use regionCoordinates if no specific data is provided.
	} else {
		boundingBox = turf.envelope(mandalsData);// or use envelope of mandals data
	}
	// initialising the mandals data with GeoJSON Object 
	finalGJSON = { ...mandalsData };

	// Checking if village data is available or not
	if (AllDataForOrder[0].value.villages) {
		const villagesData = AllDataForOrder[0].value.villages;
		let selectedVillage;
		currentHighestCountRegionInsight = 0;// Reset the highest pond count of the village

		// Calculating the highest pond count among the village
		villagesData.features.map(function (feature) {
			if (feature.properties.ponds_count > currentHighestCountRegionInsight) {
				currentHighestCountRegionInsight = feature.properties.ponds_count;
			}
		});
		// Updating the mandal properties such as count_status and color based on the ponds count
		villagesData.features.map((feature) => {
			const currentPondCount = Object.values(feature.properties?.count || {}).pop();
			feature.properties.count_status = currentPondCount;
			feature.properties.color = colorGradientInsight.getColor(
				feature.properties.ponds_count
					? Math.round(
							(feature.properties.ponds_count / currentHighestCountRegionInsight) *
								100
					  ) + 1
					: 1
			);
			feature.properties.village_name = feature.properties.name;
			feature.properties.village = true;
			// Mark the current selected village if it matches the provided villageId
			if (data.villageId) {
				feature.properties.current_selected =
					feature.properties.id === parseInt(data.villageId);
				if (feature.properties.current_selected) {
					selectedVillage = { ...feature };
					orderInfo.name = feature.properties.name;
				}
			}
		});
		// Update the Bounding box basedon the selected village
		if (data.villageId && selectedVillage) {
			boundingBox = turf.envelope(selectedVillage);
		} else {
			boundingBox = turf.envelope(villagesData);
		}
		// Add village features to the final GeoJSON object
		finalGJSON.features = [...finalGJSON.features, ...villagesData.features];
	}
	// Storing the highest pond count of the region
	store.set(currentHighestCountRegionInsightAtom, currentHighestCountRegionInsight);

	// console.log(metaData?.Total, MAXLIMITFORPONDS);
	// if (metaData?.Total > MAXLIMITFORPONDS) {
	// 	getNextBatchesInBackground(data, Math.ceil(metaData?.Total / MAXLIMITFORPONDS) - 1);
	// }

	// Processing final GJSON feature
	finalGJSON.features.map((feature) => {
		feature.properties.request_data = request_data;
	});
	if (data.mandalId) {
		//Remove Empty Ponds
		finalGJSON.features = finalGJSON.features.filter(
			(a) => a.properties.village || (a.properties.mandal && a.properties.ponds_count > 0)
		);
	}
	if (data.villageId) {
		finalGJSON.features = finalGJSON.features.filter(
			(a) => a.properties.mandal || (a.properties.village && a.properties.ponds_count > 0)
		);
	}
	SET_MASTER_GEO_JSON(finalGJSON);
	// Show the current GEO Json directly
	SET_GEOJSON_CURRENTLY_BEING_DISPLAYED(finalGJSON);

	// Calculating and setting map center
	const centroid = turf.centroid(boundingBox);
	console.log(centroid, "centroid");
	// Zoom in to the coordinates
	SET_MAP_CENTER_ATOM([centroid.geometry.coordinates[1], centroid.geometry.coordinates[0]]);
	console.log(finalGJSON, "MJ");
	// Set the meta data
	SET_METADATA_FOR_ORDER(metaData);
	// Set the zoom
	// SET_MAP_ZOOM_ATOM(15);
	SET_CURRENT_ORDER_DATA({
		...orderInfo,
		orderId: data.orderId,
		insightId: data.insightId,
		mandalId: data.mandalId,
		villageId: data.villageId,
	});
	// set bounding box coordinates for map zoom
	const bounds = new maplibregl.LngLatBounds([
		[boundingBox.bbox[0], boundingBox.bbox[1]],
		[boundingBox.bbox[2], boundingBox.bbox[3]],
	]);

	store.set(boundingBoxCoordinatesToZoomAtom, bounds);

	store.set(showLoadingScreenAtom, false);
};

export default GetRegionData;
