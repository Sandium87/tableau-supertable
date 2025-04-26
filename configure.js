function saveSettings() {
  const selectedSheet = document.getElementById('worksheetDropdown').value;
  tableau.extensions.settings.set("worksheet", selectedSheet);
  tableau.extensions.settings.saveAsync().then(() => {
    tableau.extensions.ui.closeDialog(selectedSheet);
  });
}

tableau.extensions.initializeDialogAsync().then(() => {
  const dropdown = document.getElementById('worksheetDropdown');
  tableau.extensions.dashboardContent.dashboard.worksheets.forEach(ws => {
    const option = document.createElement('option');
    option.value = ws.name;
    option.textContent = ws.name;
    dropdown.appendChild(option);
  });
});
