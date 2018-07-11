import {Shot} from "./shot.js";
import {TeapotBufferGeometry} from "./js/geometries/TeapotBufferGeometry.js";
import {EditorControls} from "./js/controls/EditorControls.js";

let TEAPOT_SIZE = 400;

export class Example extends Shot {
  // static get properties() {
  //   return {
  //     teapot: null,
  //     tess: { value: 15, config: {min: 2, max: 50, step: 1, label: 'tesselation' }},
  //     bottom: true,
  //     lid: true,
  //     body: true,
  //     fitLid: false,
  //     nonblinn: { value: false, config: {label: 'original scale'} },
  //   };
  // }
  // onPropertyChange(event) {
  //   if (event.object === this) {
  //     this.createNewTeapot();
  //   }
  //   this.rendered = false;
  // }
  init() {

    this.teapot = null;
    this.tess = 15;
    this.bottom = true;
    this.lid = true;
    this.body = true;
    this.fitLid = false;
    this.nonblinn = false;

    let camera = this.camera = new THREE.PerspectiveCamera( 45, 1, .1, 20000 );
    let scene = this.scene = new THREE.Scene();

    let control = new EditorControls( this.camera, this.renderer.domElement );
    control.addEventListener('change', () => {
      this.rendered = false;
    });

    // CAMERA
    scene.add( camera );
    camera.position.set( -600, 550, 1300 );
    camera.lookAt( control.target );

    // LIGHTS
    let ambientLight = new THREE.AmbientLight( 0x333333 );	// 0.2
    scene.add( ambientLight );

    let light = new THREE.DirectionalLight( 0xFFFFFF, 1.0 );
    scene.add( light );

    // TEXTURE MAP

    let textureMap = new THREE.TextureLoader().load( new URL('textures/UV_Grid_Sm.jpg', import.meta.url).pathname, () => {
      this.rendered = false;
    } );

    this.material = new THREE.MeshPhongMaterial( { map: textureMap, side: THREE.DoubleSide } );

    this.createNewTeapot();
  }
  createNewTeapot() {

    if ( this.teapot ) {

      this.teapot.geometry.dispose();
      this.scene.remove( this.teapot );

    }

    let teapotGeometry = new TeapotBufferGeometry( TEAPOT_SIZE,
      this.tess,
      this.bottom,
      this.lid,
      this.body,
      this.fitLid,
      !this.nonblinn );

    this.teapot = new THREE.Mesh( teapotGeometry, this.material );

    this.scene.add( this.teapot );

  }
}
