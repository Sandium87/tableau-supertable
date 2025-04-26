let hot;
let selectedWorksheetName = '';

function showConfigure() {
  document.getElementById('controls').style.display = 'none';
  document.getElementById('hot').style.display = 'none';
  document.getElementById('configurePanel').style.display = 'block';

  const configureDropdown = document.getElementById('configureDropdown');
  configureDropdown.innerHTML = '';

  tableau.extensions.dashboardContent.dashboard.worksheets.forEach(ws => {
    const option = document.createElement('option');
    option.value = ws.name;
    option.textContent = ws.name;
    configureDropdown.appendChild(option);
  });
}

function saveConfiguration() {
  const selectedSheet = document.getElementById('configureDropdown').value;
  tableau.extensions.settings.set("worksheet", selectedSheet);
  tableau.extensions.settings.saveAsync().then(() => {
    location.reload(); // Reload extension after saving config
  });
}

function loadWorksheet() {
  const selectedSheetName = document.getElementById('worksheetSelect').value;
  if (!selectedSheetName) {
    alert("No worksheet selected!");
    return;
  }

  const worksheet = tableau.extensions.dashboardContent.dashboard.worksheets.find(ws => ws.name === selectedSheetName);

  worksheet.getSummaryDataAsync().then((dataTable) => {
    const cols = dataTable.columns.map(col => col.fieldName);
    const rows = dataTable.data.map(row => row.map(cell => cell.formattedValue));

    if (hot) {
      hot.destroy();
    }

    hot = new Handsontable(document.getElementById('hot'), {
      data: rows,
      colHeaders: cols,
      rowHeaders: true,
      filters: true,
      dropdownMenu: true,
      licenseKey: 'non-commercial-and-evaluation',
    });
  }).catch((error) => {
    console.error('Error loading worksheet data:', error.message);
  });
}

function exportCSV() {
  if (!hot) {
    alert('Table not ready!');
    return;
  }
  hot.getPlugin('exportFile').downloadFile('csv');
}

function addRow() {
  if (!hot) {
    alert('Table not ready!');
    return;
  }
  hot.alter('insert_row');
}

function deleteRow() {
  if (!hot) {
    alert('Table not ready!');
    return;
  }
  const selected = hot.getSelectedLast();
  if (selected) {
    const [startRow, , endRow] = selected;
    hot.alter('remove_row', startRow, endRow - startRow + 1);
  }
}

tableau.extensions.initializeAsync().then(() => {
  selectedWorksheetName = tableau.extensions.settings.get("worksheet");

  const select = document.getElementById('worksheetSelect');
  tableau.extensions.dashboardContent.dashboard.worksheets.forEach(ws => {
    const option = document.createElement('option');
    option.value = ws.name;
    option.textContent = ws.name;
    if (ws.name === selectedWorksheetName) {
      option.selected = true;
    }
    select.appendChild(option);
  });
}).catch((error) => {
  console.error('Error initializing extension:', error.message);
});
