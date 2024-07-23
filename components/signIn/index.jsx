import { useState } from "react";//Import useState hook from react
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
} from "@mui/material";//importing material-UI components
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";//Importing LOckOutLined from material-UI icons
import Visibility from "@mui/icons-material/Visibility";//Importing visibility icon from Material-UI Icons
import VisibilityOff from "@mui/icons-material/VisibilityOff";//Importing Visibility off Icon from material-UI
import userSignInHandler from "@/api-handlers/authentication-handler/sign_in.handler";//Importing the signin Handeler function
import { Link } from "react-router-dom";//IMportinglink component from react-router-dom

/**
 * This component renders a form for signing in
 */
const SignIn = () => {
	//State to manage loading state during sign-in process
	const [loading, setLoading] = useState(false);
	//State to manage visibility ofthe password input field
	const [passwordVisible, setPasswordVisible] = useState(false);
	//Function to toggle password visibility
	const togglePasswordVisibility = () => {
		setPasswordVisible(!passwordVisible);
	};

	/**
	 * This function sends a request for user signing in
	 */
	const signInButton = async (e) => {
		try {
			e.preventDefault();//Prevent default form submission
			const email = e.target["email"].value;//Get email value from form
			const password = e.target["password"].value;//Get password value from form

			setLoading(true);//set loading state to true

			//Call the sign in handler with email id and password
			await userSignInHandler({
				email,
				password,
				user_type: "processing",
			});

			setLoading(false);//Set loading state to false after signin process
		} catch (error) {
			console.log(error);
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
			{/* right grid item for the sign in form */}
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
					{/* Avatar with lock icon */}
					<Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
						<LockOutlinedIcon />
					</Avatar>
					{/* Signin title */}
					<Typography component="h1" variant="h5" color="white">
						Sign in to Galaxeye Blue
					</Typography>
					{/* Signin form */}
					<form onSubmit={signInButton}>
						{/* Email input field */}
						<TextField
							margin="normal"
							required
							fullWidth
							id="email"
							label="Email Address"
							autoFocus
						/>
						{/* Password input field with visibility toggle */}
						<TextField
							margin="normal"
							required
							fullWidth
							label="Password"
							id="password"
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
						{/* <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              /> */}
						{
							// ?
							//   <Button
							//     type="submit"
							//     fullWidth
							//     variant="contained"
							//     sx={{ mt: 3, mb: 2 }}
							//     onClick={()=>signInButton(setLoading, setUserAccessToken, navigate)}
							//   >
							//             Sign In
							//   </Button>
							//   :
							<Button
								type="submit"
								fullWidth
								variant="contained"
								sx={{ mt: 3, mb: 2 }}
								disabled={loading}
							>
								Sign In
							</Button>
						}
					</form>

					<Typography component="p" variant="p" color="white">
						Don&lsquo;t have an account?{" "}
						<Link
							to="/sign-up"
							style={{
								textDecoration: "underline",
								color: "#ce93d8",
								fontWeight: 600,
							}}
						>
							Create account
						</Link>
					</Typography>

					{/* <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="#" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid> */}
				</Box>
			</Grid>
		</Grid>
	);
};
export default SignIn;
