
import * as AddressData from "./Address.js";
const locations = AddressData.locations;
let currentLevel = locations;
let breadcrumb = ["Regions & Suburbs"];
let selectedItems = [];
let selectedTab = "Residential"

function setupTabs() {
    const tabs = document.querySelectorAll(".property-tab");

    tabs.forEach((tab) => {
        tab.addEventListener("click", (event) => {
            // Remove the active class from all tabs
            tabs.forEach((t) => t.classList.remove("active"));

            // Add the active class to the clicked tab
            event.target.classList.add("active");

            // Get the selected tab type
            selectedTab = event.target.getAttribute("data-type");
            //console.log(`Selected Tab: ${selectedTab}`); 
        });
    });

}

function showModal(modalId) {
    const modal = new bootstrap.Modal(document.getElementById(modalId), {
        backdrop: 'static',
        keyboard: false,
    });
    modal.show();
}

function hideModal(modalId) {
    const modal = bootstrap.Modal.getInstance(document.getElementById(modalId));
    modal.hide();
}

// Render the location list
function renderList() {
    const listContainer = document.getElementById("locationList");
    const breadcrumbs = document.getElementById("currentLevel");
    listContainer.innerHTML = ""; // Clear the previous list
    breadcrumbs.textContent = breadcrumb[breadcrumb.length - 1]; // Update the breadcrumb

    currentLevel.forEach((item) => {
        const listItem = document.createElement("li");
        listItem.textContent = `${item.name} (${item.count})`;
        listItem.className = "list-group-item location-item";
        listItem.onclick = () => handleItemClick(item);
        listContainer.appendChild(listItem);
    });

    renderSelections();
}

// Handle item click events
function handleItemClick(item) {
    if (item.children) {
        // Navigate to the next level
        currentLevel = item.children;
        breadcrumb.push(item.name);
        renderList();
    } else {
        const allOfItem = currentLevel.find((loc) => loc.name.startsWith("All of"));
        const isAllOfSelected = item.name === allOfItem.name

        if (isAllOfSelected) {
            //clear other selections
            selectedItems = [item.name];
        }
        else {
            //if other selections are selected, remove "All of" selection
            const allOfItemIndex = selectedItems.indexOf(allOfItem.name);
            if (allOfItemIndex > -1) {
                selectedItems.splice(allOfItemIndex, 1);
            }

            // Toggle the current item
            const index = selectedItems.indexOf(item.name);
            if (index > -1) {
                selectedItems.splice(index, 1);
            } else {
                selectedItems.push(item.name);
            }

            // Check if all children are selected
            // If so, replace them with the "All of" item
            const allChildrenSelected = currentLevel.filter(child => !child.name.startsWith("All of")).every(child => selectedItems.includes(child.name));
            if (allChildrenSelected && !selectedItems.includes(allOfItem.name)) {
                selectedItems = [allOfItem.name];
            }
        }

        renderSelections();
    }
}

// Navigate back to the previous level
function onBtnBackClick() {
    breadcrumb.pop();
    const parentName = breadcrumb[breadcrumb.length - 1];
    let parent = locations;
    breadcrumb.slice(1).forEach((name) => {
        parent = parent.find((loc) => loc.name === name).children;
    });

    //if parentName is "Regions & Suburbs" and currentLevel is the root level
    if (!parentName || (parentName === "Regions & Suburbs" && currentLevel === locations)) {
        //hide location modal
        hideModal('locationModal');

        //show the filter modal
        showModal('filterModal');

        //clear selected items
        selectedItems = [];

        currentLevel = parent;
    }
    else {
        currentLevel = parent;
        renderList();
    }


}

// Render selected items
function renderSelections() {
    const listItems = document.querySelectorAll("#locationList li");
    listItems.forEach((item) => {
        const itemName = item.textContent.split(" (")[0];
        if (selectedItems.includes(itemName)) {
            item.style.backgroundColor = "blue";
            item.style.color = "white";
        } else {
            item.style.backgroundColor = "transparent";
            item.style.color = "black";
        }
    });
}

// Confirm the selection
function confirmSelection() {
    alert(`You selected: ${selectedItems.join(", ")}`);
    document.querySelector("#locationModal .btn-close").click(); // Close the modal
    renderList(); // Reset the list
}

function postInit() {
    renderList();
}

function eventBinding() {
    document.getElementById("btnFilter").addEventListener("click", function () {
        showModal('filterModal');
    });
    document.getElementById("btnBack").addEventListener("click", function () {
        onBtnBackClick();
    });
    document.getElementById("btnChooseLocation").addEventListener("click", function () {
        showModal('locationModal');
    });
}

document.addEventListener("DOMContentLoaded", function () {
    setupTabs();
    eventBinding();
    postInit();

});





