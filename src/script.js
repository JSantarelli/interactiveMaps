import './style.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import { GUI } from 'dat.gui';
import { Mesh } from 'three';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import {
    CSS3DRenderer,
    CSS3DObject
  } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, onSnapshot, deleteDoc, updateDoc, doc, getDoc } from "firebase/firestore";


// SETUP
const canvas = document.querySelector('canvas.webgl')
const loader = new GLTFLoader();

    // Your web app's Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyDEslhlteP9FzDmI9ax3p-rwwAMALW6XHA",
        authDomain: "intermaptive.firebaseapp.com",
        projectId: "intermaptive",
        storageBucket: "intermaptive.appspot.com",
        messagingSenderId: "260919370396",
        appId: "1:260919370396:web:583746f34afe4ae4f34359"
      };
    
      // Initialize Firebase
      const app = initializeApp(firebaseConfig);
      const db = getFirestore(app)
    
      export const submitFacility = (name, description, meshName) => {
        addDoc(collection(db, "facilities"), {name, description, meshName});
      }
      
      export const getFacilities = () => getDocs(collection(db, 'facilities'));
  
      export const getFacility = () => getDoc(doc(db, 'facilities', id));
  
      export const onGetFacilities = (callback) => onSnapshot(collection(db, 'facilities'), callback);
  
      export const deleteFacility = (id) => deleteDoc((doc(db, 'facilities', id)));
      export const editFacility = (id) => updateDoc((doc(db, 'facilities', id)));
  
      export const updateFacility = (id, newFields) => updateDoc(doc(db, 'facilities', id), newFields)
  
  // ------------------------------------------------------------------------------------
  // INDEX.JS
  // import { submitFacility, onSnapshot, deleteDoc } from './environments/environment.js'
  
  const textForm  = document.getElementById('test-form')
  const faciList = document.getElementById('test-list')
  let editStatus = false;
  let id = ''
  
  window.addEventListener('DOMContentLoaded', async () => {
      
      // const facilities = await getFacilities()
        
      onSnapshot(collection(db, 'facilities'), (facilities) => {
          let html = ''
  
          facilities.forEach(doc => {
              const facility = doc.data();
  
              html += `
                <div class="item">
                  <div class="item__container" left>
                      <i class="item__icon item__icon--24 icon icon--magenta fa-solid fa-tennis-ball"></i>
                      <span class="icon-container icon-container--vertical">
                          <h4 class="item__title">
                            ${facility.name}
                          </h4>
                          <small class="item__subtitle">
                            ${facility.description}
                          </small>
                      </span>
                  </div>
                  <div class="item__botonera">
                      <span class="badge badge--outline">${facility.meshName}</span>
                      <button class="btn-delete btn btn--rounded btn--colorSecundario" data-id="${doc.id}">Delete</button>
                      <button class="btn-edit btn btn--rounded btn--colorPrimario" data-id="${doc.id}">Edit</button>                  </div>
                </div>
              `;
          });
      
          faciList.innerHTML = html
          const btnsDelete = faciList.querySelectorAll('.btn-delete')
          const btnsEdit = faciList.querySelectorAll('.btn-edit')
  
          btnsDelete.forEach(btn => {
              btn.addEventListener('click', ({ target: { dataset }}) => {
                  deleteFacility(dataset.id)
                  console.log(dataset.id)
                  
                  // REVIEW CAUSE IT'S DUPLICATING DOM ELEMENTS
                  facilities.forEach(doc => {
                      const removedItem = document.getElementById(doc.id);
                      if(dataset.id === doc.id) {
                          console.log('removed!')
                        //   console.log(removedItem)
                        //   removedItem.remove();
                        //   removedItem.style.display = "none";
                          removedItem.classList.add('removed')
                    }
                  })
                })
          })

          btnsEdit.forEach(btn => {
              btn.addEventListener('click', async (event) => {
                  const doc = await getFacility(event.target.dataset.id)
                  const facility = doc.data()
  
                  textForm['test-name'].value = facility.name
                  textForm['test-desc'].value = facility.description
                  textForm['test-anchor'].value = facility.meshName
                  
                  editStatus = true;
                  id = doc.id;
  
                  textForm['btn-form'].innerText = 'update'
              })
          })

        //   ANNOTATIONS
        let annotationCounter = 0

        // Create empty object and array
        let annotations = {}
        const annotationMarkers = []

        const circleTexture = new THREE.TextureLoader().load('img/textWater.jpg')

        let annotationDisplay = true;
          
        // 3D MODEL            
        loader.load( "/models/park.gltf", function ( gltf ) {
            // gltf.scene.scale.set(0.5, 0.5, 0.5); 

        // Getting an individual mesh from 3D Object
            gltf.scene.traverse(function (child) {
                // Code to attach annotations to specific model parts...
                const mesh = (child).clone();
                
                // Iteration through objects
                facilities.forEach(doc => {
                    const facility = doc.data();

                    if(mesh.name === facility.meshName) {

                        console.log(mesh.name)
                        console.log(facility.meshName)
                        console.log(doc.id)
                                
                    function createAnnotation(child) {

                        // Annotation content
                        const aId = (annotationCounter++).toString()
                        annotations[aId] = {
                            title: facility.name,
                            description: facility.description,
                        }
                        
                        // Defining sprite properties
                        const annotationSpriteMaterial = new THREE.SpriteMaterial({
                            map: circleTexture,
                            depthTest: false,
                            depthWrite: false,
                            sizeAttenuation: false,
                        })
                        const annotationSprite = new THREE.Sprite(
                            annotationSpriteMaterial
                        )    
                        child.getWorldPosition(annotationSprite.position)
                        annotationSprite.aId = aId
                        child.add(annotationSprite)
                        annotationSprite.layers.set(1)
                        annotationMarkers.push(annotationSprite)
                        // console.log(annotationSprite)

                        // if (myObj.facilities[aId].name) {
                        const annotationTextDiv = document.createElement('div')
                        annotationTextDiv.className = 'panel__description'
                        
                        // Creating HTML
                        const annotationDiv = document.createElement('div');
                        annotationDiv.className = 'panel panel--white';
                        annotationDiv.textContent = facility.name;
                        annotationDiv.setAttribute("id", doc.id)
                        // annotationDiv.innerHTML = aId;
                        const annotationLabel = new CSS2DObject(annotationDiv);
                        // annotationLabel.position.set(150, 5, 0);
                        child.add(annotationLabel);

                        // Adding interaction
                        annotationDiv.addEventListener('click', showDescription)

                        function showDescription() {

                            var acc = document.getElementsByClassName("panel");
                            var i;
                            
                            for (i = 0; i < acc.length; i++) {
                            acc[i].addEventListener("click", function() {
                            
                            var panel = this.nextElementSibling;
                            if (panel.style.maxHeight){
                            //   panel.style.maxHeight = null;
                            } else {
                            let active = document.querySelectorAll(".panel.active");
                            for(let j = 0; j < active.length; j++){
                                active[j].classList.remove("active");
                                // active[j].nextElementSibling.style.maxHeight = null;
                            }
                            this.classList.toggle("active");
                            //   panel.style.maxHeight = panel.scrollHeight + "px";
                            }
                            });
                            }              
                        }

                        if (annotationDisplay) {
                            // annotationDisplay = true;

                            annotationTextDiv.innerHTML +=
                                '<p class="panel__texto--gris">' + facility.description + '</p>'
                        } 

                        // console.log(annotations[aId]);
                        annotationDiv.appendChild(annotationTextDiv)
                        annotations.descriptionDomElement =
                            annotationTextDiv
                        }

                    createAnnotation(child);

                    }
                });
            }
        )

            scene.add( gltf.scene );

        // LOADING
        }, function(loading) {
        console.log((loading.loaded/loading.total * 100) + "% loaded")
        },
        function(error) {
        console.error( error );

        });

      });
  
      });

//----------------------------------------------------------------

  function saveForm() {
  
      const fName = textForm['test-name'];
      const fDescription = textForm['test-desc'];
      const fAnchor = textForm['test-anchor'];
  
      if (!editStatus) {
          submitFacility(fName.value, fDescription.value, fAnchor.value);
      } else {
          updateFacility(id, (
              (fName.value, fDescription.value, fAnchor.value)));
          editStatus = false;
      }
  
      textForm.reset()
  }
  
  const btnForm = document.getElementById('btn-form');
  btnForm.addEventListener( 'click', saveForm )

  // ------------------------------------------------------------------------------------

// SCENE
const scene = new THREE.Scene()
scene.background = new THREE.Color(0xffffff)

// HTML

// Renderer for 2D labels
let labelRenderer = new CSS2DRenderer();
labelRenderer.setSize( window.innerWidth, window.innerHeight );
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
document.body.appendChild( labelRenderer.domElement );


// OBJECTS
// const geometry = new THREE.SphereGeometry( .7, 20, 20, );

// const labelContainerElem = document.querySelector('#labels');

// function makeInstance(geometry, color, x, name) {
//     const material = new THREE.MeshPhongMaterial({color});

//     const form = new THREE.Mesh(geometry, material);
//     scene.add(form);

//     form.position.x = x;

//     const elem = document.createElement('h2');
//     elem.textContent = name;
//     labelContainerElem.appendChild(elem);

//     return {form, elem};
// }

// Prototypes
// const cubes = [
//     makeInstance(geometry, 0x44aa88,  0, 'Cube'),
// ];

// MATERIALS
const material2 = new THREE.MeshLambertMaterial({color: 0xfff000});

// Texturing

// MESH

// LIGHTS
const pointLight1 = new THREE.PointLight(0xffffff, 2)
pointLight1.position.x = 2
pointLight1.position.y = 3
pointLight1.position.z = 4
pointLight1.intensity = 1
// scene.add(pointLight1)

const pointLight2 = new THREE.PointLight(0xffffff, 1)
pointLight2.position.set(1, 1, 1)
pointLight2.intensity = 1
// scene.add(pointLight2)

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
const controls = new OrbitControls(camera, labelRenderer.domElement)
controls.enableDamping = true

// HELPERS

// INTERACTIVITY
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

// based on interaction with object
function onMouseMove(event) {
    event.preventDefault();
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = ( event.clientY / window.innerHeight ) * 2 + 1;

    var intersects = raycaster.intersectObjects(scene.children, true);

    raycaster.setFromCamera(mouse, camera, material2);

    // Initial loop
    for (var i = 0; i < intersects.length; i++) {
        
        console.log('touched!')

        var color = (Math.random() * 0xffffff);

        intersects[0].object.material.color.setHex(color);

        this.temp = intersects[0].object.material.color.getHexString()

        document.getElementById("demo").innerHTML = "Object color is " + this.temp
        
        this.tl = new TimelineMax().delay(.3);
    }
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
var render = function() {
    requestAnimationFrame(render);
    
    renderer.render(scene, camera)
}

render();

const clock = new THREE.Clock()

const tick = () =>
{

    targetX = mouseX * .001
    targetY = mouseY * .001

    const elapsedTime = clock.getElapsedTime()

    // Render
    renderer.render(scene, camera);
    labelRenderer.render( scene, camera );
    // annotationRenderer.render( scene, camera );
    // renderer2.render( scene, camera );

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
