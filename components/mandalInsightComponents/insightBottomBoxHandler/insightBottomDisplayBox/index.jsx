import { Box, Stack } from "@mui/material";//Importing box and Stack components from Material-UI
import { useAtomValue } from "jotai";//Importing useAtomValue hook from jotai state management
import PropTypes from "prop-types";//Importing proptypes for type checking
import { graphFullSizeAtom } from "../../../../jotai";//Importing graphFullSizeAtom from jotai state management

/**
 * This component wraps the bottom slider/monotone graph components
 */
function InsightBottomDisplayBox({ children }) {
	const GRAPH_FULL_SIZE_BOOLEAN = useAtomValue(graphFullSizeAtom);// Retrieve the full-size boolean for the graph from the state

	return (
		<>
			<Box
				component="div"
				sx={{
					display: "flex",
					justifyContent: "center",
					width: GRAPH_FULL_SIZE_BOOLEAN ? "auto" : "calc(100% - 400px)",//adjust width based on the graph full-size boolean
					p: 2, //padding
					border: "1px solid grey",//border style
					borderRadius: "2",//border radius
					backgroundColor: "black",//Background color
					position: "absolute",//Positioning
					right: 5,//Right offset
					left: 5,//left offset
					bottom: 5,//Bottom offset
					zIndex: "1000",//z-index for layering
					marginRight: "auto",//auto-margin for center alignment
				}}
			>
				<Stack
					direction="row"//Arrange children in row
					spacing={1}//space between children
					alignItems="center"//center align atoms
					sx={{
						display: "flex",//flex display
						width: "100%",//full width
						height: "100%",//full height
						overflowY: "none",//no vertical overflow
						margin: "5px",//margin around the stack
						mb: "0px",//No bottom margin
					}}
				>
					{children} {/* Render child component */}
				</Stack>
			</Box>
		</>
	);
}
//Define prop type for the component
InsightBottomDisplayBox.propTypes = {
	children: PropTypes.node.isRequired,//children prop is required and should be a node
};

export default InsightBottomDisplayBox;
