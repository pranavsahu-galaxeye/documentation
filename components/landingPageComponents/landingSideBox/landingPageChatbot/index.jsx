import "react-chatbot-kit/build/main.css";
import Chatbot from "react-chatbot-kit";
import config from "./dependencies/config";
import MessageParser from "./dependencies/MessageParser";
import ActionProvider from "./dependencies/ActionProvider";

//Defining the LandingPageChatbot functional component
function LandingPageChatbot() {
	//Rendering the chatbot component with configurations and dependencies
	return (
		<div>
			<Chatbot
				config={config}// configuration object for the chatbot
				messageParser={MessageParser} // message parser component
				actionProvider={ActionProvider}// ActionProvider component
			/>
		</div>
	);
}

export default LandingPageChatbot;
