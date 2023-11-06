// Selecting elements from the DOM
const mainContainer = document.querySelector(".container");
const deleteBtn = document.querySelector(".delete__btn");
const form = document.querySelector("form");

// API Url
const apiUrl =
    "https://fsa-crud-2aa9294fe819.herokuapp.com/api/2308-acc-et-web-pt-b/events";

// Function fetches "apiUrl" and returns "data"
async function fetchPartyData() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        renderPartyList(data); // Passing data to the function
    } catch (error) {
        console.log(error);
    }
}
// Initial load
fetchPartyData();

// Function creates the HTML dynamically and displays the data
function renderPartyList(party) {
    mainContainer.innerHTML = "";
    console.log("Party Data", party.data);
    party.data.map((info) => {
        const date = new Date(Date.parse(info.date)); // Formating Date "10/15/23"
        const ampm = date.getHours() >= 12 ? "PM" : "AM"; // Display PM or AM based on the user local device
        const minutes = String(date.getMinutes()).padStart(2, "0"); // Formating the "Minutes" to have two zeros in case missing one "3:00"
        const formattedHours = date.getHours() % 12 || 12; // Convert to 12-hour format
        mainContainer.innerHTML += `
        <div class="box" data-party-id="${info.id}">
            <h3>${info.name}</h3>
            <p class="description">${info.description}</p>
            <div class="date__address__container">
                <p class="date"><strong>Date:</strong> ${date.getMonth()}/${date.getDate()}/${date.getFullYear()} | <strong>Time:</strong> ${formattedHours}:${minutes} ${ampm}</p>
                <address><strong>Address:</strong> ${info.location}</address>
                <button class="delete__btn">Delete</button>
            </div>
        </div>
        `;
    });
}

// Function to delete the party based on the party ID
async function deleteParty(partyId) {
    try {
        const response = await fetch(`${apiUrl}/${partyId}`, {
            method: "DELETE",
        });

        if (response.ok) {
            console.log(`Party with ID ${partyId} deleted successfully.`);
        } else {
            console.error(`Failed to delete party with ID ${partyId}.`);
        }
    } catch (error) {
        console.error(error);
    }
}

// Function to handle the form submission
async function handleFormSubmit(event) {
    event.preventDefault();
    const name = event.target.name.value;
    const description = event.target.description.value;
    const dateVal = event.target.date.value;
    const location = event.target.location.value;
    const date = new Date(Date.parse(dateVal));

    // Create a new party object
    const newParty = {
        name,
        description,
        date,
        location,
    };

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newParty),
        });

        if (response.ok) {
            // Party added successfully, fetch the updated party list
            fetchPartyData();

            // Clear the form
            event.target.reset();
        } else {
            console.error("Failed to add the party.");
        }
    } catch (error) {
        console.error(error);
    }
}

// Add a click event listener to the mainContainer and use event delegation to handle the click event on the delete buttons
mainContainer.addEventListener("click", (event) => {
    if (event.target.classList.contains("delete__btn")) {
        // Find the corresponding party element and delete it from the DOM and the server
        const partyElement = event.target.closest(".box");
        const partyId = partyElement.getAttribute("data-party-id"); // Selecting data attribute for party ID
        deleteParty(partyId);
        partyElement.remove();
    }
});
form.addEventListener("submit", handleFormSubmit);
