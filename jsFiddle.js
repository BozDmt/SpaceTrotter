
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js';
function main() {

	const canvas = document.querySelector( '#c' );
	const renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );

	const fov = 75;
	const aspect = 2; // the canvas default
	const near = 0.1;
	const far = 5;
	const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
	camera.position.z = 2;

	const scene = new THREE.Scene();

	const boxWidth = 1;
	const boxHeight = 1;
	const boxDepth = 1;
	const geometry = new THREE.BoxGeometry( boxWidth, boxHeight, boxDepth );

    const sphereGeo = new THREE.SphereGeometry()

	const cubes = []; // just an array we can use to rotate the cubes
	const loader = new THREE.TextureLoader();

	const texture = loader.load( './photos/ketamine_dreams.jpg' );
	texture.colorSpace = THREE.SRGBColorSpace;

	const material = new THREE.MeshBasicMaterial( {
		map: texture
	} );
    
    const sphere = new THREE.Mesh(sphereGeo, material)
	const cube = new THREE.Mesh( geometry, material );
	cubes.push( cube ); // add to our list of cubes to rotate
	
	scene.add( sphere );

    const controls = new OrbitControls(camera,renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.1

	function resizeRendererToDisplaySize( renderer ) {

		const canvas = renderer.domElement;
		const width = canvas.clientWidth;
		const height = canvas.clientHeight;
		const needResize = canvas.width !== width || canvas.height !== height;
		if ( needResize ) {

			renderer.setSize( width, height, false );

		}

		return needResize;

	}

	function render( time ) {

		time *= 0.001;

		if ( resizeRendererToDisplaySize( renderer ) ) {

			const canvas = renderer.domElement;
			camera.aspect = canvas.clientWidth / canvas.clientHeight;
			camera.updateProjectionMatrix();
			console.log('resizing')
			
		}

		cubes.forEach( ( cube, ndx ) => {

			const speed = .2 + ndx * .1;
			const rot = time * speed;
			sphere.rotation.x = rot;
			sphere.rotation.y = rot;

		} );

		renderer.render( scene, camera );

		requestAnimationFrame( render );

	}

	requestAnimationFrame( render );
	//asign properties of a source(2) to a target(1)
	// Object.assign(document.createElement('style'),{type:'text/css',textContent:`@media (prefers-color-scheme: dark) {*{color-scheme: light !important;}}`})

}

main();
