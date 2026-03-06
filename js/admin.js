/**
 * ============================================
 * KKFC ADMIN PANEL — JavaScript
 * Menu CRUD, Offers, Orders, Dashboard
 * ============================================
 */

// ========== SECURITY UTILITIES ==========
/**
 * Escape HTML special characters to prevent XSS
 * Must be used on ALL user-controlled data before inserting into innerHTML
 */
function escapeHTML(str) {
    if (str === null || str === undefined) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
}

/**
 * Sanitize a string for use inside an HTML attribute (onclick, etc.)
 */
function escapeAttr(str) {
    return escapeHTML(str).replace(/\\/g, '\\\\');
}

/**
 * Validate that a string is a safe ID (alphanumeric + hyphens only)
 */
function isSafeId(str) {
    return /^[a-zA-Z0-9_-]+$/.test(str);
}

// Login rate limiting state
var _loginAttempts = 0;
var _loginLockUntil = 0;
var MAX_LOGIN_ATTEMPTS = 5;
var LOGIN_LOCKOUT_MS = 60000; // 1 minute lockout

// ========== HARDCODED SEED DATA (matches app.js menuData) ==========
const SEED_MENU = {
    icecream: {
        name: 'Ice Creams',
        type: 'icecream',
        items: [
            { id: 'ic1', name: 'Vanilla', desc: 'Classic creamy vanilla ice cream', prices: { '250g': 60, '500g': 110, '1kg': 200 }, image: 'images/icecream/vanilla.webp' },
            { id: 'ic2', name: 'Strawberry', desc: 'Fresh strawberry flavored delight', prices: { '250g': 60, '500g': 110, '1kg': 200 }, image: 'images/icecream/strawberry.webp' },
            { id: 'ic3', name: 'Pista', desc: 'Rich pistachio ice cream', prices: { '250g': 60, '500g': 110, '1kg': 200 }, image: 'images/icecream/pista.webp' },
            { id: 'ic4', name: 'Mango', desc: 'Tropical mango paradise', prices: { '250g': 70, '500g': 130, '1kg': 240 }, image: 'images/icecream/mango.webp' },
            { id: 'ic5', name: 'Butterscotch', desc: 'Caramelized butterscotch crunch', prices: { '250g': 70, '500g': 130, '1kg': 240 }, image: 'images/icecream/butterscotch.webp' },
            { id: 'ic6', name: 'Sithaphal', desc: 'Exotic custard apple flavor', prices: { '250g': 100, '500g': 180, '1kg': 340 }, image: 'images/icecream/sithaphal.webp' },
            { id: 'ic7', name: 'Anjir', desc: 'Delicious fig ice cream', prices: { '250g': 100, '500g': 180, '1kg': 340 }, image: 'images/icecream/anjir.webp' },
            { id: 'ic8', name: 'Kulfi', desc: 'Traditional Indian kulfi', prices: { '250g': 100, '500g': 180, '1kg': 340 }, image: 'images/icecream/kulfi.webp' },
            { id: 'ic9', name: 'American Nuts', desc: 'Loaded with premium nuts', prices: { '250g': 100, '500g': 180, '1kg': 340 }, image: 'images/icecream/american-nuts.webp' },
            { id: 'ic10', name: 'Nutty Caramel', desc: 'Caramel with crunchy nuts', prices: { '250g': 100, '500g': 180, '1kg': 340 }, image: 'images/icecream/nutty-caramel.webp' },
            { id: 'ic11', name: 'Mova Badam', desc: 'Banana almond fusion', prices: { '250g': 100, '500g': 180, '1kg': 340 }, image: 'images/icecream/mova-badam.webp' },
            { id: 'ic12', name: 'Kaju Barfi', desc: 'Inspired by classic Indian sweet', prices: { '250g': 100, '500g': 180, '1kg': 340 }, image: 'images/icecream/kaju-barfi.webp' },
            { id: 'ic13', name: 'Oreo', desc: 'Cookies and cream delight', prices: { '250g': 100, '500g': 180, '1kg': 340 }, image: 'images/icecream/oreo.webp' },
            { id: 'ic14', name: 'Fruit Salad', desc: 'Mixed fruit medley', prices: { '250g': 100, '500g': 180, '1kg': 340 }, image: 'images/icecream/fruit-salad.webp' },
            { id: 'ic15', name: 'Flooda', desc: 'Classic falooda ice cream', prices: { '250g': 100, '500g': 180, '1kg': 340 }, image: 'images/icecream/falooda.webp' }
        ]
    },
    shakes: {
        name: 'Milk Shakes & Thick Shakes',
        type: 'shakes',
        items: [
            { id: 'sh1', name: 'Pineapple Milk Shake', desc: 'Refreshing pineapple blend', price: 89, thickPrice: 149, image: 'images/shakes/pineapple-shake.webp' },
            { id: 'sh2', name: 'Guava Milk Shake', desc: 'Tropical guava goodness', price: 89, thickPrice: 149, image: 'images/shakes/guava-shake.webp' },
            { id: 'sh3', name: 'Mango Milk Shake', desc: 'King of fruits shake', price: 89, thickPrice: 149, image: 'images/shakes/mango-shake.webp' },
            { id: 'sh4', name: 'Tender Coconut Milk Shake', desc: 'Fresh coconut water blend', price: 89, thickPrice: 149, image: 'images/shakes/tender-coconut-shake.webp' },
            { id: 'sh5', name: 'Chikoo Milk Shake', desc: 'Sweet sapodilla shake', price: 89, thickPrice: 149, image: 'images/shakes/chikoo-shake.webp' },
            { id: 'sh6', name: 'Jackfruit Milk Shake', desc: 'Exotic jackfruit flavor', price: 99, thickPrice: 169, image: 'images/shakes/jackfruit-shake.webp' },
            { id: 'sh7', name: 'Avocado Milk Shake', desc: 'Creamy avocado blend', price: 99, thickPrice: 169, image: 'images/shakes/avocado-shake.webp' },
            { id: 'sh8', name: 'Tender Coco Date Milk Shake', desc: 'Coconut and date fusion', price: 99, thickPrice: 169, image: 'images/shakes/tender-coco-date-shake.webp' },
            { id: 'sh9', name: 'Passion Fruit Milk Shake', desc: 'Tangy passion fruit', price: 99, thickPrice: 169, image: 'images/shakes/passion-fruit-shake.webp' },
            { id: 'sh10', name: 'Rajamsndri Rose Milk', desc: 'Traditional rose milk', price: 49, image: 'images/shakes/rose-milk.webp' },
            { id: 'sh11', name: 'Bandaru Badam Milk', desc: 'Rich almond milk', price: 49, image: 'images/shakes/badam-milk.webp' },
            { id: 'sh12', name: 'Ice Crushed Drink', desc: 'Cool crushed ice drink', price: 49, image: 'images/shakes/ice-crushed-drink.webp' },
            { id: 'sh13', name: 'Chocolate Milk Shake', desc: 'Rich chocolate blend', price: 99, thickPrice: 169, image: 'images/shakes/chocolate-shake.webp' }
        ]
    },
    chicken: {
        name: 'Chicken (KKFC)',
        type: 'chicken',
        items: [
            { id: 'ch1', name: 'Crispy Chicken Wings', desc: 'Golden crispy wings', sizes: { 'Small (4 Pcs)': 149, 'Medium (8 Pcs)': 279, 'Large (12 Pcs)': 398 }, image: 'images/chicken/crispy-wings.webp' },
            { id: 'ch2', name: 'Crispy Chicken Drumsticks', desc: 'Juicy drumsticks', sizes: { 'Small (3 Pcs)': 329, 'Medium (6 Pcs)': 639, 'Large (9 Pcs)': 950 }, image: 'images/chicken/drumsticks.webp' },
            { id: 'ch3', name: 'Crispy Chicken Popcorn', desc: 'Bite-sized chicken pops', sizes: { 'Small (4 Pcs)': 149, 'Medium (8 Pcs)': 279, 'Large (12 Pcs)': 398 }, image: 'images/chicken/chicken-popcorn.webp' },
            { id: 'ch4', name: 'Crispy Boneless Strips', desc: 'Tender boneless strips', sizes: { 'Small (4 Pcs)': 149, 'Medium (8 Pcs)': 279, 'Large (12 Pcs)': 398 }, image: 'images/chicken/boneless-strips.webp' },
            { id: 'ch5', name: 'French Fries', desc: 'Crispy golden fries', sizes: { 'Small': 129, 'Medium': 239, 'Large': 339 }, image: 'images/chicken/french-fries.webp' },
            { id: 'ch6', name: 'Spring Potato', desc: 'Spiral cut potato', price: 50, image: 'images/chicken/spring-potato.webp' }
        ]
    },
    combos: {
        name: 'Combos',
        type: 'combos',
        items: [
            { id: 'cb1', name: 'Super Special Combo', desc: 'Hot & Crispy (4), Wings (8), Strips (8), Medium Pop Corn', price: 1099, image: 'images/combos/super-special-combo.webp' },
            { id: 'cb2', name: 'Family Bucket Combo', desc: 'Hot & Crispy (4), Wings (8), Strips (4), Regular Pop Corn', price: 839, image: 'images/combos/family-bucket-combo.webp' },
            { id: 'cb3', name: 'Big Bucket Combo', desc: 'Hot & Crispy (4), Wings (8), Strips (4)', price: 699, image: 'images/combos/big-bucket-combo.webp' },
            { id: 'cb4', name: 'Mini Bucket Combo', desc: 'Hot & Crispy (2), Wings (4), Regular Pop Corn', price: 419, image: 'images/combos/mini-bucket-combo.webp' }
        ]
    },
    protein: {
        name: 'High Protein Combo',
        type: 'protein',
        items: [
            { id: 'hp1', name: 'Bread Butterfly Shrimp', desc: 'Butterfly shrimp (6 Pcs)', price: 200, image: 'images/protein/bread-butterfly-shrimp.webp' },
            { id: 'hp2', name: 'Bread Popcorn', desc: 'Bread coated popcorn', price: 250, image: 'images/protein/bread-popcorn.webp' },
            { id: 'hp3', name: 'Fish Cutlet', desc: 'Fish cutlets (4 Pcs)', price: 200, image: 'images/protein/fish-cutlet.webp' },
            { id: 'hp4', name: 'Fish Fingers', desc: 'Crispy fish fingers (6 Pcs)', price: 200, image: 'images/protein/fish-fingers.webp' },
            { id: 'hp5', name: 'Prawn Crumbed Balls', desc: 'Crispy prawn balls (6 Pcs)', price: 200, image: 'images/protein/prawn-crumbed-balls.webp' },
            { id: 'hp6', name: 'Shrimp Rings', desc: 'Crispy shrimp rings', price: 250, image: 'images/protein/shrimp-rings.webp' },
            { id: 'hp7', name: 'Shrimp Samosa', desc: 'Shrimp filled samosas (6 Pcs)', price: 250, image: 'images/protein/shrimp-samosa.webp' },
            { id: 'hp8', name: 'Shrimp Spring Rolls', desc: 'Crispy spring rolls (6 Pcs)', price: 200, image: 'images/protein/shrimp-spring-rolls.webp' }
        ]
    }
};

const CATEGORY_NAMES = {
    icecream: 'Ice Creams',
    shakes: 'Shakes',
    chicken: 'Chicken',
    combos: 'Combos',
    protein: 'High Protein'
};

// ========== STATE ==========
let currentFilter = 'all';
let allMenuItems = [];
let allOffers = [];
let allOrders = [];
let unsubMenu = null;
let unsubOffers = null;
let unsubOrders = null;
let selectedMenuItems = new Set();

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
    setupBulkActions();
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

        // Rate limiting: check if locked out
        if (_loginLockUntil > Date.now()) {
            var secsLeft = Math.ceil((_loginLockUntil - Date.now()) / 1000);
            errEl.textContent = 'Too many attempts. Try again in ' + secsLeft + 's.';
            return;
        }

        // Basic input validation
        if (!email || !pass) {
            errEl.textContent = 'Please enter email and password.';
            return;
        }

        // reCAPTCHA validation
        if (typeof grecaptcha !== 'undefined' && grecaptcha.enterprise) {
            var captchaResponse = grecaptcha.enterprise.getResponse();
            if (!captchaResponse) {
                errEl.textContent = 'Please complete the reCAPTCHA.';
                return;
            }
        }

        btn.disabled = true;
        btn.querySelector('span').textContent = 'Signing in...';

        auth.signInWithEmailAndPassword(email, pass)
            .then(function() {
                _loginAttempts = 0; // Reset on success
                btn.disabled = false;
                btn.querySelector('span').textContent = 'Sign In';
            })
            .catch(function(err) {
                _loginAttempts++;
                if (_loginAttempts >= MAX_LOGIN_ATTEMPTS) {
                    _loginLockUntil = Date.now() + LOGIN_LOCKOUT_MS;
                    errEl.textContent = 'Too many failed attempts. Locked for 1 minute.';
                    _loginAttempts = 0;
                } else {
                    // Generic error message — never reveal if email exists
                    errEl.textContent = 'Invalid email or password.';
                }
                btn.disabled = false;
                btn.querySelector('span').textContent = 'Sign In';
                if (typeof grecaptcha !== 'undefined' && grecaptcha.enterprise) grecaptcha.enterprise.reset();
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
        document.getElementById('adminMenuGrid').innerHTML = '<div class="loading-state">Error loading menu. Please refresh.</div>';
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
    var activeOffers = allOffers.filter(function(o) { return o.active; }).length;
    document.getElementById('statActiveOffers').textContent = activeOffers;
    document.getElementById('statTotalOrders').textContent = allOrders.length;

    var today = new Date().toISOString().split('T')[0];
    var todayOrders = allOrders.filter(function(o) {
        if (!o.createdAt) return false;
        var d = o.createdAt.toDate ? o.createdAt.toDate() : new Date(o.createdAt);
        return d.toISOString().split('T')[0] === today;
    });
    document.getElementById('statTodayOrders').textContent = todayOrders.length;

    // Dashboard greeting based on time
    var greetEl = document.getElementById('dashGreeting');
    if (greetEl) {
        var hour = new Date().getHours();
        var greeting = hour < 12 ? 'Good morning!' : hour < 17 ? 'Good afternoon!' : 'Good evening!';
        greetEl.textContent = greeting;
    }

    // Animate stat bar fills
    var maxMenu = 50, maxOffers = 10, maxOrders = 100, maxToday = 20;
    setStatBarWidth('statMenuItems', allMenuItems.length, maxMenu);
    setStatBarWidth('statActiveOffers', activeOffers, maxOffers);
    setStatBarWidth('statTotalOrders', allOrders.length, maxOrders);
    setStatBarWidth('statTodayOrders', todayOrders.length, maxToday);

    // Update filter counts
    updateFilterCounts();

    // Update revenue analytics
    updateRevenueAnalytics();

    // Update popular items
    renderPopularItems();
}

function setStatBarWidth(statId, value, max) {
    var el = document.getElementById(statId);
    if (!el) return;
    var card = el.closest('.stat-card');
    if (!card) return;
    var fill = card.querySelector('.stat-bar-fill');
    if (fill) fill.style.width = Math.min((value / max) * 100, 100) + '%';
}

function updateFilterCounts() {
    var counts = { all: allMenuItems.length, icecream: 0, shakes: 0, chicken: 0, combos: 0, protein: 0 };
    allMenuItems.forEach(function(item) {
        if (counts[item.category] !== undefined) counts[item.category]++;
    });
    var map = { all: 'countAll', icecream: 'countIcecream', shakes: 'countShakes', chicken: 'countChicken', combos: 'countCombos', protein: 'countProtein' };
    Object.keys(map).forEach(function(key) {
        var el = document.getElementById(map[key]);
        if (el) el.textContent = counts[key];
    });
    var countEl = document.getElementById('menuItemCount');
    if (countEl) countEl.textContent = allMenuItems.length + ' items';
}

// ========== REVENUE ANALYTICS ==========
function updateRevenueAnalytics() {
    var now = new Date();
    var todayStr = now.toISOString().split('T')[0];

    // Helper to get date from order
    function getOrderDate(order) {
        if (!order.createdAt) return null;
        return order.createdAt.toDate ? order.createdAt.toDate() : new Date(order.createdAt);
    }

    // Helper: start of week (Monday)
    function getWeekStart(d) {
        var date = new Date(d);
        var day = date.getDay();
        var diff = day === 0 ? 6 : day - 1;
        date.setDate(date.getDate() - diff);
        date.setHours(0, 0, 0, 0);
        return date;
    }

    // Helper: start of month
    function getMonthStart(d) {
        return new Date(d.getFullYear(), d.getMonth(), 1);
    }

    var todayRevenue = 0, weekRevenue = 0, monthRevenue = 0;
    var prevTodayRevenue = 0, prevWeekRevenue = 0, prevMonthRevenue = 0;
    var todayCount = 0, totalRevenue = 0;

    var weekStart = getWeekStart(now);
    var monthStart = getMonthStart(now);

    // Previous period boundaries
    var yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    var yesterdayStr = yesterday.toISOString().split('T')[0];

    var prevWeekStart = new Date(weekStart);
    prevWeekStart.setDate(prevWeekStart.getDate() - 7);

    var prevMonthStart = new Date(monthStart);
    prevMonthStart.setMonth(prevMonthStart.getMonth() - 1);

    allOrders.forEach(function(order) {
        var d = getOrderDate(order);
        if (!d) return;
        var total = parseFloat(order.total) || 0;
        var dateStr = d.toISOString().split('T')[0];
        totalRevenue += total;

        // Today
        if (dateStr === todayStr) {
            todayRevenue += total;
            todayCount++;
        }
        // Yesterday (for trend)
        if (dateStr === yesterdayStr) {
            prevTodayRevenue += total;
        }
        // This week
        if (d >= weekStart) {
            weekRevenue += total;
        }
        // Previous week (for trend)
        if (d >= prevWeekStart && d < weekStart) {
            prevWeekRevenue += total;
        }
        // This month
        if (d >= monthStart) {
            monthRevenue += total;
        }
        // Previous month (for trend)
        if (d >= prevMonthStart && d < monthStart) {
            prevMonthRevenue += total;
        }
    });

    var avgOrder = allOrders.length > 0 ? Math.round(totalRevenue / allOrders.length) : 0;

    // Format currency
    function formatCurrency(val) {
        if (val >= 100000) return '₹' + (val / 100000).toFixed(1) + 'L';
        if (val >= 1000) return '₹' + (val / 1000).toFixed(1) + 'K';
        return '₹' + Math.round(val);
    }

    // Calc trend percentage
    function getTrend(current, previous) {
        if (previous === 0 && current === 0) return { text: '—', cls: '' };
        if (previous === 0) return { text: '↑ New', cls: 'up' };
        var pct = Math.round(((current - previous) / previous) * 100);
        if (pct > 0) return { text: '↑ ' + pct + '%', cls: 'up' };
        if (pct < 0) return { text: '↓ ' + Math.abs(pct) + '%', cls: 'down' };
        return { text: '→ 0%', cls: '' };
    }

    // Update DOM
    var elToday = document.getElementById('revToday');
    var elWeek = document.getElementById('revWeek');
    var elMonth = document.getElementById('revMonth');
    var elAvg = document.getElementById('revAvgOrder');
    if (elToday) elToday.textContent = formatCurrency(todayRevenue);
    if (elWeek) elWeek.textContent = formatCurrency(weekRevenue);
    if (elMonth) elMonth.textContent = formatCurrency(monthRevenue);
    if (elAvg) elAvg.textContent = formatCurrency(avgOrder);

    // Update trends
    var trendToday = getTrend(todayRevenue, prevTodayRevenue);
    var trendWeek = getTrend(weekRevenue, prevWeekRevenue);
    var trendMonth = getTrend(monthRevenue, prevMonthRevenue);

    function setTrend(id, trend) {
        var el = document.getElementById(id);
        if (!el) return;
        el.textContent = trend.text;
        el.className = 'revenue-trend ' + trend.cls;
    }
    setTrend('revTodayTrend', trendToday);
    setTrend('revWeekTrend', trendWeek);
    setTrend('revMonthTrend', trendMonth);
}

// ========== POPULAR ITEMS ==========
function renderPopularItems() {
    var container = document.getElementById('popularItemsList');
    if (!container) return;

    if (allOrders.length === 0) {
        container.innerHTML = '<div class="loading-state">No order data yet</div>';
        return;
    }

    // Aggregate items from all orders
    var itemMap = {};
    allOrders.forEach(function(order) {
        if (!order.items || !order.items.length) return;
        order.items.forEach(function(item) {
            var key = item.name || 'Unknown';
            if (!itemMap[key]) {
                itemMap[key] = { name: key, count: 0, revenue: 0 };
            }
            itemMap[key].count += (item.qty || 1);
            itemMap[key].revenue += (parseFloat(item.total) || 0);
        });
    });

    // Sort by order count, take top 5
    var sorted = Object.values(itemMap).sort(function(a, b) { return b.count - a.count; });
    var top5 = sorted.slice(0, 5);

    if (top5.length === 0) {
        container.innerHTML = '<div class="loading-state">No item data in orders</div>';
        return;
    }

    var maxCount = top5[0].count;
    var rankEmojis = ['🥇', '🥈', '🥉'];

    container.innerHTML = top5.map(function(item, i) {
        var barWidth = Math.round((item.count / maxCount) * 100);
        var rankLabel = i < 3 ? rankEmojis[i] : '<span class="popular-rank">' + (i + 1) + '</span>';
        return '<div class="popular-item">' +
            '<div class="popular-item-rank">' + rankLabel + '</div>' +
            '<div class="popular-item-info">' +
                '<div class="popular-item-name">' + escapeHTML(item.name) + '</div>' +
                '<div class="popular-item-bar"><div class="popular-item-bar-fill" style="width:' + barWidth + '%"></div></div>' +
            '</div>' +
            '<div class="popular-item-stats">' +
                '<span class="popular-item-count">' + item.count + ' sold</span>' +
                '<span class="popular-item-rev">₹' + Math.round(item.revenue) + '</span>' +
            '</div>' +
        '</div>';
    }).join('');
}

// ========== BULK MENU ACTIONS ==========
function setupBulkActions() {
    var bar = document.getElementById('bulkActionBar');
    if (!bar) return;

    document.getElementById('bulkSelectAll').addEventListener('click', function() {
        var items = getFilteredMenuItems();
        if (selectedMenuItems.size === items.length && items.length > 0) {
            // Deselect all
            selectedMenuItems.clear();
        } else {
            // Select all visible
            items.forEach(function(item) { selectedMenuItems.add(item.id); });
        }
        updateBulkUI();
        updateMenuCardCheckboxes();
    });

    document.getElementById('bulkAvailableBtn').addEventListener('click', function() {
        bulkUpdateAvailability(true);
    });

    document.getElementById('bulkUnavailableBtn').addEventListener('click', function() {
        bulkUpdateAvailability(false);
    });

    document.getElementById('bulkDeleteBtn').addEventListener('click', function() {
        bulkDeleteItems();
    });

    document.getElementById('bulkCancelBtn').addEventListener('click', function() {
        selectedMenuItems.clear();
        updateBulkUI();
        updateMenuCardCheckboxes();
    });
}

function getFilteredMenuItems() {
    var items = currentFilter === 'all' ? allMenuItems : allMenuItems.filter(function(i) { return i.category === currentFilter; });
    var searchInput = document.getElementById('adminMenuSearch');
    var query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    if (query) {
        items = items.filter(function(i) {
            return (i.name && i.name.toLowerCase().indexOf(query) !== -1) ||
                   (i.desc && i.desc.toLowerCase().indexOf(query) !== -1) ||
                   (i.category && i.category.toLowerCase().indexOf(query) !== -1);
        });
    }
    return items;
}

function toggleMenuItemSelection(itemId) {
    if (selectedMenuItems.has(itemId)) {
        selectedMenuItems.delete(itemId);
    } else {
        selectedMenuItems.add(itemId);
    }
    updateBulkUI();
    updateMenuCardCheckboxes();
}

function updateBulkUI() {
    var bar = document.getElementById('bulkActionBar');
    var count = selectedMenuItems.size;
    var countEl = document.getElementById('bulkCount');
    var selectAllBtn = document.getElementById('bulkSelectAll');

    if (count > 0) {
        bar.style.display = '';
        countEl.textContent = count + ' selected';
    } else {
        bar.style.display = 'none';
    }

    // Update select all button icon
    var items = getFilteredMenuItems();
    if (items.length > 0 && selectedMenuItems.size === items.length) {
        selectAllBtn.textContent = '☑';
        selectAllBtn.title = 'Deselect All';
    } else {
        selectAllBtn.textContent = '☐';
        selectAllBtn.title = 'Select All';
    }
}

function updateMenuCardCheckboxes() {
    document.querySelectorAll('.menu-card').forEach(function(card) {
        var cb = card.querySelector('.menu-card-checkbox');
        if (cb) {
            var itemId = cb.dataset.id;
            cb.classList.toggle('checked', selectedMenuItems.has(itemId));
            cb.textContent = selectedMenuItems.has(itemId) ? '☑' : '☐';
        }
    });
}

function bulkUpdateAvailability(available) {
    if (selectedMenuItems.size === 0) return;
    var label = available ? 'available' : 'unavailable';
    if (!confirm('Mark ' + selectedMenuItems.size + ' item(s) as ' + label + '?')) return;

    var batch = db.batch();
    selectedMenuItems.forEach(function(id) {
        batch.update(menuRef.doc(id), { available: available });
    });
    batch.commit().then(function() {
        showToast(selectedMenuItems.size + ' items marked ' + label, 'success');
        selectedMenuItems.clear();
        updateBulkUI();
    }).catch(function(err) {
        showToast('Error: ' + err.message, 'error');
    });
}

function bulkDeleteItems() {
    if (selectedMenuItems.size === 0) return;
    if (!confirm('Delete ' + selectedMenuItems.size + ' item(s)? This cannot be undone!')) return;

    var batch = db.batch();
    selectedMenuItems.forEach(function(id) {
        batch.delete(menuRef.doc(id));
    });
    batch.commit().then(function() {
        showToast(selectedMenuItems.size + ' items deleted', 'success');
        selectedMenuItems.clear();
        updateBulkUI();
    }).catch(function(err) {
        showToast('Error: ' + err.message, 'error');
    });
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

    // Sync images button
    document.getElementById('syncImagesBtn').addEventListener('click', syncImagesToFirestore);

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

    // Image upload area
    var uploadArea = document.getElementById('imageUploadArea');
    var fileInput = document.getElementById('imageFileInput');
    var preview = document.getElementById('imagePreview');
    var placeholder = document.getElementById('imageUploadPlaceholder');
    var removeBtn = document.getElementById('removeImageBtn');

    if (uploadArea && fileInput) {
        uploadArea.addEventListener('click', function() { fileInput.click(); });
        fileInput.addEventListener('change', function() {
            var file = this.files[0];
            if (!file) return;
            // Validate file type (MIME check)
            var allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
            if (!allowedTypes.includes(file.type)) {
                showToast('Only JPG, PNG, WebP or GIF images allowed', 'error');
                this.value = '';
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                showToast('Image must be under 5MB', 'error');
                this.value = '';
                return;
            }
            window._pendingImageFile = file;
            var reader = new FileReader();
            reader.onload = function(e) {
                preview.src = e.target.result;
                preview.style.display = 'block';
                placeholder.style.display = 'none';
                removeBtn.style.display = '';
            };
            reader.readAsDataURL(file);
        });
    }
    if (removeBtn) {
        removeBtn.addEventListener('click', function() {
            window._pendingImageFile = null;
            fileInput.value = '';
            preview.src = '';
            preview.style.display = 'none';
            placeholder.style.display = '';
            removeBtn.style.display = 'none';
            document.getElementById('itemImage').value = '';
        });
    }

    // Menu search
    var searchInput = document.getElementById('adminMenuSearch');
    var searchClear = document.getElementById('adminSearchClear');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            if (searchClear) searchClear.style.display = this.value ? 'flex' : 'none';
            renderMenuGrid();
        });
    }
    if (searchClear) {
        searchClear.addEventListener('click', function() {
            searchInput.value = '';
            searchClear.style.display = 'none';
            searchInput.focus();
            renderMenuGrid();
        });
    }
}

function renderMenuGrid() {
    var grid = document.getElementById('adminMenuGrid');
    var items = currentFilter === 'all' ? allMenuItems : allMenuItems.filter(function(i) { return i.category === currentFilter; });

    // Apply search filter
    var searchInput = document.getElementById('adminMenuSearch');
    var query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    if (query) {
        items = items.filter(function(i) {
            return (i.name && i.name.toLowerCase().indexOf(query) !== -1) ||
                   (i.desc && i.desc.toLowerCase().indexOf(query) !== -1) ||
                   (i.category && i.category.toLowerCase().indexOf(query) !== -1);
        });
    }

    if (items.length === 0) {
        grid.innerHTML = '<div class="loading-state">No items found. Click "Add Item" or "Seed Menu" to get started.</div>';
        return;
    }

    grid.innerHTML = items.map(function(item) {
        var priceText = getItemPriceDisplay(item);
        var available = item.available !== false;
        var isSelected = selectedMenuItems.has(item.id);
        var safeId = isSafeId(item.id) ? item.id : '';
        var safeName = escapeHTML(item.name);
        var safeDesc = escapeHTML(item.desc || '');
        var safeImage = escapeHTML(item.image || 'https://via.placeholder.com/400x200?text=No+Image');
        var safeCatName = escapeHTML(CATEGORY_NAMES[item.category] || item.category);
        var safeNameAttr = escapeAttr(item.name);
        return '<div class="menu-card ' + (available ? '' : 'unavailable') + (isSelected ? ' selected' : '') + '">' +
            '<div class="menu-card-checkbox' + (isSelected ? ' checked' : '') + '" data-id="' + safeId + '" onclick="event.stopPropagation();toggleMenuItemSelection(\'' + safeId + '\')">' + (isSelected ? '☑' : '☐') + '</div>' +
            '<div class="menu-card-img"><img src="' + safeImage + '" alt="' + safeName + '" loading="lazy"></div>' +
            '<div class="menu-card-body">' +
                '<div class="menu-card-top">' +
                    '<span class="menu-card-name">' + safeName + '</span>' +
                    '<span class="menu-card-badge">' + (available ? safeCatName : 'Unavailable') + '</span>' +
                '</div>' +
                '<div class="menu-card-desc">' + safeDesc + '</div>' +
                '<div class="menu-card-price">' + escapeHTML(priceText) + '</div>' +
                '<div class="menu-card-actions">' +
                    '<button class="action-btn edit-btn" onclick="editMenuItem(\'' + safeId + '\')" title="Edit"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg><span>Edit</span></button>' +
                    '<button class="action-btn avail-btn' + (available ? '' : ' off') + '" onclick="toggleMenuAvailability(\'' + safeId + '\', ' + available + ')" title="' + (available ? 'Mark Unavailable' : 'Mark Available') + '">' + (available ? '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg><span>Active</span>' : '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg><span>Off</span>') + '</button>' +
                    '<button class="action-btn delete-btn" onclick="deleteMenuItem(\'' + safeId + '\', \'' + safeNameAttr + '\')" title="Delete"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg><span>Delete</span></button>' +
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

    // Reset image upload
    document.getElementById('itemImage').value = '';
    document.getElementById('imagePreview').src = '';
    document.getElementById('imagePreview').style.display = 'none';
    document.getElementById('imageUploadPlaceholder').style.display = '';
    document.getElementById('removeImageBtn').style.display = 'none';
    document.getElementById('imageFileInput').value = '';
    window._pendingImageFile = null;

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
        // Show existing image in preview
        if (item.image) {
            document.getElementById('imagePreview').src = item.image;
            document.getElementById('imagePreview').style.display = 'block';
            document.getElementById('imageUploadPlaceholder').style.display = 'none';
            document.getElementById('removeImageBtn').style.display = '';
        }
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
                row.innerHTML = '<input type="text" class="size-label" value="' + escapeAttr(label) + '">' +
                    '<input type="number" class="size-price" value="' + escapeAttr(String(item.sizes[label])) + '" min="0">' +
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

    // Input validation: max lengths
    if (name.length > 100) {
        showToast('Item name too long (max 100 chars)', 'error');
        return;
    }
    if (desc.length > 500) {
        showToast('Description too long (max 500 chars)', 'error');
        return;
    }

    var btn = document.getElementById('saveItemBtn');
    btn.disabled = true;
    btn.textContent = 'Saving...';

    // If user picked a new image file, compress and convert to base64
    if (window._pendingImageFile) {
        var file = window._pendingImageFile;
        btn.textContent = 'Compressing image...';
        console.log('[KKFC] Compressing image:', file.name, 'Size:', file.size, 'Type:', file.type);

        compressImage(file, 800, 0.75, function(base64Url) {
            console.log('[KKFC] Image compressed, base64 length:', base64Url.length);
            window._pendingImageFile = null;
            doSaveMenuItem(id, category, name, desc, base64Url, available, btn);
        }, function(err) {
            console.error('[KKFC] Image compression error:', err);
            window._pendingImageFile = null;
            showToast('Image processing failed: ' + err + '. Please try a different image.', 'error');
            btn.disabled = false;
            btn.textContent = 'Save Item';
        });
        return;
    }

    doSaveMenuItem(id, category, name, desc, image, available, btn);
}

/**
 * Compress image file to JPEG base64 data URL
 * @param {File} file - Image file
 * @param {number} maxWidth - Max width in px
 * @param {number} quality - JPEG quality 0-1
 * @param {function} onSuccess - Callback with base64 string
 * @param {function} onError - Callback with error string
 */
function compressImage(file, maxWidth, quality, onSuccess, onError) {
    var reader = new FileReader();
    reader.onload = function(e) {
        var img = new Image();
        img.onload = function() {
            try {
                var canvas = document.createElement('canvas');
                var w = img.width;
                var h = img.height;

                // Resize if wider than maxWidth
                if (w > maxWidth) {
                    h = Math.round(h * (maxWidth / w));
                    w = maxWidth;
                }

                canvas.width = w;
                canvas.height = h;
                var ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, w, h);

                var base64 = canvas.toDataURL('image/jpeg', quality);
                console.log('[KKFC] Compressed: ' + img.width + 'x' + img.height + ' → ' + w + 'x' + h + ', size: ~' + Math.round(base64.length * 0.75 / 1024) + 'KB');
                onSuccess(base64);
            } catch (err) {
                onError(err.message || 'Canvas error');
            }
        };
        img.onerror = function() { onError('Invalid image file'); };
        img.src = e.target.result;
    };
    reader.onerror = function() { onError('Could not read file'); };
    reader.readAsDataURL(file);
}

function doSaveMenuItem(id, category, name, desc, image, available, btn) {
    var DEL = firebase.firestore.FieldValue.delete();
    var data = {
        category: category,
        name: name,
        desc: desc,
        image: image,
        available: available,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    // Actively remove old pricing fields from Firestore when switching category
    // Default: delete all pricing, then set the correct one below
    if (id) {
        data.price = DEL;
        data.thickPrice = DEL;
        data.prices = DEL;
        data.sizes = DEL;
    }

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
        else if (id) data.thickPrice = DEL;
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

    console.log('[KKFC] Saving item:', id || 'new', 'image length:', (image || '').length, 'category:', category);

    var promise;
    if (id) {
        promise = menuRef.doc(id).update(data);
    } else {
        // Remove DEL sentinels for new docs (not needed)
        delete data.price;
        delete data.thickPrice;
        delete data.prices;
        delete data.sizes;
        // Re-set pricing for new item
        if (category === 'icecream') {
            data.prices = {
                '250g': Number(document.getElementById('price250g').value) || 0,
                '500g': Number(document.getElementById('price500g').value) || 0,
                '1kg': Number(document.getElementById('price1kg').value) || 0
            };
        } else if (category === 'shakes') {
            data.price = Number(document.getElementById('priceShake').value) || 0;
            var thickNew = Number(document.getElementById('priceThick').value);
            if (thickNew > 0) data.thickPrice = thickNew;
        } else if (category === 'chicken') {
            var sizeRows2 = document.querySelectorAll('#chickenSizesContainer .size-row');
            var sizes2 = {};
            var hasSizes2 = false;
            sizeRows2.forEach(function(row) {
                var label = row.querySelector('.size-label').value.trim();
                var price = Number(row.querySelector('.size-price').value);
                if (label && price > 0) { sizes2[label] = price; hasSizes2 = true; }
            });
            if (hasSizes2) data.sizes = sizes2;
            else data.price = Number(document.getElementById('itemPrice').value) || 0;
        } else {
            data.price = Number(document.getElementById('itemPrice').value) || 0;
        }
        data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
        promise = menuRef.add(data);
    }

    promise.then(function() {
        console.log('[KKFC] Item saved successfully:', id || 'new');
        showToast(id ? 'Item updated!' : 'Item added!');
        closeModal('menuItemModal');
        btn.disabled = false;
        btn.textContent = 'Save Item';
    }).catch(function(err) {
        console.error('[KKFC] Save error:', err);
        showToast('Error saving: ' + err.message, 'error');
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

// Sync images AND categories from hardcoded SEED_MENU to Firestore
function syncImagesToFirestore() {
    if (!confirm('This will sync ALL menu item images and categories in Firestore to match the hardcoded menu. Continue?')) return;

    var batch = db.batch();
    var count = 0;

    Object.keys(SEED_MENU).forEach(function(catKey) {
        var cat = SEED_MENU[catKey];
        cat.items.forEach(function(item) {
            var docRef = menuRef.doc(item.id);
            var updateData = { category: catKey };
            if (item.image) updateData.image = item.image;
            batch.update(docRef, updateData);
            count++;
        });
    });

    batch.commit()
        .then(function() {
            console.log('[KKFC] Synced ' + count + ' item images to Firestore');
            showToast(count + ' item images synced to Firestore!', 'success');
        })
        .catch(function(err) {
            console.error('[KKFC] Image sync error:', err);
            showToast('Image sync error: ' + err.message, 'error');
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
        if (offer.startDate) dateText += escapeHTML(offer.startDate);
        if (offer.endDate) dateText += ' → ' + escapeHTML(offer.endDate);
        var safeOfferId = isSafeId(offer.id) ? offer.id : '';

        return '<div class="offer-card ' + (active ? '' : 'inactive') + '">' +
            '<div class="offer-card-title">' + escapeHTML(offer.title) + '</div>' +
            '<div class="offer-card-desc">' + escapeHTML(offer.desc || '') + '</div>' +
            '<div class="offer-card-meta">' +
                '<span>💰 ' + escapeHTML(valueText) + '</span>' +
                '<span>📦 ' + escapeHTML(catText) + '</span>' +
                (offer.code ? '<span>🏷️ ' + escapeHTML(offer.code) + '</span>' : '') +
                (dateText ? '<span>📅 ' + dateText + '</span>' : '') +
                (offer.minOrder ? '<span>Min ₹' + escapeHTML(String(offer.minOrder)) + '</span>' : '') +
            '</div>' +
            '<div class="offer-card-actions">' +
                '<button class="btn-icon" onclick="editOffer(\'' + safeOfferId + '\')" title="Edit">✎</button>' +
                '<button class="btn-icon" onclick="toggleOffer(\'' + safeOfferId + '\', ' + active + ')" title="' + (active ? 'Disable' : 'Enable') + '">' + (active ? '✓' : '✗') + '</button>' +
                '<button class="btn-icon danger" onclick="deleteOffer(\'' + safeOfferId + '\')" title="Delete">🗑</button>' +
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
    if (data.title.length > 100) {
        showToast('Offer title too long (max 100 chars)', 'error');
        return;
    }
    if (data.desc && data.desc.length > 500) {
        showToast('Offer description too long (max 500 chars)', 'error');
        return;
    }
    if (data.code && data.code.length > 20) {
        showToast('Promo code too long (max 20 chars)', 'error');
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
        var safeOrderId = isSafeId(order.id) ? order.id : '';

        return '<tr>' +
            '<td data-label="Order"><strong>#' + escapeHTML(order.orderNumber || order.id.slice(-6).toUpperCase()) + '</strong></td>' +
            '<td data-label="Customer">' + escapeHTML(order.customerName || '—') + '</td>' +
            '<td data-label="Phone">' + escapeHTML(order.phone || '—') + '</td>' +
            '<td data-label="Items">' + itemCount + ' item' + (itemCount !== 1 ? 's' : '') + '</td>' +
            '<td data-label="Total"><strong>₹' + escapeHTML(String(order.total || 0)) + '</strong></td>' +
            '<td data-label="Payment">' + escapeHTML(order.paymentMethod || '—') + '</td>' +
            '<td data-label="Status"><span class="badge badge-' + escapeAttr(status) + '">' + escapeHTML(status.charAt(0).toUpperCase() + status.slice(1)) + '</span></td>' +
            '<td data-label="Date">' + escapeHTML(dateStr + ' ' + timeStr) + '</td>' +
            '<td data-label="Actions">' +
                '<button class="btn-icon" onclick="viewOrder(\'' + safeOrderId + '\')" title="View">👁</button>' +
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
            '<td data-label="Order"><strong>#' + escapeHTML(order.orderNumber || order.id.slice(-6).toUpperCase()) + '</strong></td>' +
            '<td data-label="Customer">' + escapeHTML(order.customerName || '—') + '</td>' +
            '<td data-label="Items">' + itemCount + ' items</td>' +
            '<td data-label="Total">₹' + escapeHTML(String(order.total || 0)) + '</td>' +
            '<td data-label="Status"><span class="badge badge-' + escapeAttr(status) + '">' + escapeHTML(status.charAt(0).toUpperCase() + status.slice(1)) + '</span></td>' +
            '<td data-label="Time">' + escapeHTML(timeStr) + '</td>' +
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
                return '<li><span>' + escapeHTML(item.name) + (item.variant ? ' (' + escapeHTML(item.variant) + ')' : '') + ' × ' + escapeHTML(String(item.qty)) + '</span><span>₹' + escapeHTML(String(item.total)) + '</span></li>';
            }).join('') +
        '</ul>';
    }

    var body = document.getElementById('orderDetailBody');
    var safeOrderId = isSafeId(order.id) ? order.id : '';
    body.innerHTML = '<div class="order-detail-grid">' +
        '<div>' +
            '<div class="order-info-block"><h4>Order Number</h4><p>#' + escapeHTML(order.orderNumber || order.id.slice(-6).toUpperCase()) + '</p></div>' +
            '<div class="order-info-block"><h4>Customer</h4><p>' + escapeHTML(order.customerName || '—') + '</p></div>' +
            '<div class="order-info-block"><h4>Phone</h4><p>' + escapeHTML(order.phone || '—') + '</p></div>' +
            '<div class="order-info-block"><h4>Address</h4><p>' + escapeHTML(order.address || '—') + '</p></div>' +
        '</div>' +
        '<div>' +
            '<div class="order-info-block"><h4>Date</h4><p>' + escapeHTML(dateStr) + '</p></div>' +
            '<div class="order-info-block"><h4>Payment</h4><p>' + escapeHTML(order.paymentMethod || '—') + '</p></div>' +
            '<div class="order-info-block"><h4>Total</h4><p style="font-size:1.2rem;font-weight:700;color:var(--orange);">₹' + escapeHTML(String(order.total || 0)) + '</p></div>' +
            '<div class="order-info-block"><h4>Status</h4><span class="badge badge-' + escapeAttr(status) + '">' + escapeHTML(status.charAt(0).toUpperCase() + status.slice(1)) + '</span></div>' +
        '</div>' +
    '</div>' +
    '<div class="order-info-block" style="margin-top:1rem;"><h4>Items</h4>' + (itemsHtml || '<p>No items data</p>') + '</div>' +
    (order.notes ? '<div class="order-info-block"><h4>Notes</h4><p>' + escapeHTML(order.notes) + '</p></div>' : '') +
    '<div style="margin-top:1rem;">' +
        '<label style="font-size:0.8rem;font-weight:600;display:block;margin-bottom:0.35rem;">Update Status</label>' +
        '<select class="order-status-select" onchange="updateOrderStatus(\'' + safeOrderId + '\', this.value)">' +
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
    toast.textContent = message; // textContent is safe — no HTML injection
    container.appendChild(toast);

    setTimeout(function() {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        toast.style.transition = '0.3s ease';
        setTimeout(function() { toast.remove(); }, 300);
    }, 3000);
}

// ========== AUTO-LOGOUT ON INACTIVITY ==========
var _inactivityTimer = null;
var INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

function resetInactivityTimer() {
    if (_inactivityTimer) clearTimeout(_inactivityTimer);
    _inactivityTimer = setTimeout(function() {
        if (auth && auth.currentUser) {
            auth.signOut();
            showToast('Session expired. Please log in again.', 'error');
        }
    }, INACTIVITY_TIMEOUT_MS);
}

// Track user activity
['click', 'keydown', 'mousemove', 'scroll', 'touchstart'].forEach(function(evt) {
    document.addEventListener(evt, resetInactivityTimer, { passive: true });
});
resetInactivityTimer();
