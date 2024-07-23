import { Button, Grow, Stack } from "@mui/material";
// List of questions with unique Ids and Question text
const questions = [
	{ id: 1, question: "What is average doc of the order?" },
	{ id: 2, question: "What is the average Count of order?" },
	// { id: 3, question: "Top 5 mandals having highest Count in order?" },
	{ id: 4, question: "Which Mandal has the maximum number of ponds?" },
	// { id: 5, question: "Top 5 Villages having highest Count in order?" },
	{ id: 6, question: "Which Village has the highest number of Ponds?" },
	{ id: 7, question: "What is the average date of the stocking in order?" },
	{ id: 8, question: "How many mandals and Villages are there in order?" },
	{ id: 1000, question: "Select Another Region" }, //reset the selected region
];
function QuestionOverview(props) {
	const { setState } = props;// Destructure setState from props
	return (
		<Stack
			direction="column"
			justifyContent="center"
			alignItems="flex-start"
			spacing={2}
			sx={{ color: "black", pb: "10px" }}
		>
			{questions.map((item, index) =>
				item.id === 1000 ? ( // checking if the Question Id is 1000
					<Grow
						in={true}
						key={item.id}
						style={{ transformOrigin: "0 0 0" }}
						timeout={1000 * index}
					>
						<Button
							variant="contained"
							key={item.id}
							color="error"
							size="small"
							onClick={() => {
								setState((state) => ({ ...state, selectedRegion: {} }));// Reset selectRegion in state
								props.actionProvider.goBackToRegionSelect(); // Call actionProvider method to go back to region select
							}}
							sx={{ textAlign: "left" }}
						>
							{item.question}  //Display the question text
						</Button>
					</Grow>
				) : ( // for all other questions	
					<Grow
						in={true}
						key={item.id}
						style={{ transformOrigin: "0 0 0" }}
						timeout={1000 * index}
					>
						<Button
							variant="contained"
							key={item.id}
							size="small"
							onClick={async () => {
								setState((state) => ({ ...state, selectedQuestion: item }));
								console.log("props.actionProvider", props.actionProvider);
								props.actionProvider.selectQuestion();
							}}
							sx={{ textAlign: "left" }}
						>
							{item.question}
						</Button>
					</Grow>
				)
			)}
		</Stack>
	);
}

export default QuestionOverview;
