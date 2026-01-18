
function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.className = `container py-4 ${savedTheme}-theme`;
    document.getElementById('checkbox').checked = (savedTheme === 'dark');
}

// Alternar tema
function toggleTheme() {
    const checkbox = document.getElementById('checkbox');
    const currentTheme = checkbox.checked ? 'dark' : 'light';

    document.body.className = `container py-4 ${currentTheme}-theme`;
    localStorage.setItem('theme', currentTheme);

    // Animação suave
    document.body.style.transition = 'background-color 3.0s ease, color 3.0s ease';
}