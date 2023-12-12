document.addEventListener('DOMContentLoaded', function() {
    const toastContent = document.querySelector('.toast');
    const toast = new bootstrap.Toast(toastContent);
    toast.show();
});
