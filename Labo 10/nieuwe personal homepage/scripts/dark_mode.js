const darkModeToggle = document.getElementById('dark-mode-toggle');

// Default is dark mode

// Check for saved user preference and apply light/dark mode if stored
if (localStorage.getItem('color-scheme') === 'dark') {
    document.body.classList.add('dark-mode');
    darkModeToggle.checked = true;
} else if (localStorage.getItem('color-scheme') === 'light') {
    document.body.classList.add('light-mode');
    darkModeToggle.checked = false;
}

// Toggle dark mode on checkbox change
darkModeToggle.addEventListener('change', () => {
    if (darkModeToggle.checked) {
        document.body.classList.remove('light-mode');
        document.body.classList.add('dark-mode');
        localStorage.setItem('color-scheme', 'dark');
    } else {
        document.body.classList.remove('dark-mode');
        document.body.classList.add('light-mode');
        localStorage.setItem('color-scheme', 'light');
    }
});