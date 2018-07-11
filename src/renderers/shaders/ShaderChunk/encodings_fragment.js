import {glsl} from "../glsl.js";

export default glsl`
  gl_FragColor = linearToOutputTexel( gl_FragColor );
`;
