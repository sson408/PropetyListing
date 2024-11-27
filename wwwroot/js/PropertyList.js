export function showModal(modalId) {
    const modal = new bootstrap.Modal(document.getElementById(modalId), {
        backdrop: 'static',
        keyboard: false,
    });
    modal.show();
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("btnFilter").addEventListener("click", function () {
        showModal('filterModal');
    });
});
