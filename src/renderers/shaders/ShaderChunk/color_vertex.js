import {glsl} from "../glsl.js";

export default glsl`
#ifdef USE_COLOR

	vColor.xyz = color.xyz;

#endif
`;
