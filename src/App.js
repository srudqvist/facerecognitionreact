import "./App.css";
import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import ParticlesBg from "particles-bg";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import SignIn from "./components/SignIn/SignIn";
import { Component } from "react";
import SignUp from "./components/SignUp/SignUp";

const setupClarifaiRequest = (imageUrl) => {
	// Your PAT (Personal Access Token) can be found in the portal under Authentification
	const PAT = process.env.REACT_APP_PAT;
	// Specify the correct user_id/app_id pairings
	// Since you're making inferences outside your app's scope
	const USER_ID = "srudqvist";
	const APP_ID = "facial-recognition-app";
	// Change these to whatever model and image URL you want to use
	// const MODEL_ID = "face-detection";
	const IMAGE_URL = imageUrl;

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
			box: {},
			route: "signin",
			isSignedIn: false,
		};
	}

	onInputChange = (event) => {
		this.setState({ input: event.target.value });
	};

	calculateFaceLocation = (data) => {
		const face = data.outputs[0].data.regions[0].region_info.bounding_box;
		const image = document.getElementById("inputImage");
		const imgWidth = Number(image.width);
		const imgHeight = Number(image.height);

		let leftCol = face.left_col * imgWidth;
		let rightCol = imgWidth - face.right_col * imgWidth;
		let topRow = face.top_row * imgHeight;
		let bottomRow = imgHeight - face.bottom_row * imgHeight;

		let faceLocationData = {
			leftCol: leftCol,
			topRow: topRow,
			rightCol: rightCol,
			bottomRow: bottomRow,
		};

		return faceLocationData;
	};

	displayFaceBox = (box) => {
		this.setState({ box: box });
	};

	onButtonSubmit = () => {
		this.setState({ imageUrl: this.state.input });

		// NOTE: MODEL_VERSION_ID is optional, you can also call prediction with the MODEL_ID only
		// https://api.clarifai.com/v2/models/{YOUR_MODEL_ID}/outputs
		// this will default to the latest version_id

		fetch(
			"https://api.clarifai.com/v2/models/" +
				"face-detection" +
				"/versions/" +
				"6dc7e46bc9124c5c8824be4822abe105" +
				// "/versions/" +
				// MODEL_VERSION_ID +
				"/outputs",
			setupClarifaiRequest(this.state.input)
		)
			.then((response) => response.json())
			.then((result) =>
				this.displayFaceBox(this.calculateFaceLocation(result))
			)
			.catch((error) => console.log("error", error));
	};

	onRouteChange = (route) => {
		if (route === "signout") {
			this.setState({ isSignedIn: false });
		} else if (route === "home") {
			this.setState({ isSignedIn: true });
		}
		this.setState({ route: route });
	};
	render() {
		const { isSignedIn, imageUrl, route, box } = this.state;
		return (
			<div className="App">
				<ParticlesBg
					type="cobweb"
					bg={true}
					num={100}
					color="#FFFFFF"
				/>

				<Navigation
					isSignedIn={isSignedIn}
					onRouteChange={this.onRouteChange}
				/>
				{route === "home" ? (
					<div>
						<Logo />
						<Rank />
						<ImageLinkForm
							onInputChange={this.onInputChange}
							onButtonSubmit={this.onButtonSubmit}
						/>

						<FaceRecognition imageUrl={imageUrl} box={box} />
					</div>
				) : route === "signin" ? (
					<SignIn onRouteChange={this.onRouteChange} />
				) : (
					<SignUp onRouteChange={this.onRouteChange} />
				)}
			</div>
		);
	}
}

export default App;
