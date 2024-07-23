import { currentPondsToShowAccordingToCountAtom } from "@/jotai/index";//Importing the atom for state management
import Checkbox from "@mui/material/Checkbox";//Importing checkbox component from material-UI
import FormControlLabel from "@mui/material/FormControlLabel";//Importing formControlLabel Component from material-UI
import { Box, Stack, Typography } from "@mui/material";//Importing Box, Stack and typography components from material-UI
import { useAtom } from "jotai";//Importing useAtom hook for State Management
import { useEffect, useMemo } from "react";//Importing useEffect and useMemo hooks from React
import { CheckCircle, CircleOutlined } from "@mui/icons-material";//Importing Icons from Material-UI
import { useParams } from "react-router-dom";//Importing UseParam hook from react-router-dom


//This component renders the map legend with check boxes for different options
function RegionInsightMapLegend() {
	const { mandalId, villageId } = useParams();//Extract villageId and mandalId from the URL parameters
	const [CURRENT_PONDS_TO_SHOW_VALUE, SET_CURRENT_PONDS_TO_SHOW_VALUE] = useAtom(
		currentPondsToShowAccordingToCountAtom
	);//Get and set the current ponds to show from jotai atom

	//Memoize the options to show based on the presence of mandalId and villageId
	const optionsToShow = useMemo(() => {
		const options = [];
		if (mandalId) {
			options.push({
				title: "Other Mandals",
				color: "#fc8803",
				value: "OtherMandals",
			});
		}
		if (villageId) {
			options.push({
				title: "Other Villages",
				color: "#2DFF00",
				value: "OtherVillages",
			});
		}
		if (!mandalId) {
			options.push({
				title: "Mandals with 0 ponds",
				color: "#FF0000",
				value: "EmptyMandals",
			});
		}
		if (mandalId && !villageId) {
			options.push({
				title: "Villages with 0 ponds",
				color: "#ffcc00",
				value: "EmptyVillages",
			});
		}
		return options;
	}, [mandalId, villageId]);

	//Effect to set the initial values of the ponds to show based on the options
	useEffect(() => {
		SET_CURRENT_PONDS_TO_SHOW_VALUE(optionsToShow.map((option) => option.value));
	}, [optionsToShow, SET_CURRENT_PONDS_TO_SHOW_VALUE]);

	//function to update the selected values based on checkbox changes
	const updateValues = (e) => {
		let updated = [...CURRENT_PONDS_TO_SHOW_VALUE];
		if (e.target.checked) {
			updated.push(e.target.value);
		} else {
			// if (updated.length == 1) {
			// 	return;
			// }
			updated = updated.filter((b) => b !== e.target.value);
		}
		SET_CURRENT_PONDS_TO_SHOW_VALUE(updated);
	};

	return (
		<Box
			component="div"
			sx={{
				display: "flex",
				width: "100%",
				px: 2,
				py: 1,
				border: "1px solid rgba(255, 255, 255, 0.3)",
				borderRadius: 1,
				backgroundColor: "black",
				zIndex: "1000",
				marginRight: "auto",
			}}
		>
			<Stack direction="column" justifyContent="center" alignItems="flex-start" spacing={0.5}>
				{/* Render the options with checkboxes */}
				{optionsToShow.map((option, id) => (
					<Stack
						direction="row"
						justifyContent="center"
						alignItems="center"
						spacing={2}
						sx={{ height: "50%" }}
						key={id}
					>
						<FormControlLabel
							control={
								<Checkbox
									checked={CURRENT_PONDS_TO_SHOW_VALUE.includes(option.value)}
									onChange={updateValues}
									value={option.value}
									checkedIcon={<CheckCircle />}
									icon={<CircleOutlined />}
									sx={{
										width: 20,
										height: 20,
										color: option.color,
										"&.Mui-checked": {
											color: option.color,
										},
									}}
								/>
							}
							label={
								<Typography
									variant="subtitle1"
									sx={{ marginLeft: "5px" }}
									component="div"
								>
									{option.title}
								</Typography>
							}
						/>
					</Stack>
				))}
			</Stack>
		</Box>
	);
}

export default RegionInsightMapLegend;
