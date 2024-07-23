import { IconButton, Popover, Slider, Stack, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { useSetAtom, useAtomValue } from "jotai";
import { listOfFilteredOrderDataAtom, listOfAllOrderDataAtom } from "@/jotai/index";
import FilterListIcon from "@mui/icons-material/FilterList";

/**
 * This component is used to filter the ordered data using the DoC range
 * Minium range is 0 and max is 135 days
 */
function FilterOrders() {
	const [anchorEl, setAnchorEl] = useState(null); // State to manage the anchor element for the popover
	const SET_FILTERED_ORDER_DATA = useSetAtom(listOfFilteredOrderDataAtom);
	const ALL_ORDER_DATA = useAtomValue(listOfAllOrderDataAtom);	

	const docRange = useMemo(() => [0, 135], []);// Array representing the range of days (DOC: Days of Coverage)

	// Handler to update filtered ordered data based on the selected DOC range
	const handleChange = (_event, currentDoCRange) => {
		SET_FILTERED_ORDER_DATA(
			ALL_ORDER_DATA.filter((order) => {
				return order.min_doc >= currentDoCRange[0] && order.max_doc < currentDoCRange[1];
			})
		);
	};
	
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	// Handler to close the popover
	const handleClose = () => {
		setAnchorEl(null);
	};

	const open = Boolean(anchorEl); // to determine if popover should be open
	const id = open ? "simple-popover" : undefined;

	// Array of objects used to mark specific value on the slider
	const docLegend = [
		{
			value: 0,
			label: "0 days",
		},
		{
			value: 135,
			label: "135 days",
		},
	];
	// This function used to display the valuetext for the slider 
	function valuetext(value) {
		return `${value} days`;
	}

	return (
		// Conditional rendering - The component only renders if ALL_ORDER_DATA is available
		ALL_ORDER_DATA && (
			<>
				{/* IconButton - Render a filter icon button when clicked, trigger the handleClick function to open the popover */}
				<IconButton
					aria-label="filter"
					onMouseDown={(event) => event.stopPropagation()}
					onClick={handleClick}
				>
					<FilterListIcon />
				</IconButton>
				{/* Popover - A material UI component that diplays a floating pop-up anchored to the icon button */}
				<Popover
					id={id}
					open={open}
					anchorEl={anchorEl}
					onClose={handleClose}
					anchorOrigin={{
						vertical: "bottom",
						horizontal: "right",
					}}
					transformOrigin={{
						vertical: "top",
						horizontal: "right",
					}}
				>
					<div
						style={{
							width: "300px",
							height: "110px",
							py: 2,
							borderRadius: 2,
							border: "1px solid grey",
						}}
					>
						<Typography sx={{ px: 2, paddingTop: 2 }}>DoC</Typography> {/* Displays the label "DoC" above the silder */}
						<Stack
							spacing={2}
							direction="row"
							sx={{ mb: 4, px: 4 }}
							alignItems="center"
						>
							<Slider
								getAriaValueText={valuetext}
								getAriaLabel={() => "doc"}
								step={15}
								valueLabelDisplay="auto"
								defaultValue={docRange}
								marks={docLegend}
								min={0}
								max={135}
								onChange={handleChange}
							/>
						</Stack>
					</div>
				</Popover>
			</>
		)
	);
}

export default FilterOrders;
