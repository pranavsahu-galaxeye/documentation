import { Stack, Typography } from "@mui/material";
import { useAtomValue } from "jotai";
import { listOfFilteredOrderDataAtom } from "@/jotai/index";
import { useMemo } from "react";
import { ResponsivePie } from "@nivo/pie";
import { animated } from "@react-spring/web";
import { useNavigate } from "react-router-dom";

/**
 * This component shows the all stats summary using piechart when user selects Graph mode
 */
function LandingPageSummary() {
	const FILTERED_ORDER_DATA = useAtomValue(listOfFilteredOrderDataAtom);// Get filtered ordered data using jotai atom
	const navigate = useNavigate();// navigating different routes

	const summaryData = useMemo(() => {
		if (!FILTERED_ORDER_DATA) {
			return null;
		}
		let total_active_ponds = 0,
			total_ponds = 0,
			total_active_acerage = 0,
			total_acerage = 0;

		const pieChartData = [];
		//calculate totals for active orders
		FILTERED_ORDER_DATA.map((order) => {
			if (order.status === "active") {
				total_active_ponds += order.running_ponds;
				total_acerage += order.total_acerage || 0;
				total_ponds += order.total_ponds;
				total_active_acerage += order.total_running_acerage || 0;
			}
		});
		//prepare data for pie chart 
		FILTERED_ORDER_DATA.map((order) => {
			if (order.status === "active") {
				pieChartData.push({
					id: order.name,
					label: order.name,
					value: Math.round((order.total_running_acerage / total_active_acerage) * 100),
					...order,
				});
			}
		});
		// return the summary data
		return {
			meta: [
				{
					title: "Total Ponds",
					value: total_ponds,
					color: "purple",
				},
				{
					title: "Total Active Ponds",
					value: total_active_ponds,
					color: "#1f77b4",
				},
				{
					title: "Total Acreage (acres)",
					value: total_acerage,
					color: "purple",
				},
				{
					title: "Total Active Acreage (acres)",
					value: total_active_acerage,
					color: "#2ca02c",
				},
			],
			pieChartData: pieChartData,
		};
	}, [FILTERED_ORDER_DATA]);
	//Render the component if summary data exists
	return (
		summaryData && (
			<Stack
				direction="column"
				justifyContent="center"
				alignItems="center"
				spacing={2}
				sx={{ height: "100%" }}
				className="w-full"
				gap={2}
			>
				<Stack
					direction="column"
					justifyContent="flex-start"
					alignItems="flex-start"
					spacing={1}
					sx={{ height: "40%", width: "100%", paddingTop: "20px" }}
				>
					{summaryData.meta.map((item, index) => (
						<Stack
							direction="row"
							justifyContent="flex-start"
							alignItems="center"
							spacing={2}
							sx={{ width: "100%" }}
							key={index}
						>
							<Typography
								variant="h6"
								sx={{
									width: "100%",
									fontSize: "17px",
									display: "flex",
									alignItems: "center",
								}}
								component="div"
							>
								<span style={{ width: "60%" }} className="block">
									{item.title}
								</span>
								<span style={{ width: "40%" }} className="block">
									: {item.value.toLocaleString("en-IN")}
								</span>
							</Typography>
						</Stack>
					))}
				</Stack>
				<Stack
					direction="column"
					justifyContent="flex-start"
					alignItems="flex-start"
					spacing={2}
					className="w-full h-[60%] overflow-hidden"
				>
					<ResponsivePie
						data={summaryData.pieChartData}
						animate={true}
						activeOuterRadiusOffset={8}
						enableArcLinkLabels={false}
						margin={{ left: 10, right: 10, top: 10, bottom: 10 }}
						innerRadius={0.4}
						colors={{ scheme: "pastel1" }}
						cornerRadius={3}
						sortByValue={true}
						isInteractive={true}
						startAngle={-180}
						onMouseEnter={(_datum, event) => {
							event.currentTarget.style.cursor = "pointer";
						}}
						borderWidth={1}
						borderColor={{
							from: "color",
							modifiers: [["darker", "3"]],
						}}
						tooltip={(e) => {
							const {
								datum: { label, value },
							} = e;
							return (
								<div
									style={{ backgroundColor: "#fff" }}
									className="shadow-inner text-black font-semibold text-[10px] p-1 rounded-lg"
								>
									{label} ({value}%)
								</div>
							);
						}}
						onClick={(item) => {
							console.log(item);
							if (item.data.can_access) {
								navigate(
									`/region-insight/${item.data.id}/${item.data.insights[0].id}`
								);
							}
						}}
						arcLabelsSkipAngle={10}
						arcLabelsComponent={({ _datum, label, style }) => (
							<animated.g
								transform={style.transform}
								style={{ pointerEvents: "none" }}
							>
								<text
									textAnchor="middle"
									dominantBaseline="central"
									fill={style.textColor}
									style={{
										fontSize: 16,
										fontWeight: 800,
									}}
								>
									{label}%
								</text>
							</animated.g>
						)}
					/>
				</Stack>
			</Stack>
		)
	);
}

export default LandingPageSummary;
