import { createChatBotMessage } from "react-chatbot-kit";
import RegionsOverview from "./widgets/selectRegionWidget/regions";
import QuestionOverview from "./widgets/SelectQuestionWidget/questions";

const config = {
	//Initial messages the bot sends when it starts
	initialMessages: [
		createChatBotMessage(`Hi I'm BlueBot. I’m here to help you with all your shrimp needs`),
		createChatBotMessage("Please select a region for analysis", {
			withAvatar: false,//Do not show avatar for this message
			delay: 500,//Delay message 500ms
			widget: "regionOverview",
		}),
	],
	//Initial state of the bot, Storing selected region and question.
	state: { selectedRegion: {}, selectedQuestion: {} },
	//Widgets configuration for the chatbot
	widgets: [
		{
			widgetName: "regionOverview",
			widgetFunc: (props) => <RegionsOverview {...props} />, //Function to render RegionsOverview widget
			mapStateToProps: ["selectedRegion"],
		},
		{
			widgetName: "questionOverview",
			widgetFunc: (props) => <QuestionOverview {...props} />, //Function to render QuestionOverview widget
			mapStateToProps: ["selectedQuestion"],
		},
	],
	customStyles: {
		botMessageBox: { backgroundColor: "#0047AB" }, //Background color for botMessageBox
		chatButton: { backgroundColor: "#0047AB" }, //Background color for chatButton
	},
};

export default config;
