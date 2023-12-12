document.addEventListener('DOMContentLoaded', function() {
    const toastElement = document.querySelector('.toast');
    const toast = new bootstrap.Toast(toastElement, { autohide: false });

    const closeButton = toastElement.querySelector('.btn-close');
    closeButton.addEventListener('click', function() {
        toast.hide();
    });

    toast.show();
});
