
import * as AddressData from "./Address.js";
import { rangeSelect } from "./Component/RangeSelect.js";
const locations = AddressData.locations;
let currentLevel = locations;
const minPrice = 0;
const maxPrice = 10000000;
const minWeeklyRent = 0;
const maxWeeklyRent = 10000;
const minLandArea = 0;
const maxLandArea = 100000;
let breadcrumb = ["Regions & Suburbs"];
let selectedItems = [];
let selectedLocations = [];
let selectedTab = "Residential"
let priceSlider = null;
let weeklyRentSlider = null;
let landAreaSlider = null;
let selectedBedrooms = [];
let selectedBathrooms = [];
let selectedPropertyTypes = ["All"];
let selectedSort = "Newest";
let selectedFurnishings = "";
let selectedViewTypes = [];
let rentalSelectedViewTypes = [];


function initTooltip() {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
}

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

            // Show or hide the filter details based on the selected tab
            if (selectedTab === "Residential") {
                showResidentialFilterDetail();
            } else {
                showRentalFilterDetail();
            }
        });
    });
}

function showResidentialFilterDetail() {
    //hide rental filter detail
    const rentalFilterDetail = document.querySelectorAll(".rental-filter-div");
    rentalFilterDetail.forEach(l => {
        l.classList.add("display-none")
    });


    //show residential filter detail
    const residentialFilterDetail = document.querySelectorAll(".residential-filter-div");
    residentialFilterDetail.forEach(l => {
        l.classList.remove("display-none")
    });

    //show residential filter options
    const residentialFilterOptions = document.querySelectorAll(".residenttal-filter-option");
    residentialFilterOptions.forEach(option => {
        option.classList.remove("display-none");
    });


}

function showRentalFilterDetail() {

    //hide residential filter detail
    const residentialFilterDetail = document.querySelectorAll(".residential-filter-div");
    residentialFilterDetail.forEach(l => {
        l.classList.add("display-none")
    });

    //hide residential filter options
    const residentialFilterOptions = document.querySelectorAll(".residenttal-filter-option");
    residentialFilterOptions.forEach(option => {
        option.classList.add("display-none");
    });  


    //show rental filter detail
    const rentalFilterDetail = document.querySelectorAll(".rental-filter-div");
    rentalFilterDetail.forEach(l => {
        l.classList.remove("display-none")
    });
   
}


function initlocationInputSearch() {
    const flatLocations = flattenLocations(AddressData.locations);

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

            // Update selected items and render selections
            handleItemClick({
                name: ui.item.value
            });

            setTimeout(() => {
                $(this).autocomplete("close");
            }, 50);

            return false;
        }
    });


    const locationInput = document.getElementById("locationInput");
    locationInput.addEventListener(
        "input",
        debounce(function () {
            synchronizeSelectedLocations(this.value);
        }, 1000) 
    );
}

function synchronizeSelectedLocations(inputValue) {
    const currentValues = inputValue
        .split(",")
        .map(value => value.trim()) 
        .filter(value => value);   


    // Update UI and input value
    renderSelections();
    updateLocationInput();
}


function initPirceSlider() {
    priceSlider = document.getElementById("priceSlider");
    const minPriceObj = document.getElementById("minPrice");
    const maxPriceObj = document.getElementById("maxPrice");

    // Initialize the slider
    noUiSlider.create(priceSlider, {
        start: [minPrice, maxPrice], 
        connect: true,
        range: {
            min: minPrice,
            max: maxPrice
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
        minPriceObj.textContent = numeral(values[0]).format('$0,0');
        maxPriceObj.textContent = numeral(values[1]).format('$0,0');        
    });

    // Ensure that values are set properly after user interaction
    priceSlider.noUiSlider.on("set", function () {
        if (!priceSlider) return
        const values = priceSlider.noUiSlider.get();
        minPriceObj.textContent = numeral(values[0]).format('$0,0');
        maxPriceObj.textContent = numeral(values[1]).format('$0,0');
    });
}

function initWeeklyRentSlider() {
    weeklyRentSlider = document.getElementById("weeklyRendSlider");
    const minWeeklyRentObj = document.getElementById("weeklyRentMinPrice");
    const maxWeeklyRentObj = document.getElementById("weeklyRentMaxPrice");

    // Initialize the slider
    noUiSlider.create(weeklyRentSlider, {
        start: [minWeeklyRent, maxWeeklyRent], 
        connect: true,
        range: {
            min: minWeeklyRent,
            max: maxWeeklyRent
        },
        step: 25,
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

    weeklyRentSlider.noUiSlider.on("update", function (values, handle) {
        // Show actual values
        minWeeklyRentObj.textContent = numeral(values[0]).format('$0,0');
        maxWeeklyRentObj.textContent = numeral(values[1]).format('$0,0');
    });

    weeklyRentSlider.noUiSlider.on("set", function () {
        if (!weeklyRentSlider) return
        const values = weeklyRentSlider.noUiSlider.get();
        minWeeklyRentObj.textContent = numeral(values[0]).format('$0,0');
        maxWeeklyRentObj.textContent = numeral(values[1]).format('$0,0');
    });


}

function initLandAreaSlider() {
    landAreaSlider = document.getElementById("landAreaSlider");
    const minLandAreaObj = document.getElementById("minArea");
    const maxLandAreaObj = document.getElementById("maxArea");

    // Initialize the slider
    noUiSlider.create(landAreaSlider, {
        start: [minLandArea, maxLandArea], 
        connect: true,
        range: {
            min: minLandArea,
            max: maxLandArea
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
        minLandAreaObj.textContent = numeral(values[0]).format('0,0');
        maxLandAreaObj.textContent = numeral(values[1]).format('0,0');
    });

    landAreaSlider.noUiSlider.on("set", function () {
        if (!landAreaSlider) return
        const values = landAreaSlider.noUiSlider.get();
        minLandAreaObj.textContent = numeral(values[0]).format('0,0');
        maxLandAreaObj.textContent = numeral(values[1]).format('0,0');
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

function initFurnishingSelect() {
    const furnishingOptions = document.querySelectorAll("#furnishingOptions .filter-option");

    furnishingOptions.forEach(option => {

        option.addEventListener("click", function () {
            //remove "active" class from all buttons
            furnishingOptions.forEach(opt => opt.classList.remove("active"));

            //add "active" class to the clicked button
            this.classList.add("active");

            //update the currently selected option
            selectedFurnishings = this.getAttribute("data-value");

        });

    });

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

function initRentalViewTypeSelect() {
    const rentalViewTypeOptions = document.querySelectorAll("#rentalViewTypeOptions .filter-option");

    rentalViewTypeOptions.forEach(option => {
        option.addEventListener("click", function () {
            const value = this.textContent.trim();

            //toggle the active state
            if (this.classList.contains("active")) {
                this.classList.remove("active");
                //remove from the selected options
                const index = rentalSelectedViewTypes.indexOf(value);
                if (index > -1) rentalSelectedViewTypes.splice(index, 1);
            } else {
                this.classList.add("active");
                rentalSelectedViewTypes.push(value);
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
        const allOfItem = currentLevel?.find((loc) => loc.name.startsWith("All of")) ?? null;
        const isAllOfSelected = item?.name === allOfItem?.name;

        if (isAllOfSelected) {
            //clear other selections
            selectedItems = [item.name];
        }
        else {
            //if other selections are selected, remove "All of" selection
            const allOfItemIndex = selectedItems.indexOf(allOfItem?.name);
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

//show filter detail based on the selected tab
function updateFilterDetailDisplay() {
    const filterDetailsContainer = document.getElementById("filterDetailsContainer");


    //show selected filter details(rental or residential)

    const isResidential = selectedTab === "Residential";

    //tab details
    const tabDetails = document.getElementById("tabDetailDisplay");
    if (tabDetails) {
        tabDetails.textContent = isResidential ? "Residential" : "Rental";
    }

    //location details
    const locationDetailDisplay = document.getElementById("locationDetailDisplay");
    if (locationDetailDisplay) {
        const locationText = selectedItems.length > 0 ? selectedItems.join(", ") : "all locations";
        locationDetailDisplay.textContent = locationText;
        locationDetailDisplay.setAttribute("title", locationText);
        new bootstrap.Tooltip(locationDetailDisplay);
    }

    if (isResidential) {
        //price details
        const priceDetailDisplay = document.getElementById("priceDetailDisplay");
        let priceDisplayText = "any price";
        if (priceSlider && priceDetailDisplay) {
            const priceRange = priceSlider.noUiSlider.get();
            const minPriceValue = numeral(priceRange[0]).value();
            const maxPriceValue = numeral(priceRange[1]).value();
            priceDisplayText = minPriceValue === minPrice && maxPriceValue === maxPrice ? "any price" : `$${numeral(priceRange[0]).format("0,0")} - $${numeral(priceRange[1]).format("0,0")}`;   
        }

        priceDetailDisplay.textContent = priceDisplayText;
        priceDetailDisplay.setAttribute("title", priceDisplayText);
        new bootstrap.Tooltip(priceDetailDisplay);
    }
    else {
        //weekly rent details
        const weeklyRentDetailDisplay = document.getElementById("priceDetailDisplay");
        let weeklyRentDisplayText = "any rent";
        if (weeklyRentSlider && weeklyRentDetailDisplay) {
            const weeklyRentRange = weeklyRentSlider.noUiSlider.get();
            const minWeeklyRentValue = numeral(weeklyRentRange[0]).value();
            const maxWeeklyRentValue = numeral(weeklyRentRange[1]).value();
            weeklyRentDisplayText = minWeeklyRentValue === minWeeklyRent && maxWeeklyRentValue === maxWeeklyRent ? "any rent" : `$${numeral(weeklyRentRange[0]).format("0,0")} - $${numeral(weeklyRentRange[1]).format("0,0")}`;          
        }
        weeklyRentDetailDisplay.textContent = weeklyRentDisplayText;
        weeklyRentDetailDisplay.setAttribute("title", weeklyRentDisplayText);
        new bootstrap.Tooltip(weeklyRentDetailDisplay);
    }

    //property type details
    const propertyTypeDetailDisplay = document.getElementById("propertyTypeDetailDisplay");
    if (propertyTypeDetailDisplay) {
        const propertyTypeText =
            selectedPropertyTypes.length > 0 && !selectedPropertyTypes.includes("All")
                ? selectedPropertyTypes.join(", ")
                : "all types";
        propertyTypeDetailDisplay.textContent = propertyTypeText;
        propertyTypeDetailDisplay.setAttribute("title", propertyTypeText);
        new bootstrap.Tooltip(propertyTypeDetailDisplay);
    }

    //bedroom details
    const bedroomDetailDisplay = document.getElementById("bedroomDetailDisplay");
    if (bedroomDetailDisplay) {
        const bedroomText =
            selectedBedrooms.length > 0
                ? `${Math.min(...selectedBedrooms)}-${Math.max(...selectedBedrooms)} bed`
                : "any bed";
        bedroomDetailDisplay.textContent = bedroomText;
    }

    //bathroom details
    const bathroomDetailDisplay = document.getElementById("bathroomDetailDisplay");
    if (bathroomDetailDisplay) {
        const bathroomText =
            selectedBathrooms.length > 0
                ? `${Math.min(...selectedBathrooms)}-${Math.max(...selectedBathrooms)} bath`
                : "any bath";
        bathroomDetailDisplay.textContent = bathroomText;
    }

    //land details
    const landDetailDisplay = document.getElementById("landDetailDisplay");
    if (isResidential) {      
        let landDisplayText = "any land";
        if (landAreaSlider && landDetailDisplay) {
            const landRange = landAreaSlider.noUiSlider.get();
            const minLandValue = numeral(landRange[0]).value();
            const maxLandValue = numeral(landRange[1]).value();
            landDisplayText = minLandValue === minLandArea && maxLandValue === maxLandArea ? "any land" : `${numeral(landRange[0]).format("0,0")} - ${numeral(landRange[1]).format("0,0")} m²`;
        }

        landDetailDisplay.textContent = landDisplayText;
        landDetailDisplay.setAttribute("title", landDisplayText);
        new bootstrap.Tooltip(landDetailDisplay);

        //show land area details for residential
        landDetailDisplay.classList.remove("display-none");
    }
    else {
        //hide land area details for rental
        landDetailDisplay.classList.add("display-none");       
    }

}

function onBtnApplyFilterClick() {
    //hide the filter modal
    //hideModal('filterModal');
    //updateFilterDetailDisplay(); 

   // getFilterDetails()

}

function getFilterDetails() {
    
    return {
        PropertyListingTypeName: selectedTab,
        Locations: selectedItems.join(","),
        MinPrice: priceSlider ? numeral(priceSlider.noUiSlider.get()[0]).value() : minPrice,
        MaxPrice: priceSlider ? numeral(priceSlider.noUiSlider.get()[1]).value() : maxPrice,
        PropertyTypeNames: selectedPropertyTypes.join(","),
        MinBedrooms: selectedBedrooms.length > 0 ? Math.min(...selectedBedrooms) : 0,
        MaxBedrooms: selectedBedrooms.length > 0 ? Math.max(...selectedBedrooms) : 0,
        MinBathrooms: selectedBathrooms.length > 0 ? Math.min(...selectedBathrooms) : 0,
        MaxBathrooms: selectedBathrooms.length > 0 ? Math.max(...selectedBathrooms) : 0,
        SortBy: selectedSort,
        SearchBy: selectedTab === "Residential" ? selectedViewTypes.join(",") : rentalSelectedViewTypes.join(","),
        Keywords: document.getElementById("keywordInput").value,
        MinLandArea: landAreaSlider ? numeral(landAreaSlider.noUiSlider.get()[0]).value() : minLandArea,
        MaxLandArea: landAreaSlider ? numeral(landAreaSlider.noUiSlider.get()[1]).value() : maxLandArea
    }

}

function areAllImagesLoaded() {
    const images = document.querySelectorAll('.carousel-inner img');
    return Array.from(images).every(img => img.complete);
}

function resetFilter() {
    // Reset sliders
    if (priceSlider) priceSlider.noUiSlider.set([0, 10000000]);
    if (weeklyRentSlider) weeklyRentSlider.noUiSlider.set([0, 10000]);
    if (landAreaSlider) landAreaSlider.noUiSlider.set([0, 100000]);

    // Clear selected items
    selectedItems = [];
    selectedLocations = [];
    selectedBedrooms = [];
    selectedBathrooms = [];
    selectedPropertyTypes = ["All"];
    selectedSort = "Newest";
    selectedFurnishings = "";
    selectedViewTypes = [];
    rentalSelectedViewTypes = [];

    // Reset text input
    const locationInput = document.getElementById("locationInput");
    if (locationInput) {
        locationInput.value = "";
    }

    //reset property type options
    const propertyTypeOptions = document.querySelectorAll("#propertyTypeOptions .filter-option");
    propertyTypeOptions.forEach(option => option.classList.remove("active"));

    const allOption = document.querySelector("#propertyTypeOptions .filter-option[data-value='All']");
    if (allOption) {
        allOption.classList.add("active");
    }

    //reset bedroom and bathroom options
    const bedroomOptions = document.querySelectorAll("#bedroomOptions .bedroom-option");
    const bathroomOptions = document.querySelectorAll("#bathroomOptions .bathroom-option");

    //clear active class from all bedroom options
    if (bedroomOptions) {
        bedroomOptions.forEach(option => option.classList.remove("active"));
    }

    //clear active class from all bathroom options
    if (bathroomOptions) {
        bathroomOptions.forEach(option => option.classList.remove("active"));
    }

    //reset furnishing options
    const furnishingOptions = document.querySelectorAll("#furnishingOptions .filter-option");
    furnishingOptions.forEach(option => option.classList.remove("active"));

    //reset sort options
    const sortOptions = document.querySelectorAll("#sortOptions .filter-option");
    sortOptions.forEach(option => option.classList.remove("active"));

    const newestOption = document.querySelector("#sortOptions .filter-option[data-sort='Newest']");
    if (newestOption) {
        newestOption.classList.add("active");
    }

    //reset view type options
    const viewTypeOptions = document.querySelectorAll("#viewTypeOptions .filter-option");
    viewTypeOptions.forEach(option => option.classList.remove("active"));

    const rentalViewTypeOptions = document.querySelectorAll("#rentalViewTypeOptions .filter-option");
    rentalViewTypeOptions.forEach(option => option.classList.remove("active"));

    //clear keyword search
    const keywordInput = document.getElementById("keywordInput");
    if (keywordInput) {
        keywordInput.value = "";
    }

    //reset breadcrumb and current level
    breadcrumb = ["Regions & Suburbs"];
    currentLevel = locations;

    //re-render the location list
    renderList();

    //reset active tab
    const tabs = document.querySelectorAll(".property-tab");
    tabs.forEach(tab => tab.classList.remove("active"));

    //refault to Residential tab
    const residentialTab = document.querySelector(".property-tab[data-type='Residential']");
    if (residentialTab) {
        residentialTab.classList.add("active");
    }
    selectedTab = "Residential";
    showResidentialFilterDetail();
}

function setup() {
    initTooltip();
    setupTabs();
    showResidentialFilterDetail();
    initlocationInputSearch();
    initPirceSlider();
    initWeeklyRentSlider();
    initPropertyTypeSelect();
    initBedroomSelect();
    initBathroomSelect();
    initSortSelect();
    initFurnishingSelect();
    initViewTypeSelect();
    initRentalViewTypeSelect(); 
    initLandAreaSlider();
}

function eventBinding() {
    document.getElementById("btnFilter").addEventListener("click", function () {
        showModal('filterModal');
    });
    document.getElementById("btnBack").addEventListener("click", onBtnBackClick);
    document.getElementById("btnChooseLocation").addEventListener("click", function () {
        showModal('locationModal');
        hideModal('filterModal');
    });

    document.getElementById("btnDone").addEventListener("click", function () {
        updateLocationInput();
        hideModal('locationModal');
        showModal('filterModal');
    });

    //document.getElementById("btnApplyFilter").addEventListener("click", onBtnApplyFilterClick);

    document.getElementById("btnResetFilters").addEventListener("click", resetFilter);

}

function postInit() {
    renderList();
}

//document.addEventListener("DOMContentLoaded", function () {
//    setup();
//    eventBinding();
//    postInit();

//});


function debounce(func, delay) {
    let timeout;
    return function (...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), delay);
    };
}

window.initializeJavaScriptEffects = function () {
    setup();
    eventBinding();
    postInit();
}

window.hideModal = hideModal;
window.updateFilterDetailDisplay = updateFilterDetailDisplay;
window.getFilterDetails = getFilterDetails;
window.areAllImagesLoaded = areAllImagesLoaded;