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
        {index: 1, name:"Estadio Mundialista", description: "Inaugurado en 1978, cuenta con una capacidad para 35.500 espectadores", sports:["Fúbol", "Atletismo", "Rugby"], year: 1978, positionX: 150, positionY: 300 },
        {index: 2, name:"Estadio Islas Malvinas", description: "Fue inaugurado en 1995 con motivo de la realización de los XV Juegos Panamericanos", sports:["Tenis", "Voley", "Handbol"], year: 1995, positionX: 250, positionY: 500 },
        {index: 3, name:"Natatorio Zorrilla", description: "Fue inaugurado en 1995 con motivo de la realización de los XV Juegos Panamericanos", sports:["Natación", "Clavadismo", "Waterpolo"], year: 1995, positionX: 300, positionY: 150 }
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

                    // let point = document.getElementsByClassName("label");
                    // let panel = document.getElementsByClassName("annotationDescription");
                    // const current = document.getElementById(aId);

                    // Build-in toggle method
                    // current[aId].className.toggle("active");
                    
                    // Replace method option
                    // current.className = current.className.replace("annotationDescription", "active");

                    // Iterative toggle
                    // let i;
                    // for(i = 0; i < panel.length; i++) {
                    //     panel[i].addEventListener("click", togglePanel, false);
                    // }
                        
                    // Conditional toggle
                    // if (current.style.display === "none") {
                    //     current.style.display = "block";
                    //   } else {
                    //     current.style.display = "none";
                    // }
                    // console.log(current);
                
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
// }

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

            if(mesh.name === "Stadium23") {
                createAnnotation(child);
            }

            if(mesh.name === "Shape15") {
                createAnnotation(child);
            }

            if(mesh.name === "Nata202") {
                createAnnotation(child);
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

// OBJECTS
const box = new THREE.BoxGeometry( 1, 1, 1 );
const geometry = new THREE.SphereGeometry( .7, 20, 20, );
const prisma = new THREE.BoxGeometry( 7, 3, .25);
const cylinder = new THREE.CylinderGeometry( 1, 1, 2, 10 );


// cy.position.set( 2, 2, 1 )
// scene.add(cy)

// HTML | CSS3 labels
// let renderer2 = new CSS3DRenderer();
// renderer2.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer2.domElement);

// let el = document.createElement('div');
// el.innerHTML = "<span class='style'>Hola!</span>";
// let obj = new CSS3DObject(el);
// obj.position.set(0,0,0);
// scene.add(obj);

// function draw() {
//     renderer2.render(scene, camera);
//     requestAnimationFrame(draw)
// }

// Align Scene to HTML
// const wrapper = document.querySelector('#c');
// const renderer3 = new THREE.WebGLRenderer({wrapper});



// CSS2 Labels | https://github.com/mrdoob/three.js/blob/master/examples/css2d_label.html
const EARTH_RADIUS = 1;
const earthGeometry = new THREE.SphereGeometry( EARTH_RADIUS, 16, 16 );
const earthMaterial = new THREE.MeshPhongMaterial( {
    specular: 0x333333,
    shininess: 5,
    map: new THREE.TextureLoader().load("/img/textWater.jpg"),
    normalScale: new THREE.Vector2( 0.85, 0.85 )
} );
const earth = new THREE.Mesh( earthGeometry, earthMaterial );

// scene.add( earth );


function init() {
    const earthMassDiv = document.createElement( 'div' );

    earthMassDiv.innerHTML = '<span>Hola!</span>';

    earthMassDiv.className = 'label';
    earthMassDiv.textContent = 'Annotation created with CSS2D Library';
    earthMassDiv.style.marginTop = '-1em';
    const earthMassLabel = new CSS2DObject( earthMassDiv );
    earthMassLabel.position.set( -1700, 25, 50 );
    earth.add( earthMassLabel );
    earthMassLabel.layers.set( 1 );
    // console.log(earthMassDiv)

}

// Annotation renderer
// let annotationRenderer = new CSS2DRenderer()
// annotationRenderer.setSize( window.innerWidth, window.innerHeight )
// annotationRenderer.domElement.style.position = 'absolute'
// annotationRenderer.domElement.style.top = '0px'
// document.body.appendChild( annotationRenderer.domElement )


// Renderer for 2D labels
let labelRenderer = new CSS2DRenderer();
labelRenderer.setSize( window.innerWidth, window.innerHeight );
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
document.body.appendChild( labelRenderer.domElement );

// MATERIALS
// const textureLoader = new THREE.textureLoader()
const skin = new THREE.TextureLoader().load("/img/textWater.jpg")
const texture = new THREE.TextureLoader().load("/img/matcap-gold.png")

const material = new THREE.MeshStandardMaterial
material.metalness = 0.7
material.roughness = 0.2

const material2 = new THREE.MeshLambertMaterial({color: 0xfff000});
const material3 = new THREE.MeshPhongMaterial({color: 0xff0000})

// Texturing
material.normalMap = texture;
material3.normalMap = skin;
const toon = new THREE.MeshToonMaterial()

material.color = new THREE.Color(0xffffff)
material2.color = new THREE.Color(0xe7e7e7)

// MESH
const sphere = new THREE.Mesh(geometry,material)
// scene.add(sphere)

const cube = new THREE.Mesh(box, material2)
cube.position.x = 1
cube.position.y = 2
cube.position.z = -1
// scene.add(cube)

const panel = new THREE.Mesh(prisma, material2)
panel.position.set( -1, 2, 2 )
// scene.add(panel)

const cy = new THREE.Mesh(cylinder, material3)

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

// window.addEventListener('resize', () =>
// {
//     // Update sizes
//     sizes.width = window.innerWidth
//     sizes.height = window.innerHeight

//     // Update camera
//     camera.aspect = sizes.width / sizes.height
//     camera.updateProjectionMatrix()

//     // Update renderer
//     renderer.setSize(sizes.width, sizes.height)
//     renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
// })

/**
 * CAMERA
 */
// Base camera
const camera = new THREE.PerspectiveCamera(100, sizes.width / sizes.height, 0.1, 2000)
// camera.position.x = 0
// camera.position.y = 0
// camera.position.z = 2
camera.position.set( -1900, 500, 900)

scene.add(camera)

// CONTROLS
const controls = new OrbitControls(camera, labelRenderer.domElement)
controls.enableDamping = true

// HELPERS

// INTERACTIVITY
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

// Change property based on event
// document.body.addEventListener("click", hola)


// function hola() {
//     document.getElementById("demo").innerHTML = "Hola!";
//     console.log('hola!')
// }

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
        
        // Loop object
        // var meshX = -10;

        // Create random objects
        // for(var i = 0; i < 10; i++) {
        //     var mesh2 = new THREE.Mesh(box, material3);
        //     mesh2.position.x = (Math.random() -0.5) * 10;
        //     mesh2.position.y = (Math.random() -0.5) * 10;
        //     mesh2.position.z = (Math.random() -0.5) * 10;
        //     scene.add(mesh2);
        //     meshX += 1;
        // }

        // Change property
        // intersects[i].object.material.color.set(0xff0000)

        // Adding interaction
        // this.tl = new TimelineMax({paused: true});
        // this.tl.to(intersects[i].object.scale, 1, {x: 2, ease: Expo.easeOut})
        
        // document.body.addEventListener('click', () => {
        //     this.tl.play();
        // })
        
        this.tl = new TimelineMax().delay(.3);

        // this.tl.to(intersects[i].object.scale, 1, {x: 2, ease: Expo.easeOut})
        // this.tl.to(intersects[i].object.scale, .5, {x: .5, ease: Expo.easeOut})

        // this.tl.to(intersects[i].object.position, .5, {x: 2, ease: Expo.easeOut})
        // this.tl.to(intersects[i].object.rotation, .5, {y: Math.PI*.5, ease: Expo.easeOut}, "=-1.5")
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
// Static Labels
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

const cubes = [
    // makeInstance(geometry, 0x44aa88,  0, 'Cube'),
    // makeInstance(box, 0x8844aa, -2, 'Sphere'),
    // makeInstance(cylinder, 0xaa8844,  2, 'Cylinder'),
];

// based on a function
var render = function() {
    requestAnimationFrame(render);

    cube.rotation.y += 0.01;
    panel.lookAt( camera.position );

    renderer.render(scene, camera)
}

render();
// draw();
init();

const clock = new THREE.Clock()


const tick = () =>
{

    targetX = mouseX * .001
    targetY = mouseY * .001

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    // sphere.rotation.y = .5 * elapsedTime

    // sphere.rotation.y += .5 * (targetX - sphere.rotation.y)
    // sphere.rotation.z += .5 * (targetY - sphere.rotation.z)
    
    // Update Orbital Controls
    // controls.update()

    

    // Render
    renderer.render(scene, camera);
    labelRenderer.render( scene, camera );
    // annotationRenderer.render( scene, camera );
    // renderer2.render( scene, camera );

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
