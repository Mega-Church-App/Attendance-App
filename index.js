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

const formEl = document.querySelector("form")
const deleteBtn = document.querySelector(".delete-btn")

const tableBody = document.getElementById("table-body")
const referenceInDb = ref(database, "attendees")

const toast = document.getElementById("notification-toast")
const countEl = document.getElementById("count-el")

function render(leads) {
    let listItems = ""
    for (let i = 0; i < leads.length; i++) {
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
    if (snapshot.exists()) {
        const snapshotValues = snapshot.val()
        const entries = Object.values(snapshotValues)
        myLeads = entries

        countEl.textContent = entries.length
        deleteBtn.disabled = true
        
        render(entries)
    } else {
        myLeads = []
        countEl.textContent = "0"
        tableBody.innerHTML = ""
        deleteBtn.disabled = true
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

formEl.addEventListener("submit", function(event) {
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
