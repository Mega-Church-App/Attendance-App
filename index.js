import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getDatabase,
    ref,
    push,
    onValue,
    get,
    set } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-database.js";

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

const nameEl = document.getElementById("name-el")
const numberEl = document.getElementById("num-el")
const locationEl = document.getElementById("loc-el")

const formEl = document.querySelector("form")
const tableBody = document.getElementById("table-body")

const referenceInDb = ref(database, "attendees")

const toast = document.getElementById("notification-toast")
const countEl = document.getElementById("count-el")

function render(leads) {
    let listItems = ""
    for (let i = 0; i < leads.length; i++) {
        const entry = leads[i]

        const rowClass = entry.isFirstTimer ? "first-timer-row" : ""

        listItems += `
            <tr class="${rowClass}">
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
        render(entries)
    } else {
        myLeads = []
        countEl.textContent = "0"
        tableBody.innerHTML = ""
    }
})

function showToast(message, isError = false, isFirstTimer = false) {
    toast.innerHTML = message

    toast.classList.remove("error", "flashy")

    if (isError) {
        toast.classList.add("error")
    } else {
        toast.classList.add("flashy")
    }

    toast.classList.add("show")
    setTimeout(() => {
        toast.classList.remove("show")
    }, 3000)
}

formEl.addEventListener("submit", function(event) {
    event.preventDefault()
    
    const nameVal = nameEl.value.trim()
    const numberVal = numberEl.value.trim()
    const locationVal = locationEl.value.trim()
    const isDuplicate = myLeads.some(lead => lead.phone === numberVal)

    if (isDuplicate) {
        showToast("This phone number has already checked in!", true)
        return 
        }

    if (nameVal && numberVal && locationVal) {
        const memberRef = ref(database, `members/${numberVal}`)

        get(memberRef).then((snapshot) => {
            if (snapshot.exists()) {
        push(referenceInDb, {
            fullName: nameVal,
            phone: numberVal,
            location: locationVal,
            timestamp: new Date().toISOString(),
            isFirstTimer: false
        })
        showToast(`Welcome to <span>DestinyLine</span>, ${nameVal}🎉!`)
    }
    else{
        push(referenceInDb, {
            fullName: nameVal,
            phone: numberVal,
            location: locationVal,
            timestamp: new Date().toISOString(),
            isFirstTimer: true
        })

        set(memberRef, {isMember: true})
        showToast(`🥳🙌🎉Welcome to <span>DestinyLine</span>, ${nameVal}🥳🙌🎉!`)
    }
    nameEl.value = ""
    numberEl.value = ""
    locationEl.value = ""
})
    }
})