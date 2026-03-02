/**
 * ============================================
 * KARTIKEYA ICE CREAMS & KKFC
 * Professional Mobile-First Food Ordering App
 * ============================================
 */
console.log('[KKFC] app.js v8 loaded');

// ========== FIRESTORE MENU SYNC ==========
// Load availability & updates from Firestore, merge into hardcoded menuData
function syncMenuFromFirestore() {
    if (typeof menuRef === 'undefined' || !menuRef) {
        console.log('[KKFC] Firestore not available, using hardcoded menu');
        return;
    }
    menuRef.onSnapshot(function(snap) {
        var firestoreItems = {};
        snap.forEach(function(doc) {
            var d = doc.data();
            d._fsId = doc.id;
            firestoreItems[doc.id] = d;
        });

        // Build a set of all hardcoded item IDs
        var hardcodedIds = {};
        Object.keys(menuData).forEach(function(catKey) {
            menuData[catKey].items.forEach(function(item) {
                hardcodedIds[item.id] = true;
                // Update existing items from Firestore
                if (firestoreItems[item.id]) {
                    var fsItem = firestoreItems[item.id];
                    item.available = fsItem.available !== false;
                    if (fsItem.name) item.name = fsItem.name;
                    if (fsItem.desc !== undefined) item.desc = fsItem.desc;
                    if (fsItem.image) item.image = fsItem.image;
                    if (fsItem.prices) item.prices = fsItem.prices;
                    if (fsItem.sizes) item.sizes = fsItem.sizes;
                    if (fsItem.price !== undefined) item.price = fsItem.price;
                    if (fsItem.thickPrice !== undefined) item.thickPrice = fsItem.thickPrice;
                } else {
                    item.available = true;
                }
            });
        });

        // Add NEW items from Firestore that don't exist in hardcoded data
        Object.keys(firestoreItems).forEach(function(fsId) {
            if (hardcodedIds[fsId]) return; // already merged above
            var fsItem = firestoreItems[fsId];
            var cat = fsItem.category; // e.g. 'icecream', 'shakes', 'chicken', 'combos'
            if (!cat || !menuData[cat]) return; // unknown category, skip

            // Build item object matching hardcoded format
            var newItem = {
                id: fsId,
                name: fsItem.name || 'Unnamed Item',
                desc: fsItem.desc || '',
                image: fsItem.image || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80',
                available: fsItem.available !== false
            };

            // Set pricing based on category
            if (fsItem.prices) newItem.prices = fsItem.prices;
            if (fsItem.sizes) newItem.sizes = fsItem.sizes;
            if (fsItem.price !== undefined) newItem.price = fsItem.price;
            if (fsItem.thickPrice !== undefined) newItem.thickPrice = fsItem.thickPrice;

            // Check if already added (from a previous snapshot)
            var exists = menuData[cat].items.some(function(i) { return i.id === fsId; });
            if (!exists) {
                menuData[cat].items.push(newItem);
                console.log('[KKFC] New item added from Firestore:', newItem.name, 'in', cat);
            } else {
                // Update existing dynamically-added item
                menuData[cat].items.forEach(function(item) {
                    if (item.id === fsId) {
                        item.name = newItem.name;
                        item.desc = newItem.desc;
                        item.image = newItem.image;
                        item.available = newItem.available;
                        if (fsItem.prices) item.prices = fsItem.prices;
                        if (fsItem.sizes) item.sizes = fsItem.sizes;
                        if (fsItem.price !== undefined) item.price = fsItem.price;
                        if (fsItem.thickPrice !== undefined) item.thickPrice = fsItem.thickPrice;
                    }
                });
            }
        });

        // Remove items deleted from Firestore (only dynamically-added ones)
        Object.keys(menuData).forEach(function(catKey) {
            menuData[catKey].items = menuData[catKey].items.filter(function(item) {
                // Keep hardcoded items always
                if (hardcodedIds[item.id]) return true;
                // Keep Firestore items only if they still exist
                return !!firestoreItems[item.id];
            });
        });

        console.log('[KKFC] Menu synced from Firestore');
        // Re-render if currently viewing a category
        if (currentCategory && menuData[currentCategory]) {
            var menuList = document.getElementById('menuList');
            if (menuList && document.getElementById('menuSection') && document.getElementById('menuSection').classList.contains('active')) {
                renderMenuItems(menuData[currentCategory].items, menuData[currentCategory].type, menuList);
            }
        }
    }, function(err) {
        console.warn('[KKFC] Firestore menu sync error:', err.message);
    });
}

// ========== SYNC OFFERS FROM FIRESTORE ==========
var activeOffersCache = []; // Global store for applying coupons
var appliedCoupon = null; // Currently applied coupon

function syncOffersFromFirestore() {
    if (typeof offersRef === 'undefined' || !offersRef) {
        console.log('[KKFC] Firestore offers not available');
        return;
    }
    offersRef.onSnapshot(function(snap) {
        var now = new Date();
        var activeOffers = [];
        snap.forEach(function(doc) {
            var o = doc.data();
            if (!o.active) return;
            // Check date validity
            if (o.startDate) {
                var start = new Date(o.startDate);
                if (now < start) return;
            }
            if (o.endDate) {
                var end = new Date(o.endDate + 'T23:59:59');
                if (now > end) return;
            }
            o._id = doc.id;
            activeOffers.push(o);
        });

        var strip = document.getElementById('offersStrip');
        var scroll = document.getElementById('offersScroll');
        if (!strip || !scroll) return;

        if (activeOffers.length === 0) {
            strip.style.display = 'none';
            return;
        }
        strip.style.display = '';

        var html = '';
        activeOffers.forEach(function(o) {
            // Build value label
            var valLabel = '';
            if (o.type === 'percent') valLabel = o.value + '% OFF';
            else if (o.type === 'flat') valLabel = '₹' + o.value + ' OFF';
            else if (o.type === 'bogo') valLabel = 'BUY 1 GET 1';
            else if (o.type === 'freebie') valLabel = 'FREE ITEM';
            else valLabel = 'SPECIAL';

            // Category label
            var catLabel = (o.category && o.category !== 'all') ? o.category.charAt(0).toUpperCase() + o.category.slice(1) : 'All Items';

            html += '<div class="offer-banner">';
            html += '<span class="offer-banner-tag">' + valLabel + '</span>';
            html += '<div class="offer-banner-title">' + (o.title || 'Special Offer') + '</div>';
            if (o.desc) html += '<div class="offer-banner-desc">' + o.desc + '</div>';
            html += '<div class="offer-banner-meta">';
            html += '<span class="offer-banner-chip">🍽 ' + catLabel + '</span>';
            if (o.code) html += '<span class="offer-banner-chip offer-banner-code">' + o.code + '</span>';
            if (o.minOrder) html += '<span class="offer-banner-chip">Min ₹' + o.minOrder + '</span>';
            html += '</div>';
            html += '</div>';
        });
        scroll.innerHTML = html;
        console.log('[KKFC] Offers synced:', activeOffers.length, 'active');

        // Store globally for coupon logic
        activeOffersCache = activeOffers;

        // Re-validate applied coupon (in case offer was deactivated)
        if (appliedCoupon) {
            var stillValid = activeOffers.some(function(o) { return o.code && o.code === appliedCoupon.code; });
            if (!stillValid) {
                appliedCoupon = null;
                updateCartUI();
            }
        }
    }, function(err) {
        console.warn('[KKFC] Offers sync error:', err.message);
    });
}

// ========== COUPON / PROMO CODE LOGIC ==========
function applyCoupon(code) {
    if (!code) return { success: false, msg: 'Please enter a promo code' };
    code = code.trim().toUpperCase();

    var offer = null;
    for (var i = 0; i < activeOffersCache.length; i++) {
        if (activeOffersCache[i].code && activeOffersCache[i].code.toUpperCase() === code) {
            offer = activeOffersCache[i];
            break;
        }
    }

    if (!offer) return { success: false, msg: 'Invalid promo code' };

    // Check minimum order
    var subtotal = cart.reduce(function(sum, item) { return sum + (item.unitPrice * item.quantity); }, 0);
    if (offer.minOrder && subtotal < Number(offer.minOrder)) {
        return { success: false, msg: 'Minimum order ₹' + offer.minOrder + ' required' };
    }

    // Check category match
    if (offer.category && offer.category !== 'all') {
        var hasCatItem = cart.some(function(item) {
            return item.categoryType === offer.category;
        });
        if (!hasCatItem) {
            var catName = offer.category.charAt(0).toUpperCase() + offer.category.slice(1);
            return { success: false, msg: 'This code is only for ' + catName + ' items' };
        }
    }

    appliedCoupon = offer;
    return { success: true, msg: 'Coupon applied! ' + getCouponLabel(offer) };
}

function removeCoupon() {
    appliedCoupon = null;
    updateCartUI();
}

function getCouponLabel(offer) {
    if (offer.type === 'percent') return offer.value + '% OFF';
    if (offer.type === 'flat') return '₹' + offer.value + ' OFF';
    if (offer.type === 'bogo') return 'Buy 1 Get 1 Free';
    if (offer.type === 'freebie') return 'Free Item';
    return 'Special Offer';
}

function calculateDiscount(subtotal) {
    if (!appliedCoupon) return 0;
    var offer = appliedCoupon;
    if (offer.type === 'percent') {
        return Math.round(subtotal * (Number(offer.value) / 100));
    } else if (offer.type === 'flat') {
        return Math.min(Number(offer.value), subtotal);
    } else if (offer.type === 'bogo') {
        // Find cheapest eligible item and make it free
        var cheapest = Infinity;
        cart.forEach(function(item) {
            if (!offer.category || offer.category === 'all' || item.categoryType === offer.category) {
                if (item.unitPrice < cheapest) cheapest = item.unitPrice;
            }
        });
        return cheapest < Infinity ? cheapest : 0;
    } else if (offer.type === 'freebie') {
        var cheapestItem = Infinity;
        cart.forEach(function(item) {
            if (item.unitPrice < cheapestItem) cheapestItem = item.unitPrice;
        });
        return cheapestItem < Infinity ? cheapestItem : 0;
    }
    return 0;
}

// ========== MENU DATA ==========
const menuData = {
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

// ========== STATE MANAGEMENT ==========
let cart = loadCart();
let currentCategory = null;
let currentItem = null;
let selectedVariant = null;
let customizeQuantity = 1;

// ========== DOM ELEMENTS ==========
const elements = {
    // Header & Search
    searchInput: document.getElementById('searchInput'),
    searchClear: document.getElementById('searchClear'),
    
    // Main Content
    mainContent: document.getElementById('mainContent'),
    heroSection: document.getElementById('heroSection'),
    bannerSliderSection: document.getElementById('bannerSliderSection'),
    categorySection: document.getElementById('categorySection'),
    menuSection: document.getElementById('menuSection'),
    menuTitle: document.getElementById('menuTitle'),
    menuList: document.getElementById('menuList'),
    searchResultsSection: document.getElementById('searchResultsSection'),
    searchResultsList: document.getElementById('searchResultsList'),

    
    // Banner Slider
    bannerSlider: document.getElementById('bannerSlider'),
    bannerTrack: document.getElementById('bannerTrack'),
    bannerPagination: document.getElementById('bannerPagination'),
    
    // Buttons
    orderNowBtn: document.getElementById('orderNowBtn'),
    backToCategories: document.getElementById('backToCategories'),
    clearSearchBtn: document.getElementById('clearSearchBtn'),
    viewMapBtn: document.getElementById('viewMapBtn'),
    
    // Home-only sections
    whyCardsSection: document.querySelector('.why-cards-section'),
    statsSection: document.querySelector('.stats-section'),
    
    // Cart
    cartOverlay: document.getElementById('cartOverlay'),
    cartPanel: document.getElementById('cartPanel'),
    cartClose: document.getElementById('cartClose'),
    cartItems: document.getElementById('cartItems'),
    cartEmpty: document.getElementById('cartEmpty'),
    cartFooter: document.getElementById('cartFooter'),
    subtotalAmount: document.getElementById('subtotalAmount'),
    cartBadge: document.getElementById('cartBadge'),
    addMoreBtn: document.getElementById('addMoreBtn'),
    checkoutBtn: document.getElementById('checkoutBtn'),
    
    // Checkout
    checkoutOverlay: document.getElementById('checkoutOverlay'),
    checkoutModal: document.getElementById('checkoutModal'),
    checkoutBack: document.getElementById('checkoutBack'),
    checkoutSummary: document.getElementById('checkoutSummary'),
    checkoutTotal: document.getElementById('checkoutTotal'),
    checkoutForm: document.getElementById('checkoutForm'),
    addMoreCheckout: document.getElementById('addMoreCheckout'),
    
    // Customize Modal
    customizeOverlay: document.getElementById('customizeOverlay'),
    customizeModal: document.getElementById('customizeModal'),
    customizeClose: document.getElementById('customizeClose'),
    customizeImage: document.getElementById('customizeImage'),
    customizeName: document.getElementById('customizeName'),
    customizeDesc: document.getElementById('customizeDesc'),
    variantSelection: document.getElementById('variantSelection'),
    variantOptions: document.getElementById('variantOptions'),
    customizeQtyMinus: document.getElementById('customizeQtyMinus'),
    customizeQtyValue: document.getElementById('customizeQtyValue'),
    customizeQtyPlus: document.getElementById('customizeQtyPlus'),
    customizeTotalAmount: document.getElementById('customizeTotalAmount'),
    addToCartBtn: document.getElementById('addToCartBtn'),
    
    // Category Cards (no longer used — using event delegation instead)
};

// ========== UTILITY FUNCTIONS ==========
function formatPrice(price) {
    return `Rs. ${price.toFixed(2)}`;
}

// ========== CART PERSISTENCE ==========
function saveCart() {
    try { localStorage.setItem('kkfc_cart', JSON.stringify(cart)); } catch(e) {}
}
function loadCart() {
    try {
        var saved = localStorage.getItem('kkfc_cart');
        return saved ? JSON.parse(saved) : [];
    } catch(e) { return []; }
}

function generateCartItemId(item, variant) {
    return `${item.id}_${variant || 'default'}`;
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ========== BANNER SLIDER ==========
let bannerSlider = null;

class BannerSlider {
    constructor(options = {}) {
        this.track = elements.bannerTrack;
        this.pagination = elements.bannerPagination;
        this.slides = this.track.querySelectorAll('.banner-slide');
        this.dots = this.pagination.querySelectorAll('.pagination-dot');
        
        this.currentIndex = 0;
        this.totalSlides = this.slides.length;
        this.autoPlayInterval = options.interval || 3500;
        this.autoPlayTimer = null;
        this.isPlaying = false;
        
        // Touch handling
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.isDragging = false;
        this.dragOffset = 0;
        
        this.init();
    }
    
    init() {
        // Set up pagination clicks
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Touch events
        this.track.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
        this.track.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: true });
        this.track.addEventListener('touchend', (e) => this.handleTouchEnd(e));
        
        // Mouse events for desktop
        this.track.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.track.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.track.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.track.addEventListener('mouseleave', (e) => this.handleMouseUp(e));
        
        // Pause on hover (desktop)
        elements.bannerSlider.addEventListener('mouseenter', () => this.stopAutoPlay());
        elements.bannerSlider.addEventListener('mouseleave', () => this.startAutoPlay());
        
        // Start autoplay
        this.startAutoPlay();
    }
    
    goToSlide(index, animate = true) {
        if (index < 0) index = this.totalSlides - 1;
        if (index >= this.totalSlides) index = 0;
        
        this.currentIndex = index;
        
        if (animate) {
            this.track.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        } else {
            this.track.style.transition = 'none';
        }
        
        this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
        
        // Update pagination
        this.dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === this.currentIndex);
        });
    }
    
    nextSlide() {
        this.goToSlide(this.currentIndex + 1);
    }
    
    prevSlide() {
        this.goToSlide(this.currentIndex - 1);
    }
    
    startAutoPlay() {
        if (this.isPlaying) return;
        this.isPlaying = true;
        this.autoPlayTimer = setInterval(() => this.nextSlide(), this.autoPlayInterval);
    }
    
    stopAutoPlay() {
        this.isPlaying = false;
        if (this.autoPlayTimer) {
            clearInterval(this.autoPlayTimer);
            this.autoPlayTimer = null;
        }
    }
    
    handleTouchStart(e) {
        this.touchStartX = e.touches[0].clientX;
        this.isDragging = true;
        this.stopAutoPlay();
        this.track.style.transition = 'none';
    }
    
    handleTouchMove(e) {
        if (!this.isDragging) return;
        this.touchEndX = e.touches[0].clientX;
        const diff = this.touchEndX - this.touchStartX;
        const slideWidth = this.track.offsetWidth;
        const offset = (diff / slideWidth) * 100;
        this.track.style.transform = `translateX(calc(-${this.currentIndex * 100}% + ${offset}%))`;
    }
    
    handleTouchEnd(e) {
        if (!this.isDragging) return;
        this.isDragging = false;
        
        const diff = this.touchEndX - this.touchStartX;
        const threshold = 50;
        
        if (diff > threshold) {
            this.prevSlide();
        } else if (diff < -threshold) {
            this.nextSlide();
        } else {
            this.goToSlide(this.currentIndex);
        }
        
        this.startAutoPlay();
    }
    
    handleMouseDown(e) {
        e.preventDefault();
        this.touchStartX = e.clientX;
        this.isDragging = true;
        this.stopAutoPlay();
        this.track.style.transition = 'none';
        this.track.style.cursor = 'grabbing';
    }
    
    handleMouseMove(e) {
        if (!this.isDragging) return;
        this.touchEndX = e.clientX;
        const diff = this.touchEndX - this.touchStartX;
        const slideWidth = this.track.offsetWidth;
        const offset = (diff / slideWidth) * 100;
        this.track.style.transform = `translateX(calc(-${this.currentIndex * 100}% + ${offset}%))`;
    }
    
    handleMouseUp(e) {
        if (!this.isDragging) return;
        this.isDragging = false;
        this.track.style.cursor = 'grab';
        
        const diff = this.touchEndX - this.touchStartX;
        const threshold = 50;
        
        if (diff > threshold) {
            this.prevSlide();
        } else if (diff < -threshold) {
            this.nextSlide();
        } else {
            this.goToSlide(this.currentIndex);
        }
        
        this.startAutoPlay();
    }
}

// ========== NAVIGATION FUNCTIONS ==========
function showSection(sectionName) {
    // Hide all sections
    if (elements.heroSection) elements.heroSection.style.display = 'none';
    if (elements.bannerSliderSection) elements.bannerSliderSection.style.display = 'none';
    if (elements.categorySection) elements.categorySection.style.display = 'none';
    if (elements.menuSection) elements.menuSection.classList.remove('active');
    if (elements.searchResultsSection) elements.searchResultsSection.classList.remove('active');
    
    // Show requested section
    switch (sectionName) {
        case 'home':
            if (elements.heroSection) elements.heroSection.style.display = 'block';
            if (elements.bannerSliderSection) elements.bannerSliderSection.style.display = 'block';
            if (elements.categorySection) elements.categorySection.style.display = 'block';
            if (elements.searchInput) {
                elements.searchInput.value = '';
                elements.searchClear.classList.remove('visible');
            }
            if (bannerSlider) bannerSlider.startAutoPlay();
            break;
        case 'cart':
            openCart();
            break;
    }
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showMenu(categoryKey) {
    console.log('[KKFC] showMenu called:', categoryKey);
    
    var category = menuData[categoryKey];
    if (!category) {
        console.error('[KKFC] No data for category:', categoryKey);
        return;
    }
    
    currentCategory = categoryKey;
    
    // Hide home content
    var hero = document.getElementById('heroSection');
    var banner = document.getElementById('bannerSliderSection');
    var catSec = document.getElementById('categorySection');
    var statsSec = document.getElementById('statsSection');
    var menuSec = document.getElementById('menuSection');
    var menuTitle = document.getElementById('menuTitle');
    var menuList = document.getElementById('menuList');
    
    console.log('[KKFC] Elements found:', {
        hero: !!hero, banner: !!banner, catSec: !!catSec,
        menuSec: !!menuSec, menuTitle: !!menuTitle, menuList: !!menuList
    });
    
    if (hero) hero.style.display = 'none';
    if (banner) banner.style.display = 'none';
    if (catSec) catSec.style.display = 'none';
    if (statsSec) statsSec.style.display = 'none';
    
    // Stop banner
    if (bannerSlider) bannerSlider.stopAutoPlay();
    
    // Set title and render items
    if (menuTitle) menuTitle.textContent = category.name;
    if (menuList) renderMenuItems(category.items, category.type, menuList);
    
    // Show menu section
    if (menuSec) {
        menuSec.style.display = 'block';
        menuSec.classList.add('active');
    }
    
    // Scroll to top instantly
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    console.log('[KKFC] Menu should now be visible for:', category.name);
}

function backToHome() {
    window.location.href = window.location.pathname;
}

// ========== MENU RENDERING ==========
function renderMenuItems(items, categoryType, container) {
    container.innerHTML = '';
    
    items.forEach((item, index) => {
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item fade-in';
        menuItem.style.animationDelay = `${index * 0.05}s`;
        
        const isAvailable = item.available !== false;
        if (!isAvailable) menuItem.classList.add('out-of-stock');
        
        // Determine price display
        let priceDisplay = '';
        if (item.prices) {
            const minPrice = Math.min(...Object.values(item.prices));
            priceDisplay = `From ${formatPrice(minPrice)}`;
        } else if (item.sizes) {
            const minPrice = Math.min(...Object.values(item.sizes));
            priceDisplay = `From ${formatPrice(minPrice)}`;
        } else if (item.thickPrice) {
            priceDisplay = `${formatPrice(item.price)} - ${formatPrice(item.thickPrice)}`;
        } else {
            priceDisplay = formatPrice(item.price);
        }
        
        menuItem.innerHTML = `
            <div class="menu-item-info">
                <h4 class="menu-item-name">${item.name}</h4>
                <p class="menu-item-desc">${item.desc}</p>
                <span class="menu-item-price">${isAvailable ? priceDisplay : '<span class="stock-badge">Out of Stock</span>'}</span>
            </div>
            <div class="menu-item-image-wrapper">
                <img src="${item.image}" alt="${item.name}" class="menu-item-image" loading="lazy">
                ${isAvailable 
                    ? `<button class="add-btn" data-item-id="${item.id}" data-category="${categoryType}">+ Add</button>`
                    : `<span class="soldout-label">Sold Out</span>`
                }
            </div>
        `;
        
        container.appendChild(menuItem);
    });
    
    // Add event listeners to add buttons
    container.querySelectorAll('.add-btn').forEach(btn => {
        btn.addEventListener('click', handleAddClick);
    });
}

// ========== SEARCH FUNCTIONALITY ==========
function handleSearch(query) {
    const searchTerm = query.toLowerCase().trim();
    
    if (searchTerm.length < 2) {
        elements.searchResultsSection.classList.remove('active');
        if (!elements.menuSection.classList.contains('active')) {
            elements.heroSection.style.display = 'block';
            elements.bannerSliderSection.style.display = 'block';
            elements.categorySection.style.display = 'block';
            if (bannerSlider) bannerSlider.startAutoPlay();
        }
        return;
    }
    
    // Search through all categories
    const results = [];
    Object.keys(menuData).forEach(categoryKey => {
        const category = menuData[categoryKey];
        category.items.forEach(item => {
            if (item.name.toLowerCase().includes(searchTerm) || 
                item.desc.toLowerCase().includes(searchTerm)) {
                results.push({ ...item, categoryType: category.type });
            }
        });
    });
    
    // Hide other sections
    elements.heroSection.style.display = 'none';
    elements.bannerSliderSection.style.display = 'none';
    elements.categorySection.style.display = 'none';
    elements.menuSection.classList.remove('active');
    
    // Stop banner autoplay
    if (bannerSlider) bannerSlider.stopAutoPlay();
    
    // Show search results
    elements.searchResultsSection.classList.add('active');
    
    if (results.length > 0) {
        renderSearchResults(results);
    } else {
        elements.searchResultsList.innerHTML = `
            <div class="no-results">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                </svg>
                <p>No items found</p>
                <span>Try searching with different keywords</span>
            </div>
        `;
    }
}

function renderSearchResults(results) {
    elements.searchResultsList.innerHTML = '';
    
    results.forEach((item, index) => {
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item fade-in';
        menuItem.style.animationDelay = `${index * 0.05}s`;
        
        const isAvailable = item.available !== false;
        if (!isAvailable) menuItem.classList.add('out-of-stock');
        
        // Determine price display
        let priceDisplay = '';
        if (item.prices) {
            const minPrice = Math.min(...Object.values(item.prices));
            priceDisplay = `From ${formatPrice(minPrice)}`;
        } else if (item.sizes) {
            const minPrice = Math.min(...Object.values(item.sizes));
            priceDisplay = `From ${formatPrice(minPrice)}`;
        } else if (item.thickPrice) {
            priceDisplay = `${formatPrice(item.price)} - ${formatPrice(item.thickPrice)}`;
        } else {
            priceDisplay = formatPrice(item.price);
        }
        
        menuItem.innerHTML = `
            <div class="menu-item-info">
                <h4 class="menu-item-name">${item.name}</h4>
                <p class="menu-item-desc">${item.desc}</p>
                <span class="menu-item-price">${isAvailable ? priceDisplay : '<span class="stock-badge">Out of Stock</span>'}</span>
            </div>
            <div class="menu-item-image-wrapper">
                <img src="${item.image}" alt="${item.name}" class="menu-item-image" loading="lazy">
                ${isAvailable 
                    ? `<button class="add-btn" data-item-id="${item.id}" data-category="${item.categoryType}">+ Add</button>`
                    : `<span class="soldout-label">Sold Out</span>`
                }
            </div>
        `;
        
        elements.searchResultsList.appendChild(menuItem);
    });
    
    // Add event listeners
    elements.searchResultsList.querySelectorAll('.add-btn').forEach(btn => {
        btn.addEventListener('click', handleAddClick);
    });
}

function clearSearch() {
    elements.searchInput.value = '';
    elements.searchClear.classList.remove('visible');
    elements.searchResultsSection.classList.remove('active');
    
    if (!elements.menuSection.classList.contains('active')) {
        elements.heroSection.style.display = 'block';
        elements.bannerSliderSection.style.display = 'block';
        elements.categorySection.style.display = 'block';
        if (bannerSlider) bannerSlider.startAutoPlay();
    }
}

// ========== ITEM CUSTOMIZATION ==========
function handleAddClick(e) {
    const btn = e.currentTarget;
    const itemId = btn.dataset.itemId;
    const categoryType = btn.dataset.category;
    
    // Find the item
    let item = null;
    Object.keys(menuData).forEach(categoryKey => {
        const found = menuData[categoryKey].items.find(i => i.id === itemId);
        if (found) {
            item = { ...found, categoryType };
        }
    });
    
    if (!item) return;
    if (item.available === false) return; // Block unavailable items
    
    currentItem = item;
    selectedVariant = null;
    customizeQuantity = 1;
    
    // Open customize modal
    openCustomizeModal(item);
}

function openCustomizeModal(item) {
    elements.customizeImage.src = item.image;
    elements.customizeImage.alt = item.name;
    elements.customizeName.textContent = item.name;
    elements.customizeDesc.textContent = item.desc;
    elements.customizeQtyValue.textContent = '1';
    
    // Clear and setup variant options based on item type
    elements.variantOptions.innerHTML = '';
    
    if (item.prices) {
        // Ice cream - gram selection
        elements.variantSelection.classList.remove('hidden');
        Object.entries(item.prices).forEach(([size, price], index) => {
            const option = createVariantOption(size, price, index === 0);
        });
        selectedVariant = Object.keys(item.prices)[0];
    } else if (item.sizes) {
        // Chicken - size selection
        elements.variantSelection.classList.remove('hidden');
        Object.entries(item.sizes).forEach(([size, price], index) => {
            createVariantOption(size, price, index === 0);
        });
        selectedVariant = Object.keys(item.sizes)[0];
    } else if (item.thickPrice) {
        // Shakes - regular/thick selection
        elements.variantSelection.classList.remove('hidden');
        createVariantOption('Milk Shake', item.price, true);
        createVariantOption('Thick Shake', item.thickPrice, false);
        selectedVariant = 'Milk Shake';
    } else {
        // Fixed price items (combos, some others)
        elements.variantSelection.classList.add('hidden');
        selectedVariant = null;
    }
    
    updateCustomizeTotal();
    
    // Show modal
    elements.customizeOverlay.classList.add('active');
    elements.customizeModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function createVariantOption(name, price, isSelected) {
    const option = document.createElement('div');
    option.className = `variant-option ${isSelected ? 'selected' : ''}`;
    option.dataset.variant = name;
    option.dataset.price = price;
    
    option.innerHTML = `
        <div class="variant-option-info">
            <div class="variant-radio"></div>
            <span class="variant-name">${name}</span>
        </div>
        <span class="variant-price">${formatPrice(price)}</span>
    `;
    
    option.addEventListener('click', () => selectVariant(option, name));
    elements.variantOptions.appendChild(option);
}

function selectVariant(optionElement, variantName) {
    // Deselect all
    elements.variantOptions.querySelectorAll('.variant-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    // Select clicked option
    optionElement.classList.add('selected');
    selectedVariant = variantName;
    
    updateCustomizeTotal();
}

function updateCustomizeTotal() {
    if (!currentItem) return;
    
    let unitPrice = 0;
    
    if (currentItem.prices && selectedVariant) {
        unitPrice = currentItem.prices[selectedVariant];
    } else if (currentItem.sizes && selectedVariant) {
        unitPrice = currentItem.sizes[selectedVariant];
    } else if (currentItem.thickPrice && selectedVariant) {
        unitPrice = selectedVariant === 'Thick Shake' ? currentItem.thickPrice : currentItem.price;
    } else {
        unitPrice = currentItem.price;
    }
    
    const total = unitPrice * customizeQuantity;
    elements.customizeTotalAmount.textContent = formatPrice(total);
}

function closeCustomizeModal() {
    elements.customizeOverlay.classList.remove('active');
    elements.customizeModal.classList.remove('active');
    document.body.style.overflow = '';
    currentItem = null;
    selectedVariant = null;
    customizeQuantity = 1;
}

// ========== CART FUNCTIONS ==========
function addToCart() {
    if (!currentItem) return;
    
    let unitPrice = 0;
    let variantDisplay = '';
    
    if (currentItem.prices && selectedVariant) {
        unitPrice = currentItem.prices[selectedVariant];
        variantDisplay = selectedVariant;
    } else if (currentItem.sizes && selectedVariant) {
        unitPrice = currentItem.sizes[selectedVariant];
        variantDisplay = selectedVariant;
    } else if (currentItem.thickPrice && selectedVariant) {
        unitPrice = selectedVariant === 'Thick Shake' ? currentItem.thickPrice : currentItem.price;
        variantDisplay = selectedVariant;
    } else {
        unitPrice = currentItem.price;
        variantDisplay = '';
    }
    
    const cartItemId = generateCartItemId(currentItem, selectedVariant);
    
    // Check if item already exists in cart
    const existingIndex = cart.findIndex(item => item.cartItemId === cartItemId);
    
    if (existingIndex > -1) {
        cart[existingIndex].quantity += customizeQuantity;
    } else {
        cart.push({
            cartItemId,
            id: currentItem.id,
            name: currentItem.name,
            image: currentItem.image,
            variant: variantDisplay,
            unitPrice,
            quantity: customizeQuantity,
            categoryType: currentItem.categoryType || ''
        });
    }
    
    updateCartUI();
    closeCustomizeModal();
    
    // Brief feedback
    elements.cartBadge.classList.add('pulse');
    setTimeout(() => elements.cartBadge.classList.remove('pulse'), 300);
}

function removeFromCart(cartItemId) {
    cart = cart.filter(item => item.cartItemId !== cartItemId);
    updateCartUI();
}

function updateCartItemQuantity(cartItemId, change) {
    const item = cart.find(item => item.cartItemId === cartItemId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(cartItemId);
    } else {
        updateCartUI();
    }
}

function updateCartUI() {
    saveCart();
    // Update badge
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    elements.cartBadge.textContent = totalItems;
    elements.cartBadge.classList.toggle('visible', totalItems > 0);
    
    // Update cart items
    if (cart.length === 0) {
        elements.cartEmpty.classList.remove('hidden');
        elements.cartFooter.classList.remove('visible');
        return;
    }
    
    elements.cartEmpty.classList.add('hidden');
    elements.cartFooter.classList.add('visible');
    
    // Clear and re-render cart items (except empty state)
    const cartItemElements = elements.cartItems.querySelectorAll('.cart-item');
    cartItemElements.forEach(el => el.remove());
    
    let subtotal = 0;
    
    cart.forEach(item => {
        const itemTotal = item.unitPrice * item.quantity;
        subtotal += itemTotal;
        
        const cartItemEl = document.createElement('div');
        cartItemEl.className = 'cart-item';
        cartItemEl.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <h4 class="cart-item-name">${item.name}</h4>
                ${item.variant ? `<span class="cart-item-variant">${item.variant}</span>` : ''}
                <div class="cart-item-controls">
                    <div class="cart-qty-controls">
                        <button class="cart-qty-btn" data-action="decrease" data-cart-id="${item.cartItemId}">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                        </button>
                        <span class="cart-qty-value">${item.quantity}</span>
                        <button class="cart-qty-btn" data-action="increase" data-cart-id="${item.cartItemId}">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                        </button>
                    </div>
                    <span class="cart-item-total">${formatPrice(itemTotal)}</span>
                </div>
            </div>
            <button class="cart-item-remove" data-cart-id="${item.cartItemId}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
            </button>
        `;
        
        elements.cartItems.insertBefore(cartItemEl, elements.cartEmpty);
    });
    
    elements.subtotalAmount.textContent = formatPrice(subtotal);

    // ===== COUPON / DISCOUNT DISPLAY =====
    var couponArea = document.getElementById('couponArea');
    var discountRow = document.getElementById('discountRow');
    var cartTotalRow = document.getElementById('cartTotalRow');

    if (couponArea) {
        if (appliedCoupon) {
            couponArea.innerHTML = '<div class="coupon-applied">' +
                '<span class="coupon-applied-tag">🎉 ' + appliedCoupon.code + ' — ' + getCouponLabel(appliedCoupon) + '</span>' +
                '<button class="coupon-remove-btn" id="removeCouponBtn">✕</button>' +
                '</div>';
            var removeBtn = document.getElementById('removeCouponBtn');
            if (removeBtn) removeBtn.addEventListener('click', removeCoupon);
        } else {
            couponArea.innerHTML = '<div class="coupon-input-row">' +
                '<input type="text" id="couponInput" class="coupon-input" placeholder="Promo code">' +
                '<button class="coupon-apply-btn" id="applyCouponBtn">Apply</button>' +
                '</div>' +
                '<span class="coupon-msg" id="couponMsg"></span>';
            var applyBtn = document.getElementById('applyCouponBtn');
            var couponInput = document.getElementById('couponInput');
            if (applyBtn && couponInput) {
                applyBtn.addEventListener('click', function() {
                    var result = applyCoupon(couponInput.value);
                    var msgEl = document.getElementById('couponMsg');
                    if (result.success) {
                        updateCartUI();
                    } else if (msgEl) {
                        msgEl.textContent = result.msg;
                        msgEl.className = 'coupon-msg coupon-msg-error';
                    }
                });
                couponInput.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter') { e.preventDefault(); applyBtn.click(); }
                });
            }
        }
    }

    // Show/hide discount row
    var discount = calculateDiscount(subtotal);
    if (discountRow) {
        if (discount > 0) {
            discountRow.style.display = 'flex';
            document.getElementById('discountAmount').textContent = '- ' + formatPrice(discount);
        } else {
            discountRow.style.display = 'none';
        }
    }
    if (cartTotalRow) {
        cartTotalRow.querySelector('.cart-total-amount').textContent = formatPrice(subtotal - discount);
    }
    
    // Add event listeners
    elements.cartItems.querySelectorAll('.cart-qty-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const action = btn.dataset.action;
            const cartId = btn.dataset.cartId;
            updateCartItemQuantity(cartId, action === 'increase' ? 1 : -1);
        });
    });
    
    elements.cartItems.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', () => {
            removeFromCart(btn.dataset.cartId);
        });
    });
}

function openCart() {
    elements.cartOverlay.classList.add('active');
    elements.cartPanel.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    elements.cartOverlay.classList.remove('active');
    elements.cartPanel.classList.remove('active');
    document.body.style.overflow = '';
}

// ========== CHECKOUT FUNCTIONS ==========
function openCheckout() {
    if (cart.length === 0) return;
    
    // Render summary
    elements.checkoutSummary.innerHTML = '';
    let subtotal = 0;
    
    cart.forEach(item => {
        const itemTotal = item.unitPrice * item.quantity;
        subtotal += itemTotal;
        
        const summaryItem = document.createElement('div');
        summaryItem.className = 'summary-item';
        summaryItem.innerHTML = `
            <div class="summary-item-info">
                <span class="summary-item-name">${item.name} x ${item.quantity}</span>
                ${item.variant ? `<span class="summary-item-variant">${item.variant}</span>` : ''}
            </div>
            <span class="summary-item-price">${formatPrice(itemTotal)}</span>
        `;
        elements.checkoutSummary.appendChild(summaryItem);
    });

    // Apply discount if coupon is active
    var discount = calculateDiscount(subtotal);
    var total = subtotal - discount;

    if (discount > 0 && appliedCoupon) {
        var discountSummary = document.createElement('div');
        discountSummary.className = 'summary-item summary-discount';
        discountSummary.innerHTML = '<div class="summary-item-info"><span class="summary-item-name" style="color:#16A34A;">🎉 ' + appliedCoupon.code + ' (' + getCouponLabel(appliedCoupon) + ')</span></div><span class="summary-item-price" style="color:#16A34A;">- ' + formatPrice(discount) + '</span>';
        elements.checkoutSummary.appendChild(discountSummary);
    }
    
    elements.checkoutTotal.textContent = formatPrice(total);
    
    // Generate UPI QR Code
    generateUpiQr(total);
    
    // Reset payment method to UPI
    resetPaymentUI();
    
    // Close cart and open checkout
    closeCart();
    elements.checkoutOverlay.classList.add('active');
    elements.checkoutModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// ========== UPI PAYMENT INTEGRATION ==========
var UPI_ID = '9381084499-2@ybl';
var UPI_NAME = 'Kartikeya Ice Creams';

function generateUpiQr(amount) {
    var upiLink = 'upi://pay?pa=' + encodeURIComponent(UPI_ID) +
        '&pn=' + encodeURIComponent(UPI_NAME) +
        '&am=' + amount.toFixed(2) +
        '&cu=INR' +
        '&tn=' + encodeURIComponent('KKFC Order Payment');
    
    var qrImg = document.getElementById('upiQrImage');
    var upiAmountEl = document.getElementById('upiAmount');
    var upiDeepLink = document.getElementById('upiDeepLink');
    
    if (qrImg) {
        qrImg.src = 'https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=' + encodeURIComponent(upiLink);
    }
    if (upiAmountEl) {
        upiAmountEl.textContent = 'Amount: Rs. ' + amount.toFixed(2);
    }
    if (upiDeepLink) {
        upiDeepLink.href = upiLink;
    }
}

function resetPaymentUI() {
    var upiSection = document.getElementById('upiPaymentSection');
    var upiConfirm = document.getElementById('upiConfirmCheckbox');
    var confirmBtnText = document.getElementById('confirmBtnText');
    var methods = document.querySelectorAll('.payment-option');
    
    // Reset to UPI selected
    methods.forEach(function(m) {
        if (m.dataset.method === 'upi') {
            m.classList.add('selected');
            m.querySelector('input[type="radio"]').checked = true;
        } else {
            m.classList.remove('selected');
        }
    });
    
    if (upiSection) upiSection.style.display = 'block';
    if (upiConfirm) upiConfirm.checked = false;
    if (confirmBtnText) confirmBtnText.textContent = 'Confirm Order via WhatsApp';
    // Reset screenshot upload
    var ssSection = document.getElementById('upiScreenshotSection');
    var ssInput = document.getElementById('upiScreenshotInput');
    var ssPreview = document.getElementById('upiUploadPreview');
    var ssPlaceholder = document.getElementById('upiUploadPlaceholder');
    if (ssSection) ssSection.style.display = 'none';
    if (ssInput) ssInput.value = '';
    if (ssPreview) ssPreview.style.display = 'none';
    if (ssPlaceholder) ssPlaceholder.style.display = 'flex';
    window._upiScreenshotUploaded = false;
}

function setupPaymentToggle() {
    var methods = document.querySelectorAll('.payment-option');
    var upiSection = document.getElementById('upiPaymentSection');
    var confirmBtnText = document.getElementById('confirmBtnText');
    
    methods.forEach(function(option) {
        option.addEventListener('click', function() {
            methods.forEach(function(m) { m.classList.remove('selected'); });
            option.classList.add('selected');
            option.querySelector('input[type="radio"]').checked = true;
            
            var method = option.dataset.method;
            if (upiSection) {
                upiSection.style.display = method === 'upi' ? 'block' : 'none';
            }
            if (confirmBtnText) {
                confirmBtnText.textContent = method === 'upi' 
                    ? 'Confirm Order via WhatsApp' 
                    : 'Place COD Order via WhatsApp';
            }
        });
    });
    
    // Copy UPI ID button
    var copyBtn = document.getElementById('upiCopyBtn');
    if (copyBtn) {
        copyBtn.addEventListener('click', function(e) {
            e.preventDefault();
            navigator.clipboard.writeText(UPI_ID).then(function() {
                copyBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><polyline points="20 6 9 17 4 12"/></svg>';
                setTimeout(function() {
                    copyBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>';
                }, 2000);
            });
        });
    }
    
    // UPI confirm checkbox — show/hide screenshot upload
    var upiCheckbox = document.getElementById('upiConfirmCheckbox');
    if (upiCheckbox) {
        upiCheckbox.addEventListener('change', function() {
            var ssSection = document.getElementById('upiScreenshotSection');
            if (ssSection) {
                ssSection.style.display = upiCheckbox.checked ? 'block' : 'none';
            }
        });
    }

    // Screenshot upload handling
    var uploadArea = document.getElementById('upiUploadArea');
    var ssFileInput = document.getElementById('upiScreenshotInput');
    var ssPreviewWrap = document.getElementById('upiUploadPreview');
    var ssPlaceholder = document.getElementById('upiUploadPlaceholder');
    var ssPreviewImg = document.getElementById('upiScreenshotPreview');
    var ssRemoveBtn = document.getElementById('upiRemoveScreenshot');
    window._upiScreenshotUploaded = false;

    if (uploadArea && ssFileInput) {
        // Click to upload
        uploadArea.addEventListener('click', function(e) {
            if (e.target.closest('.upi-remove-btn')) return;
            ssFileInput.click();
        });
        // File selected
        ssFileInput.addEventListener('change', function() {
            if (ssFileInput.files && ssFileInput.files[0]) {
                var file = ssFileInput.files[0];
                if (!file.type.startsWith('image/')) {
                    alert('Please upload an image file.');
                    ssFileInput.value = '';
                    return;
                }
                if (file.size > 10 * 1024 * 1024) {
                    alert('Image is too large. Please upload an image under 10MB.');
                    ssFileInput.value = '';
                    return;
                }
                var reader = new FileReader();
                reader.onload = function(ev) {
                    ssPreviewImg.src = ev.target.result;
                    ssPlaceholder.style.display = 'none';
                    ssPreviewWrap.style.display = 'flex';
                    window._upiScreenshotUploaded = true;
                    uploadArea.classList.remove('upload-error');
                };
                reader.readAsDataURL(file);
            }
        });
    }
    // Remove screenshot
    if (ssRemoveBtn) {
        ssRemoveBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            ssFileInput.value = '';
            ssPreviewWrap.style.display = 'none';
            ssPlaceholder.style.display = 'flex';
            window._upiScreenshotUploaded = false;
        });
    }
}

function closeCheckout() {
    elements.checkoutOverlay.classList.remove('active');
    elements.checkoutModal.classList.remove('active');
    document.body.style.overflow = '';
}

function processOrder(e) {
    e.preventDefault();
    
    const formData = new FormData(elements.checkoutForm);
    const customerName = formData.get('name');
    const customerPhone = formData.get('phone');
    const deliveryLocation = formData.get('location');
    const orderNotes = formData.get('notes');
    const paymentMethod = formData.get('paymentMethod') || 'cod';
    
    // UPI: require confirmation checkbox + screenshot
    if (paymentMethod === 'upi') {
        var upiCheck = document.getElementById('upiConfirmCheckbox');
        if (upiCheck && !upiCheck.checked) {
            upiCheck.parentElement.classList.add('shake');
            setTimeout(function() { upiCheck.parentElement.classList.remove('shake'); }, 600);
            alert('Please confirm that you have completed the UPI payment.');
            return;
        }
        if (!window._upiScreenshotUploaded) {
            var uploadArea = document.getElementById('upiUploadArea');
            if (uploadArea) {
                uploadArea.classList.add('upload-error');
                setTimeout(function() { uploadArea.classList.remove('upload-error'); }, 3000);
            }
            alert('Please upload your payment screenshot as proof.');
            return;
        }
    }
    
    // Build WhatsApp message
    let message = `New Order - Kartikeya Ice Creams & KKFC\n\n`;
    message += `Customer Details:\n`;
    message += `Name: ${customerName}\n`;
    message += `Phone: ${customerPhone}\n`;
    message += `Location: ${deliveryLocation}\n`;
    if (orderNotes) {
        message += `Notes: ${orderNotes}\n`;
    }
    if (paymentMethod === 'upi') {
        message += `\nPayment: ✅ UPI (Paid)\n`;
        message += `� IMPORTANT: Customer will share payment screenshot in this chat for verification\n`;
        message += `⚠️ Please verify screenshot before dispatching order\n`;
    } else {
        message += `\nPayment: 💰 Cash on Delivery\n`;
    }
    message += `\nOrder Details:\n`;
    message += `----------------------------------------\n`;
    
    let subtotalOrder = 0;
    cart.forEach((item, index) => {
        const itemTotal = item.unitPrice * item.quantity;
        subtotalOrder += itemTotal;
        message += `${index + 1}. ${item.name}\n`;
        if (item.variant) {
            message += `   Size: ${item.variant}\n`;
        }
        message += `   Qty: ${item.quantity}\n`;
        message += `   Amount: Rs. ${itemTotal.toFixed(2)}\n\n`;
    });
    
    var orderDiscount = calculateDiscount(subtotalOrder);
    var total = subtotalOrder - orderDiscount;

    message += `----------------------------------------\n`;
    if (orderDiscount > 0 && appliedCoupon) {
        message += `Subtotal: Rs. ${subtotalOrder.toFixed(2)}\n`;
        message += `Discount (${appliedCoupon.code}): - Rs. ${orderDiscount.toFixed(2)}\n`;
    }
    message += `Total Amount: Rs. ${total.toFixed(2)}\n`;
    
    // Encode and redirect to WhatsApp
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/917032944849?text=${encodedMessage}`;
    
    // ===== SAVE ORDER TO FIRESTORE =====
    try {
        if (typeof ordersRef !== 'undefined' && ordersRef) {
            var orderNum = 'KKFC-' + Date.now().toString(36).toUpperCase();
            var orderItems = cart.map(function(item) {
                return {
                    name: item.name,
                    variant: item.variant || null,
                    qty: item.quantity,
                    unitPrice: item.unitPrice,
                    total: item.unitPrice * item.quantity
                };
            });
            ordersRef.add({
                orderNumber: orderNum,
                customerName: customerName,
                phone: customerPhone,
                address: deliveryLocation,
                notes: orderNotes || '',
                items: orderItems,
                subtotal: subtotalOrder,
                discount: orderDiscount,
                couponCode: appliedCoupon ? appliedCoupon.code : null,
                total: total,
                paymentMethod: paymentMethod,
                status: 'pending',
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            }).catch(function(err) {
                console.warn('[KKFC] Could not save order to Firestore:', err.message);
            });
        }
    } catch(e) {
        console.warn('[KKFC] Firestore not available, order not saved:', e.message);
    }
    
    // Clear cart, coupon and close modals
    cart = [];
    appliedCoupon = null;
    saveCart();
    updateCartUI();
    closeCheckout();
    elements.checkoutForm.reset();
    
    // Show screenshot reminder for UPI orders, then redirect to WhatsApp
    if (paymentMethod === 'upi') {
        var reminderOverlay = document.getElementById('ssReminderOverlay');
        if (reminderOverlay) {
            reminderOverlay.style.display = 'flex';
            var closeBtn = document.getElementById('ssReminderClose');
            if (closeBtn) {
                closeBtn.onclick = function() {
                    reminderOverlay.style.display = 'none';
                    window.open(whatsappUrl, '_blank');
                };
            }
            // Also close on overlay click
            reminderOverlay.onclick = function(e) {
                if (e.target === reminderOverlay) {
                    reminderOverlay.style.display = 'none';
                    window.open(whatsappUrl, '_blank');
                }
            };
        } else {
            window.open(whatsappUrl, '_blank');
        }
    } else {
        window.open(whatsappUrl, '_blank');
    }
}

// ========== EVENT LISTENERS ==========
function initEventListeners() {
    // Search
    if (elements.searchInput) {
        elements.searchInput.addEventListener('input', debounce((e) => {
            elements.searchClear.classList.toggle('visible', e.target.value.length > 0);
            handleSearch(e.target.value);
        }, 300));
    }
    
    if (elements.searchClear) elements.searchClear.addEventListener('click', clearSearch);
    if (elements.clearSearchBtn) elements.clearSearchBtn.addEventListener('click', clearSearch);
    
    // Order Now Button
    if (elements.orderNowBtn) {
        elements.orderNowBtn.addEventListener('click', () => {
            if (elements.categorySection) elements.categorySection.scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    // Category cards are now <a href="?cat=..."> links — JS click handlers as backup
    // They also have inline onclick, but add JS listeners for reliability
    document.querySelectorAll('.cat-card[onclick]').forEach(function(card) {
        card.addEventListener('click', function(e) {
            var onclickAttr = card.getAttribute('onclick');
            if (onclickAttr) {
                var match = onclickAttr.match(/showMenu\(['"]([^'"]+)['"]\)/);
                if (match && match[1]) {
                    e.preventDefault();
                    e.stopPropagation();
                    showMenu(match[1]);
                }
            }
        });
    });
    
    // Hero tab buttons backup listeners
    document.querySelectorAll('.hero-tab-btn').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            var href = btn.getAttribute('href');
            if (href) {
                var match = href.match(/cat=([^&]+)/);
                if (match && match[1]) showMenu(match[1]);
            }
        });
    });
    
    // Back to Categories
    if (elements.backToCategories) {
        elements.backToCategories.addEventListener('click', backToHome);
    }
    
    // Cart
    var cartBtn = document.querySelector('.cart-link[data-tab=\"cart\"]');
    if (cartBtn) cartBtn.addEventListener('click', openCart);
    if (elements.cartOverlay) elements.cartOverlay.addEventListener('click', closeCart);
    if (elements.cartClose) elements.cartClose.addEventListener('click', closeCart);
    if (elements.addMoreBtn) elements.addMoreBtn.addEventListener('click', () => {
        closeCart();
        showSection('home');
    });
    if (elements.checkoutBtn) elements.checkoutBtn.addEventListener('click', openCheckout);
    
    // Checkout
    if (elements.checkoutOverlay) elements.checkoutOverlay.addEventListener('click', closeCheckout);
    if (elements.checkoutBack) elements.checkoutBack.addEventListener('click', closeCheckout);
    if (elements.checkoutForm) elements.checkoutForm.addEventListener('submit', processOrder);
    if (elements.addMoreCheckout) elements.addMoreCheckout.addEventListener('click', () => {
        closeCheckout();
        showSection('home');
    });
    
    // Customize Modal
    if (elements.customizeOverlay) elements.customizeOverlay.addEventListener('click', closeCustomizeModal);
    if (elements.customizeClose) elements.customizeClose.addEventListener('click', closeCustomizeModal);
    
    if (elements.customizeQtyMinus) elements.customizeQtyMinus.addEventListener('click', () => {
        if (customizeQuantity > 1) {
            customizeQuantity--;
            elements.customizeQtyValue.textContent = customizeQuantity;
            updateCustomizeTotal();
        }
    });
    
    if (elements.customizeQtyPlus) elements.customizeQtyPlus.addEventListener('click', () => {
        customizeQuantity++;
        elements.customizeQtyValue.textContent = customizeQuantity;
        updateCustomizeTotal();
    });
    
    if (elements.addToCartBtn) elements.addToCartBtn.addEventListener('click', addToCart);
    
    // View Map
    if (elements.viewMapBtn) {
        elements.viewMapBtn.addEventListener('click', () => {
            window.open('https://www.google.com/maps/place/16%C2%B041\'08.2%22N+80%C2%B023\'18.6%22E/@16.6856136,80.3884893,17z', '_blank');
        });
    }
}

// ========== HAMBURGER MENU ==========
function initHamburger() {
    var btn = document.getElementById('hamburgerBtn');
    var overlay = document.getElementById('mobileNav');
    if (!btn || !overlay) return;

    btn.addEventListener('click', function() {
        btn.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.style.overflow = overlay.classList.contains('active') ? 'hidden' : '';
    });

    // Close on link click
    overlay.querySelectorAll('.mobile-nav-link, .mobile-nav-cta').forEach(function(link) {
        link.addEventListener('click', function() {
            btn.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Mobile Order Now button mirrors main Order Now
    var mobileOrderBtn = document.getElementById('mobileOrderBtn');
    if (mobileOrderBtn) {
        mobileOrderBtn.addEventListener('click', function(e) {
            e.preventDefault();
            btn.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
            showSection('home');
        });
    }
}

// ========== INITIALIZATION ==========
function init() {
    // Check URL for category parameter FIRST (e.g. ?cat=shakes)
    var params = new URLSearchParams(window.location.search);
    var catParam = params.get('cat');
    
    try {
        initEventListeners();
        setupPaymentToggle();
        updateCartUI();
        initHamburger();
        syncMenuFromFirestore();
        syncOffersFromFirestore();
    } catch (err) {
        console.error('KKFC listeners error:', err);
    }
    
    try {
        if (elements.bannerTrack && elements.bannerPagination) {
            bannerSlider = new BannerSlider({ interval: 3500 });
        }
    } catch (err) {
        console.error('KKFC banner error:', err);
    }
    
    try {
        if (catParam && menuData[catParam]) {
            showMenu(catParam);
        } else {
            showSection('home');
        }
    } catch (err) {
        console.error('KKFC showMenu error:', err);
    }
}

// Start the app
document.addEventListener('DOMContentLoaded', init);

// Expose showMenu and backToHome globally for inline onclick handlers
window.showMenu = showMenu;
window.backToHome = backToHome;
