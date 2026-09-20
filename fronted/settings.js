document.addEventListener('DOMContentLoaded', () => {
    const storedUser = localStorage.getItem('retinaai_user');
    const loggedIn = localStorage.getItem('retinaai_logged_in') === 'true';
    if (!loggedIn || !storedUser) {
        window.location.href = 'login.html';
        return;
    }

    const user = JSON.parse(storedUser);
    const displayName = document.getElementById('displayName');
    const email = document.getElementById('email');
    const saveButton = document.getElementById('saveButton');
    const saveMessage = document.getElementById('saveMessage');
    const historyToggle = document.getElementById('historyToggle');

    displayName.value = user.name || 'Admin';
    email.value = user.email || '';
    historyToggle.checked = localStorage.getItem('retinaAI_history_enabled') !== 'false';

    saveButton.addEventListener('click', () => {
        const updatedUser = {...user, name: displayName.value.trim() || 'Admin'};
        localStorage.setItem('retinaai_user', JSON.stringify(updatedUser));
        saveMessage.textContent = 'Changes saved.';
    });

    historyToggle.addEventListener('change', () => {
        localStorage.setItem('retinaAI_history_enabled', String(historyToggle.checked));
    });

    document.getElementById('logoutButton').addEventListener('click', () => {
        localStorage.removeItem('retinaai_logged_in');
        localStorage.removeItem('retinaai_user');
        window.location.href = 'login.html';
    });
});
