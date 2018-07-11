// glsl template literal

var glsl = function() {
	return arguments[0][0].replace( /[ \t]*\/\/.*\n/g, '' ) // remove //
	.replace( /[ \t]*\/\*[\s\S]*?\*\//g, '' ) // remove /* */
	.replace( /\n{2,}/g, '\n' ) // # \n+ to \n
}

export {glsl};
