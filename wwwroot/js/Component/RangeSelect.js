export function rangeSelect(containerId, selectedItems) {
    const options = document.querySelectorAll(`#${containerId} .option`);

    options.forEach(option => {
        option.addEventListener("click", function () {
            const value = parseInt(this.getAttribute("data-value"));

            if (selectedItems.length === 1 && selectedItems.includes(value.toString())) {
                // Prevent deselection if it's the only selected option
                return;
            }

            if (selectedItems.length > 0) {
                const lastSelected = Math.max(...selectedItems.map(Number));
                const min = Math.min(lastSelected, value);
                const max = Math.max(lastSelected, value);

                if (selectedItems.includes(value.toString())) {
                    // If clicked value is already selected, remove the range except the clicked one
                    selectedItems.splice(0, selectedItems.length, value.toString());
                } else {
                    // If adding a new value, include the range
                    const newRange = Array.from(
                        { length: max - min + 1 },
                        (_, i) => (min + i).toString()
                    );
                    selectedItems.splice(0, selectedItems.length, ...new Set([...selectedItems, ...newRange]));
                }
            } else {
                // Select only the clicked option if none are selected
                selectedItems.splice(0, selectedItems.length, value.toString());
            }

            // Update Active States
            options.forEach(opt => {
                if (selectedItems.includes(opt.getAttribute("data-value"))) {
                    opt.classList.add("active");
                } else {
                    opt.classList.remove("active");
                }
            });
        });
    });
}
