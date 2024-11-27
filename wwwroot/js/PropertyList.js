const locations = [
    {
        name: "Auckland",
        count: 5279,
        children: [
            {
                name: "Auckland City",
                count: 1061,
                children: [
                    { name: "All of Auckland City", count: 1061 },
                    { name: "Arch Hill", count: 0 },
                    { name: "Avondale", count: 48 },
                    { name: "Balmoral", count: 0 },
                    { name: "Blockhouse Bay", count: 51 },
                    { name: "City Centre", count: 154 },
                    { name: "Coxs Bay", count: 0 },
                    { name: "Eden Terrace", count: 15 }
                ]
            },
            {
                name: "Franklin District",
                count: 465,
                children: [
                    { name: "All of Franklin District", count: 465 },
                    { name: "Pukekohe", count: 100 },
                    { name: "Tuakau", count: 50 }
                ]
            },
            {
                name: "Manukau City",
                count: 1226,
                children: [
                    { name: "All of Manukau City", count: 1226 },
                    { name: "Botany Downs", count: 200 },
                    { name: "Flat Bush", count: 150 },
                    { name: "Mangere", count: 300 }
                ]
            },
            {
                name: "North Shore City",
                count: 738,
                children: [
                    { name: "All of North Shore City", count: 738 },
                    { name: "Albany", count: 100 },
                    { name: "Birkenhead", count: 50 },
                    { name: "Takapuna", count: 200 }
                ]
            },
            {
                name: "Waitakere City",
                count: 962,
                children: [
                    { name: "All of Waitakere City", count: 962 },
                    { name: "Henderson", count: 150 },
                    { name: "Massey", count: 120 },
                    { name: "Te Atatu Peninsula", count: 100 }
                ]
            }
        ]
    },
    {
        name: "Bay of Plenty",
        count: 77,
        children: [
            {
                name: "Tauranga",
                count: 50,
                children: [
                    { name: "All of Tauranga", count: 50 },
                    { name: "Papamoa", count: 25 },
                    { name: "Mount Maunganui", count: 15 }
                ]
            },
            {
                name: "Rotorua",
                count: 27,
                children: [
                    { name: "All of Rotorua", count: 27 },
                    { name: "Ngongotaha", count: 10 },
                    { name: "Lynmore", count: 7 }
                ]
            }
        ]
    },
    {
        name: "Northland",
        count: 301,
        children: [
            {
                name: "Whangarei",
                count: 200,
                children: [
                    { name: "All of Whangarei", count: 200 },
                    { name: "Kamo", count: 50 },
                    { name: "Onerahi", count: 30 }
                ]
            },
            {
                name: "Bay of Islands",
                count: 101,
                children: [
                    { name: "All of Bay of Islands", count: 101 },
                    { name: "Paihia", count: 50 },
                    { name: "Russell", count: 20 }
                ]
            }
        ]
    },
    {
        name: "Other",
        count: 115,
        children: [
            { name: "Chatham Islands", count: 15 },
            { name: "Stewart Island", count: 10 },
            { name: "Other Areas", count: 90 }
        ]
    }
];
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
    const listContainer = document.getElementById("location-list");
    const breadcrumbs = document.getElementById("current-level");
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
function goBack() {
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
    const listItems = document.querySelectorAll("#location-list li");
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

    renderList();
});
