import './style.css'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { GUI } from 'dat.gui'
import { Mesh } from 'three'
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js'
import {
    CSS3DRenderer,
    CSS3DObject
  } from 'three/examples/jsm/renderers/CSS3DRenderer.js'


// SETUP
const canvas = document.querySelector('canvas.webgl')
const loader = new GLTFLoader();

const myObj = {
    name: "Parque Municipal de los Deportes",
    year: 1978,
    buildings: function() {
      return stadium.name;
    },
    facilities: [
        { name:"Estadio Mundialista", description: "Inaugurado en 1978, cuenta con una capacidad para 35.500 espectadores", sports:["Fúbol", "Atletismo", "Rugby"], year: 1978, anchor: "Stadium23" },
        { name:"Estadio Islas Malvinas", description: "Fue inaugurado en 1995 con motivo de la realización de los XV Juegos Panamericanos", sports:["Tenis", "Voley", "Handbol"], year: 1995, anchor: "Shape15" },
        { name:"Natatorio Zorrilla", description: "Fue inaugurado en 1995 con motivo de la realización de los XV Juegos Panamericanos", sports:["Natación", "Clavadismo", "Waterpolo"], year: 1995, anchor: "Nata202" },
        { name:"Acceso Natatorio", description: "Capacidad para 20.000 espectadores", sports:["Natación", "Clavadismo", "Waterpolo"], year: 1995, anchor: "Nata203" }
    ]
  }

let annotationCounter = 0

// Create empty object and array
let annotations = {}
const annotationMarkers = []

const circleTexture = new THREE.TextureLoader().load('img/textWater.jpg')

let annotationDisplay = true;


function createAnnotation(child) {

                // Annotation content
                const aId = (annotationCounter++).toString()
                annotations[aId] = {
                    title: myObj.facilities[aId].name,
                    description: myObj.facilities[aId].description,
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
                annotationTextDiv.className = 'annotationDescription'
                annotationTextDiv.setAttribute("id", aId)
                
                // Creating HTML
                const annotationDiv = document.createElement('div');
                annotationDiv.className = 'label';
                annotationDiv.textContent = myObj.facilities[aId].name;
                // annotationDiv.innerHTML = aId;
                const annotationLabel = new CSS2DObject(annotationDiv);
                // annotationLabel.position.set(150, 5, 0);
                child.add(annotationLabel);

                // Adding interaction
                annotationDiv.addEventListener('click', showDescription)

                function showDescription() {

                    var acc = document.getElementsByClassName("label");
                    var i;
                    
                    for (i = 0; i < acc.length; i++) {
                    acc[i].addEventListener("click", function() {
                    
                    var panel = this.nextElementSibling;
                    if (panel.style.maxHeight){
                    //   panel.style.maxHeight = null;
                    } else {
                      let active = document.querySelectorAll(".label.active");
                      for(let j = 0; j < active.length; j++){
                        active[j].classList.remove("active");
                        // active[j].nextElementSibling.style.maxHeight = null;
                      }
                      this.classList.toggle("active");
                    //   panel.style.maxHeight = panel.scrollHeight + "px";
                    }
                    });
                    }

                    // const current = document.getElementById(aId);
                        
                    // Conditional toggle
                    // if (current.style.display === "none") {
                    //     current.style.display = "block";
                    //   } else {
                    //     current.style.display = "none";
                    // }                
                }
          
                if (annotationDisplay) {
                    // annotationDisplay = true;

                    annotationTextDiv.innerHTML +=
                        '<p>' + myObj.facilities[aId].description + '</p>'
                } 
 
                // console.log(annotations[aId]);
                annotationDiv.appendChild(annotationTextDiv)
                annotations[aId].descriptionDomElement =
                    annotationTextDiv
                }

// SCENE
const scene = new THREE.Scene()
scene.background = new THREE.Color(0xffffff)

// 3D MODEL
loader.load( "/models/park.gltf", function ( gltf ) {
        // gltf.scene.scale.set(0.5, 0.5, 0.5); 

    // Getting an individual mesh from 3D Object
        gltf.scene.traverse(function (child) {
            // Code to attach annotations to specific model parts...
            const mesh = (child).clone();

            // Iteration through objects
            let i;

            for (i = 0; i < myObj.facilities.length; i++) {

                if(mesh.name === myObj.facilities[i].anchor) {
                    createAnnotation(child);
                }
            }
        }
    )
        console.log(gltf)
        // const root = gltf.scene;
        // scene.add(root)
    
        scene.add( gltf.scene );
    
    // LOADING
}, function(loading) {
    console.log((loading.loaded/loading.total * 100) + "% loaded")
},
    function(error) {
    console.error( error );

} );

// HTML
// TO-DO: try bring elements using IDs, append, textContent, createNode, createElement  

// for (let i in myObj.facilities) {
    //     const para = document.createElement("p");
    //     const node = document.createTextNode(myObj.facilities[i].name);
    //     node.domElement.style.color = 'blue';
    //     para.className = 'holder';
    //     para.appendChild(node);
    //     const element = document.getElementById("holder");
    //     element.appendChild(para);
// }

let i;

function binding() {
    // Add code block that updates the map!
}

// Adding facilities
function addClient() {
    
    var newFacility = {
      name:document.getElementById("facility-name").value,
      year:document.getElementById("facility-year").value,
      description:document.getElementById("facility-desc").value,
      sports:document.getElementById("facility-sports").value,
      anchor:document.getElementById("facility-anchor").value,
    }
    
    myObj.facilities.push(newFacility)
    displayClients()
    binding()
  }

const btn = document.getElementById("btn-save");
btn.addEventListener('click', addClient)


// Displaying current facilities
function displayClients() {    
    document.getElementById("list").innerHTML = " "

    for (i = 0; i < myObj.facilities.length; i++) {
        
      var myTr = document.createElement("tr")
      console.log(myTr)

      for(let a in myObj.facilities[i]) {
        var myTd = document.createElement("td")
        // myTd.className = "floating"
        myTd.innerHTML = myObj.facilities[i][a]
        myTr.appendChild(myTd)
        console.log(myTd)
      }
      
        var myTd = document.createElement("td")
        myTd.innerHTML = myObj.facilities[i].name
        myTr.appendChild(myTd)

        var actionTd = document.createElement("td")
        var editBtn = document.createElement("button")
        editBtn.textContent = "Edit"
        editBtn.setAttribute("class" , "btn btn-sm btn-primary")
        editBtn.setAttribute("onclick" , "editClient(" + i + ")")

        var deletebtn = document.createElement("button")
        deletebtn.innerHTML="Delete"
        deletebtn.setAttribute("class" , "btn btn-sm btn-danger")
        deletebtn.setAttribute("onclick" , "deleteClient(" + i + ")")

        actionTd.appendChild(editBtn)
        actionTd.appendChild(deletebtn)
        myTr.appendChild(actionTd)
        document.getElementById("list").appendChild(myTr)
      }
    
      document.getElementById("facility-name").value = " ";
      document.getElementById("facility-year").value = " ";
      document.getElementById("facility-desc").value = " ";
      document.getElementById("facility-sports").value = " ";
      document.getElementById("facility-anchor").value = " "
      
    }

  displayClients()


// CreateNode method
function createNode(element) {
    return document.createElement(element);
}

function append(parent, el) {
  return parent.appendChild(el);
}

const ul = document.getElementById('holder');

// for (let i in myObj.facilities) {
    // Creating a table
//     let li = createNode('li');
//     let img = createNode('img');
//     let span = createNode('span');
//     li.innerHTML = myObj.facilities[i].name;
//     li.className = 'holder';
//     append(li, img);
//     append(li, span);
//     append(ul, li);
// }

// Renderer for 2D labels
let labelRenderer = new CSS2DRenderer();
labelRenderer.setSize( window.innerWidth, window.innerHeight );
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
document.body.appendChild( labelRenderer.domElement );


// OBJECTS
const geometry = new THREE.SphereGeometry( .7, 20, 20, );

const labelContainerElem = document.querySelector('#labels');

function makeInstance(geometry, color, x, name) {
    const material = new THREE.MeshPhongMaterial({color});

    const form = new THREE.Mesh(geometry, material);
    scene.add(form);

    form.position.x = x;

    const elem = document.createElement('h2');
    elem.textContent = name;
    labelContainerElem.appendChild(elem);


    return {form, elem};
}

// Prototypes
const cubes = [
    makeInstance(geometry, 0x44aa88,  0, 'Cube'),
];


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
