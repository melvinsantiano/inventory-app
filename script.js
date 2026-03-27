// Grab elements
const addProductForm = document.getElementById('addProductForm');
const inventoryTableBody = document.querySelector('#inventoryTable tbody');
const totalValueDisplay = document.getElementById('totalValue');
const sortPriceBtn = document.getElementById('sortPrice');
const resetBtn = document.getElementById('resetInventory');
const fab = document.getElementById('fab');
const categoryFilter = document.getElementById('categoryFilter');

// Hamburger menu elements
const menuBtn = document.getElementById('menuBtn');
const menuDropdown = document.getElementById('menuDropdown');
const themeToggle = document.getElementById('themeToggle');
const showInstructionsBtn = document.getElementById('showInstructions');
const logo = document.getElementById('logo');

// Logo click to scroll to top
if (logo) {
  logo.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Modal elements
const confirmModal = document.getElementById('confirmModal');
const confirmYes = document.getElementById('confirmYes');
const confirmNo = document.getElementById('confirmNo');
const instructionsModal = document.getElementById('instructionsModal');
const closeInstructions = document.getElementById('closeInstructions');
const dailyStatsModal = document.getElementById('dailyStatsModal');
const showDailyStatsBtn = document.getElementById('showDailyStats');
const closeDailyStatsBtn = document.getElementById('closeDailyStats');

// Daily Stats functions
function getTodayKey() {
  const today = new Date();
  return `daily_${today.getFullYear()}_${today.getMonth()}_${today.getDate()}`;
}

function recordTransaction(type, productName, price, quantity = 1) {
  const todayKey = getTodayKey();
  let dailyData = JSON.parse(localStorage.getItem(todayKey)) || {
    sales: 0,
    revenue: 0,
    restocks: 0,
    restockCost: 0,
    transactions: []
  };
  
  const timestamp = new Date().toLocaleTimeString();
  
  if (type === 'sale') {
    dailyData.sales += quantity;
    dailyData.revenue += price * quantity;
    dailyData.transactions.unshift({
      type: 'sale',
      product: productName,
      price: price,
      quantity: quantity,
      time: timestamp
    });
  } else if (type === 'restock') {
    dailyData.restocks += quantity;
    dailyData.restockCost += price * quantity;
    dailyData.transactions.unshift({
      type: 'restock',
      product: productName,
      price: price,
      quantity: quantity,
      time: timestamp
    });
  }
  
  // Keep only last 50 transactions
  if (dailyData.transactions.length > 50) {
    dailyData.transactions = dailyData.transactions.slice(0, 50);
  }
  
  localStorage.setItem(todayKey, JSON.stringify(dailyData));
}

function displayDailyStats() {
  const todayKey = getTodayKey();
  const dailyData = JSON.parse(localStorage.getItem(todayKey)) || {
    sales: 0,
    revenue: 0,
    restocks: 0,
    restockCost: 0,
    transactions: []
  };
  
  const today = new Date();
  document.getElementById('dailyStatsDate').textContent = 
    `📅 ${today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`;
  
  document.getElementById('totalSalesCount').textContent = dailyData.sales;
  document.getElementById('totalRevenue').textContent = `₱${dailyData.revenue.toFixed(0)}`;
  document.getElementById('totalRestocks').textContent = dailyData.restocks;
  
  const netProfit = dailyData.revenue - dailyData.restockCost;
  const netProfitEl = document.getElementById('netProfit');
  netProfitEl.textContent = `₱${netProfit.toFixed(0)}`;
  netProfitEl.style.color = netProfit >= 0 ? '#155724' : '#721c24';
  
  // Display transactions
  const transactionList = document.getElementById('transactionList');
  if (dailyData.transactions.length === 0) {
    transactionList.innerHTML = '<div style="text-align: center; color: #888; padding: 20px;">No transactions today</div>';
  } else {
    transactionList.innerHTML = dailyData.transactions.map(t => `
      <div class="transaction-item">
        <span class="transaction-time">${t.time}</span>
        <span class="transaction-product">${t.product}</span>
        <span class="${t.type === 'sale' ? 'transaction-sale' : 'transaction-restock'}">
          ${t.type === 'sale' ? '-' : '+'}${t.quantity} (₱${(t.price * t.quantity).toFixed(0)})
        </span>
      </div>
    `).join('');
  }
  
  dailyStatsModal.classList.remove('hidden');
}

// Default sample products - for local testing
const defaultProducts = [
  { name: "Coca Cola", price: 25, stock: 50, category: "Drinks", history: [50] },
  { name: "Royal Cola", price: 25, stock: 45, category: "Drinks", history: [45] },
  { name: "Sprite", price: 25, stock: 40, category: "Drinks", history: [40] },
  { name: "Minute Maid", price: 30, stock: 35, category: "Drinks", history: [35] },
  { name: "Water Bottle", price: 15, stock: 60, category: "Drinks", history: [60] },
  { name: "Ligo Sardines", price: 35, stock: 25, category: "Canned Goods", history: [25] },
  { name: "San Marino Tuna", price: 45, stock: 20, category: "Canned Goods", history: [20] },
  { name: "Century Tuna", price: 50, stock: 18, category: "Canned Goods", history: [18] },
  { name: "Lucky Me Noodles", price: 12, stock: 80, category: "Noodles", history: [80] },
  { name: "Mangkok Noodles", price: 14, stock: 65, category: "Noodles", history: [65] },
  { name: "Piattos", price: 18, stock: 40, category: "Snacks", history: [40] },
  { name: "Chippy", price: 15, category: "Snacks", stock: 55, history: [55] },
  { name: "Oreo", price: 35, stock: 30, category: "Snacks", history: [30] },
  { name: "Rebo", price: 12, stock: 45, category: "Snacks", history: [45] },
  { name: "Cloud 9", price: 10, stock: 70, category: "Snacks", history: [70] },
  { name: "Knorr Sinigang", price: 8, stock: 90, category: "Condiments", history: [90] },
  { name: "Milo", price: 45, stock: 25, category: "Drinks", history: [25] },
  { name: "Nido Milk", price: 180, stock: 15, category: "Drinks", history: [15] },
  { name: "Prince Pancit Canton", price: 15, stock: 50, category: "Noodles", history: [50] },
  { name: "Monaco", price: 10, stock: 60, category: "Snacks", history: [60] },
  { name: "Fudgee Barr", price: 8, stock: 75, category: "Snacks", history: [75] },
  { name: "C2 Green", price: 22, stock: 30, category: "Drinks", history: [30] },
  { name: "Sting", price: 18, stock: 40, category: "Drinks", history: [40] },
  { name: "Tide Powder", price: 120, stock: 10, category: "Cleaning", history: [10] },
  { name: "Joy Dishwashing", price: 35, stock: 20, category: "Cleaning", history: [20] },
  { name: "Surf Powder", price: 45, stock: 15, category: "Cleaning", history: [15] },
  { name: "Silka Papaya", price: 85, stock: 12, category: "Personal Care", history: [12] },
  { name: "Cecure", price: 55, stock: 18, category: "Personal Care", history: [18] },
  { name: "Palmolive", price: 65, stock: 22, category: "Personal Care", history: [22] },
  { name: "Head & Shoulders", price: 150, stock: 8, category: "Personal Care", history: [8] },
  { name: "Datu Puti Vinegar", price: 18, stock: 35, category: "Condiments", history: [35] },
  { name: "Silver Swan Soy Sauce", price: 25, stock: 30, category: "Condiments", history: [30] },
  { name: "Mang Tomas", price: 30, stock: 25, category: "Condiments", history: [25] },
  { name: "Star Margarine", price: 45, stock: 20, category: "Breads & Bakery", history: [20] },
  { name: "Patchi Bread", price: 18, stock: 40, category: "Breads & Bakery", history: [40] },
  { name: "Gardenia White", price: 55, stock: 15, category: "Breads & Bakery", history: [15] },
  { name: "Heritage Loaf", price: 48, stock: 18, category: "Breads & Bakery", history: [18] },
  { name: "Premium Rice 5kg", price: 280, stock: 10, category: "Rice & Grains", history: [10] },
  { name: "Sinandomeng Rice 5kg", price: 250, stock: 12, category: "Rice & Grains", history: [12] },
  { name: "Red Rice 5kg", price: 300, stock: 8, category: "Rice & Grains", history: [8] }
];

// Store products in an array (and sync with localStorage)
let products = JSON.parse(localStorage.getItem('products'));

// Load default sample products only if no data exists in localStorage
if (!products || products.length === 0) {
  products = [...defaultProducts];
  localStorage.setItem('products', JSON.stringify(products));
}

// Sort state tracking
let priceSortAscending = true;
let stockSortAscending = true;
let nameSortAscending = true;

// Helper: Capitalize product names
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Function to render table
function renderTable() {
  inventoryTableBody.innerHTML = ''; 
  let totalValue = 0;

  products.forEach((product, index) => {
    totalValue += product.price * product.stock;

    const row = document.createElement('tr');
    if (product.stock < 5 && product.stock > 0) {
      row.classList.add('warning');
    }

    row.innerHTML = `
      <td>${capitalize(product.name)}</td>
      <td><span class="category-badge">${product.category}</span></td>
      <td>₱${product.price}</td>
      <td>${product.stock > 0 ? product.stock : "Out of Stock"}</td>
      <td>
        <button class="restock" onclick="restock(${index})">+</button>
        <button class="sale" onclick="sale(${index})">-</button>
        <button class="delete" onclick="deleteItem(${index})">🗑️</button>
      </td>
      <td>
        <canvas id="sparkline-${index}" width="100" height="30"></canvas>
        <div id="trend-${index}" class="trend-cell"></div>
      </td>
    `;

    inventoryTableBody.appendChild(row);

    // Draw sparkline for this product
    if (product.history && product.history.length > 0) {
      drawSparkline(`sparkline-${index}`, product.history);
      // Add trend indicator below sparkline
      const trendCell = document.getElementById(`trend-${index}`);
      if (trendCell) {
        addTrendIndicator(trendCell, product.history);
      }
    }
  });

  totalValueDisplay.textContent = `Total Value: ₱${totalValue}`;
  
  // Re-apply filters after render
  filterProducts();
}

// Add product form handler
addProductForm.addEventListener('submit', function(e) {
  e.preventDefault();

  const name = capitalize(document.getElementById('itemName').value.trim());
  const price = parseFloat(document.getElementById('itemPrice').value);
  const stock = parseInt(document.getElementById('itemStock').value);
  const category = document.getElementById('itemCategory').value;

  if (!name || price <= 0 || stock < 0 || !category) {
    alert("Please enter valid product details including a category.");
    return;
  }  
  // Check if product already exists (same name + price)
  const existingProduct = products.find(p => p.name === name && p.price === price);
  if (existingProduct) {
    existingProduct.stock += stock;
    existingProduct.history.push(existingProduct.stock);
    recordTransaction('restock', name, price, stock);
  } else {
    const newProduct = { name, price, stock, category, history: [stock] };
    products.push(newProduct);
    recordTransaction('restock', name, price, stock);
  }

  localStorage.setItem('products', JSON.stringify(products));
  updateCategoryFilter();
  renderTable();
  addProductForm.reset();
});

// Restock function
function restock(index) {
  products[index].stock += 1;
  products[index].history.push(products[index].stock);
  recordTransaction('restock', products[index].name, products[index].price, 1);
  localStorage.setItem('products', JSON.stringify(products));
  renderTable();
}

// Sale function
function sale(index) {
  if (products[index].stock > 0) {
    products[index].stock -= 1;
    products[index].history.push(products[index].stock);
    recordTransaction('sale', products[index].name, products[index].price, 1);
    localStorage.setItem('products', JSON.stringify(products));
    renderTable();
  }
}

// Delete function
function deleteItem(index) {
  products.splice(index, 1); // remove item
  localStorage.setItem('products', JSON.stringify(products));
  renderTable();
}

// Sort by Price (toggle ascending/descending)
sortPriceBtn.addEventListener('click', () => {
  priceSortAscending = !priceSortAscending;
  products.sort((a, b) => priceSortAscending ? a.price - b.price : b.price - a.price);
  localStorage.setItem('products', JSON.stringify(products));
  renderTable();
  sortPriceBtn.textContent = `Sort by Price ${priceSortAscending ? '↑' : '↓'}`;
});

// Sort by Stock (toggle ascending/descending)
let sortStockBtn;
function createSortStockButton() {
  const controls = document.getElementById('controls');
  sortStockBtn = document.createElement('button');
  sortStockBtn.id = 'sortStock';
  sortStockBtn.textContent = 'Sort by Stock ↑';
  sortStockBtn.style.background = '#6f42c1';
  sortStockBtn.style.color = 'white';
  sortStockBtn.addEventListener('click', () => {
    stockSortAscending = !stockSortAscending;
    products.sort((a, b) => stockSortAscending ? a.stock - b.stock : b.stock - a.stock);
    localStorage.setItem('products', JSON.stringify(products));
    renderTable();
    sortStockBtn.textContent = `Sort by Stock ${stockSortAscending ? '↑' : '↓'}`;
  });
  controls.insertBefore(sortStockBtn, document.getElementById('resetInventory'));
}

// Sort by Name (toggle A-Z / Z-A)
let sortNameBtn;
function createSortNameButton() {
  const controls = document.getElementById('controls');
  sortNameBtn = document.createElement('button');
  sortNameBtn.id = 'sortName';
  sortNameBtn.textContent = 'Sort by Name A→Z';
  sortNameBtn.style.background = '#17a2b8';
  sortNameBtn.style.color = 'white';
  sortNameBtn.addEventListener('click', () => {
    nameSortAscending = !nameSortAscending;
    products.sort((a, b) => nameSortAscending 
      ? a.name.localeCompare(b.name) 
      : b.name.localeCompare(a.name));
    localStorage.setItem('products', JSON.stringify(products));
    renderTable();
    sortNameBtn.textContent = `Sort by Name ${nameSortAscending ? 'A→Z' : 'Z→A'}`;
  });
  controls.insertBefore(sortNameBtn, document.getElementById('sortStock'));
}

// Initialize sort buttons after DOM loads
document.addEventListener('DOMContentLoaded', () => {
  createSortNameButton();
  createSortStockButton();
  updateCategoryFilter();
  
  // Menu search functionality
  const menuSearchInput = document.getElementById('menuSearchInput');
  if (menuSearchInput) {
    menuSearchInput.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase().replace('🔍 ', '');
      const rows = inventoryTableBody.querySelectorAll('tr');
      
      rows.forEach(row => {
        const itemName = row.cells[0].textContent.toLowerCase();
        if (itemName.includes(searchTerm)) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
      
      // Sync with main search input
      const mainSearch = document.getElementById('searchInput');
      if (mainSearch) mainSearch.value = searchTerm;
      
      // Show/hide clear button on main search
      const clearBtn = document.getElementById('clearSearch');
      if (clearBtn) {
        clearBtn.style.display = searchTerm.length > 0 ? 'inline-block' : 'none';
      }
    });
  }
});

// Reset Inventory with confirmation modal
resetBtn.addEventListener('click', () => {
  if (products.length === 0) {
    alert("No items listed to remove.");
    return;
  }
  confirmModal.classList.remove('hidden');
});

confirmYes.addEventListener('click', () => {
  products = [];
  localStorage.setItem('products', JSON.stringify(products));
  renderTable();
  confirmModal.classList.add('hidden');
});

// Click outside confirmation modal to close
confirmModal.addEventListener('click', (e) => {
  if (e.target === confirmModal) {
    confirmModal.classList.add('hidden');
  }
});

// Daily Stats Modal
showDailyStatsBtn.addEventListener('click', () => {
  displayDailyStats();
});

closeDailyStatsBtn.addEventListener('click', () => {
  dailyStatsModal.classList.add('hidden');
});

dailyStatsModal.addEventListener('click', (e) => {
  if (e.target === dailyStatsModal) {
    dailyStatsModal.classList.add('hidden');
  }
});

// Search functionality
const searchInput = document.getElementById('searchInput');
const clearSearchBtn = document.getElementById('clearSearch');

function filterProducts() {
  const searchTerm = searchInput.value.toLowerCase();
  const selectedCategory = categoryFilter.value;
  const rows = inventoryTableBody.querySelectorAll('tr');
  
  let hasResults = false;
  rows.forEach(row => {
    const itemName = row.cells[0].textContent.toLowerCase();
    const itemCategory = row.cells[1].textContent;
    
    const matchesSearch = itemName.includes(searchTerm);
    const matchesCategory = selectedCategory === '' || itemCategory === selectedCategory;
    
    if (matchesSearch && matchesCategory) {
      row.style.display = '';
      hasResults = true;
    } else {
      row.style.display = 'none';
    }
  });
  
  // Show/hide clear button
  if (searchTerm.length > 0 || selectedCategory !== '') {
    clearSearchBtn.style.display = 'inline-block';
  } else {
    clearSearchBtn.style.display = 'none';
  }
}

searchInput.addEventListener('input', filterProducts);

// Category filter functionality
categoryFilter.addEventListener('change', filterProducts);

// Update category filter dropdown with unique categories from products
function updateCategoryFilter() {
  const categories = [...new Set(products.map(p => p.category))].sort();
  categoryFilter.innerHTML = '<option value="">All Categories</option>';
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });
}

clearSearchBtn.addEventListener('click', () => {
  searchInput.value = '';
  categoryFilter.value = '';
  clearSearchBtn.style.display = 'none';
  renderTable(); // Re-render to show all
});

confirmNo.addEventListener('click', () => {
  confirmModal.classList.add('hidden');
});

// Floating Action Button scrolls to top and focuses input
fab.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
  setTimeout(() => {
    document.getElementById('itemName').focus();
  }, 500);
});

// Scroll to Bottom Button
const scrollBottomBtn = document.getElementById('scrollBottom');
scrollBottomBtn.addEventListener('click', () => {
  window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
});

// Hamburger menu toggle
menuBtn.addEventListener('click', () => {
  menuDropdown.classList.toggle('hidden');
});

// Hide dropdown when mouse leaves
menuDropdown.addEventListener('mouseleave', () => {
  menuDropdown.classList.add('hidden');
});

// Theme toggle
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-theme');
});

// Show instructions modal
showInstructionsBtn.addEventListener('click', () => {
  instructionsModal.classList.remove('hidden');
});

// Close instructions modal
closeInstructions.addEventListener('click', () => {
  instructionsModal.classList.add('hidden');
});

// Click outside modal to close
instructionsModal.addEventListener('click', (e) => {
  if (e.target === instructionsModal) {
    instructionsModal.classList.add('hidden');
  }
});

// Calculate trend data
function calculateTrend(data) {
  if (!data || data.length < 2) {
    return { direction: 'stable', percent: 0 };
  }
  
  const first = data[0];
  const last = data[data.length - 1];
  const diff = last - first;
  const percentChange = Math.round((diff / first) * 100);
  
  if (diff > 0) {
    return { direction: 'up', percent: percentChange };
  } else if (diff < 0) {
    return { direction: 'down', percent: Math.abs(percentChange) };
  } else {
    return { direction: 'stable', percent: 0 };
  }
}

// Sparkline drawing function
function drawSparkline(canvasId, data) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Determine line color based on trend
  const trend = calculateTrend(data);
  let lineColor = "#007bff"; // default blue
  if (trend.direction === 'up') {
    lineColor = "#28a745"; // green for increasing
  } else if (trend.direction === 'down') {
    lineColor = "#dc3545"; // red for decreasing
  }

  ctx.beginPath();
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 2;

  const maxVal = Math.max(...data);
  const minVal = Math.min(...data);
  const range = maxVal - minVal || 1;

  data.forEach((val, i) => {
    const x = (i / (data.length - 1)) * canvas.width;
    const y = canvas.height - ((val - minVal) / range) * canvas.height;
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });

  ctx.stroke();
}

// Add trend indicator to a cell
function addTrendIndicator(cell, data) {
  const trend = calculateTrend(data);
  let arrow = '➖'; // stable
  let colorClass = 'trend-stable';
  
  if (trend.direction === 'up') {
    arrow = '📈';
    colorClass = 'trend-up';
  } else if (trend.direction === 'down') {
    arrow = '📉';
    colorClass = 'trend-down';
  }
  
  const percentText = trend.percent > 0 ? `${trend.percent}%` : (trend.percent === 0 ? '0%' : `${trend.percent}%`);
  
  cell.innerHTML = `
    <span class="trend-indicator ${colorClass}">${arrow} ${percentText}</span>
  `;
}

// Initial render
renderTable();
