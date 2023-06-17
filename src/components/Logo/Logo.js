import React from "react";
import Tilt from "react-parallax-tilt";
import "./Logo.css";
import brain from "./brainIcon.png";

const Logo = () => {
	return (
		<div className="ma4 mt0">
			<Tilt
				className="Tilt br2 shadow-2 parallax-effect"
				tiltReverse={true}
				// reset={false}
				perspective={500}
				glareEnable={true}
				glareMaxOpacity={0.45}
				// scale={1.02}
				// options={{ max: 100 }}
				style={{
					height: 100,
					width: 100,
					background:
						"linear-gradient(89deg, #FF5EDF 0%,  #04C8DE 100%)",
				}}
				// style={{ height: "100px", width: "100px" }}
			>
				<div className="Tilt-inner pa3">
					<img
						// style={{ paddingTop: "5px" }}
						alt="brain logo"
						src={brain}
					></img>
				</div>
			</Tilt>
		</div>
	);
};

export default Logo;
