
import * as AddressData from "./Address.js";
import { rangeSelect } from "./Component/RangeSelect.js";
const locations = AddressData.locations;
let currentLevel = locations;
let breadcrumb = ["Regions & Suburbs"];
let selectedItems = [];
let selectedTab = "Residential"
let priceSlider = null;
let landAreaSlider = null;
let selectedBedrooms = [];
let selectedBathrooms = [];
let selectedPropertyTypes = [];
let selectedSort = "Newest";
const selectedViewTypes = [];
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

function showResidentialFilterOptions() { }

function showRentalFilterOptions() { }


function initlocationInputSearch() {
    const locations = AddressData.locations;
    const flatLocations = flattenLocations(locations);


    $("#locationInput").autocomplete({
        source: function (request, response) {
            const term = request.term.split(/,\s*/).pop();
            const matches = flatLocations.filter(location =>
                location.toLowerCase().startsWith(term.toLowerCase())
            );
            response(matches);
        },
        focus: function () {
            // Prevent value from being inserted on focus
            return false;
        },
        select: function (event, ui) {
            const terms = this.value.split(/,\s*/); 
            terms.pop(); 
            terms.push(ui.item.value);
            terms.push(""); 
            this.value = terms.join(", ");

            setTimeout(() => {
                $(this).autocomplete("close");
            }, 0);

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
        start: [0, 10000000], 
        connect: true,
        range: {
            min: 0,
            max: 10000000
        },
        step: 50000,
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

function initLandAreaSlider() {
    landAreaSlider = document.getElementById("landAreaSlider");
    const minLandArea = document.getElementById("minArea");
    const maxLandArea = document.getElementById("maxArea");

    // Initialize the slider
    noUiSlider.create(landAreaSlider, {
        start: [0, 100000], 
        connect: true,
        range: {
            min: 0,
            max: 100000
        },
        step: 100,
        tooltips: [false, false],
        format: {
            to: function (value) {
                // Use numeral to format value as currency
                return numeral(value).format('0,0');
            },
            from: function (value) {          
                if (typeof value === "string") {
                    return numeral(value.replace(",", "").trim()).value();
                }
                return Number(value) || 0;
            }
        }
    });

    landAreaSlider.noUiSlider.on("update", function (values, handle) {
        // Show actual values
        minLandArea.textContent = numeral(values[0]).format('0,0');
        maxLandArea.textContent = numeral(values[1]).format('0,0');
    });

    landAreaSlider.noUiSlider.on("set", function () {
        if (!landAreaSlider) return
        const values = landAreaSlider.noUiSlider.get();
        minLandArea.textContent = numeral(values[0]).format('0,0');
        maxLandArea.textContent = numeral(values[1]).format('0,0');
    });

    
}

function initPropertyTypeSelect() {
    const propertyTypeOptions = document.querySelectorAll("#propertyTypeOptions .filter-option");

    propertyTypeOptions.forEach(option => {
        option.addEventListener("click", function () {
            const value = this.getAttribute("data-value");

            if (value === "All") {
                selectedPropertyTypes = ["All"];
                propertyTypeOptions.forEach(opt => opt.classList.remove("active"));
            } else {
                const allIndex = selectedPropertyTypes.indexOf("All");
                if (allIndex > -1) selectedPropertyTypes.splice(allIndex, 1);

                const index = selectedPropertyTypes.indexOf(value);
                if (index > -1) {
                    selectedPropertyTypes.splice(index, 1);
                } else {
                    selectedPropertyTypes.push(value);
                }
            }

            // Update Active States
            propertyTypeOptions.forEach(opt => {
                if (selectedPropertyTypes.includes(opt.getAttribute("data-value"))) {
                    opt.classList.add("active");
                } else {
                    opt.classList.remove("active");
                }
            });
        });
    });
}

function initBedroomSelect() {
    rangeSelect("bedroomOptions", selectedBedrooms);
}

function initBathroomSelect() {
    rangeSelect("bathroomOptions", selectedBathrooms);
}

function initSortSelect() {
    const sortOptions = document.querySelectorAll("#sortOptions .filter-option");

    sortOptions.forEach(option => {
        option.addEventListener("click", function () {
            //remove "active" class from all buttons
            sortOptions.forEach(opt => opt.classList.remove("active"));

            //add "active" class to the clicked button
            this.classList.add("active");

            //update the currently selected option
            selectedSort = this.getAttribute("data-sort");
            //console.log("Selected sort:", selectedSort);
        });
    });

} 

function initViewTypeSelect() {
    const viewTypeOptions = document.querySelectorAll("#viewTypeOptions .filter-option");

    viewTypeOptions.forEach(option => {
        option.addEventListener("click", function () {
            const value = this.textContent.trim();

            //toggle the active state
            if (this.classList.contains("active")) {
                this.classList.remove("active");
                //remove from the selected options
                const index = selectedViewTypes.indexOf(value);
                if (index > -1) selectedViewTypes.splice(index, 1);
            } else {
                this.classList.add("active");
                selectedViewTypes.push(value);
            }
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


// Flatten the location data
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
    initPropertyTypeSelect();
    initBedroomSelect();
    initBathroomSelect();
    initSortSelect();
    initViewTypeSelect();
    initLandAreaSlider();
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





