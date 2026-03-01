/**
 * ============================================
 * KKFC ADMIN PANEL — JavaScript
 * Menu CRUD, Offers, Orders, Dashboard
 * ============================================
 */

// ========== HARDCODED SEED DATA (matches app.js menuData) ==========
const SEED_MENU = {
    icecream: {
        name: 'Ice Creams',
        type: 'icecream',
        items: [
            { id: 'ic1', name: 'Vanilla', desc: 'Classic creamy vanilla ice cream', prices: { '250g': 60, '500g': 110, '1kg': 200 }, image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400&q=80' },
            { id: 'ic2', name: 'Strawberry', desc: 'Fresh strawberry flavored delight', prices: { '250g': 60, '500g': 110, '1kg': 200 }, image: 'https://images.unsplash.com/photo-1557142046-c704a3adf364?w=400&q=80' },
            { id: 'ic3', name: 'Pista', desc: 'Rich pistachio ice cream', prices: { '250g': 60, '500g': 110, '1kg': 200 }, image: 'https://images.unsplash.com/photo-1629385701021-fcd568a743e8?w=400&q=80' },
            { id: 'ic4', name: 'Mango', desc: 'Tropical mango paradise', prices: { '250g': 70, '500g': 130, '1kg': 240 }, image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=400&q=80' },
            { id: 'ic5', name: 'Butterscotch', desc: 'Caramelized butterscotch crunch', prices: { '250g': 70, '500g': 130, '1kg': 240 }, image: 'https://images.unsplash.com/photo-1580915411954-282cb1b0d780?w=400&q=80' },
            { id: 'ic6', name: 'Sithaphal', desc: 'Exotic custard apple flavor', prices: { '250g': 100, '500g': 180, '1kg': 340 }, image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&q=80' },
            { id: 'ic7', name: 'Anjir', desc: 'Delicious fig ice cream', prices: { '250g': 100, '500g': 180, '1kg': 340 }, image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400&q=80' },
            { id: 'ic8', name: 'Kulfi', desc: 'Traditional Indian kulfi', prices: { '250g': 100, '500g': 180, '1kg': 340 }, image: 'https://images.unsplash.com/photo-1633933358116-a27b902fad35?w=400&q=80' },
            { id: 'ic9', name: 'American Nuts', desc: 'Loaded with premium nuts', prices: { '250g': 100, '500g': 180, '1kg': 340 }, image: 'https://images.unsplash.com/photo-1516559828984-fb3b99548b21?w=400&q=80' },
            { id: 'ic10', name: 'Nutty Caramel', desc: 'Caramel with crunchy nuts', prices: { '250g': 100, '500g': 180, '1kg': 340 }, image: 'https://images.unsplash.com/photo-1560008581-09826d1de69e?w=400&q=80' },
            { id: 'ic11', name: 'Mova Badam', desc: 'Banana almond fusion', prices: { '250g': 100, '500g': 180, '1kg': 340 }, image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=400&q=80' },
            { id: 'ic12', name: 'Kaju Barfi', desc: 'Inspired by classic Indian sweet', prices: { '250g': 100, '500g': 180, '1kg': 340 }, image: 'https://images.unsplash.com/photo-1488900128323-21503983a07e?w=400&q=80' },
            { id: 'ic13', name: 'Oreo', desc: 'Cookies and cream delight', prices: { '250g': 100, '500g': 180, '1kg': 340 }, image: 'https://images.unsplash.com/photo-1576506295286-5cda18df43e7?w=400&q=80' },
            { id: 'ic14', name: 'Fruit Salad', desc: 'Mixed fruit medley', prices: { '250g': 100, '500g': 180, '1kg': 340 }, image: 'https://images.unsplash.com/photo-1505394033641-40c6ad1178d7?w=400&q=80' },
            { id: 'ic15', name: 'Flooda', desc: 'Classic falooda ice cream', prices: { '250g': 100, '500g': 180, '1kg': 340 }, image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&q=80' }
        ]
    },
    shakes: {
        name: 'Milk Shakes & Thick Shakes',
        type: 'shakes',
        items: [
            { id: 'sh1', name: 'Pineapple Milk Shake', desc: 'Refreshing pineapple blend', price: 89, thickPrice: 149, image: 'https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?w=400&q=80' },
            { id: 'sh2', name: 'Guava Milk Shake', desc: 'Tropical guava goodness', price: 89, thickPrice: 149, image: 'https://images.unsplash.com/photo-1638176066666-ffb2f013c7dd?w=400&q=80' },
            { id: 'sh3', name: 'Mango Milk Shake', desc: 'King of fruits shake', price: 89, thickPrice: 149, image: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400&q=80' },
            { id: 'sh4', name: 'Tender Coconut Milk Shake', desc: 'Fresh coconut water blend', price: 89, thickPrice: 149, image: 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?w=400&q=80' },
            { id: 'sh5', name: 'Chikoo Milk Shake', desc: 'Sweet sapodilla shake', price: 89, thickPrice: 149, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&q=80' },
            { id: 'sh6', name: 'Jackfruit Milk Shake', desc: 'Exotic jackfruit flavor', price: 99, thickPrice: 169, image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=400&q=80' },
            { id: 'sh7', name: 'Avocado Milk Shake', desc: 'Creamy avocado blend', price: 99, thickPrice: 169, image: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400&q=80' },
            { id: 'sh8', name: 'Tender Coco Date Milk Shake', desc: 'Coconut and date fusion', price: 99, thickPrice: 169, image: 'https://images.unsplash.com/photo-1577805947697-89e18249d767?w=400&q=80' },
            { id: 'sh9', name: 'Passion Fruit Milk Shake', desc: 'Tangy passion fruit', price: 99, thickPrice: 169, image: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=400&q=80' },
            { id: 'sh10', name: 'Rajamsndri Rose Milk', desc: 'Traditional rose milk', price: 49, image: 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?w=400&q=80' },
            { id: 'sh11', name: 'Bandaru Badam Milk', desc: 'Rich almond milk', price: 49, image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80' },
            { id: 'sh12', name: 'Ice Crushed Drink', desc: 'Cool crushed ice drink', price: 49, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&q=80' }
        ]
    },
    chicken: {
        name: 'Chicken (KKFC)',
        type: 'chicken',
        items: [
            { id: 'ch1', name: 'Crispy Chicken Wings', desc: 'Golden crispy wings', sizes: { 'Small (4 Pcs)': 149, 'Medium (8 Pcs)': 279, 'Large (12 Pcs)': 398 }, image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&q=80' },
            { id: 'ch2', name: 'Crispy Chicken Drumsticks', desc: 'Juicy drumsticks', sizes: { 'Small (3 Pcs)': 329, 'Medium (6 Pcs)': 639, 'Large (9 Pcs)': 950 }, image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&q=80' },
            { id: 'ch3', name: 'Crispy Chicken Popcorn', desc: 'Bite-sized chicken pops', sizes: { 'Small (4 Pcs)': 149, 'Medium (8 Pcs)': 279, 'Large (12 Pcs)': 398 }, image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400&q=80' },
            { id: 'ch4', name: 'Crispy Boneless Strips', desc: 'Tender boneless strips', sizes: { 'Small (4 Pcs)': 149, 'Medium (8 Pcs)': 279, 'Large (12 Pcs)': 398 }, image: 'https://images.unsplash.com/photo-1585325701165-351af916e581?w=400&q=80' },
            { id: 'ch5', name: 'French Fries', desc: 'Crispy golden fries', sizes: { 'Small': 129, 'Medium': 239, 'Large': 339 }, image: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=400&q=80' },
            { id: 'ch6', name: 'Spring Potato', desc: 'Spiral cut potato', price: 50, image: 'https://images.unsplash.com/photo-1518013431117-eb1465fa5752?w=400&q=80' }
        ]
    },
    combos: {
        name: 'Combos',
        type: 'combos',
        items: [
            { id: 'cb1', name: 'Super Special Combo', desc: 'Hot & Crispy (4), Wings (8), Strips (8), Medium Pop Corn', price: 1099, image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&q=80' },
            { id: 'cb2', name: 'Family Bucket Combo', desc: 'Hot & Crispy (4), Wings (8), Strips (4), Regular Pop Corn', price: 839, image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400&q=80' },
            { id: 'cb3', name: 'Big Bucket Combo', desc: 'Hot & Crispy (4), Wings (8), Strips (4)', price: 699, image: 'https://images.unsplash.com/photo-1585325701165-351af916e581?w=400&q=80' },
            { id: 'cb4', name: 'Mini Bucket Combo', desc: 'Hot & Crispy (2), Wings (4), Regular Pop Corn', price: 419, image: 'https://images.unsplash.com/photo-1585325701165-351af916e581?w=400&q=80' },
            { id: 'cb5', name: 'Prawn Crumbed Balls', desc: 'Crispy prawn balls (6 Pcs)', price: 200, image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400&q=80' },
            { id: 'cb6', name: 'Bread Butterfly Shrimp', desc: 'Butterfly shrimp (6 Pcs)', price: 200, image: 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=400&q=80' },
            { id: 'cb7', name: 'Shrimp Spring Rolls', desc: 'Crispy spring rolls (6 Pcs)', price: 200, image: 'https://images.unsplash.com/photo-1606525437679-037aca74a3e9?w=400&q=80' },
            { id: 'cb8', name: 'Bread Popcorn', desc: 'Bread coated popcorn', price: 250, image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400&q=80' },
            { id: 'cb9', name: 'Shrimp Samosa', desc: 'Shrimp filled samosas (6 Pcs)', price: 250, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80' },
            { id: 'cb10', name: 'Fish Fingers', desc: 'Crispy fish fingers (6 Pcs)', price: 200, image: 'https://images.unsplash.com/photo-1580217593608-61931cefc821?w=400&q=80' },
            { id: 'cb11', name: 'Fish Cutlet', desc: 'Fish cutlets (4 Pcs)', price: 200, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80' },
            { id: 'cb12', name: 'Shrimp Rings', desc: 'Crispy shrimp rings', price: 250, image: 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=400&q=80' }
        ]
    }
};

const CATEGORY_NAMES = {
    icecream: 'Ice Creams',
    shakes: 'Shakes',
    chicken: 'Chicken',
    combos: 'Combos'
};

// ========== STATE ==========
let currentFilter = 'all';
let allMenuItems = [];
let allOffers = [];
let allOrders = [];
let unsubMenu = null;
let unsubOffers = null;
let unsubOrders = null;

// ========== INIT ==========
document.addEventListener('DOMContentLoaded', function() {
    // Auth state listener
    auth.onAuthStateChanged(function(user) {
        if (user) {
            showAdmin();
            startListeners();
        } else {
            showLogin();
            stopListeners();
        }
    });

    setupLoginForm();
    setupSidebar();
    setupMenuTab();
    setupOfferTab();
    setupOrderTab();
});

// ========== AUTH ==========
function setupLoginForm() {
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        var email = document.getElementById('loginEmail').value.trim();
        var pass = document.getElementById('loginPassword').value;
        var errEl = document.getElementById('loginError');
        var btn = document.getElementById('loginBtn');

        errEl.textContent = '';
        btn.disabled = true;
        btn.querySelector('span').textContent = 'Signing in...';

        auth.signInWithEmailAndPassword(email, pass)
            .then(function() {
                btn.disabled = false;
                btn.querySelector('span').textContent = 'Sign In';
            })
            .catch(function(err) {
                errEl.textContent = err.message.replace('Firebase: ', '');
                btn.disabled = false;
                btn.querySelector('span').textContent = 'Sign In';
            });
    });
}

function showLogin() {
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('adminApp').style.display = 'none';
}

function showAdmin() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminApp').style.display = 'flex';
}

function logout() {
    auth.signOut();
}

// ========== SIDEBAR & NAVIGATION ==========
function setupSidebar() {
    var navBtns = document.querySelectorAll('.sidebar-nav .nav-btn');
    navBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            switchTab(btn.dataset.tab);
        });
    });

    document.getElementById('logoutBtn').addEventListener('click', logout);
    document.getElementById('mobileLogoutBtn').addEventListener('click', logout);

    // Mobile toggle
    var toggle = document.getElementById('menuToggle');
    var sidebar = document.getElementById('sidebar');
    var overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);

    toggle.addEventListener('click', function() {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('active');
    });

    overlay.addEventListener('click', function() {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
    });
}

function switchTab(tabId) {
    // Update nav buttons
    document.querySelectorAll('.sidebar-nav .nav-btn').forEach(function(b) {
        b.classList.toggle('active', b.dataset.tab === tabId);
    });

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(function(t) {
        t.classList.toggle('active', t.id === 'tab-' + tabId);
    });

    // Close mobile sidebar
    document.getElementById('sidebar').classList.remove('open');
    var ov = document.querySelector('.sidebar-overlay');
    if (ov) ov.classList.remove('active');
}

// ========== REALTIME LISTENERS ==========
function startListeners() {
    // Menu — simple query, sort in JS to avoid composite index
    unsubMenu = menuRef.onSnapshot(function(snap) {
        allMenuItems = [];
        snap.forEach(function(doc) {
            allMenuItems.push({ id: doc.id, ...doc.data() });
        });
        // Sort by category then name in JS
        allMenuItems.sort(function(a, b) {
            if (a.category < b.category) return -1;
            if (a.category > b.category) return 1;
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
        });
        renderMenuGrid();
        updateDashboardStats();
    }, function(err) {
        console.error('Menu listener error:', err);
        document.getElementById('adminMenuGrid').innerHTML = '<div class="loading-state">Error loading menu: ' + err.message + '</div>';
    });

    // Offers
    unsubOffers = offersRef.onSnapshot(function(snap) {
        allOffers = [];
        snap.forEach(function(doc) {
            allOffers.push({ id: doc.id, ...doc.data() });
        });
        // Sort by createdAt desc in JS
        allOffers.sort(function(a, b) {
            var aTime = a.createdAt ? (a.createdAt.toMillis ? a.createdAt.toMillis() : new Date(a.createdAt).getTime()) : 0;
            var bTime = b.createdAt ? (b.createdAt.toMillis ? b.createdAt.toMillis() : new Date(b.createdAt).getTime()) : 0;
            return bTime - aTime;
        });
        renderOffersGrid();
        updateDashboardStats();
    }, function(err) {
        console.error('Offers listener error:', err);
    });

    // Orders
    unsubOrders = ordersRef.onSnapshot(function(snap) {
        allOrders = [];
        snap.forEach(function(doc) {
            allOrders.push({ id: doc.id, ...doc.data() });
        });
        // Sort by createdAt desc in JS
        allOrders.sort(function(a, b) {
            var aTime = a.createdAt ? (a.createdAt.toMillis ? a.createdAt.toMillis() : new Date(a.createdAt).getTime()) : 0;
            var bTime = b.createdAt ? (b.createdAt.toMillis ? b.createdAt.toMillis() : new Date(b.createdAt).getTime()) : 0;
            return bTime - aTime;
        });
        renderOrdersTable();
        renderRecentOrders();
        updateDashboardStats();
    }, function(err) {
        console.error('Orders listener error:', err);
    });
}

function stopListeners() {
    if (unsubMenu) unsubMenu();
    if (unsubOffers) unsubOffers();
    if (unsubOrders) unsubOrders();
}

// ========== DASHBOARD STATS ==========
function updateDashboardStats() {
    document.getElementById('statMenuItems').textContent = allMenuItems.length;
    document.getElementById('statActiveOffers').textContent = allOffers.filter(function(o) { return o.active; }).length;
    document.getElementById('statTotalOrders').textContent = allOrders.length;

    var today = new Date().toISOString().split('T')[0];
    var todayOrders = allOrders.filter(function(o) {
        if (!o.createdAt) return false;
        var d = o.createdAt.toDate ? o.createdAt.toDate() : new Date(o.createdAt);
        return d.toISOString().split('T')[0] === today;
    });
    document.getElementById('statTodayOrders').textContent = todayOrders.length;
}

// ========== MENU MANAGEMENT ==========
function setupMenuTab() {
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');
            currentFilter = btn.dataset.cat;
            renderMenuGrid();
        });
    });

    // Add item button
    document.getElementById('addMenuItemBtn').addEventListener('click', function() {
        openMenuItemModal();
    });

    // Seed menu button
    document.getElementById('seedMenuBtn').addEventListener('click', seedMenuToFirestore);

    // Category change in modal — toggle pricing fields
    document.getElementById('itemCategory').addEventListener('change', function() {
        updatePricingSection(this.value);
    });

    // Add size button (chicken)
    document.getElementById('addSizeBtn').addEventListener('click', addChickenSizeRow);

    // Form submit
    document.getElementById('menuItemForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveMenuItem();
    });
}

function renderMenuGrid() {
    var grid = document.getElementById('adminMenuGrid');
    var items = currentFilter === 'all' ? allMenuItems : allMenuItems.filter(function(i) { return i.category === currentFilter; });

    if (items.length === 0) {
        grid.innerHTML = '<div class="loading-state">No items found. Click "Add Item" or "Seed Menu" to get started.</div>';
        return;
    }

    grid.innerHTML = items.map(function(item) {
        var priceText = getItemPriceDisplay(item);
        var available = item.available !== false;
        return '<div class="menu-card ' + (available ? '' : 'unavailable') + '">' +
            '<div class="menu-card-img"><img src="' + (item.image || 'https://via.placeholder.com/400x200?text=No+Image') + '" alt="' + item.name + '" loading="lazy"></div>' +
            '<div class="menu-card-body">' +
                '<div class="menu-card-top">' +
                    '<span class="menu-card-name">' + item.name + '</span>' +
                    '<span class="menu-card-badge">' + (available ? (CATEGORY_NAMES[item.category] || item.category) : 'Unavailable') + '</span>' +
                '</div>' +
                '<div class="menu-card-desc">' + (item.desc || '') + '</div>' +
                '<div class="menu-card-price">' + priceText + '</div>' +
                '<div class="menu-card-actions">' +
                    '<button class="action-btn edit-btn" onclick="editMenuItem(\'' + item.id + '\')" title="Edit">✎ Edit</button>' +
                    '<button class="action-btn avail-btn' + (available ? '' : ' off') + '" onclick="toggleMenuAvailability(\'' + item.id + '\', ' + available + ')" title="' + (available ? 'Mark Unavailable' : 'Mark Available') + '">' + (available ? '✓ Available' : '✗ Unavailable') + '</button>' +
                    '<button class="action-btn delete-btn" onclick="deleteMenuItem(\'' + item.id + '\', \'' + item.name.replace(/'/g, "\\'") + '\')" title="Delete">🗑 Delete</button>' +
                '</div>' +
            '</div>' +
        '</div>';
    }).join('');
}

function getItemPriceDisplay(item) {
    if (item.prices) {
        var keys = Object.keys(item.prices);
        return keys.map(function(k) { return k + ': ₹' + item.prices[k]; }).join(' · ');
    }
    if (item.sizes) {
        var sKeys = Object.keys(item.sizes);
        return sKeys.map(function(k) { return '₹' + item.sizes[k]; }).join(' / ');
    }
    var parts = [];
    if (item.price) parts.push('₹' + item.price);
    if (item.thickPrice) parts.push('Thick: ₹' + item.thickPrice);
    return parts.join(' · ') || 'N/A';
}

function openMenuItemModal(item) {
    var modal = document.getElementById('menuItemModal');
    var title = document.getElementById('menuModalTitle');

    // Reset form
    document.getElementById('menuItemForm').reset();
    document.getElementById('editItemId').value = '';
    document.getElementById('itemAvailable').checked = true;

    // Reset chicken sizes to one row
    document.getElementById('chickenSizesContainer').innerHTML =
        '<div class="size-row">' +
            '<input type="text" placeholder="Size label (e.g. Small 4 Pcs)" class="size-label">' +
            '<input type="number" placeholder="Price ₹" class="size-price" min="0">' +
            '<button type="button" class="btn-icon remove-size" title="Remove">&times;</button>' +
        '</div>';

    if (item) {
        title.textContent = 'Edit Menu Item';
        document.getElementById('editItemId').value = item.id;
        document.getElementById('itemCategory').value = item.category || '';
        document.getElementById('itemName').value = item.name || '';
        document.getElementById('itemDesc').value = item.desc || '';
        document.getElementById('itemImage').value = item.image || '';
        document.getElementById('itemAvailable').checked = item.available !== false;

        updatePricingSection(item.category);

        // Fill pricing
        if (item.category === 'icecream' && item.prices) {
            document.getElementById('price250g').value = item.prices['250g'] || '';
            document.getElementById('price500g').value = item.prices['500g'] || '';
            document.getElementById('price1kg').value = item.prices['1kg'] || '';
        } else if (item.category === 'shakes') {
            document.getElementById('priceShake').value = item.price || '';
            document.getElementById('priceThick').value = item.thickPrice || '';
        } else if (item.category === 'chicken' && item.sizes) {
            var container = document.getElementById('chickenSizesContainer');
            container.innerHTML = '';
            Object.keys(item.sizes).forEach(function(label) {
                var row = document.createElement('div');
                row.className = 'size-row';
                row.innerHTML = '<input type="text" class="size-label" value="' + label + '">' +
                    '<input type="number" class="size-price" value="' + item.sizes[label] + '" min="0">' +
                    '<button type="button" class="btn-icon remove-size" title="Remove">&times;</button>';
                container.appendChild(row);
            });
        } else {
            document.getElementById('itemPrice').value = item.price || '';
        }
    } else {
        title.textContent = 'Add Menu Item';
        updatePricingSection('');
    }

    openModal('menuItemModal');
}

function updatePricingSection(cat) {
    document.getElementById('priceModeSingle').style.display = 'none';
    document.getElementById('priceModeIcecream').style.display = 'none';
    document.getElementById('priceModeShake').style.display = 'none';
    document.getElementById('priceModeChicken').style.display = 'none';

    switch (cat) {
        case 'icecream':
            document.getElementById('priceModeIcecream').style.display = 'block';
            break;
        case 'shakes':
            document.getElementById('priceModeShake').style.display = 'block';
            break;
        case 'chicken':
            document.getElementById('priceModeChicken').style.display = 'block';
            break;
        default:
            document.getElementById('priceModeSingle').style.display = 'block';
    }
}

function addChickenSizeRow() {
    var container = document.getElementById('chickenSizesContainer');
    var row = document.createElement('div');
    row.className = 'size-row';
    row.innerHTML = '<input type="text" placeholder="Size label" class="size-label">' +
        '<input type="number" placeholder="Price ₹" class="size-price" min="0">' +
        '<button type="button" class="btn-icon remove-size" title="Remove">&times;</button>';
    container.appendChild(row);
}

// Delegate remove-size clicks
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('remove-size')) {
        var container = document.getElementById('chickenSizesContainer');
        if (container.children.length > 1) {
            e.target.closest('.size-row').remove();
        }
    }
});

function saveMenuItem() {
    var id = document.getElementById('editItemId').value;
    var category = document.getElementById('itemCategory').value;
    var name = document.getElementById('itemName').value.trim();
    var desc = document.getElementById('itemDesc').value.trim();
    var image = document.getElementById('itemImage').value.trim();
    var available = document.getElementById('itemAvailable').checked;

    if (!category || !name) {
        showToast('Please fill category and name', 'error');
        return;
    }

    var data = {
        category: category,
        name: name,
        desc: desc,
        image: image,
        available: available,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    // Clear old pricing fields
    delete data.price;
    delete data.thickPrice;
    delete data.prices;
    delete data.sizes;

    // Set pricing based on category
    if (category === 'icecream') {
        data.prices = {
            '250g': Number(document.getElementById('price250g').value) || 0,
            '500g': Number(document.getElementById('price500g').value) || 0,
            '1kg': Number(document.getElementById('price1kg').value) || 0
        };
    } else if (category === 'shakes') {
        data.price = Number(document.getElementById('priceShake').value) || 0;
        var thick = Number(document.getElementById('priceThick').value);
        if (thick > 0) data.thickPrice = thick;
    } else if (category === 'chicken') {
        var sizeRows = document.querySelectorAll('#chickenSizesContainer .size-row');
        var hasSizes = false;
        var sizes = {};
        sizeRows.forEach(function(row) {
            var label = row.querySelector('.size-label').value.trim();
            var price = Number(row.querySelector('.size-price').value);
            if (label && price > 0) {
                sizes[label] = price;
                hasSizes = true;
            }
        });
        if (hasSizes) {
            data.sizes = sizes;
        } else {
            data.price = Number(document.getElementById('itemPrice').value) || 0;
        }
    } else {
        data.price = Number(document.getElementById('itemPrice').value) || 0;
    }

    var btn = document.getElementById('saveItemBtn');
    btn.disabled = true;
    btn.textContent = 'Saving...';

    var promise;
    if (id) {
        promise = menuRef.doc(id).update(data);
    } else {
        data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
        promise = menuRef.add(data);
    }

    promise.then(function() {
        showToast(id ? 'Item updated!' : 'Item added!');
        closeModal('menuItemModal');
        btn.disabled = false;
        btn.textContent = 'Save Item';
    }).catch(function(err) {
        showToast('Error: ' + err.message, 'error');
        btn.disabled = false;
        btn.textContent = 'Save Item';
    });
}

function editMenuItem(itemId) {
    var item = allMenuItems.find(function(i) { return i.id === itemId; });
    if (item) openMenuItemModal(item);
}

function toggleMenuAvailability(itemId, currentState) {
    menuRef.doc(itemId).update({ available: !currentState })
        .then(function() {
            showToast(currentState ? 'Item marked unavailable' : 'Item is now available');
        });
}

function deleteMenuItem(itemId, itemName) {
    if (!confirm('Delete "' + itemName + '"? This cannot be undone.')) return;
    menuRef.doc(itemId).delete()
        .then(function() { showToast('Item deleted'); })
        .catch(function(err) { showToast('Error: ' + err.message, 'error'); });
}

// Seed hardcoded menu to Firestore
function seedMenuToFirestore() {
    if (!confirm('This will upload all menu items from the hardcoded data to Firestore. Existing Firestore items will NOT be deleted. Continue?')) return;

    var batch = db.batch();
    var count = 0;

    Object.keys(SEED_MENU).forEach(function(catKey) {
        var cat = SEED_MENU[catKey];
        cat.items.forEach(function(item) {
            var docRef = menuRef.doc(item.id);
            var data = {
                category: catKey,
                name: item.name,
                desc: item.desc || '',
                image: item.image || '',
                available: true,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };

            if (item.prices) data.prices = item.prices;
            if (item.sizes) data.sizes = item.sizes;
            if (item.price !== undefined) data.price = item.price;
            if (item.thickPrice !== undefined) data.thickPrice = item.thickPrice;

            batch.set(docRef, data);
            count++;
        });
    });

    batch.commit()
        .then(function() {
            showToast(count + ' menu items uploaded to Firestore!');
        })
        .catch(function(err) {
            showToast('Seed error: ' + err.message, 'error');
        });
}

// ========== OFFERS MANAGEMENT ==========
function setupOfferTab() {
    document.getElementById('addOfferBtn').addEventListener('click', function() {
        openOfferModal();
    });

    document.getElementById('offerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveOffer();
    });
}

function renderOffersGrid() {
    var grid = document.getElementById('adminOffersGrid');
    if (allOffers.length === 0) {
        grid.innerHTML = '<div class="loading-state">No offers yet. Click "Add Offer" to create one.</div>';
        return;
    }

    grid.innerHTML = allOffers.map(function(offer) {
        var active = offer.active !== false;
        var typeLabel = { percent: '%', flat: '₹', bogo: 'BOGO', freebie: 'Free' }[offer.type] || '';
        var valueText = offer.type === 'percent' ? offer.value + '% OFF' :
                        offer.type === 'flat' ? '₹' + offer.value + ' OFF' :
                        offer.type === 'bogo' ? 'Buy 1 Get 1' : 'Free Item';
        var catText = offer.category === 'all' ? 'All Items' : (CATEGORY_NAMES[offer.category] || offer.category);
        var dateText = '';
        if (offer.startDate) dateText += offer.startDate;
        if (offer.endDate) dateText += ' → ' + offer.endDate;

        return '<div class="offer-card ' + (active ? '' : 'inactive') + '">' +
            '<div class="offer-card-title">' + offer.title + '</div>' +
            '<div class="offer-card-desc">' + (offer.desc || '') + '</div>' +
            '<div class="offer-card-meta">' +
                '<span>💰 ' + valueText + '</span>' +
                '<span>📦 ' + catText + '</span>' +
                (offer.code ? '<span>🏷️ ' + offer.code + '</span>' : '') +
                (dateText ? '<span>📅 ' + dateText + '</span>' : '') +
                (offer.minOrder ? '<span>Min ₹' + offer.minOrder + '</span>' : '') +
            '</div>' +
            '<div class="offer-card-actions">' +
                '<button class="btn-icon" onclick="editOffer(\'' + offer.id + '\')" title="Edit">✎</button>' +
                '<button class="btn-icon" onclick="toggleOffer(\'' + offer.id + '\', ' + active + ')" title="' + (active ? 'Disable' : 'Enable') + '">' + (active ? '✓' : '✗') + '</button>' +
                '<button class="btn-icon danger" onclick="deleteOffer(\'' + offer.id + '\')" title="Delete">🗑</button>' +
            '</div>' +
        '</div>';
    }).join('');
}

function openOfferModal(offer) {
    document.getElementById('offerForm').reset();
    document.getElementById('editOfferId').value = '';
    document.getElementById('offerActive').checked = true;

    if (offer) {
        document.getElementById('offerModalTitle').textContent = 'Edit Offer';
        document.getElementById('editOfferId').value = offer.id;
        document.getElementById('offerTitle').value = offer.title || '';
        document.getElementById('offerDesc').value = offer.desc || '';
        document.getElementById('offerType').value = offer.type || 'percent';
        document.getElementById('offerValue').value = offer.value || '';
        document.getElementById('offerCategory').value = offer.category || 'all';
        document.getElementById('offerMinOrder').value = offer.minOrder || '';
        document.getElementById('offerStart').value = offer.startDate || '';
        document.getElementById('offerEnd').value = offer.endDate || '';
        document.getElementById('offerCode').value = offer.code || '';
        document.getElementById('offerActive').checked = offer.active !== false;
    } else {
        document.getElementById('offerModalTitle').textContent = 'Add Offer';
    }

    openModal('offerModal');
}

function saveOffer() {
    var id = document.getElementById('editOfferId').value;
    var data = {
        title: document.getElementById('offerTitle').value.trim(),
        desc: document.getElementById('offerDesc').value.trim(),
        type: document.getElementById('offerType').value,
        value: Number(document.getElementById('offerValue').value) || 0,
        category: document.getElementById('offerCategory').value,
        minOrder: Number(document.getElementById('offerMinOrder').value) || 0,
        startDate: document.getElementById('offerStart').value || null,
        endDate: document.getElementById('offerEnd').value || null,
        code: document.getElementById('offerCode').value.trim().toUpperCase() || null,
        active: document.getElementById('offerActive').checked,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    if (!data.title) {
        showToast('Please enter offer title', 'error');
        return;
    }

    var promise;
    if (id) {
        promise = offersRef.doc(id).update(data);
    } else {
        data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
        promise = offersRef.add(data);
    }

    promise.then(function() {
        showToast(id ? 'Offer updated!' : 'Offer created!');
        closeModal('offerModal');
    }).catch(function(err) {
        showToast('Error: ' + err.message, 'error');
    });
}

function editOffer(offerId) {
    var offer = allOffers.find(function(o) { return o.id === offerId; });
    if (offer) openOfferModal(offer);
}

function toggleOffer(offerId, currentState) {
    offersRef.doc(offerId).update({ active: !currentState })
        .then(function() { showToast(currentState ? 'Offer disabled' : 'Offer enabled'); });
}

function deleteOffer(offerId) {
    if (!confirm('Delete this offer?')) return;
    offersRef.doc(offerId).delete()
        .then(function() { showToast('Offer deleted'); });
}

// ========== ORDERS MANAGEMENT ==========
function setupOrderTab() {
    document.getElementById('orderStatusFilter').addEventListener('change', function() {
        renderOrdersTable();
    });
}

function renderOrdersTable() {
    var filter = document.getElementById('orderStatusFilter').value;
    var orders = filter === 'all' ? allOrders : allOrders.filter(function(o) { return o.status === filter; });
    var tbody = document.getElementById('ordersBody');

    if (orders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" class="empty-cell">No orders found</td></tr>';
        return;
    }

    tbody.innerHTML = orders.map(function(order) {
        var date = order.createdAt ? (order.createdAt.toDate ? order.createdAt.toDate() : new Date(order.createdAt)) : new Date();
        var dateStr = date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' });
        var timeStr = date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
        var itemCount = order.items ? order.items.length : 0;
        var status = order.status || 'pending';

        return '<tr>' +
            '<td><strong>#' + (order.orderNumber || order.id.slice(-6).toUpperCase()) + '</strong></td>' +
            '<td>' + (order.customerName || '—') + '</td>' +
            '<td>' + (order.phone || '—') + '</td>' +
            '<td>' + itemCount + ' item' + (itemCount !== 1 ? 's' : '') + '</td>' +
            '<td><strong>₹' + (order.total || 0) + '</strong></td>' +
            '<td>' + (order.paymentMethod || '—') + '</td>' +
            '<td><span class="badge badge-' + status + '">' + status.charAt(0).toUpperCase() + status.slice(1) + '</span></td>' +
            '<td>' + dateStr + '<br><small>' + timeStr + '</small></td>' +
            '<td>' +
                '<button class="btn-icon" onclick="viewOrder(\'' + order.id + '\')" title="View">👁</button>' +
            '</td>' +
        '</tr>';
    }).join('');
}

function renderRecentOrders() {
    var tbody = document.getElementById('recentOrdersBody');
    var recent = allOrders.slice(0, 5);

    if (recent.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-cell">No orders yet</td></tr>';
        return;
    }

    tbody.innerHTML = recent.map(function(order) {
        var date = order.createdAt ? (order.createdAt.toDate ? order.createdAt.toDate() : new Date(order.createdAt)) : new Date();
        var timeStr = date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
        var itemCount = order.items ? order.items.length : 0;
        var status = order.status || 'pending';

        return '<tr>' +
            '<td><strong>#' + (order.orderNumber || order.id.slice(-6).toUpperCase()) + '</strong></td>' +
            '<td>' + (order.customerName || '—') + '</td>' +
            '<td>' + itemCount + ' items</td>' +
            '<td>₹' + (order.total || 0) + '</td>' +
            '<td><span class="badge badge-' + status + '">' + status.charAt(0).toUpperCase() + status.slice(1) + '</span></td>' +
            '<td>' + timeStr + '</td>' +
        '</tr>';
    }).join('');
}

function viewOrder(orderId) {
    var order = allOrders.find(function(o) { return o.id === orderId; });
    if (!order) return;

    var date = order.createdAt ? (order.createdAt.toDate ? order.createdAt.toDate() : new Date(order.createdAt)) : new Date();
    var dateStr = date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' + date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    var status = order.status || 'pending';

    var itemsHtml = '';
    if (order.items && order.items.length) {
        itemsHtml = '<ul class="order-items-list">' +
            order.items.map(function(item) {
                return '<li><span>' + item.name + (item.variant ? ' (' + item.variant + ')' : '') + ' × ' + item.qty + '</span><span>₹' + item.total + '</span></li>';
            }).join('') +
        '</ul>';
    }

    var body = document.getElementById('orderDetailBody');
    body.innerHTML = '<div class="order-detail-grid">' +
        '<div>' +
            '<div class="order-info-block"><h4>Order Number</h4><p>#' + (order.orderNumber || order.id.slice(-6).toUpperCase()) + '</p></div>' +
            '<div class="order-info-block"><h4>Customer</h4><p>' + (order.customerName || '—') + '</p></div>' +
            '<div class="order-info-block"><h4>Phone</h4><p>' + (order.phone || '—') + '</p></div>' +
            '<div class="order-info-block"><h4>Address</h4><p>' + (order.address || '—') + '</p></div>' +
        '</div>' +
        '<div>' +
            '<div class="order-info-block"><h4>Date</h4><p>' + dateStr + '</p></div>' +
            '<div class="order-info-block"><h4>Payment</h4><p>' + (order.paymentMethod || '—') + '</p></div>' +
            '<div class="order-info-block"><h4>Total</h4><p style="font-size:1.2rem;font-weight:700;color:var(--admin-orange);">₹' + (order.total || 0) + '</p></div>' +
            '<div class="order-info-block"><h4>Status</h4><span class="badge badge-' + status + '">' + status.charAt(0).toUpperCase() + status.slice(1) + '</span></div>' +
        '</div>' +
    '</div>' +
    '<div class="order-info-block" style="margin-top:1rem;"><h4>Items</h4>' + (itemsHtml || '<p>No items data</p>') + '</div>' +
    (order.notes ? '<div class="order-info-block"><h4>Notes</h4><p>' + order.notes + '</p></div>' : '') +
    '<div style="margin-top:1rem;">' +
        '<label style="font-size:0.8rem;font-weight:600;display:block;margin-bottom:0.35rem;">Update Status</label>' +
        '<select class="order-status-select" onchange="updateOrderStatus(\'' + order.id + '\', this.value)">' +
            '<option value="pending"' + (status === 'pending' ? ' selected' : '') + '>Pending</option>' +
            '<option value="confirmed"' + (status === 'confirmed' ? ' selected' : '') + '>Confirmed</option>' +
            '<option value="preparing"' + (status === 'preparing' ? ' selected' : '') + '>Preparing</option>' +
            '<option value="ready"' + (status === 'ready' ? ' selected' : '') + '>Ready</option>' +
            '<option value="delivered"' + (status === 'delivered' ? ' selected' : '') + '>Delivered</option>' +
            '<option value="cancelled"' + (status === 'cancelled' ? ' selected' : '') + '>Cancelled</option>' +
        '</select>' +
    '</div>';

    openModal('orderDetailModal');
}

function updateOrderStatus(orderId, newStatus) {
    ordersRef.doc(orderId).update({
        status: newStatus,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }).then(function() {
        showToast('Order status updated to ' + newStatus);
    }).catch(function(err) {
        showToast('Error: ' + err.message, 'error');
    });
}

// ========== MODAL HELPERS ==========
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Close modal on overlay click
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal-overlay') && e.target.classList.contains('active')) {
        e.target.classList.remove('active');
    }
});

// ========== TOAST ==========
function showToast(message, type) {
    var container = document.getElementById('toastContainer');
    var toast = document.createElement('div');
    toast.className = 'toast' + (type ? ' ' + type : '');
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(function() {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        toast.style.transition = '0.3s ease';
        setTimeout(function() { toast.remove(); }, 300);
    }, 3000);
}
