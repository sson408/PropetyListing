
import * as AddressData from "./Address.js";
const locations = AddressData.locations;
let currentLevel = locations;
let breadcrumb = ["New Zealand"];
let selectedItems = [];

function showModal(modalId) {
    const modal = new bootstrap.Modal(document.getElementById(modalId), {
        backdrop: 'static',
        keyboard: false,
    });
    modal.show();
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
        listItem.className = "list-group-item";
        listItem.onclick = () => handleItemClick(item);
        listContainer.appendChild(listItem);
    });
}

// Handle item click events
function handleItemClick(item) {
    if (item.children) {
        // Navigate to the next level
        currentLevel = item.children;
        breadcrumb.push(item.name);
        renderList();
    } else {
        // Handle multi-select logic
        if (item.name.startsWith("All of")) {
            selectedItems = [item.name]; // Clear other selections and select "All of"
        } else {
            // Toggle selection
            const index = selectedItems.indexOf(item.name);
            if (index > -1) {
                selectedItems.splice(index, 1);
            } else {
                selectedItems.push(item.name);
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
    currentLevel = parent;
    renderList();
}

// Render selected items
function renderSelections() {
    const listItems = document.querySelectorAll("#locationList li");
    listItems.forEach((item) => {
        if (selectedItems.includes(item.textContent.split(" (")[0])) {
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


document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("btnFilter").addEventListener("click", function () {
        showModal('filterModal');
    });
    document.getElementById("btnBack").addEventListener("click", function () {
        onBtnBackClick();
    });

    renderList();
});





