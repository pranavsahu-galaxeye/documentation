import MenuItem from "@mui/material/MenuItem";//Import MenuItem component from material-UI
import FormControl from "@mui/material/FormControl";//Import FromControl component from material-UI
import Select from "@mui/material/Select";//Import select component from Material-UI
import { Box, InputLabel } from "@mui/material";//Import Box and InputLabel components from material-UI
import { useAtom, useAtomValue } from "jotai";//Import useAtom and useAtomValue hooks from jotai for stage management
import { currentLineChartDropdownValueAtom, metaDataForOrderAtom } from "../../../../../jotai";//Import specific atoms from jotai
import { useEffect } from "react";//Import useEffect hook from react

/**
 * This renders a dropdown for selecting property
 */
export default function RegionInsightGraphDropdown() {
	const [CURRENT_LINE_CHART_DROPDOWN_VALUE, SET_CURRENT_LINE_CHART_DROPDOWN_VALUE] = useAtom(
		currentLineChartDropdownValueAtom
	);//Get the current value and setter for the dropdown value atom

	const handleChange = (event) => {
		SET_CURRENT_LINE_CHART_DROPDOWN_VALUE(event.target.value);// update the dropdown value when selection changes
	};

	const METADATA_FOR_ORDER = useAtomValue(metaDataForOrderAtom);// Get the current value of the metadata atom

	useEffect(() => {
		//Effect to set the default dropdown value when metadata changes
		if (METADATA_FOR_ORDER && METADATA_FOR_ORDER?.count_summary)
			SET_CURRENT_LINE_CHART_DROPDOWN_VALUE(
				Object.keys(METADATA_FOR_ORDER?.count_summary).pop()//set the dropdown value to the last key in count_summary
			);
	}, [METADATA_FOR_ORDER, SET_CURRENT_LINE_CHART_DROPDOWN_VALUE]);//Dependencies for the effect
	return (
		<Box sx={{ top: 0, height: "100%", width: "100%" }}>{/* container box */}
			<FormControl sx={{ width: "100%" }}>{/* FormControl to handle the drop down */}
				<InputLabel id="property-label">Count</InputLabel>{/* Label for the dropdown */}
				{METADATA_FOR_ORDER && METADATA_FOR_ORDER.count_summary && ( // Render dropdown only if metadata and count_summary are available
					<Select
						labelId="property-label"
						id="property-label"
						value={CURRENT_LINE_CHART_DROPDOWN_VALUE}//current value of the drop down
						onChange={handleChange}//Handler for change events
						displayEmpty
						label="Property"
					>
						{/* Map over the count_summary keys to create  dropdown items */}
						{Object.keys(METADATA_FOR_ORDER.count_summary).map((item, index) => {
							return (
								<MenuItem value={item} key={index}>
									{item}
								</MenuItem>
							);
						})}
					</Select>
				)}
				{/* <FormHelperText>Without label</FormHelperText> */}
			</FormControl>
		</Box>
	);
}
