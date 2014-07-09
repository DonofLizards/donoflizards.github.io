// Script is run only when document is loaded.
$(document).ready(function() {

var controls;
var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
var instructions = document.getElementById('instructions');

if (havePointerLock)
{
	var element = document.body;
	
	var pointerLockChange = function(evt) {
	
		if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element)
			{
				controls.enabled = true;
				container.style.display = 'none';
				}
		else 
			{	
				controls.enabled = false;

				}

		};
	};
	
	document.addEventListener( 'pointerlockchange', pointerLockChange, false );
	document.addEventListener( 'mozpointerlockchange', pointerLockChange, false );
	document.addEventListener( 'webkitpointerlockchange', pointerLockChange, false );
	
	instructions.addEventListener('click', function(evt) {
		instructions.style.display = 'none';
		element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
		element.requestPointerLock();
		
		});
		
/*// PointerLock requested when element is clicked.
//function getPointerLock() {
	
	
	var instructions = document.getElementById("instructions");
	
	instructions.addEventListener('click', function(evt) {
		instructions.style.display = 'none';
		
		document.addEventListener( 'pointerlockchange', pointerlockchange, false );
		document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
		document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );
		
		//document.addEventListener('keypress', moveCamera, false);

		element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock; 
		
		// Ask browser to lock the pointer.
		element.requestPointerLock();
		
		});
//}

*/


//Leftover code from pointer lock example. Should possibly be removed.   
/*function changeCallback(e) {
// Called when the pointer lock has changed. Check whether pointlocker was initiated.
	if (element.pointerLockElement === element || element.mozPointerLockElement === element || element.webkitPointerLockElement === element) 
	{
		// Add a mouselistener
        element.addEventListener("mousemove", moveCallback, false);
    } else {
		// pointer lock is no longer active, remove the callback
        element.removeEventListener("mousemove", moveCallback, false);
 
        // and reset the entry coordinates
        entryCoordinates = {x:-1, y:-1};
        }
		
}
*/

init();
renderScene();
	
function init () {	
	// Set up the initial scene
	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000);

	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor(0xEEEEEE);
	renderer.setSize(window.innerWidth, window.innerHeight);

	planeGeometry = new THREE.PlaneGeometry(2000,2000);
	planeGeometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );
	planeMaterial = new THREE.MeshBasicMaterial({color:0xcccccc});
	plane = new THREE.Mesh(planeGeometry,planeMaterial);
	scene.add(plane);

	cubeGeometry = new THREE.BoxGeometry(4,4,4);
	cubeMaterial = new THREE.MeshBasicMaterial({color: 0xff0000, wireframe: false});
	cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

	cube.position.z = -20;
	cube.position.y = 50;

	scene.add(cube);
	
	controls = new THREE.PointerLockControls(camera);
	scene.add(controls.getObject());
	
	ray = new THREE.Raycaster();
	ray.ray.direction.set( 0, -1, 0 );

	camera.position.y = 20;
	camera.position.z = 100;

	document.body.appendChild(renderer.domElement);

	}



function moveCamera(evt) {

	var keyCode = parseInt(evt.which);
	
	switch(keyCode) {
		// When 'w' key is pressed, move forward
		case 119:
			camera.position.z -= 1;
		break
		// When 'a' key is pressed, move left
		case 97:
			camera.position.x -= 1;
		break
		// When 's' key is pressed, move back
		case 115:
			camera.position.z += 1;
		// When 'd' key is pressed, move right
		case 100:
			camera.position.x += 1;
		}
	}
		
function renderScene() {
	requestAnimationFrame(renderScene);
	controls.isOnObject(false);
	ray.ray.origin.copy( controls.getObject().position );
	ray.ray.origin.y -= 10;
	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;
	//getPointerLock();
	controls.update();
	renderer.render(scene, camera);
	}
	
});

