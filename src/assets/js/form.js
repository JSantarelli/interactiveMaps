import { submitFacility } from "../../script";


// FORM
const textForm  = document.getElementById('test-form')
let editStatus = false;
let i = '';

// Dropdowns
let sports = ['arco','atletismo','basquet','bochas','ciclismo','esgrima','futbol','handbol','natacion','hockey','patinaje','skate','tenis','tiro','vector','voley','attention','info-circled','floppy','coffee','food','female','male','taxi','trash','bicycle','bus','train','wheelchair-alt'];

const dropdown2 = document.getElementById('dropSports') // .text || .index
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

const typesDropdown = document.getElementById('dropTypes') // .text || .index
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

const dropdown = document.getElementById('dropStatus') // .text || .index
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

// CREATE
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