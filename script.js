let hot;
let allWorksheets = [];
let selectedWorksheetName = '';

function showConfigure() {
  hideAll();
  document.getElementById('configurePanel').classList.remove('hidden');

  const configureDropdown = document.getElementById('configureDropdown');
  configureDropdown.innerHTML = '';

  // 🔥 Fetch worksheets fresh when clicking Configure
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
    showMessage("Configuration Saved Successfully!");
    setTimeout(() => window.location.reload(), 1000); // Small delay before reload
  });
}

function cancelConfigure() {
  hideAll();
  showMainControls();
}

function showMainControls() {
  document.getElementById('controls').style.display = 'flex';
  document.getElementById('hot').style.display = 'block';
}

function hideAll() {
  document.getElementById('controls').style.display = 'none';
  document.getElementById('hot').style.display = 'none';
  document.getElementById('configurePanel').classList.add('hidden');
  document.getElementById('messagePanel').style.display = 'none';
}

function showMessage(msg) {
  const panel = document.getElementById('messagePanel');
  panel.innerHTML = msg;
  panel.style.display = 'block';
  setTimeout(() => { panel.style.display = 'none'; }, 3000);
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

// 🛠 Initialize Extension
tableau.extensions.initializeAsync().then(() => {
  console.log('Extension Initialized');

  const allWs = tableau.extensions.dashboardContent.dashboard.worksheets;
  console.log('Worksheets found:', allWs.length);

  selectedWorksheetName = tableau.extensions.settings.get("worksheet");

  const select = document.getElementById('worksheetSelect');
  allWs.forEach(ws => {
    const option = document.createElement('option');
    option.value = ws.name;
    option.textContent = ws.name;
    if (ws.name === selectedWorksheetName) {
      option.selected = true;
    }
    select.appendChild(option);
  });

  showMainControls();
});


