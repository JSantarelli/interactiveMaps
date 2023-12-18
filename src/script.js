import './style.css';
import './assets/scss/sports.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
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
  // INDEX.JS
  
  const textForm  = document.getElementById('test-form')
  const faciList = document.getElementById('test-list')
  let editStatus = false;
  let id = ''
  
  window.addEventListener('DOMContentLoaded', async () => {
              
      onSnapshot(collection(db, 'facilities'), (facilities) => {
          let html = ''
  
          facilities.forEach(doc => {
              const facility = doc.data();
  
              html += `
                <div class="item">
                  <div class="item__container" left>
                    <div class="icon-container">
                        <span class="item__icon icon icon--${facility.status} icon-${facility.sport}"></span>
                        <span class="notification__${facility.status}--${facility.status === 'deshabilitado' || facility.status === 'clausurado'} icon-${facility.status}"></span>                      
                    </div>
                    <span>
                        <h4 class="item__title">
                        ${facility.name}
                        </h4>
                        <small class="item__subtitle">
                        ${facility.description}
                        </small>
                    </span>
                  </div>
                  <div class="item__botonera">
                        <span class="badge badge--outline badge--${facility.status}">${facility.status}</span>
                        <button class="btn-edit btn btn--rounded btn--colorSecundario icon-floppy" data-id="${doc.id}"></button>
                        <button class="btn-delete btn btn--rounded btn--colorTerciario icon-trash" data-id="${doc.id}"></button>
                    </div>
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
                  
                  facilities.forEach(doc => {
                      const removedItem = document.getElementById(doc.id);
                      if(dataset.id === doc.id) {   
                          removedItem.classList.add('removed')
                    }
                  })
                })
          })

          btnsEdit.forEach(btn => {
              btn.addEventListener('click', async event => {
                // Pending
              })
          })

        //   ANNOTATIONS
        let annotationCounter = 0

        // Create empty object and array
        let annotations = {}
        const annotationMarkers = []
        let annotationDisplay = true;
          
        // 3D MODEL            
        loader.load( "/models/park.gltf", function ( gltf ) {
            const model = gltf.scene

            const elapsedTime = clock.getElapsedTime()
            if (model) model.rotation.y = .5 * elapsedTime;

            // gltf.scene.scale.set(0.5, 0.5, 0.5); 

        // Getting an individual mesh from 3D Object
            gltf.scene.traverse(function (child) {
                // Code to attach annotations to specific model parts...
                const mesh = (child).clone();
                facilities.forEach(doc => {
                    const facility = doc.data();

                    // 1. Identifica las instalaciones según estado
                    if (mesh.name === facility.meshName) {

                        // Mesh opacity
                        model.getObjectByName(mesh.name).material.transparent = true;
                        model.getObjectByName(mesh.name).material.opacity = 0.5;

                        // 'Remove' unwanted shape
                        model.getObjectByName('Shape2').visible = false;

                        // Colors
                        model.getObjectByName('Shape3').material = grass;
                        model.getObjectByName('Shape4').material = grass;
                        model.getObjectByName('Shape5').material = grass;
                        model.getObjectByName('Shape6').material = grass;
                        model.getObjectByName('Shape7').material = grass;
                        model.getObjectByName('Shape12').material = grass;
                        model.getObjectByName('Shape16').material = grass;
                        model.getObjectByName('Stadium16').material = grass;
                        model.getObjectByName('Shape25').material = grass;
                        model.getObjectByName('Sup13').material = grass;
                        model.getObjectByName('Sup16').material = grass;
                        model.getObjectByName('Sup17').material = grass;
                        model.getObjectByName('Sup18').material = grass;
                        model.getObjectByName('Sup21').material = grass;
                        model.getObjectByName('Sup23').material = grass;
                        model.getObjectByName('Sup24').material = grass;
                        model.getObjectByName('Sup25').material = grass;
                        model.getObjectByName('Sup29').material = grass;
                        model.getObjectByName('Sup31').material = grass;
                        model.getObjectByName('Sup32').material = grass;
                        model.getObjectByName('Sup52').material = grass;
                        model.getObjectByName('Sup100').material = grass;
                        model.getObjectByName('Box55').material = grass;
                        model.getObjectByName('Box56').material = grass;
                        model.getObjectByName('Vel100').material = grass;
                        model.getObjectByName('Vel101').material = grass;
                        model.getObjectByName('Vel102').material = grass;
                        model.getObjectByName('Vel103').material = grass;
                    }

                        if (mesh.name === facility.meshName) {

                            if (facility.status === 'clausurado') {
                            
                                // 2. Asignar atributos
                                model.getObjectByName(facility.meshName).material = blockColor;
                                model.getObjectByName(facility.meshName).material.transparent = true;
                                model.getObjectByName(facility.meshName).material.opacity = 0.5;

                            }
                        }

                    if(mesh.name === facility.meshName) {

                    function createAnnotation(child) {

                        // Annotation content
                        const aId = (annotationCounter++).toString()
                        annotations[aId] = {
                            title: facility.name,
                            description: facility.description,
                        }
                        
                        // if (myObj.facilities[aId].name) {
                        const annotationTextDiv = document.createElement('div')
                        annotationTextDiv.className = 'panel__description'
                        
                        // Creating HTML
                        const annotationDiv = document.createElement('div');
                        annotationDiv.className = 'panel flex flex--between';
                        annotationDiv.innerHTML = `<span class="annotation item__icon icon icon--${facility.status} icon-${facility.sport}"></span>
                                                    <span class="annotation notification__${facility.status}--${facility.status === 'deshabilitado' || facility.status === 'clausurado'} icon-${facility.status}"></span>
                                                    `;
                        annotationDiv.setAttribute("id", doc.id)
                        // annotationDiv.innerHTML = aId;
                        const annotationLabel = new CSS2DObject(annotationDiv);
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
                            }
                            this.classList.toggle("active");
                            }
                            });
                            }              
                        }

                        if (annotationDisplay) {
                            annotationTextDiv.innerHTML +=
                                `<span class="badge badge--outline badge--${facility.status}">${facility.status}</span>
                                <p class="panel__texto--blanco">${facility.name}</p>
                                <small class="panel__texto--blanco">${facility.description}</small>`
                        } 

                        annotationDiv.appendChild(annotationTextDiv)
                        annotations.descriptionDomElement =
                            annotationTextDiv
                        }

                    createAnnotation(child);

                    }
                });
            }
        )

        // Evita rotaciones o cambio de posicion del modelo al actualizar
        model.matrixAutoUpdate = false;


        // Oculta modelo 3D
        function removeModel() {

            // Remueve modelo
            model.getObjectByName('Scene').visible = false;
            const entireMesh = model.getObjectByName('Scene');
            entireMesh.remove();

            // Remueve iconos
            let i;
            let removeIcons = document.getElementsByClassName('annotation');

            for (i = 0; i < removeIcons.length; i++) {
                removeIcons[i].style.display = 'none';
            }
        }

        const btnSubmit = document.getElementById('btn-form');
        btnSubmit.addEventListener('click', removeModel)

        btnsDelete.forEach(btn => {
            btn.addEventListener('click', async event => {
                removeModel()
            })
        })

        scene.add(model);

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
// FORM

// Dropdowns
let sports = ['arco','atletismo','basquet','bochas','ciclismo','esgrima','futbol','handbol','natacion','hockey','patinaje','skate','tenis','tiro','vector','voley','attention','info-circled','floppy','coffee','food','female','male','taxi','trash','bicycle','bus','train','wheelchair-alt'];

let dropdown2 = document.getElementById('dropSports') // .text || .index
dropdown2.addEventListener('click', selectSport)

function selectSport(i) {
    let sportsValue = dropdown2.options[dropdown2.selectedIndex]
    console.log(sportsValue.value)
    }

        
function listSports() {     
        for (let i in sports) {
            // Crear un elemento HTML <option> y asignarle los valores del array
            dropdown2.innerHTML += `<option>${sports[i]}</option>`
        }
    }
    
listSports();

let types = ['actividad deportiva', 'servicio complementario'];

let typesDropdown = document.getElementById('dropTypes') // .text || .index
typesDropdown.addEventListener('click', selectType)

function selectType(i) {
    let typesValue = typesDropdown.options[typesDropdown.selectedIndex]
    }
    
function listTypes() {     
        for (let i in types) {
            // Crear un elemento HTML <option> y asignarle los valores del array
            typesDropdown.innerHTML += `<option>${types[i]}</option>`
        }
    }
    
listTypes();

let status = ['habilitado', 'deshabilitado', 'clausurado'];

let dropdown = document.getElementById('dropStatus') // .text || .index
dropdown.addEventListener('click', selectStatus)

function selectStatus(i) {
    let statusValue = dropdown.options[dropdown.selectedIndex]
    }
    
function listStatus() {     
        for (let i in status) {
            // Crear un elemento HTML <option> y asignarle los valores del array
            dropdown.innerHTML += `<option>${status[i]}</option>`
        }
    }
    
listStatus();

function saveForm() {
      const fName = textForm['test-name'];
      const fDescription = textForm['test-desc'];
      const fAnchor = textForm['test-anchor'];
      const fType = textForm['dropTypes'];
      const fStatus = textForm['dropStatus'];
      const fSport = textForm['dropSports'];
  
      if (!editStatus) {
          submitFacility(fName.value, fDescription.value, fAnchor.value, fType.value, fStatus.value, fSport.value);
      } else {
          updateFacility(id, (
              (fName.value, fDescription.value, fAnchor.value, fType.value, fStatus.value, fSport.value)));
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
labelRenderer.domElement.style.zIndex = '0';
labelRenderer.domElement.setAttribute('id', 'icons');
document.body.appendChild( labelRenderer.domElement );

// MATERIALS
const material2 = new THREE.MeshLambertMaterial({color: 0xfff000});
const white = new THREE.MeshStandardMaterial({color: 0xffffff});
const disabledColor = new THREE.MeshStandardMaterial({color: 0xffa500});
const blockColor = new THREE.MeshStandardMaterial({color: 0xff0000});
const concrete = new THREE.MeshStandardMaterial({color: 0xa3a3a3});
const grass = new THREE.MeshStandardMaterial({color: 0x454B1B});


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
const controls = new OrbitControls(camera, labelRenderer.domElement)
controls.enableDamping = true
// controls.autoRotate = true

// HELPERS

// INTERACTIVITY
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

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

    // Render
    renderer.render(scene, camera);
    labelRenderer.render( scene, camera );

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

// EDIT
function editar(id, fName, fDescription, fType, fStatus, fSport) {
    console.log('hola!')
    document.getElementById('test-name').value = fName;
    document.getElementById('test-des').value = fDescription;
    document.getElementById('dropTypes').value = fType;
    document.getElementById('dropStatus').value = fStatus;
    document.getElementById('dropSports').value = fSport;

    var boton = document.getElementById('btn-form');

    boton.innerHTML = 'Save updates';
    boton.onclick = function saveForm() {

    var parkFacilities = db.collection("facilities").doc(id);

    var fName = document.getElementById('test-name').value;
    var fDescription = document.getElementById('test-des').value;
    var fType = document.getElementById('dropTypes').value;
    var fStatus = document.getElementById('dropStatus').value;
    var fSport = document.getElementById('dropSports').value;

    return parkFacilities.update ({
        name: fName,
        description: fDescription,
        type: fType,
        status: fStatus,
        sport: fSport
    })

    .then(function() {
        console.log("Document successfully updated!");
    })

    .catch(function(error) {
        console.log("Document error!");
    })
    }
    }