import { Button, Grow, Stack } from "@mui/material";
// List of regions with uniqueIds and names
const regions = [
	{ id: 1120, name: "Nellore" },
	{ id: 1109, name: "West Godavari" },
	{ id: 1108, name: "East Godavari" },
	{ id: 1133, name: "Prakasam" },
	{ id: 1137, name: "Guntur" },
	{ id: 1134, name: "Krishna" },
];
function RegionsOverview(props) {
	const { setState } = props;// Destructure setstate from props
	return (
		<Stack
			direction="column"
			justifyContent="center"
			alignItems="flex-start"
			spacing={2}
			sx={{ color: "black", pb: "10px" }}
		>
			{regions.map((item, index) => {
				return (
					<Grow
						in={true}
						key={item.id}
						style={{ transformOrigin: "0 0 0" }}
						timeout={1000 * index}
					>
						<Button
							variant="contained"
							onClick={() => {
								setState((state) => ({ ...state, selectedRegion: item }));
								props.actionProvider.selectRegion();
							}}
						>
							{item.name}
						</Button>
					</Grow>
				);
			})}
		</Stack>
	);
}

export default RegionsOverview;
