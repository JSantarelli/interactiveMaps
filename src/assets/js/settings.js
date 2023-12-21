import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, onSnapshot, deleteDoc, updateDoc, doc, getDoc } from "firebase/firestore";
import { firebaseConfig } from '../../environments/conection'; 

// SETUP
export const canvas = document.querySelector('canvas.webgl')
let id = ''

      // Initialize Firebase
      const app = initializeApp(firebaseConfig);
      export const db = getFirestore(app)
    
      export const submitFacility = (name, description, meshName, type, status, sport) => {
        addDoc(collection(db, "facilities"), {name, description, meshName, type, status, sport});
      }
      export const getFacilities = () => getDocs(collection(db, 'facilities'));
      export const getFacility = () => getDoc(doc(db, 'facilities', id));
      export const onGetFacilities = (callback) => onSnapshot(collection(db, 'facilities'), callback);
      export const deleteFacility = (id) => deleteDoc((doc(db, 'facilities', id)));
      export const editFacility = (id) => updateDoc((doc(db, 'facilities', id)));
      export const updateFacility = (id, newFields) => updateDoc(doc(db, 'facilities', id), newFields)

// ------------------------------------------------------------------------------------

// SCENE
export const scene = new THREE.Scene()
scene.background = new THREE.Color(0xffffff)

// Renderer for 2D labels
let labelRenderer = new CSS2DRenderer();
labelRenderer.setSize( window.innerWidth, window.innerHeight );
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
labelRenderer.domElement.style.zIndex = '0';
labelRenderer.domElement.setAttribute('id', 'icons');
document.body.appendChild( labelRenderer.domElement );

// MATERIALS
export const material2 = new THREE.MeshLambertMaterial({color: 0xfff000});
export const white = new THREE.MeshStandardMaterial({color: 0xffffff});
export const disabledColor = new THREE.MeshStandardMaterial({color: 0xffa500});
export const blockColor = new THREE.MeshStandardMaterial({color: 0xff0000});
export const concrete = new THREE.MeshStandardMaterial({color: 0xa3a3a3});
export const grass = new THREE.MeshStandardMaterial({color: 0x454B1B});


// LIGHTS
const pointLight1 = new THREE.PointLight(0xffffff, 2)
pointLight1.position.x = 2
pointLight1.position.y = 3
pointLight1.position.z = 4
pointLight1.intensity = 1

const pointLight2 = new THREE.PointLight(0xffffff, 1)
pointLight2.position.set(1, 1, 1)
pointLight2.intensity = 1

const stadiumLight = new THREE.PointLight(0xffffff, 2)
stadiumLight.position.set( 0, 500, 0)
scene.add(stadiumLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

/**
 * CAMERA
 */
// Base camera
const camera = new THREE.PerspectiveCamera(100, sizes.width / sizes.height, 0.1, 2000)
camera.position.set( -1900, 500, 900)

scene.add(camera)

// CONTROLS
const controls = new OrbitControls(camera, labelRenderer.domElement);
controls.enableDamping = true;
controls.autoRotate = true;
controls.autoRotaterotateSpeed = 1.0;


// HELPERS

// INTERACTIVITY
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

// Stops rotation on click
const btnSidepanel = document.getElementById('btnSidepanel');

function stopRotation() {
    controls.autoRotate = !controls.autoRotate;
}

btnSidepanel.addEventListener('click', stopRotation);

// based on interaction with object
function onMouseMove(event) {
    event.preventDefault();
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = ( event.clientY / window.innerHeight ) * 2 + 1;

    raycaster.setFromCamera(mouse, camera, material2);
}

window.addEventListener('click', onMouseMove);

// Rotate based on mouse position
document.addEventListener('mousemove', onDocumentMouseMove)

let mouseX = 0;
let mouseY = 0;

let targetX = 0;
let targetY = 0;

const windowX = window.innerWidth / 2;
const windowY = window.innerHeight / 2;

function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowX) 
    mouseY = (event.clientY - windowY) 
}

/**
 * RENDERER
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * ANIMATIONS
 */

// based on a function
const tick = () =>
{
    targetX = mouseX * .001
    targetY = mouseY * .001

    // Render
    renderer.render(scene, camera);
    labelRenderer.render( scene, camera );

    // Ejecuta giro y suavizado en los controles
    controls.update();

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()