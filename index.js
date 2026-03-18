import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getDatabase,
    ref,
    push,
    onValue,
    remove } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDBbohkO6Zzvw-3V4d_L6RDkV_-CXZMNOU",
    authDomain: "lead-tracker-app-10ad9.firebaseapp.com",
    databaseURL: "https://lead-tracker-app-10ad9-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "lead-tracker-app-10ad9",
    storageBucket: "lead-tracker-app-10ad9.firebasestorage.app",
    messagingSenderId: "491351355063",
    appId: "1:491351355063:web:2efd89a4e6840469192732"
};


const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

let myLeads = []
const name = document.getElementById("name-el")
const number = document.getElementById("num-el")
const location = document.getElementById("loc-el")
const submitBtn = document.getElementById("input-btn")
const deleteBtn = document.querySelector(".delete-btn")
const tableBody = document.getElementById("table-body")
const referenceInDb = ref(database, "attendees")
const toast = document.getElementById("notification-toast")

function render(leads) {
    let listItems = ""
    for (let i = 0; i < leads.length; i++) {
        // leads[i] is now an object: {fullName: "...", phone: "...", location: "..."}
        const entry = leads[i]
        
        listItems += `
            <tr>
                <td><strong>${entry.fullName || "N/A"}</strong></td>
                <td>${entry.phone || "N/A"}</td>
                <td>${entry.location || "N/A"}</td>
            </tr>
        `
    }
    tableBody.innerHTML = listItems
}

onValue(referenceInDb, function(snapshot) {
    const snapshotDoesExist = snapshot.exists(); 
    if (snapshotDoesExist){const snapshotValues = (snapshot.val())
    const leads = Object.values(snapshotValues)
    render(leads)
}
    
})

deleteBtn.addEventListener("dblclick", function() {
    remove(referenceInDb)
    ulEl.innerHTML =""  
})

function showToast(userName) {
    toast.classList.add("show")

    toast.innerHTML = `Welcome to <span>DestinyLine</span>, ${userName}🎉!`
    
    setTimeout(() => {
        toast.classList.remove("show")
    }, 3000)
}

submitBtn.addEventListener("click", function(event) {
    event.preventDefault()
    
    const nameVal = name.value.trim()
    const numberVal = number.value.trim()
    const locationVal = location.value.trim()

    if (nameVal && numberVal && locationVal) {
        push(referenceInDb, {
            fullName: nameVal,
            phone: numberVal,
            location: locationVal
        })
        
        showToast(nameVal)
        name.value = ""
        number.value = ""
        location.value = ""
    }
})
