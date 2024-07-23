import { useState } from "react";
import { Link } from "react-router-dom";
import {
	Avatar,
	Box,
	Button,
	Grid,
	IconButton,
	InputAdornment,
	Paper,
	TextField,
	Typography,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import userSignUpHandler from "@/api-handlers/authentication-handler/sign_up.handler";

/**
 * This component renders a form for signing in
 */
const SignUp = () => {
	//State to manage loading state during signup process
	const [loading, setLoading] = useState(false);
	//State to manage password visibility
	const [passwordVisible, setPasswordVisible] = useState(false);
	//function to toggle password visibility
	const togglePasswordVisibility = () => {
		setPasswordVisible(!passwordVisible);
	};

	/**
	 * This function sends a request for user signing in
	 */
	const signInButton = async (e) => {
		try {
			e.preventDefault();//Password default form submission
			setLoading(true);//Set loading state to true
			const email = e.target["email"].value;//Get email value from form
			const password = e.target["password"].value;//Get password value from form
			const firstName = e.target["firstName"].value;//Get first name value from form 
			const lastName = e.target["lastName"].value;//Get last name value from form
			const organization = e.target["organization"].value;//Get orgnaisation name value from form

			//Call the signup handler with the form data
			await userSignUpHandler({
				email,
				password,
				firstName,
				lastName,
				organization,
				user_type: "processing",
			});
			setLoading(false);//set loading state to false after signup process
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<Grid container component="main" sx={{ height: "100vh" }}>
			{/* left grid item for the background image */}
			<Grid
				item
				xs={false}
				sm={4}
				md={7}
				sx={{
					backgroundImage: `url(${"../../cover.jpeg"})`,
					backgroundRepeat: "no-repeat",
					backgroundColor: (t) =>
						t.palette.mode === "light" ? t.palette.grey[50] : t.palette.grey[900],
					backgroundSize: "cover",
					backgroundPosition: "center",
				}}
			/>
			{/* right grid item for the form */}
			<Grid
				item
				xs={12}
				sm={8}
				md={5}
				component={Paper}
				elevation={6}
				square
				sx={{
					backgroundColor: "black",
				}}
			>
				<Box
					sx={{
						my: 8,
						mx: 4,
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
					}}
				>
					{/* Avatar with lock Icon */}
					<Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
						<LockOutlinedIcon />
					</Avatar>
					{/* sign-up title */}
					<Typography component="h1" variant="h5" color="white">
						Welcome to Galaxeye Blue
					</Typography>
					{/* sign-up form */}
					<form onSubmit={signInButton} autoComplete="off">
						{/* Name input fields */}
						<Box
							sx={{
								display: "flex",
								flexDirection: "row",
								alignItems: "center",
								justifyContent: "space-between",
								flexWrap: "wrap",
							}}
						>
							<TextField
								margin="normal"
								required
								name="firstName"
								id="firstName"
								label="First Name"
								autoFocus
								sx={{
									width: "48%",
									"@media (max-width: 450px)": {
										width: "100%",
									},
								}}
							/>

							<TextField
								margin="normal"
								required
								name="lastName"
								id="lastName"
								label="Last Name"
								sx={{
									width: "48%",
									"@media (max-width: 450px)": {
										width: "100%",
									},
								}}
							/>
						</Box>
						{/* organisation Input field */}
						<TextField
							margin="normal"
							required
							fullWidth
							name="organization"
							id="organization"
							label="Organization Name"
						/>
						{/* Email input field */}
						<TextField
							margin="normal"
							required
							fullWidth
							id="email"
							label="Email Address"
							autoComplete="new-password"
						/>{/* Password input field with visibility toggle */}
						<TextField
							margin="normal"
							required
							fullWidth
							label="Password"
							id="password"
							autoComplete="new-password"
							type={passwordVisible ? "text" : "password"}
							InputProps={{
								endAdornment: (
									<InputAdornment position="end">
										<IconButton
											aria-label="toggle password visibility"
											onClick={togglePasswordVisibility}
											edge="end"
										>
											{passwordVisible ? <VisibilityOff /> : <Visibility />}
										</IconButton>
									</InputAdornment>
								),
							}}
						/>
						{/* sign-up button */}
						<Button
							type="submit"
							fullWidth
							variant="contained"
							sx={{ mt: 3, mb: 2 }}
							disabled={loading}
						>
							Create account
						</Button>
					</form>
					
					{/* Link to sign-in Page */}
					<Typography component="p" variant="p" color="white">
						Already have an account?{" "}
						<Link
							to="/sign-in"
							style={{
								textDecoration: "underline",
								color: "#ce93d8",
								fontWeight: 600,
							}}
						>
							Sign in
						</Link>
					</Typography>
				</Box>
			</Grid>
		</Grid>
	);
};
export default SignUp;
