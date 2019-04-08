/**
 * @author mrdoob / http://mrdoob.com/
 * @author Mugen87 / https://github.com/Mugen87
 */

THREE.PointerLockControls = function ( camera, domElement ) {

	var scope = this;

	this.domElement = domElement || document.body;
	this.isLocked = false;
	this.reverseY = false;
	this.sensitivity = 0.002;

	var yAxis = new THREE.Vector3( 0, 1, 0 );
	var xAxis = new THREE.Vector3( 1, 0, 0 );
	var tempQuat = new THREE.Quaternion();
	var tempVector = new THREE.Vector3();
	var yawQuat = new THREE.Quaternion();
	var pitchQuat = new THREE.Quaternion();

	var PI_2 = Math.PI / 2;

	function onMouseMove( event ) {

		if ( scope.isLocked === false ) return;

		var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

		tempQuat.copy( camera.quaternion );
		yawQuat.setFromAxisAngle( yAxis, movementX * - scope.sensitivity );
		camera.quaternion.copy( yawQuat ).multiply( tempQuat );

		tempQuat.copy( camera.quaternion );
		pitchQuat.setFromAxisAngle( tempVector.copy( xAxis ).applyQuaternion( camera.quaternion ), movementY * scope.sensitivity * ( scope.reverseY ? 1 : -1 ) );
		camera.quaternion.copy( pitchQuat ).multiply( tempQuat );

		// pitch = Math.max( - PI_2, Math.min( PI_2, pitch ) );

		scope.dispatchEvent( { type: 'change' } );

	}

	function onPointerlockChange() {

		if ( document.pointerLockElement === scope.domElement ) {

			scope.dispatchEvent( { type: 'lock' } );

			scope.isLocked = true;

		} else {

			scope.dispatchEvent( { type: 'unlock' } );

			scope.isLocked = false;

		}

	}

	function onPointerlockError() {

		console.error( 'THREE.PointerLockControls: Unable to use Pointer Lock API' );

	}

	this.connect = function () {

		document.addEventListener( 'mousemove', onMouseMove, false );
		document.addEventListener( 'pointerlockchange', onPointerlockChange, false );
		document.addEventListener( 'pointerlockerror', onPointerlockError, false );

	};

	this.disconnect = function () {

		document.removeEventListener( 'mousemove', onMouseMove, false );
		document.removeEventListener( 'pointerlockchange', onPointerlockChange, false );
		document.removeEventListener( 'pointerlockerror', onPointerlockError, false );

	};

	this.dispose = function () {

		this.disconnect();

	};

	this.getObject = function () {

		// return yawObject;

	};

	this.getDirection = function () {

		// // assumes the camera itself is not rotated
		//
		// var direction = new THREE.Vector3( 0, 0, - 1 );
		// var rotation = new THREE.Euler( 0, 0, 0, 'YXZ' );
		//
		// return function ( v ) {
		//
		// 	rotation.set( pitchObject.rotation.x, yawObject.rotation.y, 0 );
		//
		// 	v.copy( direction ).applyEuler( rotation );
		//
		// 	return v;
		//
		// };

	}();

	this.lock = function () {

		this.domElement.requestPointerLock();

	};

	this.unlock = function () {

		document.exitPointerLock();

	};

	this.connect();

};

THREE.PointerLockControls.prototype = Object.create( THREE.EventDispatcher.prototype );
THREE.PointerLockControls.prototype.constructor = THREE.PointerLockControls;
