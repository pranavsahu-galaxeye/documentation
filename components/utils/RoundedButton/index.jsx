import { Box, Button } from "@mui/material";
import styles from "./rounded_button.module.css";
//RoundedButton component definition
const RoundedButton = ({
	background,//Background style
	size,//size of the button
	route,//Current route (Used for active state styling)
	forPath,//Path to match with route for active state
	children,//children element to be displayed inside the button
	onClick,//Click event handler
	type,//type of the button
	className,//additional class names for styling
	disabled,//Disabled state of the button
}) => {
	return (
		<Button
		//Combine the class names for styling 
			className={`${className} ${styles.rounded_button}
						${background === "light" ? styles.bg_light : styles.bg_dark}//conditional background style
						${forPath === route ? styles.active_button : ""}//Conditional active state styling
						${
							type === "multi" && size === "medium"//conditional styles for multi and single button types
								? styles.multi_medium
								: type === "multi" && size === "small"
								? styles.multi_small
								: type === "single" && size === "medium"
								? styles.single_medium
								: type === "single" && size === "small"
								? styles.single_small
								: ""
						}
					`}
			onClick={onClick}//attach the click event handler
			disabled={disabled}//set the disabled state of the button
		>
			{/* Conditional rendering based on the button type */}
			{type === "single" ? (
				children[0]//Render single child element for single type
			) : (
				//Render multiple child elements for multi type
				<Box
					component="span"
					className="w-full h-full flex flex-wrap justify-center p-2 gap-2 items-center"
				>
					{/* First child element (icon) */}
					<Box component="span" className="max-w-[20%] relative">
						{children[0]}
					</Box>
					{/* second child element (text) */}
					<Box component="span" className="max-w-[80%] font-karla text-xl uppercase">
						{children[1]}
					</Box>
				</Box>
			)}
		</Button>
	);
};

export default RoundedButton;
