import React from "react";

const MessageParser = ({ children, actions }) => {
	//Defining the parse function to handle the incoming messages
	const parse = (message) => {
		console.log(message);
	};

	return (
		//Rendering the child component
		<div>
			{React.Children.map(children, (child) => {
				return React.cloneElement(child, {
					parse: parse,
					actions: actions,
				});
			})}
		</div>
	);
};

export default MessageParser;
