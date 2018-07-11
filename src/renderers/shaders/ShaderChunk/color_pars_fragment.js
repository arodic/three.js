import {glsl} from "../glsl.js";

export default glsl`
#ifdef USE_COLOR

	varying vec3 vColor;

#endif
`;
