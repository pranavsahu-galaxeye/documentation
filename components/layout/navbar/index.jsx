import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import HomeIcon from "@mui/icons-material/Home";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import {
	cookiesValuesAtom,
	currentSelectedPondDateAtom,
	currentSelectedStatusOnRegionInsightAtom,
	isUserOnLandingPageAtom,
	pondDateArrayAtom,
	showGraphBoxAtom,
	showLoadingScreenAtom,
	showPondInsightPageAtom,
	showRegionInsightPageAtom,
	userAccessTokensAtom,
} from "../../../jotai"; //Importing atoms from jotai
import { useAtom, useAtomValue, useSetAtom } from "jotai";// importing hooks from jotai
import { toast } from "react-hot-toast";//importing toast from react-hot-toast for notifications
import Cookies from "js-cookie";//Importing js cookies to manage cookies
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@mui/material";

//Function to the email dialog box
const openEmailDialogBox = () => {
	window.open("mailto:info@galaxeye.space");
};

/**
 * This component renders a list of options to route in the navbar with a logo
 */
function Navbar() {
	const [anchorElUser, setAnchorElUser] = useState(null); //State to manage the user menu anchor element
	const SET_UAT = useSetAtom(userAccessTokensAtom); //Jotai atom to manage various state value
	const [COOKIES, SET_COOKIES] = useAtom(cookiesValuesAtom);// Jotai atom manage the cookie values
	const IS_USER_ON_LANDING_PAGE = useAtomValue(isUserOnLandingPageAtom);// Jotai atom to check if the user is on the landing page
	const SET_POND_INSIGHT_DISPLAY_BOOLEAN = useSetAtom(showPondInsightPageAtom);//Jotai atom to check the visibility of the pond Insight page
	const SET_REGION_INSIGHT_DISPLAY_BOOLEAN = useSetAtom(showRegionInsightPageAtom);//Jotai atom to check the visibility of the region Insight page
	const SET_LOADING_SCREEN_BOOLEAN = useSetAtom(showLoadingScreenAtom);//Jotai atom to manage the visibility of the loading screen
	const SET_GRAPH_BOX_DISPLAY_BOOLEAN = useSetAtom(showGraphBoxAtom);//Jotai atom to manage the visibilty of the graph box
	const SET_CURRENT_SELECTED_STATUS_ON_REGION_INSIGHT = useSetAtom(
		currentSelectedStatusOnRegionInsightAtom
	);//Jotai atom to manage the current selected status on region insight
	const SET_CURRENT_SELECTED_POND_DATE = useSetAtom(currentSelectedPondDateAtom);//Jotai atom to manage the current selected pond date
	const SET_POND_DATE_ARRAY = useSetAtom(pondDateArrayAtom);//Jotai atom to manage the pond date array

	//Function to open the user menu
	const handleOpenUserMenu = (event) => {
		setAnchorElUser(event.currentTarget);
	};

	//function to logout and close the user menu
	const logoutAndCloseUserMenu = (event) => {
		logout();
		setAnchorElUser(event.currentTarget);
	};

	//Function to close the user menu
	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};

	// hoke to navigate to different routes
	const navigate = useNavigate();

	//Function to handle user logout
	const logout = () => {
		toast.loading("Logging Out...", {
			id: "logging-out",
		});
		//remove accessToken from cookie
		Cookies.remove("accessToken");
		localStorage.clear();
		SET_COOKIES({});
		SET_UAT(null);
		toast.success("Logged Out", {
			id: "logging-out",
		});
		window.location.href = "/sign-in";//Redirected to signin page
	};

	//Function to navigate back to landing page
	const navigateBackToLandingPage = () => {
		SET_LOADING_SCREEN_BOOLEAN(true);
		SET_POND_INSIGHT_DISPLAY_BOOLEAN(false);
		SET_REGION_INSIGHT_DISPLAY_BOOLEAN(true);
		SET_GRAPH_BOX_DISPLAY_BOOLEAN(false);
		SET_CURRENT_SELECTED_STATUS_ON_REGION_INSIGHT("all");
		SET_POND_DATE_ARRAY([]);
		SET_CURRENT_SELECTED_POND_DATE(null);
		navigate("/");//Navigate to the root route 
	};

	return (
		<AppBar
			position="static"
			sx={{ backgroundColor: "light dark", paddingY: "3px", height: "100%" }}
		>
			<Container maxWidth="xxl" sx={{ zIndex: 15000 }}>
				<Toolbar>
					{/* Logo image */}
					<img
						src={"/galaxeye-white.png"}
						width="100px"
						alt="Galaxeye Logo"
						loading="lazy"
					/>

					<Box sx={{ flexGrow: 1 }}></Box>
					{/* Home button, visible only if the user is not on the landing page */}
					{IS_USER_ON_LANDING_PAGE ? (
						<></>
					) : (
						<Box
							sx={{
								flexGrow: 0,
								display: { md: "flex" },
								alignItems: "flex-end",
								marginRight: "20px",
							}}
						>
							<Button
								variant="outlined"
								startIcon={<HomeIcon />}
								sx={{ width: 90, padding: 1, color: "white", borderColor: "grey" }}
								onClick={navigateBackToLandingPage}
							>
								Home
							</Button>
						</Box>
					)}

					{/* User avatar and menu */}
					<Box sx={{ flexGrow: 0 }}>
						<Tooltip title="Open settings">
							<IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
								<Avatar>
									{COOKIES?.first_name?.split(" ")?.[0]?.[0]}
									{COOKIES?.first_name?.split(" ")?.[1]?.[0]}
								</Avatar>
							</IconButton>
						</Tooltip>
						<Menu
							sx={{ mt: "45px" }}
							id="menu-appbar"
							anchorEl={anchorElUser}
							anchorOrigin={{
								vertical: "top",
								horizontal: "right",
							}}
							keepMounted
							transformOrigin={{
								vertical: "top",
								horizontal: "right",
							}}
							open={Boolean(anchorElUser)}
							onClose={handleCloseUserMenu}
						>
							{/* Display user's name and email */}
							<Typography key="Name" textAlign="start" px="10px">
								Name : {COOKIES.first_name} {COOKIES.last_name}
							</Typography>
							<Typography
								key="Email"
								textAlign="start"
								px="10px"
								paddingBottom="10px"
							>
								Email : {COOKIES.email}
							</Typography>

							<MenuItem key="Contact Us" onClick={openEmailDialogBox}>
								<Typography textAlign="center">Contact Us</Typography>
							</MenuItem>
							<MenuItem key="Logout" onClick={logoutAndCloseUserMenu}>
								<Typography textAlign="center">Log Out</Typography>
							</MenuItem>
						</Menu>
					</Box>
				</Toolbar>
			</Container>
		</AppBar>
	);
}
export default Navbar;
