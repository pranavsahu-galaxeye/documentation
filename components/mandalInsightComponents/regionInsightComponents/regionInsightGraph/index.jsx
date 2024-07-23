import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	Label,
	ReferenceLine,
} from "recharts";//Import Recharts comonents for creating a line chart 
import { useAtomValue } from "jotai";// Import useAtomValue hook from jotai for state management
import { currentLineChartDropdownValueAtom, metaDataForOrderAtom } from "@/jotai/index";//Import specific atoms from jotai
import { useEffect, useState } from "react";
import dayjs from "dayjs";//Import dayjs for date manipulation

//custom tooltip component displaying chart data
const CustomTooltip = ({ active, payload }) => {
	if (active && payload && payload.length) {
		return (
			<div className="custom-tooltip">
				{typeof payload[0].value === "number" && (
					<p className="label">{`${payload[0].dataKey} : 
      ${payload[0].value} `}</p>
				)}
				{/* <p className="desc">Anything you want can be displayed here.</p> */}
			</div>
		);
	}

	return null;//Return null if the tooltip is not active
};

//Main component to render Region Insight Graph
function RegionInsightGraph() {
	const CURRENT_LINE_CHART_DROPDOWN_VALUE = useAtomValue(currentLineChartDropdownValueAtom);//Get the current drop down value
	const METADATA_FOR_ORDER = useAtomValue(metaDataForOrderAtom);//Get the metadata for the order
	const [data, setData] = useState([]);//State to hold the chartdata
	const [liveReferenceLine, setLiveReferenceLine] = useState({ toShow: false, date: "" });//State to hold the live reference line data

	useEffect(() => {
		if (METADATA_FOR_ORDER?.count_summary[CURRENT_LINE_CHART_DROPDOWN_VALUE]) {
			setLiveReferenceLine({ toShow: false, date: {} });//Reset line reference live statement
			console.log(METADATA_FOR_ORDER, "METADATA_FOR_ORDER");
			const unorderdCountSummaryObject =
				METADATA_FOR_ORDER?.count_summary[CURRENT_LINE_CHART_DROPDOWN_VALUE];//Get unordered count summary object
			const orderdCountSummaryObject = Object.keys(unorderdCountSummaryObject)
				.sort()
				.reduce((obj, key) => {
					obj[key] = unorderdCountSummaryObject[key];//Sort and order the count summary object
					return obj;
				}, {});
			const allDatesForCurrentDoc = Object.keys(orderdCountSummaryObject);// get all dates for the current dropdownvalue
			const allValuesForCorrespondingDatesForCurrentDoc =
				Object.values(orderdCountSummaryObject);//Get all values for the corresponding dates
			var tempArr = [];
			const currentDateAsDayJSObject = dayjs();// Get the current date as a dayjs object
			console.log(currentDateAsDayJSObject, "currentDateAsDayJSObject");
			var movedFromActualToPredictedBoolean = false;

			//mapping over all dates to create data array for the chart
			allDatesForCurrentDoc.map((item, index) => {
				const dateAsADayJSObject = dayjs(item);//convert item to a dayjs object
				if (currentDateAsDayJSObject.isAfter(dateAsADayJSObject))
					tempArr.push({
						name: dateAsADayJSObject.format("DD-MMM"),//Format the data
						actual: allValuesForCorrespondingDatesForCurrentDoc[index],//Set actual value
					});
				//Set Live Tracker
				else if (!movedFromActualToPredictedBoolean) {
					movedFromActualToPredictedBoolean = true;
					// if actual values are present
					if (tempArr.length > 0) {
						tempArr[tempArr.length - 1] = {
							...tempArr[tempArr.length - 1],
							predicted: tempArr[tempArr.length - 1].actual,//Set predicted value for the last element
						};
						setLiveReferenceLine({
							status: true,
							date: tempArr[tempArr.length - 1].name,//set live reference line status and date
						});
						tempArr.push({
							name: dateAsADayJSObject.format("DD-MMM"),
							predicted: allValuesForCorrespondingDatesForCurrentDoc[index],//set predicted value
						});
					} else {
						// if actual values are not present
						tempArr = [
							{
								name: currentDateAsDayJSObject.format("DD-MMM"),
								predicted: 0,
								actual: 0,//Initialize with zero values
							},
						];
						setLiveReferenceLine({
							status: true,
							date: currentDateAsDayJSObject.format("DD-MMM"),//Set live reference line status and date
						});
						tempArr.push({
							name: dateAsADayJSObject.format("DD-MMM"),
							predicted: allValuesForCorrespondingDatesForCurrentDoc[index],//set predicted value 
						});
					}
				} else
					tempArr.push({
						name: dateAsADayJSObject.format("DD-MMM"),
						predicted: allValuesForCorrespondingDatesForCurrentDoc[index],//Set predicted value
					});
			});
			if (tempArr.length > 0) setData(tempArr);//Update data state if tempArr has elements
			else {
				tempArr.push({
					name: currentDateAsDayJSObject.format("DD-MMM"),
					actual: 0,//Initialize with zero values
				});
				setData(tempArr);//Update data state
				setLiveReferenceLine({
					status: true,
					date: currentDateAsDayJSObject.format("DD-MMM"),//Set live reference line status and data
				});
			}
		}
	}, [METADATA_FOR_ORDER, CURRENT_LINE_CHART_DROPDOWN_VALUE]);//dependencies for the effect

	return (
		<>
			<ResponsiveContainer width="100%" height="100%">{/* Responsive container for the chart */}
				<LineChart
					width={500}
					height={300}
					data={data}
					margin={{
						top: 30,
						right: 30,
						left: 20,
						bottom: 5,
					}}
				>
					<CartesianGrid strokeDasharray="3 3" />{/* Grid Lines */}
					<XAxis dataKey="name" tick={{ fill: "white" }} />{/* X-Axis */}
					{/* <YAxis domain={[0, 300]} tickCount={4} tick={{ fill: "white" }}> */}
					<YAxis tick={{ fill: "white" }}>{/* Y-axis */}
						<Label
							value="No. of Ponds"
							angle="-90"
							position={{
								x: 20,
								y: 15,
							}}
							fill="white"
							style={{
								fontSize: "1rem",
							}}
						/>
					</YAxis>
					{liveReferenceLine.status && ( //Conditional rendering for the reference line
						<ReferenceLine x={liveReferenceLine.date} stroke="#82ca9d" strokeWidth={3}>
							<Label
								value="Live"
								position="top"
								fill="#82ca9d"
								offset="10"
								style={{
									fontSize: "1rem",
								}}
							/>
						</ReferenceLine>
					)}
					<Tooltip content={<CustomTooltip />} />{/* Tooltip */}

					<Line type="monotone" dataKey="actual" stroke="#8884d8" strokeWidth={3} />{/* Actual data line */}
					<Line
						type="monotone"
						dataKey="predicted"
						stroke="#82ca9d"
						strokeDasharray="5 5"
						strokeWidth={3}//Predicted data line
					/>
				</LineChart>
			</ResponsiveContainer>
		</>
	);
}

export default RegionInsightGraph;
