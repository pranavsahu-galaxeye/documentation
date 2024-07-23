import { Outlet } from "react-router";//import outlet for nested routes rendering
import Navigation from "./navbar";//import the navigation component
import { Toaster } from "react-hot-toast";//import toaster for notification
import { Box, Stack } from "@mui/system";//import box and stack from MUI
import { Fragment, useMemo } from "react";//Import fragment and useMemo from react
import { useLocation, useNavigate } from "react-router-dom";//Import hooks from react-router-dom
import { history, ignoreNavbarRoutes } from "../../constants";//Import custom constants
import LoadingScreen from "../utils/loadingScreen";//Import loading screen component
import CheckCookies from "./checkCookies";//Import check cookies component

/**
 * This component is basic layout with navbar, whatever components get wraps in this will have a navbar
 */
function LayoutWithNavbar({ children }) {
	return (
		<Stack spacing={0} sx={{ height: "100vh" }}>{/* Stack to arrange children vertically with no spacing */}
			{/* Top section for the navigation bar, occupies 10% of the viewport height */}
			<Box sx={{ height: "10%" }}>
				<Navigation />
			</Box>
			{/* Bottom section for the main content, occupies 90% of the viewport height with a dark background color */}
			<Box sx={{ height: "90%", backgroundColor: "#242424" }}>{children}</Box>
		</Stack>
	);
}

/**
 * This component is basic layout, all the pages get wrapped in this component
 */
function Layout() {
	const location = useLocation();//Get the current location from the router

	history.navigate = useNavigate();//Hook to programmatically navigate
	history.location = location;// Update the history object with the current location

	// Decide the layout should have a navbar or not based on the given routes for which we have to hide the navbar
	const BasicLayout = useMemo(() => {
		const isNavbarIgnored = ignoreNavbarRoutes.includes(location.pathname);
		//Use fragment isnavbar should be ignored, Otherwise use LayoutWithNavbar
		return isNavbarIgnored ? Fragment : LayoutWithNavbar;
	}, [location.pathname]);//Recompute Whenever the PathName changes

	return (
		<CheckCookies> {/* Wrapper to check for cookies */}
			<Box sx={{ width: "100%", margin: "0", overflow: "hidden" }}>
				<BasicLayout>
					<Outlet /> {/* Render the matched child route */}
				</BasicLayout>
				<LoadingScreen /> {/* Display the loading screen if necessary */}

				{/* Setup toaster for notifications */}
				<Toaster
					position="top-center"
					reverseOrder={true}
					toastOptions={{
						style: {
							zIndex: 50,
						},
						duration: 5000,
					}}
				/>
			</Box>
		</CheckCookies>
	);
}

export default Layout;
