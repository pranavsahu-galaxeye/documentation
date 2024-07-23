import { Pane, Tooltip } from "react-leaflet";

// To update the tooltip of the marker
function TooltipMarker({ region, index }) {
	return (
		//Pane computing to manage zIndex layering of the tooltip
		<Pane name={"ttPane-" + index} style={{ zIndex: 403 }}>
			<Tooltip sticky style={{ width: 1 }}> {/* Tooltip component to display information */}
				<div>
					{/* Check if the region has the name and display it */}
					{region.name && (
						<div className="flex gap-1 ">
							<span>Name:</span>
							<span>{region.name}</span>
						</div>
					)}
					{/* Check if the region can be accessed and display the additional information */}
					{region.can_access && (
						<>
						{/* Display the total running acerage and display it */}
							{region.total_running_acerage && (
								<div className="flex gap-1 ">
									<span>Active Acreage:</span>
									<span>{region.total_running_acerage.toFixed(2)} acres</span>
								</div>
							)}
							{/* Display the average DOC if available */}
							{region.avg_doc && (
								<div className="flex gap-1 ">
									<span>Average DoC:</span>
									<span>{region.avg_doc.toFixed(2)}</span>
								</div>
							)}
						</>
					)}
				</div>
			</Tooltip>
		</Pane>
	);
}

export default TooltipMarker;
