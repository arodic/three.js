import * as THREE from "../src/Three.js";

export class Shot extends Object {
	constructor( params ) {
		super();
		this.renderer = params.renderer;
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera( 30, 1, 1, 10000 );
	}
	init() {
	}
	dispose() {
	}
	play() {
	}
	pause() {
	}
	stop() {
	}
	update( time ) {
	}
	preRender() {
	}
  render() {

		this.renderer.render( this.scene, this.camera );

	}
	postRender() {
	}
	setAspect( aspect ) {

		this.camera.aspect = aspect;
		this.camera.updateProjectionMatrix();

	}
}
