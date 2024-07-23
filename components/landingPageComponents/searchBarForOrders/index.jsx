import { InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useAtomValue, useSetAtom } from "jotai";
import { listOfAllOrderDataAtom, listOfFilteredOrderDataAtom } from "../../../jotai";

/**
 * This component is used to search in the order data using the order name
 */
function SearchBarForOrders() {
	//Using Jotai Atoms to manage the state
	const SET_FILTERED_ORDER_DATA = useSetAtom(listOfFilteredOrderDataAtom);
	const ALL_ORDER_DATA = useAtomValue(listOfAllOrderDataAtom);

	// Search and filter the all orders using the name
	const handleChange = (event) => {
		// console.log(searchTerm);
		// Filter ALL_ORDER_DATA based on the search term and update the filtered order data atom
		SET_FILTERED_ORDER_DATA(
			ALL_ORDER_DATA.filter((order) => {
				//check if the order name includes the search term
				return order.name.toLowerCase().includes(event.target.value);
			})
		);
	};

	return (
		// Render the Textfield only if there is order data available
		ALL_ORDER_DATA && (
			<TextField
				id="search"
				type="search"
				label="Search"
				onChange={handleChange}// Call handle change on input change
				sx={{ width: "100%" }}
				InputProps={{
					endAdornment: (
						<InputAdornment position="end">
							<SearchIcon /> {/* Search Icon Displayed at the end */}
						</InputAdornment>
					),
				}}
			/>
		)
	);
}

export default SearchBarForOrders;
