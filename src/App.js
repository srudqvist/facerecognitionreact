import "./App.css";
import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import ParticlesBg from "particles-bg";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import { Component } from "react";

const setupClarifaiRequest = (imageUrl) => {
	// Your PAT (Personal Access Token) can be found in the portal under Authentification
	const PAT = process.env.REACT_APP_PAT;
	// Specify the correct user_id/app_id pairings
	// Since you're making inferences outside your app's scope
	const USER_ID = "srudqvist";
	const APP_ID = "facial-recognition-app";
	// Change these to whatever model and image URL you want to use
	// const MODEL_ID = "face-detection";
	const IMAGE_URL = "https://samples.clarifai.com/metro-north.jpg";

	const raw = JSON.stringify({
		user_app_id: {
			user_id: USER_ID,
			app_id: APP_ID,
		},
		inputs: [
			{
				data: {
					image: {
						url: IMAGE_URL,
					},
				},
			},
		],
	});

	const requestOptions = {
		method: "POST",
		headers: {
			Accept: "application/json",
			Authorization: "Key " + PAT,
		},
		body: raw,
	};

	return requestOptions;
};

class App extends Component {
	constructor() {
		super();
		this.state = {
			input: "",
			imageUrl: "",
		};
	}
	onInputChange = (event) => {
		this.setState({ input: event.target.value });
	};
	onButtonSubmit = (event) => {
		console.log("Click");
		let imageUrl = this.state.input;
		this.setState({ imageUrl: this.state.input });
		// NOTE: MODEL_VERSION_ID is optional, you can also call prediction with the MODEL_ID only
		// https://api.clarifai.com/v2/models/{YOUR_MODEL_ID}/outputs
		// this will default to the latest version_id

		fetch(
			"https://api.clarifai.com/v2/models/" +
				"face-detection" +
				// "/versions/" +
				// MODEL_VERSION_ID +
				"/outputs",
			setupClarifaiRequest(imageUrl)
		)
			.then((response) => response.json())
			.then((result) => console.log(result))
			.catch((error) => console.log("error", error));
	};

	render() {
		return (
			<div className="App">
				<ParticlesBg
					type="cobweb"
					bg={true}
					num={100}
					color="#FFFFFF"
				/>
				<Navigation />

				<Logo />
				<Rank />
				<ImageLinkForm
					onInputChange={this.onInputChange}
					onButtonSubmit={this.onButtonSubmit}
				/>

				<FaceRecognition imageUrl={this.state.imageUrl} />
			</div>
		);
	}
}

export default App;
