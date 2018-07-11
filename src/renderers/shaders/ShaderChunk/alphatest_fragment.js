import {glsl} from "../glsl.js";

export default glsl`
#ifdef ALPHATEST

	if ( diffuseColor.a < ALPHATEST ) discard;

#endif
`;
