// ENVIRONMENT.JS --> MODULARIZAR Y ENVIAR A environment.js!
// Firebase connection
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.2/firebase-app.js"
import { getFirestore, collection, addDoc, getDocs, onSnapshot, deleteDoc, updateDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.2/firebase-firestore.js"
  
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
  
    export const submitFacility = (name, description) => {
      addDoc(collection(db, "facilities"), {name, description});
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

const textForm  = document.getElementById('test-form');
const faciList = document.getElementById('test-list');
let editStatus = false;
let id = ''

window.addEventListener('DOMContentLoaded', async () => {
    
    // const facilities = await getFacilities()
    
    onSnapshot(collection(db, 'facilities'), (facilities) => {
        let html = ''

        facilities.forEach(doc => {
            const facility = doc.data();
            console.log(doc.id)

            html += `
                <li>
                    <h2>${facility.name}</h2>
                    <p>${facility.description}</p>
                    <p>${facility.status}</p>
                    <p>${facility.sport}</p>
                    <button class="btn-edit" data-id="${doc.id}" onclick="edit('${doc.id}','${doc.fName}', '${doc.fDescription}','${doc.fStatus}','${doc.fSport}')">Edit</button>
                    <button class="btn-delete" data-id="${doc.id}">Delete</button>
                </li> 
            `;
        });
    
        faciList.innerHTML = html
        const btnsDelete = faciList.querySelectorAll('.btn-delete')
        const btnsEdit = faciList.querySelectorAll('.btn-edit')

        btnsDelete.forEach(btn => {
            btn.addEventListener('click', ({ target: { dataset }}) => {
                deleteFacility(dataset.id)
            })
        })

        btnsEdit.forEach(btn => {
            btn.addEventListener('click', async (event) => {
                const doc = await getFacility(event.target.dataset.id)
                const facility = doc.data()

                textForm['test-name'].value = facility.name;
                textForm['test-desc'].value = facility.description;
                textForm['dropStatus'].value = facility.status;
                textForm['test-sport'].value = facility.sport;
                
                editStatus = true;
                id = doc.id;

                textForm['btn-form'].innerText = 'update';
                console.log(editStatus)
            })
        })
    });

    });

function saveForm() {

    const fName = textForm['test-name'];
    const fDescription = textForm['test-desc'];
    const fStatus = textForm['dropStatus'];
    const fSport = textForm['dropSports'];

    if (!editStatus) {
        submitFacility(fName.value, fDescription.value, fStatus.value, fSport.value);
    } else {
        updateFacility(id, (
            (fName.value, fDescription.value, fStatus.value, fSport.value)));
        editStatus = false;
    }

    textForm.reset()
}



const btnForm = document.getElementById('btn-form');
btnForm.addEventListener( 'click', saveForm )
