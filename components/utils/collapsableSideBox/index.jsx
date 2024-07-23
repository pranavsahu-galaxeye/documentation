import { Box, IconButton, Slide, Stack } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import PropTypes from "prop-types";
/**
 * This component is used for the sidebox on the landing and insights page
 * which is collapsable
 */
function CollapsableSideBox({
	children,
	openSideBox,
	showCloseIcon = true,
	onSideboxClose = () => {},
	onSideboxOpen = () => {},
	onMouseEnter = () => {},
	onMouseLeave = () => {},
}) {
	return (
		<>
			<Stack
				direction="row"//use a row direction to align items horizontally
				// divider={
				//   <Divider
				//     orientation="vertical"
				//     variant="middle"
				//     flexItem
				//     sx={{
				//       zIndex:1000,
				//       borderRightWidth: 5,
				//       bgcolor:'black',
				//       marginY:5
				//     }}/>}
				spacing={2} //set spacing between items
				justifyContent="flex-end"//align content to the right
				alignItems="center"//Center items vertically
				//Apply customs styling
				sx={{
					height: "100%",
					marginRight: "8px",
				}}
			>
				{showCloseIcon &&
					(openSideBox ? (
						//Icon button to close the sidebar
						<IconButton
							aria-label="Close Sidebar"
							onClick={onSideboxClose}
							sx={{
								p: "10",
								border: "1px solid grey",
								borderRadius: "2px",
								backgroundColor: "black",
								position: "relative",
								marginRight: "8px",
								zIndex: "400",
							}}
						>
							<ArrowForwardIosIcon />
						</IconButton>
					) : (
						//Icon button to open the sidebar
						<IconButton
							aria-label="Open Sidebar"
							onClick={onSideboxOpen}
							sx={{
								p: "10",
								border: "1px solid grey",
								borderRadius: "2px",
								backgroundColor: "black",
								position: "relative",
								marginRight: "8px",
								zIndex: "400",
							}}
						>
							<ArrowBackIosNewIcon />
						</IconButton>
					))}
				{/* Slide Transition for the side bar */}
				<Slide direction="left" in={openSideBox} mountOnEnter unmountOnExit>
					<Box
						component="div"
						//Apply custom styling to the box
						sx={{
							display: "flex",
							justifyContent: "center",
							width: 384,
							p: 2,
							border: "1px solid grey",
							borderRadius: "2px",
							backgroundColor: "black",
							position: "relative",
							height: "calc(100% - 16px)",
							zIndex: "1000",
							margin: "auto",
						}}
						//Handle mouse enter and leave on side bar
						onMouseEnter={onMouseEnter}
						onMouseLeave={onMouseLeave}
					>
						<Stack
							//Stack items in the column
							direction="column"
							//set spacing between items
							spacing={2}
							//align items atthe center
							alignItems="center"
							//apply custom styling
							sx={{
								display: "flex",
								width: "100%",
								height: "100%",
								overflowY: "auto",
								mt: "5px",
							}}
						>
							{/*Render children inside the sidebar*/}
							{children}
						</Stack>
					</Box>
				</Slide>
			</Stack>
		</>
	);
}
//Define proptypes for the component
CollapsableSideBox.propTypes = {
	children: PropTypes.node.isRequired,
};

export default CollapsableSideBox;
