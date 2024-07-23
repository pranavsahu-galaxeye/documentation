import { graphFullSizeAtom, mapScrollWheelZoomAtom } from "@/jotai/index";
import { useSetAtom } from "jotai";
import { useState } from "react";
import CollapsableSideBox from "../collapsableSideBox";

function SideboxForLandingInsights({ children }) {
	//State to manage the visibilty of sideBox
	const [isSideBoxVisible, setIsSideBoxVisible] = useState(true);
	const SET_MAP_SCROLL_WHEEL_ZOOM_BOOLEAN = useSetAtom(mapScrollWheelZoomAtom);
	const SET_GRAPH_FULL_SIZE_BOOLEAN = useSetAtom(graphFullSizeAtom);
	//function to handle sideBox close event
	const onSideboxClose = () => {
		//Hide the sideBox
		setIsSideBoxVisible(false);
		//set graph to full size when sideBox is closed
		SET_GRAPH_FULL_SIZE_BOOLEAN(true);
	};
	//Function to handle sideBox open event
	const onSideboxOpen = () => {
		//Show the sideBox
		setIsSideBoxVisible(true);
		//set graph to normal when sideBox is open
		SET_GRAPH_FULL_SIZE_BOOLEAN(false);
	};
	//Function to disable map scroll wheel zoom when mouse enters the sidebox
	const onMouseEnter = () => {
		SET_MAP_SCROLL_WHEEL_ZOOM_BOOLEAN(false);
	};
	//Function to enable map scroll wheel zoom when mouse leaves the sidebox
	const onMouseLeave = () => {
		SET_MAP_SCROLL_WHEEL_ZOOM_BOOLEAN(true);
	};
	return (
		<>
			{/* Render the CollapsableSideBox component with appropriate props */}
			<CollapsableSideBox
				openSideBox={isSideBoxVisible}
				onSideboxClose={onSideboxClose}
				onSideboxOpen={onSideboxOpen}
				onMouseEnter={onMouseEnter}
				onMouseLeave={onMouseLeave}
			>
				{children}
			</CollapsableSideBox>
		</>
	);
}

export default SideboxForLandingInsights;
