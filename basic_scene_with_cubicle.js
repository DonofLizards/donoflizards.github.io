// Script is run only when document is loaded.
$(document).ready(function() {

var stats = initStats();

var controls;
cubicleMeshes = [];
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

	if ( /Firefox/i.test( navigator.userAgent ) ) {

		var fullscreenchange = function ( event ) {

		if ( document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element ) {

			document.removeEventListener( 'fullscreenchange', fullscreenchange );
			document.removeEventListener( 'mozfullscreenchange', fullscreenchange );

			element.requestPointerLock();
			}

		}
		


	document.addEventListener( 'fullscreenchange', fullscreenchange, false );
	document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );

	element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;

	element.requestFullscreen();
	}


	else 
	{
		element.requestPointerLock();
		}
		
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
var loader = new THREE.JSONLoader();
loader.load("cubicle_generic_GIANT.js", addModelToScene);

function addModelToScene( geometry, materials ) 
{
	
	
	for (var x = 0; x < 10; x ++) 
	{
		var material = new THREE.MeshFaceMaterial( materials );
		cubicleMesh = new THREE.Mesh( geometry, material );
		cubicleMesh.scale.set(10,10,10);
		var cubicleGeometry = new THREE.Geometry();
		var texture = new THREE.Mesh(geometry);

		cubicleMesh.position.x = randomSign(Math.random() * 10000);
		//cubicleMesh.position.y = cube.position.y + Math.floor(Math.random() * 100);
		cubicleMesh.position.z = randomSign(Math.random() * 10000);

		scene.add(cubicleMesh);
 		cubicleMeshes.push(cubicleMesh);
		
	}
}

function randomSign(int) {

	if (Math.round(Math.random()) === 1)
	{
		return -int;
	}
	else {
		return int;
	}
}

init();
renderScene();

function initStats() {
               var stats = new Stats();
               stats.setMode(0);
               stats.domElement.style.position = 'absolute';
               stats.domElement.style.left = '0px';
               stats.domElement.style.top = '0px';
               $("#statsOutput").append( stats.domElement );
               return stats;
}
	
function init () {	
	// Set up the initial scene
	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 20000);

	var ambiColor = "#0c0c0c";
   	var ambientLight = new THREE.AmbientLight(ambiColor);
   	scene.add(ambientLight);

   	var hemiLight = new THREE.HemisphereLight(0x0000ff, 0x00ff00, 0.6);
  	hemiLight.position.set(0, 500, 0);
   	scene.add(hemiLight);

   	    var lightControls = new function () {
            	this.rotationSpeed = 0.03;
            	this.bouncingSpeed = 0.03;

            	this.hemisphere = false;
            	this.groundColor = 0x00ff00;
            	this.skyColor = 0x0000ff;
            	this.intensity = 0.6;

        		}

	var gui = new dat.GUI();

        	gui.add(lightControls, 'hemisphere').onChange(function (e) {
            	hemiLight.visible = e;
        });
        	gui.addColor(lightControls, 'groundColor').onChange(function (e) {
            	hemiLight.groundColor = new THREE.Color(e);
        });
       	 gui.addColor(lightControls, 'skyColor').onChange(function (e) {
            	hemiLight.color = new THREE.Color(e);
        });
        	gui.add(lightControls, 'intensity', 0, 5).onChange(function (e) {
           	 hemiLight.intensity = e;
        });


   	

	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor(0xEEEEEE);
	renderer.setSize(window.innerWidth, window.innerHeight);

	planeGeometry = new THREE.PlaneGeometry(20000,20000);
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
	camera.position.z = 400;

	document.body.appendChild(renderer.domElement);
	}



/*function moveCamera(evt) {

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

*/
	
function renderScene() {
	stats.update();
	requestAnimationFrame(renderScene);
	controls.isOnObject(false);
	ray.ray.origin.copy( controls.getObject().position );
	ray.ray.origin.y -= 10;
	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;
	//getPointerLock();
	controls.update();
	renderer.render(scene, camera);
	/*for (var i = 0; i <  monkeyModels.length ; i ++)
	 {
		monkeyModels[i].rotation.x += randomSign(Math.random() / 10);
		monkeyModels[i].rotation.y += randomSign(Math.random() / 10);
		monkeyModels[i].rotation.z += randomSign(Math.random() / 10);
		monkeyModels[i].position.x += randomSign(Math.floor(Math.random() * 10));
		//monkeyModels[i].position.y += randomSign(Math.floor(Math.random() * 10));
		monkeyModels[i].position.z += randomSign(Math.floor(Math.random() * 10));

		var randomNum = randomSign(Math.floor(Math.random() * 10));

		if (monkeyModels[i].position.y + randomNum < 100)
		{
			monkeyModels[i].position.y = 100;
		}
		else 
		{
			monkeyModels[i].position.y += randomNum;
		}

		console.log(monkeyModels[i].position.y);


	}*/

	}
	
});

