import {Shot} from "./shot.js";

export class Example extends Shot {
  init() {
    let camera = this.camera = new THREE.PerspectiveCamera( 45, 1, .1, 20000 );
    let scene = this.scene = new THREE.Scene();

    camera.position.z = 5500;
    scene.background = new THREE.Color( 0xffffff );

    let geometry = new THREE.BoxGeometry( 100, 100, 100 );
    let material = new THREE.MeshNormalMaterial();

    let root = new THREE.Mesh( geometry, material );
    scene.add( root );

    let amount = 200, object, parent = root;

    for ( let i = 0; i < amount; i ++ ) {

      object = new THREE.Mesh( geometry, material );
      object.position.x = 100;

      parent.add( object );
      parent = object;

    }

    parent = root;

    for ( let i = 0; i < amount; i ++ ) {

      object = new THREE.Mesh( geometry, material );
      object.position.x = - 100;

      parent.add( object );
      parent = object;

    }

    parent = root;

    for ( let i = 0; i < amount; i ++ ) {

      object = new THREE.Mesh( geometry, material );
      object.position.y = - 100;

      parent.add( object );
      parent = object;

    }

    parent = root;

    for ( let i = 0; i < amount; i ++ ) {

      object = new THREE.Mesh( geometry, material );
      object.position.y = 100;

      parent.add( object );
      parent = object;

    }

    parent = root;

    for ( let i = 0; i < amount; i ++ ) {

      object = new THREE.Mesh( geometry, material );
      object.position.z = - 100;

      parent.add( object );
      parent = object;

    }

    parent = root;

    for ( let i = 0; i < amount; i ++ ) {

      object = new THREE.Mesh( geometry, material );
      object.position.z = 100;

      parent.add( object );
      parent = object;

    }

  }
  update( time ) {
    let rx = Math.sin( time * 0.0007 ) * 0.2;
    let ry = Math.sin( time * 0.0003 ) * 0.1;
    let rz = Math.sin( time * 0.0002 ) * 0.1;

    this.scene.traverse( function ( object ) {

      object.rotation.x = rx;
      object.rotation.y = ry;
      object.rotation.z = rz;

    } );

    this.rendered = false;
  }
}
