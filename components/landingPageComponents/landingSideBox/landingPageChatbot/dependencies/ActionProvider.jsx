import getBotAnswer from "@/api-handlers/landing-page-handler/get_bot_answers";
import React from "react";
import { createClientMessage } from "react-chatbot-kit";

const ActionProvider = ({ createChatBotMessage, setState, children }) => {
	// Function for the bot to ask the user to select a region for analysis
	const goBackToRegionSelect = () => {
		console.log("children", children);
		setState((state) => {
			const botMessage = createChatBotMessage("Please select a region for analysis", {
				delay: 200, //Delaying Message appearance by 200ms
				widget: "regionOverview",
			});

			return {
				...state,
				messages: [...state.messages, botMessage],
			};
		});
	};
	// Function for creating a message inquiring about the specified region
	const selectRegion = () => {
		console.log("children", children); 	// Debugging purpose
		setState((state) => {
			console.log(state.selectedRegion);
			const forcedUserMessage = createClientMessage(
				"I would like to inquire about the " + state.selectedRegion.name + " region",
				{ withAvatar: false, delay: 500, widget: "questionOverview" }
			);
			//Update the state with the new bot message
			return {
				...state,
				messages: [...state.messages, forcedUserMessage],
			};
		});
	};

	// Function to create client message inquiring about the selected region
	const selectQuestion = async () => {
		console.log("children", children);
		var questionID;
		var regionID;
		//Set the state and extract questionId and regionId from the selected question and region
		await setState((state) => {
			questionID = state.selectedQuestion.id;
			regionID = state.selectedRegion.id;

			return { ...state };
		});
		console.log(questionID, regionID, "answer222");
		//Fetch the bot answer using the questionID and regioID
		const answer = await getBotAnswer(questionID, regionID);
		//Update the states with bot's Answer and provide options for further questions
		setState((state) => {
			console.log(state.selectedRegion);
			const forcedUserMessage = createClientMessage(state.selectedQuestion.question);

			console.log(answer, "answererr");
			//created a Bot message with the answer to the Question
			const answerToQuestion = createChatBotMessage(Object.values(answer).pop());
			//creating a bot message asking if the user needs any help
			const returnAllQuestions = createChatBotMessage("Anything else I can help you with?", {
				withAvatar: false,
				delay: 5000, //Delay message appearance by 5ms
				widget: "questionOverview",
			});
			//Update the state with the forced user message, the bot answer and follow up questions
			return {
				...state,
				messages: [
					...state.messages,
					forcedUserMessage,
					answerToQuestion,
					returnAllQuestions,
				],
			};
		});
	};

	// Rendering the children components with provided actions
	return (
		<div>
			{React.Children.map(children, (child) => {
				return React.cloneElement(child, {
					actions: { selectRegion, selectQuestion, goBackToRegionSelect },
				});
			})}
		</div>
	);
};

export default ActionProvider;
