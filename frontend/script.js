const API_URL = 'http://localhost:5000/api/inventory';

const form = document.getElementById('item-form');
const nameInput = document.getElementById('name-input');
const stockInput = document.getElementById('stock-input');
const categoryInput = document.getElementById('category-input');
const list = document.getElementById('inventory-list');

// Tambah Barang
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = nameInput.value.trim();
  const stock = parseInt(stockInput.value);
  const category = categoryInput.value.trim();

  if (!name || isNaN(stock) || !category) return;

  await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, stock, category })
  });

  nameInput.value = '';
  stockInput.value = '';
  categoryInput.value = '';
  loadInventory();
});

// Tampilkan Daftar Barang
async function loadInventory() {
  const res = await fetch(API_URL);
  const items = await res.json();

  list.innerHTML = '';
  items.forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div class="item-info">
        <div>
          <strong>${item.name}</strong>
          <span class="badge">Kategori: ${item.category}</span>
        </div>
        <div><span class="stock">Stok: ${item.stock}</span></div>
      </div>
      <div class="item-actions">
        <button class="edit-btn" onclick="editItem(${item.id}, event)">Edit</button>
        <button onclick="deleteItem(${item.id})">Hapus</button>
      </div>
    `;
    list.appendChild(li);
  });
}

// Hapus Barang
async function deleteItem(id) {
  const konfirmasi = confirm("Apakah kamu yakin ingin menghapus barang ini?");
  if (!konfirmasi) return;

  await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  loadInventory();
}

// Edit Barang
function editItem(id, event) {
  const itemLi = event?.target?.closest('li');
  if (!itemLi) return;

  const nameEl = itemLi.querySelector('strong');
  const badgeEl = itemLi.querySelector('.badge');
  const stockEl = itemLi.querySelector('.stock');

  const name = nameEl?.textContent.trim() || '';
  const category = badgeEl?.textContent.replace('Kategori: ', '').trim() || '';
  const stock = parseInt(stockEl?.textContent.replace('Stok: ', '').trim()) || 0;

  itemLi.innerHTML = `
    <input type="text" id="edit-name-${id}" value="${name}">
    <input type="number" id="edit-stock-${id}" value="${stock}">
    <input type="text" id="edit-category-${id}" value="${category}">
    <button class="edit-btn" onclick="submitEdit(${id})">Simpan</button>
    <button onclick="loadInventory()">Batal</button>
  `;
}

// Simpan Perubahan Edit
async function submitEdit(id) {
  const name = document.getElementById(`edit-name-${id}`).value.trim();
  const stock = parseInt(document.getElementById(`edit-stock-${id}`).value);
  const category = document.getElementById(`edit-category-${id}`).value.trim();

  if (!name || isNaN(stock) || !category) return;

  await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, stock, category })
  });

  loadInventory();
}

// Load pertama kali
loadInventory();