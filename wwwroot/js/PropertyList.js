
import * as AddressData from "./Address.js";
const locations = AddressData.locations;
let currentLevel = locations;
let breadcrumb = ["Regions & Suburbs"];
let selectedItems = [];
let selectedTab = "Residential"
let priceSlider = null;

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


function initlocationInputSearch() {
    const locations = AddressData.locations;

    // Helper function to flatten the nested locations into a flat array
    function flattenLocations(data) {
        let flatData = [];
        data.forEach(location => {
            flatData.push(location.name);
            if (location.children) {
                flatData = flatData.concat(flattenLocations(location.children));
            }
        });
        return flatData;
    }

    const flatLocations = flattenLocations(locations);

    // Initialize jQuery UI Autocomplete with multiple values support
    $("#locationInput").autocomplete({
        source: function (request, response) {
            const term = request.term.split(/,\s*/).pop(); // Get the last entered value
            const matches = $.grep(flatLocations, function (location) {
                return location.toLowerCase().startsWith(term.toLowerCase());
            });
            response(matches); // Pass matched results to autocomplete
        },
        focus: function () {
            // Prevent value from being inserted on focus
            return false;
        },
        select: function (event, ui) {
            const terms = this.value.split(/,\s*/); // Split the current input value
            terms.pop(); // Remove the last term (partial input)
            terms.push(ui.item.value); // Add the selected item
            terms.push(""); // Add a placeholder for the next value
            this.value = terms.join(", "); // Update the input value
            return false;
        }
    });
}

function initPirceSlider() {
    priceSlider = document.getElementById("priceSlider");
    const minPrice = document.getElementById("minPrice");
    const maxPrice = document.getElementById("maxPrice");

    // Initialize the slider
    noUiSlider.create(priceSlider, {
        start: [0, 1000000], 
        connect: true,
        range: {
            min: 0,
            max: 1000000
        },
        tooltips: [false, false],
        format: {
            to: function (value) {
                // Use numeral to format value as currency
                return numeral(value).format('$0,0');
            },
            from: function (value) {          
                if (typeof value === "string" && value.includes("$")) {
                    return numeral(value.replace("$", "").trim()).value();
                }
                return Number(value) || 0;
            }
        }
    });


    // Update the labels dynamically on slider value changes
    priceSlider.noUiSlider.on("update", function (values, handle) {
        // Show actual slider values
        minPrice.textContent = numeral(values[0]).format('$0,0');
        maxPrice.textContent = numeral(values[1]).format('$0,0');        
    });

    // Ensure that values are set properly after user interaction
    priceSlider.noUiSlider.on("set", function () {
        if (!priceSlider) return
        const values = priceSlider.noUiSlider.get();
        minPrice.textContent = numeral(values[0]).format('$0,0');
        maxPrice.textContent = numeral(values[1]).format('$0,0');
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

function updateLocationInput() {
    const locationInput = document.getElementById("locationInput");
    if (selectedItems.length > 0) {
        locationInput.value = selectedItems.join(", ");
    } else {
        locationInput.value = "";
    }
}

//// Confirm the selection
//function confirmSelection() {
//    alert(`You selected: ${selectedItems.join(", ")}`);
//    document.querySelector("#locationModal .btn-close").click(); // Close the modal
//    renderList(); // Reset the list
//}

function setup() {
    setupTabs();
    initlocationInputSearch();
    initPirceSlider();
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
        hideModal('filterModal');
    });

    document.getElementById("btnDone").addEventListener("click", function () {
        updateLocationInput();
        hideModal('locationModal');
        showModal('filterModal');
    });
 
}

function postInit() {
    renderList();
}

document.addEventListener("DOMContentLoaded", function () {
    setup();
    eventBinding();
    postInit();

});





