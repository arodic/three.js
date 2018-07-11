import {glsl} from "../glsl.js";

export default glsl`
#ifdef USE_EMISSIVEMAP

	uniform sampler2D emissiveMap;

#endif
`;
