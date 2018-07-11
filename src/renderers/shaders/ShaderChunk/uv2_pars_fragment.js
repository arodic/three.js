import {glsl} from "../glsl.js";

export default glsl`
#if defined( USE_LIGHTMAP ) || defined( USE_AOMAP )

	varying vec2 vUv2;

#endif
`;
