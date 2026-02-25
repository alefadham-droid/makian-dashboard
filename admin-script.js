let appData = null;

document.getElementById('load-btn')?.addEventListener('click', () => {
  const fileInput = document.getElementById('file-input');
  if (!fileInput.files.length) {
    alert('لطفاً یک فایل JSON انتخاب کنید.');
    return;
  }

  const reader = new FileReader();
  reader.onload = function(event) {
    try {
      appData = JSON.parse(event.target.result);
      renderDashboard(appData);
      document.getElementById('upload-section').style.display = 'none';
      document.getElementById('dashboard-section').style.display = 'block';
    } catch (e) {
      alert('خطا در خواندن فایل JSON: ' + e.message);
    }
  };
  reader.readAsText(fileInput.files[0]);
});

function renderDashboard(data) {
  renderTable('#users-table tbody', data.users || [], ['id', 'username', 'createdAt'], (item) => `<td>${item.id}</td><td>${item.username}</td><td>${item.createdAt}</td><td><button class="delete-btn" onclick="deleteItem('users', ${item.id})">حذف</button></td>`);
  renderTable('#halls-table tbody', data.halls || [], ['id', 'name', 'capacity', 'userId', 'createdDate'], (item) => `<td>${item.id}</td><td>${item.name}</td><td>${item.capacity}</td><td>${item.userId}</td><td>${item.createdDate}</td><td><button class="delete-btn" onclick="deleteItem('halls', "${item.id}")">حذف</button></td>`);
  renderTable('#reports-table tbody', data.reports || [], ['id', 'hallId', 'date', 'temperature', 'humidity', 'fanSpeed'], (item) => `<td>${item.id}</td><td>${item.hallId}</td><td>${item.date}</td><td>${item.temperature}</td><td>${item.humidity}</td><td>${item.fanSpeed}</td><td><button class="delete-btn" onclick="deleteItem('reports', "${item.id}")">حذف</button></td>`);
}

function renderTable(selector, items, fields, generateRowHtml) {
  const tbody = document.querySelector(selector);
  if (!tbody) return;
  tbody.innerHTML = '';
  items.forEach(item => {
    const row = document.createElement('tr');
    row.innerHTML = generateRowHtml(item);
    tbody.appendChild(row);
  });
}

function deleteItem(type, id) {
  if (!appData || !appData[type]) return;
  appData[type] = appData[type].filter(item => item.id !== id && item.id !== String(id));
  renderDashboard(appData);
  console.log(`Deleted ${type} with id ${id}`);
}

document.getElementById('export-btn')?.addEventListener('click', () => {
  if (!appData) {
    alert('ابتدا یک فایل بارگذاری کنید.');
    return;
  }
  const dataStr = JSON.stringify(appData, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'makian-data-edited.json';
  a.click();
  URL.revokeObjectURL(url);
});
