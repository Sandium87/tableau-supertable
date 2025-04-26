function saveSettings() {
  const selectedSheet = document.getElementById('worksheetDropdown').value;
  tableau.extensions.settings.set("worksheet", selectedSheet);
  tableau.extensions.settings.saveAsync().then(() => {
    window.top.location.reload(); // Reload parent after saving
  });
}

tableau.extensions.initializeAsync().then(() => {
  const dropdown = document.getElementById('worksheetDropdown');
  tableau.extensions.dashboardContent.dashboard.worksheets.forEach(ws => {
    const option = document.createElement('option');
    option.value = ws.name;
    option.textContent = ws.name;
    dropdown.appendChild(option);
  });
}).catch(error => {
  console.error('Error initializing configure iframe:', error.message);
});
