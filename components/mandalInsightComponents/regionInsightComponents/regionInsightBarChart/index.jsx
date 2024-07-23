import { useAtomValue, useSetAtom } from "jotai";//Import hooks from jotai
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";//Import chat components from Recharts
import {
	barChartTypeAtom,
	currentLineChartDropdownValueAtom,
	metaDataForOrderAtom,
} from "../../../../jotai";//Import atoms from jotai
import { useMemo } from "react";//Import useMemo from jotai

//Function to extract numeric values from a string
const extractNumericValues = (name) => {
	const [start, end] = name.split("-").map(Number);
	return { start, end };
};

/**
 * Bar chart for the running pond with different DoC on the X-Axis
 */
function RegionInsightBarChart() {
	const BAR_CHART_TYPE = useAtomValue(barChartTypeAtom);//Get the current value of barChartTypeAtom
	const METADATA_FOR_ORDER = useAtomValue(metaDataForOrderAtom);//Get the current value of metDataForOrderAtom
	const SET_CURRENT_LINE_CHART_DROPDOWN_VALUE = useSetAtom(currentLineChartDropdownValueAtom);//Get the setter function for currentLineChartDropdownValueAtom

	const barChartData = useMemo(() => {
		const data = [];
		if (METADATA_FOR_ORDER && METADATA_FOR_ORDER.latest_summary) {
			let latest_summary;
			let latest_summary_keys = [];
			//Handle different types of bar charts
			if (BAR_CHART_TYPE == "count") {
				latest_summary = METADATA_FOR_ORDER.latest_summary.count || {};
				latest_summary_keys = Object.keys(latest_summary);
				latest_summary_keys.sort(function compare(a, b) {
					if (a < b) {
						return -1;
					}
					if (a > b) {
						return 1;
					}
					return 0;
				});
			} else {
				latest_summary = METADATA_FOR_ORDER.latest_summary.doc || {};
				latest_summary_keys = Object.keys(latest_summary);
				latest_summary_keys.sort(function compare(a, b) {
					const { start: startA, end: endA } = extractNumericValues(a);
					const { start: startB, end: endB } = extractNumericValues(b);
					if (startA !== startB) {
						return startA - startB;
					} else {
						return endA - endB;
					}
				});
			}
			//Populate data array with sorted keys and values
			latest_summary_keys.map((key) => {
				data.push({
					name: key,
					value: latest_summary[key],
				});
			});
			console.log(data);
		}
		//Filter out unwanted data
		return data.filter((a) => a.name.toLowerCase() !== "runningbutnotstocked");
	}, [BAR_CHART_TYPE, METADATA_FOR_ORDER]);

	//Handle bar chart click events
	const barChartClick = (data) => {
		if (
			BAR_CHART_TYPE == "count" &&
			data &&
			data.activePayload &&
			data.activePayload.length > 0
		) {
			const key = data.activePayload[0].payload.name;
			if (Object.keys(METADATA_FOR_ORDER?.count_summary || {}).includes(key)) {
				SET_CURRENT_LINE_CHART_DROPDOWN_VALUE(key);
			}
		}
	};

	return (
		<ResponsiveContainer>
			<BarChart
				width={500}
				height={300}
				data={barChartData}
				layout="vertical"//Set layout to vertical for better readability
				onClick={barChartClick}//attach click event handler
				style={{ cursor: "pointer" }}//change cursor to point on hover
			>
				<XAxis type="number" tick={{ fill: "white" }} />{/* X-axis for number type data */}
				<YAxis
					dataKey="name"
					type="category"
					tick={{ fill: "white" }}//Customize Y-axis tick color
					label={{
						value: BAR_CHART_TYPE == "count" ? "" : "DoC (in days)",//Conditionally set label based on chart type
						angle: -90,//Rotate label 
						position: "insideLeft",//position label inside left
						style: {
							fontWeight: 600,
							fill: "white",
						},
					}}
				/>
				<CartesianGrid strokeDasharray="3 3" />{/* Add grid lines with dashed pattern */}
				<Tooltip />{/* Add tooltip for data points */}
				<Legend />{/* Add legend for the chart */}
				<Bar dataKey="value" name="No. of Ponds" fill="#8884d8" />{/* Define bar appearance */}
			</BarChart>
		</ResponsiveContainer>
	);
}

export default RegionInsightBarChart;
