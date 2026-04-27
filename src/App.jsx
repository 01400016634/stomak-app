import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  ShoppingCart, Plus, Minus, BarChart3, Video,
  Sparkles, ChevronRight, ChevronLeft, Calendar, Upload,
  Utensils, Calculator, Check, X, User,
  PackagePlus, Trash2, TrendingUp, DollarSign, Printer,
  ArrowUp, Save, ShoppingBag, Search, BellRing, ClipboardList,
  Phone, Send, Settings2, LogIn, LogOut, LayoutDashboard
} from 'lucide-react';
import emailjs from '@emailjs/browser';

// --- MEDIA IMPORTS MUST BE AT THE VERY TOP ---
import bgVideo from './assets/Burger_and_Cola_Assembly_Video.mp4';
import defaultLogo from './assets/logo.png'; // <--- THIS LOADS YOUR LOGO FROM THE ASSETS FOLDER

import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from 'firebase/auth';

// --- FIREBASE CONFIGURATION ---
// ⚠️ PASTE YOUR FIREBASE CONFIG HERE ⚠️
const firebaseConfig = {
  apiKey: "AIzaSyD6eNN3ZyI46_DsRCh-7y9YQ96K3fnhRGM",
  authDomain: "stomak-soluition.firebaseapp.com",
  projectId: "stomak-soluition",
  storageBucket: "stomak-soluition.firebasestorage.app",
  messagingSenderId: "301690803586",
  appId: "1:301690803586:web:92d5e2373b15b4ddd02b9b",
  measurementId: "G-NLFKN946V6"
};

let auth, googleProvider;
try {
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
} catch (error) {
  console.warn("Firebase not configured.");
}

// --- DATA: INITIAL MENU ---
const initialMenuData = [
  { id: 'b1', name: "The Crown Burger", price: 18.99, category: "Burgers", details: "Wagyu beef, truffle aioli.", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800" },
  { id: 'b2', name: "Spicy Volcano Burger", price: 16.99, category: "Burgers", details: "Double patty, habanero cheese.", image: "https://images.unsplash.com/photo-1594212887874-9276d4001d94?q=80&w=800" },
  { id: 'b3', name: "BBQ Bacon Beast", price: 15.99, category: "Burgers", details: "Applewood bacon, crispy onions.", image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?q=80&w=800" },
  { id: 'b4', name: "Classic Cheeseburger", price: 12.99, category: "Burgers", details: "Angus beef, cheddar, pickles.", image: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?q=80&w=800" },
  { id: 'p1', name: "Truffle Mushroom Pizza", price: 24.99, category: "Pizza", details: "Wild mushrooms, white truffle oil.", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800" },
  { id: 'p2', name: "Pepperoni Passion", price: 19.99, category: "Pizza", details: "Double pepperoni, mozzarella.", image: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?q=80&w=800" },
  { id: 's1', name: "Loaded Cheese Fries", price: 8.99, category: "Snacks", details: "Melted cheddar, bacon bits, jalapenos.", image: "https://images.unsplash.com/photo-1576107232684-1279f390859f?q=80&w=800" },
  { id: 's2', name: "Chicken Wings (12)", price: 15.99, category: "Snacks", details: "Choose Buffalo, BBQ, or Lemon Pepper.", image: "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?q=80&w=800" },
  { id: 'v1', name: "Classic Cola", price: 3.50, category: "Drinks", details: "Refreshing classic soft drink.", image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=800" },
  { id: 'v2', name: "Mango Smoothie", price: 5.99, category: "Drinks", details: "Fresh mango, yogurt, honey blend.", image: "https://images.unsplash.com/photo-1525059337994-6f2a1311b4d4?q=80&w=800" },
  { id: 'c1', name: "Family Royalty Feast", price: 89.99, category: "Combos", details: "1 Burger, 1 Pizza, Fries, Wings, Colas.", image: "https://images.unsplash.com/photo-1563216336-1e663a8a37f5?q=80&w=800" },
];

const categoryList = ["All Items", "Burgers", "Pizza", "Snacks", "Drinks", "Combos"];
const eventTypes = ["Table Reservation", "Birthday Party", "Corporate Event", "Wedding", "Farewell", "Other"];

// --- APP DEFAULT SETTINGS WITH IMPORTED LOGO ---
const defaultSettings = {
  logoImage: defaultLogo, // <--- DEFAULT LOGO IMPORTED FROM ASSETS
  logoText: "STOMAK",
  logoSubText: "Solution",
  homeTitle: "TASTE THE FOOD OF FUTURE.",
  appName: "Stomak OS"
};

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [notification, setNotification] = useState(null);
  const [showScrollFAB, setShowScrollFAB] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const [notifiedOrders, setNotifiedOrders] = useState(() => {
    const saved = localStorage.getItem('stomak_notified');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        setCustomerCheckoutInfo(prev => ({ ...prev, name: user.displayName || '', email: user.email || '' }));
        setBookingInfo(prev => ({ ...prev, name: user.displayName || '', email: user.email || '' }));
      }
    });
    return () => unsubscribe();
  }, []);

  // --- CORE SYSTEM STATE WITH LOCALSTORAGE PERSISTENCE ---
  const [appSettings, setAppSettings] = useState(() => {
    const saved = localStorage.getItem('stomak_settings');
    // If local storage doesn't have a logo but our default does, force an update
    const parsed = saved ? JSON.parse(saved) : defaultSettings;
    if (!parsed.logoImage && defaultLogo) parsed.logoImage = defaultLogo;
    return parsed;
  });

  const [menuItems, setMenuItems] = useState(() => {
    const saved = localStorage.getItem('stomak_menu');
    return saved ? JSON.parse(saved) : initialMenuData;
  });

  const [allOrders, setAllOrders] = useState(() => {
    const saved = localStorage.getItem('stomak_orders');
    return saved ? JSON.parse(saved).map(order => ({ ...order, timestamp: new Date(order.timestamp) })) : [];
  });

  const [reservations, setReservations] = useState(() => {
    const saved = localStorage.getItem('stomak_reservations');
    return saved ? JSON.parse(saved).map(res => ({ ...res, timestamp: new Date(res.timestamp) })) : [];
  });

  const [customerRecords, setCustomerRecords] = useState(() => {
    const saved = localStorage.getItem('stomak_customers');
    return saved ? JSON.parse(saved) : [];
  });

  const [videoSource, setVideoSource] = useState(() => {
    const savedVideo = localStorage.getItem('stomak_bg_video');
    return savedVideo || bgVideo;
  });

  useEffect(() => {
    const syncStorage = (e) => {
      if (e.key === 'stomak_orders') setAllOrders(JSON.parse(e.newValue).map(order => ({ ...order, timestamp: new Date(order.timestamp) })));
      if (e.key === 'stomak_reservations') setReservations(JSON.parse(e.newValue).map(res => ({ ...res, timestamp: new Date(res.timestamp) })));
    };
    window.addEventListener('storage', syncStorage);
    return () => window.removeEventListener('storage', syncStorage);
  }, []);

  useEffect(() => { localStorage.setItem('stomak_settings', JSON.stringify(appSettings)); }, [appSettings]);
  useEffect(() => { localStorage.setItem('stomak_menu', JSON.stringify(menuItems)); }, [menuItems]);
  useEffect(() => { localStorage.setItem('stomak_orders', JSON.stringify(allOrders)); }, [allOrders]);
  useEffect(() => { localStorage.setItem('stomak_reservations', JSON.stringify(reservations)); }, [reservations]);
  useEffect(() => { localStorage.setItem('stomak_customers', JSON.stringify(customerRecords)); }, [customerRecords]);
  useEffect(() => { localStorage.setItem('stomak_notified', JSON.stringify(notifiedOrders)); }, [notifiedOrders]);

  // Customer Ordering State
  const [orderType, setOrderType] = useState('Delivery');
  const [activeCategory, setActiveCategory] = useState('All Items');
  const [searchQuery, setSearchQuery] = useState('');
  const [customerCart, setCustomerCart] = useState([]);
  const [itemQuantities, setItemQuantities] = useState({});
  const [showCustomerCheckout, setShowCustomerCheckout] = useState(false);
  const [customerCheckoutInfo, setCustomerCheckoutInfo] = useState({ name: '', phone: '', email: '' });

  // Booking State
  const [bookingData, setBookingData] = useState({ type: 'Table Reservation', guests: 2, date: '', description: '', menuType: 'Standard Menu', selectedMenuItems: [] });
  const [bookingInfo, setBookingInfo] = useState({ name: '', phone: '', email: '' });
  const [showMenuModal, setShowMenuModal] = useState(false);

  // Admin Panel State
  const [adminTab, setAdminTab] = useState('pos');
  const [posCart, setPosCart] = useState([]);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [vipMembership, setVipMembership] = useState(false);
  const [posCustomerInfo, setPosCustomerInfo] = useState({ name: '', phone: '', email: '' });
  const [receiptData, setReceiptData] = useState(null);
  const [newItemForm, setNewItemForm] = useState({ name: '', price: '', category: 'Burgers', details: '', image: null });

  const formRef = useRef();
  const [isSendingMail, setIsSendingMail] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScrollFAB(window.scrollY > 200);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const showNotification = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleLogin = async () => {
    if (!auth) return showNotification("Please add Firebase Config in App.jsx!", "error");
    try {
      await signInWithPopup(auth, googleProvider);
      showNotification("Logged in successfully!");
      setCurrentView('customerDashboard');
    } catch (error) {
      showNotification("Login failed. Try again.", "error");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    showNotification("Logged out successfully.");
    setCurrentView('home');
  };

  useEffect(() => {
    if (currentUser) {
      const readyOrders = allOrders.filter(o => o.customer.email === currentUser.email && o.status === 'Ready to Serve');
      readyOrders.forEach(order => {
        if (!notifiedOrders.includes(order.id)) {
          showNotification(`🔔 ${currentUser.displayName}, your food is ready for collect. Enjoy your food!`, 'success');
          setNotifiedOrders(prev => [...prev, order.id]);
        }
      });
    }
  }, [allOrders, currentUser, notifiedOrders]);


  const sendEmail = (e) => {
    e.preventDefault();
    setIsSendingMail(true);
    if (!formRef.current.user_name.value || !formRef.current.user_email.value || !formRef.current.message.value) {
      showNotification("Please fill all fields!", "error");
      setIsSendingMail(false); return;
    }
    emailjs.sendForm('service_aicywzk', 'template_9n9tk2g', formRef.current, 'Fabn3ObqC-RdCDk0L')
      .then(() => {
        showNotification("Enquiry sent successfully! We will reply soon.");
        formRef.current.reset();
      }, (error) => {
        showNotification("Failed to send enquiry. Please check console.", "error");
        console.error(error.text);
      })
      .finally(() => setIsSendingMail(false));
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          localStorage.setItem('stomak_bg_video', reader.result);
          setVideoSource(reader.result);
          showNotification("Background Video Saved Permanently!");
        };
      } catch (err) {
        setVideoSource(URL.createObjectURL(file));
      }
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setAppSettings({ ...appSettings, logoImage: reader.result });
        showNotification("Logo updated! Remember to click Save Preferences.");
      };
    }
  };

  const handleSettingChange = (e) => setAppSettings({ ...appSettings, [e.target.name]: e.target.value });

  const handleItemImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => setNewItemForm({ ...newItemForm, image: reader.result });
    }
  };

  const addMenuItem = () => {
    if (!newItemForm.name || !newItemForm.price || !newItemForm.image) return showNotification("Missing Name, Price, or Image!", "error");
    const id = newItemForm.name.toLowerCase().replace(/ /g, '-') + Date.now();
    setMenuItems(prev => [{ ...newItemForm, id, price: parseFloat(newItemForm.price) }, ...prev]);
    setNewItemForm({ name: '', price: '', category: 'Burgers', details: '', image: null });
    showNotification("Item added successfully!");
  };

  const deleteMenuItem = (id, name) => {
    if (window.confirm(`Delete '${name}'?`)) {
      setMenuItems(prev => prev.filter(item => item.id !== id));
      showNotification(`Item deleted!`);
    }
  };

  const updateItemQty = (id, delta) => setItemQuantities(prev => ({ ...prev, [id]: Math.max(1, (prev[id] || 1) + delta) }));

  const addToCart = (item, qtyToAdd = 1, cartType = 'customer') => {
    const setTargetCart = cartType === 'customer' ? setCustomerCart : setPosCart;
    setTargetCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + qtyToAdd } : i);
      return [...prev, { ...item, qty: qtyToAdd }];
    });
    if (cartType === 'customer') {
      showNotification(`Added ${qtyToAdd}x ${item.name}!`);
      setItemQuantities(prev => ({ ...prev, [item.id]: 1 }));
    }
  };

  const changeQty = (id, delta, cartType = 'customer') => {
    const setTargetCart = cartType === 'customer' ? setCustomerCart : setPosCart;
    setTargetCart(prev => prev.map(item => item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item));
  };

  const removeFromCart = (id, cartType = 'customer') => {
    const setTargetCart = cartType === 'customer' ? setCustomerCart : setPosCart;
    setTargetCart(prev => prev.filter(item => item.id !== id));
  };

  const customerCartTotal = useMemo(() => customerCart.reduce((sum, item) => sum + (item.price * item.qty), 0), [customerCart]);

  const saveToCustomerRecords = (customerInfo, orderData, isVIP = false) => {
    setCustomerRecords(prevRecords => {
      const existingIdx = prevRecords.findIndex(c => c.phone === customerInfo.phone || (c.email && c.email === customerInfo.email));
      const orderSummary = { id: orderData.id, date: orderData.timestamp.toLocaleDateString(), items: orderData.items, total: orderData.finalTotal, status: orderData.status };

      if (existingIdx !== -1) {
        const recordsCopy = [...prevRecords];
        recordsCopy[existingIdx] = {
          ...recordsCopy[existingIdx],
          name: customerInfo.name,
          email: customerInfo.email || recordsCopy[existingIdx].email,
          isVIP: isVIP || recordsCopy[existingIdx].isVIP,
          totalOrders: recordsCopy[existingIdx].totalOrders + 1,
          totalSpent: recordsCopy[existingIdx].totalSpent + orderData.finalTotal,
          orderHistory: [orderSummary, ...(recordsCopy[existingIdx].orderHistory || [])]
        };
        return recordsCopy;
      } else {
        return [{ ...customerInfo, isVIP, totalOrders: 1, totalSpent: orderData.finalTotal, orderHistory: [orderSummary] }, ...prevRecords];
      }
    });
  };

  // --- SUBMIT BOOKING RESERVATION ---
  const toggleMenuItemForBooking = (item) => {
    const isSelected = bookingData.selectedMenuItems.some(i => i.id === item.id);
    if (isSelected) setBookingData(prev => ({ ...prev, selectedMenuItems: prev.selectedMenuItems.filter(i => i.id !== item.id) }));
    else setBookingData(prev => ({ ...prev, selectedMenuItems: [...prev.selectedMenuItems, item] }));
  };

  const submitBookingRequest = () => {
    if (!bookingData.date || !bookingData.guests || !bookingInfo.name || !bookingInfo.phone) {
      return showNotification("Please fill your Name, Phone, Date and Guests!", "error");
    }

    const newReservation = {
      id: `RES-${Math.floor(10000 + Math.random() * 90000)}`,
      timestamp: new Date(),
      customer: bookingInfo,
      details: bookingData,
      status: 'New'
    };

    setReservations(prev => [newReservation, ...prev]);

    const templateParams = {
      user_name: bookingInfo.name,
      user_email: bookingInfo.email,
      message: `NEW BOOKING: ${bookingData.guests} guests on ${bookingData.date}. Type: ${bookingData.type}. Phone: ${bookingInfo.phone}. Requests: ${bookingData.description}`
    };
    emailjs.send('service_aicywzk', 'template_9n9tk2g', templateParams, 'Fabn3ObqC-RdCDk0L');

    showNotification("Reservation Request Submitted & Saved to Admin Panel!");

    setBookingData({ type: 'Table Reservation', guests: 2, date: '', description: '', menuType: 'Standard Menu', selectedMenuItems: [] });
    if (!currentUser) setBookingInfo({ name: '', phone: '', email: '' });
    setShowMenuModal(false);
  };

  const submitCustomerAppOrder = () => {
    if (!customerCheckoutInfo.name || !customerCheckoutInfo.phone) return showNotification("Enter Name and Phone!", "error");
    const newOrder = { id: `APP-${Math.floor(100000 + Math.random() * 900000)}`, timestamp: new Date(), customer: customerCheckoutInfo, items: customerCart, orderType: orderType, source: 'Customer App', status: 'Pending Kitchen', finalTotal: customerCartTotal };
    setAllOrders(prev => [newOrder, ...prev]);
    saveToCustomerRecords(customerCheckoutInfo, newOrder);
    setShowCustomerCheckout(false); setCustomerCart([]);

    if (currentUser) { setCustomerCheckoutInfo({ name: currentUser.displayName, phone: '', email: currentUser.email }); }
    else { setCustomerCheckoutInfo({ name: '', phone: '', email: '' }); }

    showNotification(`Order Sent! Preparing your ${orderType}.`);
  };

  const processPOSOrderPayment = () => {
    if (!posCustomerInfo.name || !posCustomerInfo.phone) return showNotification("Missing Customer Details!", "error");
    if (posCart.length === 0) return showNotification("Cart is empty!", "error");

    const newOrder = { id: `POS-${Math.floor(100000 + Math.random() * 900000)}`, timestamp: new Date(), customer: posCustomerInfo, items: posCart, orderType: 'Walk-in', source: 'Admin POS', status: 'Pending Kitchen', subtotal: posSubtotal, vipMemberUsed: vipMembership, memberDiscountAmount, manualDiscountPercent: discountPercent, manualDiscountAmount, finalTotal: posFinalTotal };
    setAllOrders(prev => [newOrder, ...prev]);
    saveToCustomerRecords(posCustomerInfo, newOrder, vipMembership);
    setReceiptData(newOrder); setPosCart([]); setDiscountPercent(0); setVipMembership(false); setPosCustomerInfo({ name: '', phone: '', email: '' });
    showNotification("Payment Processed Successfully!");
  };

  const markOrderAsReady = (orderId, customerName) => {
    setAllOrders(prev => prev.map(order => order.id === orderId ? { ...order, status: 'Ready to Serve' } : order));
    showNotification(`🔔 ORDER READY: ${customerName}'s order is ready!`, 'success');
  };

  const posSubtotal = useMemo(() => posCart.reduce((sum, item) => sum + (item.price * item.qty), 0), [posCart]);
  const memberDiscountAmount = useMemo(() => vipMembership ? posSubtotal * 0.10 : 0, [vipMembership, posSubtotal]);
  const manualDiscountAmount = useMemo(() => (posSubtotal - memberDiscountAmount) * (discountPercent / 100), [posSubtotal, memberDiscountAmount, discountPercent]);
  const posFinalTotal = posSubtotal - memberDiscountAmount - manualDiscountAmount;

  const { totalSellDay, totalSellMonth, topSellingItem } = useMemo(() => {
    const today = new Date().toDateString(); const currentMonth = new Date().getMonth();
    let daySum = 0, monthSum = 0; const itemCounts = {};
    allOrders.forEach(order => {
      const date = new Date(order.timestamp);
      if (date.toDateString() === today) daySum += order.finalTotal;
      if (date.getMonth() === currentMonth) monthSum += order.finalTotal;
      order.items.forEach(item => itemCounts[item.name] = (itemCounts[item.name] || 0) + item.qty);
    });
    let topItem = "None", maxCount = 0;
    Object.entries(itemCounts).forEach(([name, count]) => { if (count > maxCount) { maxCount = count; topItem = name; } });
    return { totalSellDay: daySum, totalSellMonth: monthSum, topSellingItem: topItem };
  }, [allOrders]);

  const filteredCustomerMenu = useMemo(() => {
    let result = activeCategory === 'All Items' ? menuItems : menuItems.filter(i => i.category === activeCategory);
    if (searchQuery) result = result.filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return result;
  }, [menuItems, activeCategory, searchQuery]);

  return (
    <div className="min-h-screen font-sans text-white bg-black selection:bg-orange-500/30 overflow-x-hidden print:bg-white print:text-black">

      {/* BACKGROUND VIDEO */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none print:hidden">
        <video key={videoSource} autoPlay loop muted playsInline preload="auto" className="w-full h-full object-cover opacity-100 scale-105">
          <source src={videoSource} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-black/[0.65] via-black/[0.40] to-transparent"></div>
      </div>

      <div className="print:hidden relative z-10">
        {/* NAVIGATION BAR */}
        <nav className="fixed w-full z-50 bg-black/70 backdrop-blur-xl border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex justify-between items-center">
            <div className="flex items-center gap-4">
              {currentView !== 'home' && (
                <button onClick={() => setCurrentView('home')} className="p-2 text-gray-400 hover:text-white bg-white/5 rounded-full hover:bg-white/10 transition flex items-center justify-center">
                  <ChevronLeft size={20} />
                </button>
              )}

              {/* --- PERFECT CIRCLE LOGO --- */}
              <div className="cursor-pointer flex items-center gap-3" onClick={() => setCurrentView('home')}>
                {appSettings.logoImage && (
                  <img src={appSettings.logoImage} alt="App Logo" className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-orange-500 object-cover shadow-lg bg-black" />
                )}
                <span className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600 tracking-tighter uppercase">
                  {appSettings.logoText}<span className="text-white font-light lowercase">{appSettings.logoSubText}</span>
                </span>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-6">
              {['home', 'menu', 'book', 'admin'].map(view => (
                <button key={view} onClick={() => setCurrentView(view)} className={`text-sm font-bold uppercase tracking-widest transition-colors ${currentView === view ? 'text-orange-500' : 'text-gray-400 hover:text-white'}`}>{view}</button>
              ))}

              {currentUser ? (
                <div className="flex items-center gap-4 pl-4 border-l border-white/20">
                  <button onClick={() => setCurrentView('customerDashboard')} className="flex items-center gap-2 text-sm font-bold text-gray-300 hover:text-white transition">
                    <img src={currentUser.photoURL} alt="Profile" className="w-8 h-8 rounded-full border-2 border-orange-500" />
                    Hi, {currentUser.displayName.split(' ')[0]}
                  </button>
                  <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition" title="Logout">
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <button onClick={handleLogin} className="flex items-center gap-2 text-sm font-bold bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition ml-4">
                  <LogIn size={16} /> SIGN IN
                </button>
              )}

              <button onClick={() => setShowCustomerCheckout(true)} className="relative p-3 text-gray-300 bg-white/5 rounded-full hover:bg-white/10 transition">
                <ShoppingCart size={18} />
                {customerCart.length > 0 && <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-black rounded-full h-5 w-5 flex items-center justify-center">{customerCart.length}</span>}
              </button>
            </div>

            <div className="md:hidden flex items-center gap-3">
              {currentUser && (
                <button onClick={() => setCurrentView('customerDashboard')}>
                  <img src={currentUser.photoURL} alt="Profile" className="w-8 h-8 rounded-full border-2 border-orange-500" />
                </button>
              )}
              <button onClick={() => setShowCustomerCheckout(true)} className="relative p-2 text-gray-300 bg-white/5 rounded-full">
                <ShoppingCart size={18} />
                {customerCart.length > 0 && <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-black rounded-full h-5 w-5 flex items-center justify-center">{customerCart.length}</span>}
              </button>
            </div>
          </div>
        </nav>

        <main className="pt-28 pb-32 px-4 md:px-6 max-w-7xl mx-auto min-h-screen">

          {/* HOME */}
          {currentView === 'home' && (
            <>
              <div className="h-[75vh] flex flex-col items-start justify-center animate-in fade-in slide-in-from-left-8 duration-1000">
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tighter mb-8 text-shadow-xl uppercase max-w-4xl">
                  {appSettings.homeTitle.split(' ').map((word, index) => {
                    const w = word.toLowerCase().replace(/[^a-z]/g, '');
                    if (w === 'the' || w === 'of') return <span key={index} className="text-yellow-400">{word} </span>;
                    if (w === 'future') return <span key={index} className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600">{word} </span>;
                    return word + ' ';
                  })}
                </h1>
                <div className="flex flex-wrap gap-4 w-full md:w-auto">
                  <button onClick={() => setCurrentView('menu')} className="w-full md:w-auto px-10 py-5 bg-gradient-to-r from-orange-600 to-red-600 rounded-full font-black text-lg hover:scale-105 transition-transform shadow-orange-500/20 shadow-2xl">START ORDER</button>
                  <button onClick={() => setCurrentView('book')} className="w-full md:w-auto justify-center px-10 py-5 bg-black/40 backdrop-blur-md rounded-full font-black text-lg border border-white/20 hover:bg-white/10 transition flex items-center gap-2">RESERVE TABLE <ChevronRight size={18} /></button>
                </div>
              </div>

              {/* ENQUIRY FORM AT BOTTOM OF HOME PAGE */}
              <div className="max-w-3xl mx-auto bg-black/60 backdrop-blur-xl p-8 md:p-12 rounded-[40px] border border-white/10 shadow-2xl mt-20 animate-in fade-in duration-700">
                <h3 className="text-3xl font-black mb-6 flex items-center gap-3"><Send className="text-orange-500" /> General Enquiry</h3>
                <p className="text-gray-400 mb-8 font-medium">Have questions about corporate events, large reservations, or custom menus? Drop us a message and our team will get back to you shortly.</p>
                <form ref={formRef} onSubmit={sendEmail} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" name="user_name" defaultValue={currentUser?.displayName || ''} placeholder="* Your Name" required className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-orange-500 transition" />
                    <input type="email" name="user_email" defaultValue={currentUser?.email || ''} placeholder="* Your Email" required className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-orange-500 transition" />
                  </div>
                  <textarea name="message" rows="4" placeholder="* How can we help you?" required className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-orange-500 transition resize-none"></textarea>
                  <button type="submit" disabled={isSendingMail} className="w-full py-5 bg-orange-600 rounded-2xl font-black text-lg hover:bg-orange-500 transition shadow-lg flex justify-center items-center gap-3">
                    {isSendingMail ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : <Send size={20} />}
                    {isSendingMail ? 'SENDING ENQUIRY...' : 'SEND MESSAGE'}
                  </button>
                </form>
              </div>
            </>
          )}

          {/* CUSTOMER PROFILE DASHBOARD */}
          {currentView === 'customerDashboard' && currentUser && (
            <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-10">
              <div className="bg-black/60 backdrop-blur-xl rounded-[40px] p-10 border border-white/10 shadow-2xl mb-8">
                <div className="flex items-center gap-6 mb-8 border-b border-white/10 pb-8">
                  <img src={currentUser.photoURL} alt="Profile" className="w-24 h-24 rounded-full border-4 border-orange-500 shadow-xl" />
                  <div>
                    <h2 className="text-4xl font-black">{currentUser.displayName}</h2>
                    <p className="text-gray-400 font-medium">{currentUser.email}</p>
                  </div>
                </div>

                <h3 className="text-2xl font-black mb-6 flex items-center gap-3"><LayoutDashboard className="text-orange-500" /> My Live Orders</h3>
                <div className="space-y-4">
                  {allOrders.filter(o => o.customer.email === currentUser.email).length === 0 ? (
                    <p className="text-gray-500 p-6 bg-white/5 rounded-2xl text-center">You have no recent orders.</p>
                  ) : (
                    allOrders.filter(o => o.customer.email === currentUser.email).map(order => (
                      <div key={order.id} className={`p-6 rounded-3xl border ${order.status === 'Ready to Serve' ? 'bg-green-900/30 border-green-500' : 'bg-white/5 border-white/10'}`}>
                        <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
                          <div>
                            <span className="text-xs text-orange-400 font-mono tracking-widest">{order.id}</span>
                            <h4 className="text-lg font-bold">{order.orderType} Order</h4>
                          </div>
                          <div className="text-right">
                            <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${order.status === 'Ready to Serve' ? 'bg-green-500 text-white' : 'bg-yellow-500/20 text-yellow-500'}`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                        <div className="text-sm text-gray-300 flex flex-wrap gap-2">
                          {order.items.map((item, idx) => <span key={idx} className="bg-black/40 px-3 py-1 rounded-lg border border-white/5">{item.qty}x {item.name}</span>)}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* MENU (CUSTOMER) */}
          {currentView === 'menu' && (
            <div className="animate-in fade-in duration-500">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-8 gap-4">
                <div className="flex flex-col gap-4">
                  <h2 className="text-3xl md:text-4xl font-black flex items-center gap-2 drop-shadow-md"><Utensils className="text-orange-500" /> Our Menu</h2>
                  <div className="bg-black/40 backdrop-blur-md p-1.5 rounded-2xl flex flex-wrap gap-1 border border-white/10 w-fit">
                    {['Delivery', 'Takeaway', 'Dine-In'].map(type => (
                      <button key={type} onClick={() => setOrderType(type)} className={`px-4 md:px-5 py-2 rounded-xl font-bold transition-all text-xs md:text-sm ${orderType === type ? 'bg-orange-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>{type}</button>
                    ))}
                  </div>
                </div>
                <div className="relative w-full lg:w-72">
                  <input type="text" placeholder="Search delicious food..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl py-3 pl-10 pr-4 text-white outline-none focus:border-orange-500 transition text-sm" />
                  <Search size={18} className="absolute left-3 top-3.5 text-gray-400" />
                </div>
              </div>
              <div className="flex flex-wrap gap-2 md:gap-3 mb-10 selection:bg-none">
                {categoryList.map(cat => (
                  <button key={cat} onClick={() => { setActiveCategory(cat); setSearchQuery(''); }} className={`px-4 md:px-6 py-2 rounded-full font-bold text-sm md:text-base border transition-all backdrop-blur-md ${activeCategory === cat ? 'bg-white text-black border-white' : 'bg-black/40 border-white/20 text-gray-300 hover:border-orange-500'}`}>{cat}</button>
                ))}
              </div>
              {filteredCustomerMenu.length === 0 ? <p className="text-gray-500 text-center py-20 text-xl font-bold">No items found matching your search.</p> : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCustomerMenu.map(item => (
                    <div key={item.id} className="bg-black/40 backdrop-blur-md rounded-3xl p-5 border border-white/10 hover:border-orange-500/50 transition duration-300 flex flex-col xl:flex-row gap-4 overflow-hidden shadow-2xl">
                      <div className="w-full xl:w-28 xl:h-28 rounded-2xl overflow-hidden shrink-0 h-48">
                        <img src={item.image} className="w-full h-full object-cover hover:scale-110 transition duration-500" />
                      </div>
                      <div className="flex flex-col flex-1 min-w-0">
                        <p className="text-[10px] text-orange-400 font-bold mb-1 uppercase tracking-wider truncate">{item.category}</p>
                        <h3 className="text-lg font-bold mb-1 leading-tight truncate">{item.name}</h3>
                        <p className="text-xs text-gray-400 mb-3 flex-1 line-clamp-2">{item.details}</p>
                        <div className="flex flex-wrap justify-between items-center mt-auto pt-3 border-t border-white/10 gap-2">
                          <span className="text-xl font-black">${item.price.toFixed(2)}</span>
                          <div className="flex items-center gap-2 mt-2 xl:mt-0">
                            <div className="flex items-center bg-white/5 border border-white/10 rounded-full h-8 md:h-9 px-1">
                              <button onClick={() => updateItemQty(item.id, -1)} className="w-7 flex items-center justify-center hover:text-orange-500"><Minus size={14} /></button>
                              <span className="w-4 text-center text-xs md:text-sm font-bold">{itemQuantities[item.id] || 1}</span>
                              <button onClick={() => updateItemQty(item.id, 1)} className="w-7 flex items-center justify-center hover:text-orange-500"><Plus size={14} /></button>
                            </div>
                            <button onClick={() => addToCart(item, itemQuantities[item.id] || 1, 'customer')} className="h-8 md:h-9 px-3 md:px-4 bg-orange-600 rounded-full flex items-center justify-center hover:bg-orange-500 transition font-bold text-xs md:text-sm shadow-lg tracking-wider shrink-0">ADD</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* BOOKING */}
          {currentView === 'book' && (
            <div className="max-w-5xl mx-auto bg-black/60 p-6 md:p-10 rounded-3xl md:rounded-[40px] border border-white/10 backdrop-blur-xl animate-in slide-in-from-bottom-10 flex flex-col lg:flex-row gap-8">
              <div className="flex-1 space-y-6">
                <h2 className="text-3xl md:text-4xl font-black mb-6 flex items-center gap-3"><Calendar className="text-orange-500" /> Book Event</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-white/10">
                  <div><label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">Name *</label><input type="text" value={bookingInfo.name} onChange={e => setBookingInfo({ ...bookingInfo, name: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-orange-500 transition text-sm" placeholder="Your Name" /></div>
                  <div><label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">Phone *</label><input type="tel" value={bookingInfo.phone} onChange={e => setBookingInfo({ ...bookingInfo, phone: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-orange-500 transition text-sm" placeholder="Phone Number" /></div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">Event Type</label>
                  <select className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-orange-500 transition font-medium appearance-none" value={bookingData.type} onChange={e => setBookingData({ ...bookingData, type: e.target.value })}>
                    {eventTypes.map(t => <option key={t} value={t} className="bg-gray-900">{t}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div><label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">Date & Time *</label><input type="datetime-local" value={bookingData.date} onChange={e => setBookingData({ ...bookingData, date: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-orange-500 transition [color-scheme:dark]" /></div>
                  <div><label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">Guests *</label><input type="number" min="1" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-orange-500 transition" value={bookingData.guests} onChange={e => setBookingData({ ...bookingData, guests: e.target.value })} /></div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">Description / Custom Requests</label>
                  <textarea rows="4" value={bookingData.description} onChange={e => setBookingData({ ...bookingData, description: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-orange-500 transition resize-none" placeholder="Describe how you want to customize your menu or event..."></textarea>
                </div>
                <button onClick={submitBookingRequest} className="w-full py-5 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl font-black text-xl hover:scale-[1.02] transition shadow-xl mt-4">SUBMIT REQUEST</button>
              </div>
              <div className="w-full lg:w-72 bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col shrink-0 h-fit sticky top-28">
                <label className="block text-xs font-bold text-gray-500 mb-3 uppercase tracking-widest">Standard Menu Selection</label>
                <button onClick={() => setShowMenuModal(true)} className="w-full text-left py-4 px-5 rounded-xl border border-white/20 bg-black/30 hover:border-orange-500 transition text-sm font-medium text-gray-300">Choose from Restaurant Menu...</button>
                {bookingData.selectedMenuItems.length > 0 && (
                  <div className="mt-5 space-y-2 text-xs text-gray-400 overflow-y-auto max-h-64 pr-2 custom-scrollbar">
                    {bookingData.selectedMenuItems.map(item => (
                      <div key={item.id} className="flex items-center gap-2 bg-black/40 p-2 rounded-lg border border-white/5">
                        <img src={item.image} className="w-6 h-6 rounded object-cover" />
                        <span className="truncate">{item.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ADMIN */}
          {currentView === 'admin' && (
            <div className="flex flex-col lg:flex-row gap-6 md:gap-8 min-h-[75vh]">

              {/* Admin Nav */}
              <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 lg:w-56 shrink-0 selection:bg-none hide-scrollbar">
                <button onClick={() => setAdminTab('dashboard')} className={`flex items-center gap-3 px-5 py-4 rounded-2xl font-bold whitespace-nowrap transition-all ${adminTab === 'dashboard' ? 'bg-orange-600 text-white shadow-lg' : 'text-gray-400 bg-black/40 border border-white/10 hover:bg-white/5'}`}><BarChart3 size={18} /> Dashboard</button>
                <button onClick={() => setAdminTab('orders')} className={`flex items-center gap-3 px-5 py-4 rounded-2xl font-bold whitespace-nowrap transition-all ${adminTab === 'orders' ? 'bg-orange-600 text-white shadow-lg' : 'text-gray-400 bg-black/40 border border-white/10 hover:bg-white/5'}`}><ClipboardList size={18} /> Live Orders</button>
                <button onClick={() => setAdminTab('reservations')} className={`flex items-center gap-3 px-5 py-4 rounded-2xl font-bold whitespace-nowrap transition-all ${adminTab === 'reservations' ? 'bg-orange-600 text-white shadow-lg' : 'text-gray-400 bg-black/40 border border-white/10 hover:bg-white/5'}`}><Calendar size={18} /> Reservations</button>
                <button onClick={() => setAdminTab('pos')} className={`flex items-center gap-3 px-5 py-4 rounded-2xl font-bold whitespace-nowrap transition-all ${adminTab === 'pos' ? 'bg-orange-600 text-white shadow-lg' : 'text-gray-400 bg-black/40 border border-white/10 hover:bg-white/5'}`}><Calculator size={18} /> Point of Sale</button>
                <button onClick={() => setAdminTab('menuManager')} className={`flex items-center gap-3 px-5 py-4 rounded-2xl font-bold whitespace-nowrap transition-all ${adminTab === 'menuManager' ? 'bg-orange-600 text-white shadow-lg' : 'text-gray-400 bg-black/40 border border-white/10 hover:bg-white/5'}`}><PackagePlus size={18} /> Menu Manager</button>
                <button onClick={() => setAdminTab('records')} className={`flex items-center gap-3 px-5 py-4 rounded-2xl font-bold whitespace-nowrap transition-all ${adminTab === 'records' ? 'bg-orange-600 text-white shadow-lg' : 'text-gray-400 bg-black/40 border border-white/10 hover:bg-white/5'}`}><User size={18} /> Customers</button>
                <button onClick={() => setAdminTab('settings')} className={`flex items-center gap-3 px-5 py-4 rounded-2xl font-bold whitespace-nowrap transition-all ${adminTab === 'settings' ? 'bg-orange-600 text-white shadow-lg' : 'text-gray-400 bg-black/40 border border-white/10 hover:bg-white/5'}`}><Settings2 size={18} /> App Settings</button>
              </div>

              {/* Admin Content Area */}
              <div className="flex-1 bg-black/80 backdrop-blur-xl border border-white/10 rounded-3xl md:rounded-[40px] p-5 md:p-8 flex flex-col h-[75vh] lg:h-auto overflow-hidden">

                {/* Dashboard */}
                {adminTab === 'dashboard' && (
                  <div className="space-y-6 md:space-y-10 overflow-y-auto pr-2 custom-scrollbar">
                    <h3 className="text-2xl md:text-3xl font-black mb-4 flex items-center gap-3"><BarChart3 className="text-orange-500" /> Admin Dashboard</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                      <div className="bg-white/5 p-5 md:p-6 rounded-3xl border border-white/10 flex items-center gap-4 shadow-lg">
                        <div className="p-3 md:p-4 rounded-full bg-green-500/20 text-green-400"><DollarSign size={24} /></div>
                        <div><p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Daily Sell</p><p className="text-2xl md:text-4xl font-black">${totalSellDay.toFixed(2)}</p></div>
                      </div>
                      <div className="bg-white/5 p-5 md:p-6 rounded-3xl border border-white/10 flex items-center gap-4 shadow-lg">
                        <div className="p-3 md:p-4 rounded-full bg-orange-500/20 text-orange-400"><TrendingUp size={24} /></div>
                        <div><p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Top Item</p><p className="text-xl md:text-3xl font-black line-clamp-1">{topSellingItem}</p></div>
                      </div>
                      <div className="bg-white/5 p-5 md:p-6 rounded-3xl border border-white/10 flex items-center gap-4 shadow-lg">
                        <div className="p-3 md:p-4 rounded-full bg-yellow-500/20 text-yellow-400"><Calendar size={24} /></div>
                        <div><p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Monthly Sell</p><p className="text-2xl md:text-4xl font-black">${totalSellMonth.toFixed(2)}</p></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Live Orders */}
                {adminTab === 'orders' && (
                  <div className="flex-1 overflow-hidden flex flex-col">
                    <h3 className="text-2xl md:text-3xl font-black mb-6 flex items-center gap-3"><ClipboardList className="text-orange-500" /> Live Orders Tracking</h3>
                    <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                      {allOrders.length === 0 ? <p className="text-gray-500 text-center py-20 font-bold">No orders received yet today.</p> :
                        allOrders.map(order => (
                          <div key={order.id} className={`p-5 rounded-2xl border shadow-lg ${order.status === 'Ready to Serve' ? 'bg-green-900/20 border-green-500/50' : 'bg-white/5 border-white/10'}`}>
                            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4 pb-4 border-b border-white/10">
                              <div>
                                <p className="text-xs text-gray-400 font-mono mb-1">{order.id} • {order.timestamp.toLocaleTimeString()}</p>
                                <h4 className="text-xl font-black">{order.customer.name} <span className="text-sm font-medium text-gray-400">({order.customer.phone})</span></h4>
                                <div className="flex items-center gap-3 mt-2">
                                  <span className="bg-orange-600/20 text-orange-400 text-xs font-bold px-2 py-1 rounded-md">{order.orderType}</span>
                                  <span className="bg-white/10 text-gray-300 text-xs font-bold px-2 py-1 rounded-md">Via: {order.source}</span>
                                </div>
                              </div>
                              <div className="text-left md:text-right">
                                <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Status</p>
                                <p className={`font-black text-lg ${order.status === 'Ready to Serve' ? 'text-green-400' : 'text-yellow-400'}`}>{order.status}</p>
                                {order.status === 'Pending Kitchen' && (
                                  <button onClick={() => markOrderAsReady(order.id, order.customer.name)} className="mt-2 text-xs font-black bg-white text-black px-4 py-2 rounded hover:bg-gray-200 flex items-center gap-2"><BellRing size={14} /> MARK READY</button>
                                )}
                              </div>
                            </div>
                            <div className="text-sm text-gray-300">
                              {order.items.map((item, idx) => <span key={idx} className="mr-3 font-medium border border-white/10 px-2 py-1 rounded bg-black/40">{item.qty}x {item.name}</span>)}
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                )}

                {/* RESERVATIONS TRACKING */}
                {adminTab === 'reservations' && (
                  <div className="flex-1 overflow-hidden flex flex-col">
                    <h3 className="text-2xl md:text-3xl font-black mb-6 flex items-center gap-3"><Calendar className="text-orange-500" /> Table Reservations</h3>
                    <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                      {reservations.length === 0 ? <p className="text-gray-500 text-center py-20 font-bold">No reservations yet.</p> :
                        reservations.map(res => (
                          <div key={res.id} className="bg-white/5 p-5 rounded-2xl border border-white/10 flex flex-col md:flex-row gap-4 justify-between shadow-lg">
                            <div>
                              <span className="text-xs text-orange-400 font-mono tracking-widest">{res.id}</span>
                              <h4 className="text-xl font-black mt-1">{res.customer.name} <span className="text-sm font-medium text-gray-400">({res.customer.phone})</span></h4>
                              <p className="text-sm font-bold mt-2 text-white">Event: {res.details.type}</p>
                              <p className="text-sm text-gray-300 mt-1">Date: {new Date(res.details.date).toLocaleString()} &nbsp;•&nbsp; Guests: {res.details.guests}</p>

                              {res.details.selectedMenuItems.length > 0 && (
                                <p className="text-xs text-gray-400 mt-3 font-medium leading-relaxed">Selected Menu:<br /> <span className="text-gray-300">{res.details.selectedMenuItems.map(i => i.name).join(', ')}</span></p>
                              )}
                              {res.details.description && <p className="text-sm text-gray-400 italic mt-3 bg-black/40 p-3 rounded-lg border border-white/5">"{res.details.description}"</p>}
                            </div>
                            <div className="text-left md:text-right">
                              <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs font-black uppercase rounded-md">{res.status}</span>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                )}

                {/* FULL REDESIGNED POS */}
                {adminTab === 'pos' && (
                  <div className="flex-1 flex flex-col h-full overflow-hidden animate-in fade-in">
                    <h3 className="text-xl md:text-2xl font-black flex items-center gap-3 mb-6"><Calculator className="text-orange-500" /> {appSettings.appName} POS</h3>
                    <div className="flex-1 flex gap-4 lg:gap-6 min-h-0 overflow-hidden flex-col lg:flex-row">

                      {/* 1. Category Column */}
                      <div className="lg:w-36 flex lg:flex-col gap-2 shrink-0 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 hide-scrollbar">
                        {categoryList.map(cat => (
                          <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-3 rounded-xl font-bold text-xs lg:text-sm text-center lg:text-left transition-all backdrop-blur-md whitespace-nowrap ${activeCategory === cat ? 'bg-orange-600 text-white shadow-lg' : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10'}`}>
                            {cat}
                          </button>
                        ))}
                      </div>

                      {/* 2. Item Grid Column */}
                      <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 overflow-y-auto pr-2 custom-scrollbar min-h-[300px] lg:min-h-0 content-start">
                        {filteredCustomerMenu.map(item => (
                          <div key={item.id} onClick={() => addToCart(item, 1, 'pos')} className="bg-white/5 hover:bg-white/10 rounded-2xl p-2 border border-white/20 cursor-pointer hover:border-orange-500 transition-all flex flex-col text-left shadow-lg group relative overflow-hidden h-[210px]">

                            {/* Image Container */}
                            <div className="relative w-full h-24 mb-2 rounded-xl overflow-hidden shrink-0">
                              <img src={item.image} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition"></div>
                              <div className="absolute top-2 right-2 bg-orange-600 rounded-full p-1 opacity-0 group-hover:opacity-100 transition shadow-lg"><Plus size={14} className="text-white" /></div>
                            </div>

                            {/* Text & Price Data Box */}
                            <div className="flex flex-col flex-1 min-w-0 bg-black/40 p-2.5 rounded-xl border border-white/5">
                              <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-0.5 truncate">{item.category}</p>
                              <h4 className="font-bold text-xs truncate mb-1 text-white">{item.name}</h4>

                              <div className="mt-auto pt-1 flex items-center justify-between">
                                <span className="text-sm font-black text-orange-400">${item.price.toFixed(2)}</span>
                                <span className="text-[9px] font-black tracking-widest text-gray-500 group-hover:text-orange-500 transition uppercase">Add</span>
                              </div>
                            </div>

                          </div>
                        ))}
                      </div>

                      {/* 3. Checkout/Billing Column */}
                      <div className="w-full lg:w-80 xl:w-96 bg-black/60 backdrop-blur-xl rounded-3xl p-5 flex flex-col border border-white/10 shrink-0 h-auto lg:h-full overflow-hidden shadow-2xl">
                        <h3 className="text-lg font-black mb-4 flex items-center justify-between border-b border-white/10 pb-4">
                          <span className="flex items-center gap-2"><ClipboardList size={18} /> Billing Cart</span>
                          <span className="bg-orange-600 text-xs px-2 py-1 rounded-md">{posCart.length} Items</span>
                        </h3>

                        {/* Dynamic Cart Section */}
                        <div className="flex-1 overflow-y-auto space-y-3 mb-4 border-b border-white/10 pb-4 custom-scrollbar min-h-[150px]">
                          {posCart.length === 0 ? <p className="text-gray-500 text-center text-sm mt-10">Cart is empty. Tap items to add.</p> :
                            posCart.map((item, idx) => (
                              <div key={idx} className="flex gap-2 text-xs items-center text-white bg-white/5 p-2 rounded-xl border border-white/5">
                                <img src={item.image} className="w-10 h-10 rounded-lg object-cover" />
                                <div className="flex-1 font-bold truncate pr-1">{item.name}</div>
                                <div className="flex items-center gap-1 bg-black/40 rounded-md p-1 border border-white/5">
                                  <button onClick={() => changeQty(item.id, -1, 'pos')} className="hover:text-orange-500 p-0.5"><Minus size={12} /></button>
                                  <span className="text-orange-400 font-bold w-4 text-center">{item.qty}</span>
                                  <button onClick={() => changeQty(item.id, 1, 'pos')} className="hover:text-orange-500 p-0.5"><Plus size={12} /></button>
                                </div>
                                <span className="font-black w-12 text-right">${(item.price * item.qty).toFixed(2)}</span>
                                <button onClick={() => removeFromCart(item.id, 'pos')} className="text-gray-500 hover:text-red-500 ml-1"><Trash2 size={14} /></button>
                              </div>
                            ))
                          }
                        </div>

                        {/* Customer Info Form */}
                        <div className="space-y-2 mb-4">
                          <input type="text" placeholder="* Customer Name" value={posCustomerInfo.name} onChange={e => setPosCustomerInfo({ ...posCustomerInfo, name: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white outline-none focus:border-orange-500 text-xs" />
                          <div className="flex gap-2">
                            <input type="tel" placeholder="* Phone" value={posCustomerInfo.phone} onChange={e => setPosCustomerInfo({ ...posCustomerInfo, phone: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white outline-none focus:border-orange-500 text-xs" />
                            <input type="email" placeholder="Email" value={posCustomerInfo.email} onChange={e => setPosCustomerInfo({ ...posCustomerInfo, email: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white outline-none focus:border-orange-500 text-xs" />
                          </div>
                        </div>

                        {/* Discounts and Totals */}
                        <div className="space-y-2 mb-4 text-xs font-medium">
                          <div className="flex justify-between text-gray-400"><span>Subtotal</span> <span>${posSubtotal.toFixed(2)}</span></div>

                          <div className="flex justify-between items-center py-1">
                            <label className="flex items-center gap-2 cursor-pointer hover:text-white transition text-gray-400" onClick={(e) => { e.preventDefault(); setVipMembership(!vipMembership); }}>
                              <div className={`w-4 h-4 rounded flex items-center justify-center border transition ${vipMembership ? 'bg-orange-600 border-orange-600' : 'border-gray-500'}`}>
                                {vipMembership && <Check size={10} className="text-white" />}
                              </div>
                              VIP Member (10%)
                            </label>
                            {vipMembership && <span className="text-green-400">-${memberDiscountAmount.toFixed(2)}</span>}
                          </div>

                          <div className="flex justify-between items-center py-1 border-b border-white/10 pb-3">
                            <span className="text-gray-400 flex items-center gap-2">Manual Dis. <input type="number" min="0" max="100" value={discountPercent} onChange={e => setDiscountPercent(e.target.value)} className="w-12 bg-white/10 border border-white/20 rounded p-1 text-center text-white outline-none" />%</span>
                            {discountPercent > 0 && <span className="text-orange-400">-${manualDiscountAmount.toFixed(2)}</span>}
                          </div>
                        </div>

                        {/* Total and Charge Button */}
                        <div className="flex justify-between items-end mb-4 pt-1 gap-2">
                          <span className="text-gray-400 font-bold text-sm">Amount Due</span>
                          <span className="text-4xl font-black text-orange-400">${posFinalTotal.toFixed(2)}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mb-2">
                          <button onClick={() => { setPosCart([]); setPosCustomerInfo({ name: '', phone: '', email: '' }); showNotification("Cart Cleared"); }} className="py-2.5 bg-white/5 border border-white/10 text-white rounded-xl font-bold text-xs hover:bg-white/10 transition flex items-center justify-center gap-2"><Trash2 size={14} /> Clear</button>
                          <button onClick={() => showNotification("Order Saved to Drafts!")} className="py-2.5 bg-white/5 border border-white/10 text-white rounded-xl font-bold text-xs hover:bg-white/10 transition flex items-center justify-center gap-2"><Save size={14} /> Save Order</button>
                        </div>
                        <button onClick={processPOSOrderPayment} className="w-full py-3.5 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl font-black text-sm md:text-base hover:shadow-lg transition">
                          <Calculator className="inline mr-2" size={18} /> CHARGE & PRINT
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* APP SETTINGS TAB (Logo, Titles, Video) */}
                {adminTab === 'settings' && (
                  <div className="flex-1 overflow-y-auto space-y-6 pr-2 animate-in fade-in custom-scrollbar">
                    <h3 className="text-2xl font-black flex items-center gap-3 mb-6"><Settings2 className="text-orange-500" /> App Settings</h3>

                    <div className="bg-white/5 p-6 rounded-3xl border border-white/10 flex flex-col sm:flex-row gap-6 items-center shadow-lg">
                      <div className="flex-1 w-full">
                        <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">Brand Logo (PNG/JPG)</label>
                        <label className="w-full border border-white/10 rounded-xl p-4 text-sm flex items-center justify-center cursor-pointer transition bg-black/40 text-gray-400 hover:bg-white/10 font-bold">
                          <Upload size={18} className="mr-2" /> {appSettings.logoImage ? 'Change Logo' : 'Upload Logo'}
                          <input type="file" accept="image/png, image/jpeg" className="hidden" onChange={handleLogoUpload} />
                        </label>
                      </div>
                      {appSettings.logoImage && (
                        <div className="w-24 h-24 rounded-full bg-black border-4 border-orange-500 flex items-center justify-center overflow-hidden shrink-0 shadow-xl">
                          <img src={appSettings.logoImage} alt="Logo" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>

                    <div className="bg-white/5 p-6 rounded-3xl border border-white/10 flex flex-col sm:flex-row gap-6 items-center shadow-lg">
                      <div className="flex-1 w-full">
                        <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">Background Video (.mp4)</label>
                        <label className="w-full border border-white/10 rounded-xl p-4 text-sm flex items-center justify-center cursor-pointer transition bg-black/40 text-gray-400 hover:bg-white/10 font-bold">
                          <Upload size={18} className="mr-2" /> Upload New Video
                          <input type="file" accept="video/mp4" className="hidden" onChange={handleVideoUpload} />
                        </label>
                        <p className="text-xs text-gray-500 mt-3">* Video will save locally to your browser. Use files under 5MB.</p>
                      </div>
                      <video src={videoSource} autoPlay loop muted className="w-full sm:w-48 h-32 rounded-2xl object-cover border border-white/10 shadow-2xl" />
                    </div>

                    <div className="bg-white/5 p-6 rounded-3xl border border-white/10 grid grid-cols-1 md:grid-cols-2 gap-6 shadow-lg">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">Logo Main Text</label>
                        <input type="text" name="logoText" value={appSettings.logoText} onChange={handleSettingChange} className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-orange-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">Logo Sub-Text</label>
                        <input type="text" name="logoSubText" value={appSettings.logoSubText} onChange={handleSettingChange} className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-orange-500" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">Home Page Main Title</label>
                        <input type="text" name="homeTitle" value={appSettings.homeTitle} onChange={handleSettingChange} className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-orange-500" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">Application Name</label>
                        <input type="text" name="appName" value={appSettings.appName} onChange={handleSettingChange} className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-orange-500" />
                      </div>
                    </div>
                    <div className="flex justify-end pt-4 border-t border-white/10">
                      <button onClick={() => showNotification("Preferences Saved Successfully!")} className="py-4 px-10 bg-green-600 rounded-xl font-black flex items-center gap-2 hover:bg-green-500 transition shadow-lg">
                        <Save size={18} /> SAVE PREFERENCES
                      </button>
                    </div>
                  </div>
                )}

                {/* Menu Manager Tab */}
                {adminTab === 'menuManager' && (
                  <div className="flex-1 overflow-hidden flex flex-col space-y-6">
                    <h3 className="text-xl md:text-2xl font-black flex items-center gap-3"><PackagePlus className="text-orange-500" /> Menu Manager</h3>
                    <div className="bg-white/5 p-4 md:p-6 rounded-3xl border border-white/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end shadow-lg">
                      <div><input type="text" placeholder="Name" value={newItemForm.name} onChange={e => setNewItemForm({ ...newItemForm, name: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white" /></div>
                      <div><input type="number" placeholder="Price ($)" value={newItemForm.price} onChange={e => setNewItemForm({ ...newItemForm, price: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white" /></div>
                      <div>
                        <select className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white appearance-none" value={newItemForm.category} onChange={e => setNewItemForm({ ...newItemForm, category: e.target.value })}>
                          {categoryList.filter(c => c !== "All Items").map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className={`w-full border border-white/10 rounded-xl p-3 text-sm flex items-center justify-center cursor-pointer transition ${newItemForm.image ? 'bg-orange-600/20 text-orange-400 border-orange-500' : 'bg-black/40 text-gray-400 hover:bg-white/10'}`}>
                          {newItemForm.image ? 'Image Ready' : 'Upload PNG/JPG'}
                          <input type="file" accept="image/png, image/jpeg" className="hidden" onChange={handleItemImageUpload} />
                        </label>
                      </div>
                      <button onClick={addMenuItem} className="py-3 bg-orange-600 rounded-xl font-bold flex items-center justify-center hover:bg-orange-500 transition text-sm"><Plus size={16} className="mr-1" /> ADD DRAFT</button>
                    </div>

                    <div className="flex-1 overflow-x-auto overflow-y-auto custom-scrollbar">
                      <table className="w-full text-xs md:text-sm text-left min-w-[500px]">
                        <thead className="text-gray-400 uppercase tracking-wider sticky top-0 bg-black/80 backdrop-blur z-10">
                          <tr><th className="p-3">Item</th><th className="p-3">Category</th><th className="p-3">Price</th><th className="p-3 text-right">Delete</th></tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {menuItems.map(item => (
                            <tr key={item.id} className="hover:bg-white/5">
                              <td className="p-3 font-medium text-white flex items-center gap-2"><img src={item.image} className="w-8 h-8 rounded-md object-cover hidden sm:block" /> {item.name}</td>
                              <td className="p-3 text-gray-400">{item.category}</td>
                              <td className="p-3 font-bold">${item.price.toFixed(2)}</td>
                              <td className="p-3 text-right"><button onClick={() => deleteMenuItem(item.id, item.name)} className="text-gray-500 hover:text-red-500"><Trash2 size={16} /></button></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Customer Records Tab */}
                {adminTab === 'records' && (
                  <div className="flex-1 overflow-auto custom-scrollbar">
                    <h3 className="text-2xl md:text-3xl font-black mb-6 flex items-center gap-3"><User className="text-orange-500" /> Customer Profiles ({customerRecords.length})</h3>
                    {customerRecords.length === 0 ? (
                      <div className="text-sm text-gray-400 text-center mt-10 border border-dashed border-white/10 p-10 rounded-2xl">
                        Profiles and Order Histories will populate here automatically after checkout.
                      </div>
                    ) : (
                      <div className="space-y-4 pr-2">
                        {customerRecords.map((c, i) => (
                          <div key={i} className="bg-white/5 rounded-3xl p-5 border border-white/10 flex flex-col shadow-xl">
                            <div className="flex flex-col md:flex-row justify-between md:items-center border-b border-white/10 pb-4 mb-4 gap-4">
                              <div>
                                <h4 className="text-xl font-black flex items-center gap-2">
                                  {c.name} {c.isVIP && <span className="bg-orange-600/20 text-orange-400 text-[10px] uppercase px-2 py-1 rounded-md">VIP</span>}
                                </h4>
                                <p className="text-sm text-gray-400 mt-1 flex flex-wrap items-center gap-4">
                                  <span>📞 {c.phone}</span>
                                  {c.email && <span>✉️ {c.email}</span>}
                                </p>
                              </div>
                              <div className="md:text-right">
                                <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">Lifetime Value</p>
                                <p className="text-2xl font-black text-green-400">${c.totalSpent.toFixed(2)}</p>
                              </div>
                            </div>

                            <div>
                              <p className="text-xs font-bold text-gray-500 uppercase mb-3 tracking-widest">Complete Order History</p>
                              <div className="space-y-2">
                                {c.orderHistory?.map(order => (
                                  <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm bg-black/40 p-3 md:p-4 rounded-xl border border-white/5">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 w-full sm:w-1/3">
                                      <span className="font-mono text-orange-400 text-xs bg-orange-600/10 px-2 py-1 rounded w-fit">{order.id}</span>
                                      <span className="text-gray-400 text-xs">{order.date}</span>
                                    </div>
                                    <span className="text-gray-300 flex-1 truncate">{order.items.map(i => `${i.qty}x ${i.name}`).join(', ')}</span>
                                    <span className="font-black text-left sm:text-right text-base">${order.total.toFixed(2)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* --- QUICK ACTIONS (FABs) --- */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-[100] print:hidden">
        <a href="https://wa.me/qr/WESWWPZOLUQ4H1" target="_blank" rel="noopener noreferrer" className="w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center shadow-2xl shadow-green-500/40 hover:scale-110 transition-transform">
          <Phone size={24} />
        </a>

        {currentView === 'menu' && customerCart.length > 0 && (
          <button onClick={() => setShowCustomerCheckout(true)} className="w-14 h-14 bg-orange-600 text-white rounded-full flex items-center justify-center shadow-2xl shadow-orange-600/40 hover:scale-110 transition-transform relative">
            <ShoppingBag size={24} />
            <span className="absolute -top-1 -right-1 bg-white text-black text-xs font-black rounded-full h-6 w-6 flex items-center justify-center border-2 border-orange-600">{customerCart.length}</span>
          </button>
        )}

        {showScrollFAB && (
          <button onClick={scrollToTop} className="w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full flex items-center justify-center shadow-xl hover:bg-white/20 transition-all self-end">
            <ArrowUp size={20} />
          </button>
        )}
      </div>

      {/* --- MODALS --- */}
      {/* Booking Menu Selector Modal */}
      {showMenuModal && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md p-4 flex items-center justify-center animate-in fade-in print:hidden">
          <div className="bg-black/90 w-full max-w-4xl max-h-[85vh] rounded-3xl border border-white/10 p-6 md:p-8 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-xl md:text-2xl font-black">Select Standard Menu Items</h4>
              <button onClick={() => setShowMenuModal(false)} className="p-2 bg-white/10 rounded-full"><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-1 sm:grid-cols-2 gap-3 custom-scrollbar">
              {menuItems.map(item => {
                const isSelected = bookingData.selectedMenuItems.some(i => i.id === item.id);
                return (
                  <div key={item.id} onClick={() => toggleMenuItemForBooking(item)} className={`flex items-center gap-3 bg-white/5 p-3 rounded-xl cursor-pointer border ${isSelected ? 'border-orange-500 bg-orange-500/10' : 'border-transparent'}`}>
                    <img src={item.image} className="w-10 h-10 rounded-lg object-cover" />
                    <p className="flex-1 font-bold text-sm">{item.name}</p>
                    {isSelected ? <Check size={18} className="text-orange-400" /> : <div className="w-5 h-5 rounded border border-white/30"></div>}
                  </div>
                );
              })}
            </div>
            <button onClick={() => setShowMenuModal(false)} className="w-full mt-6 py-4 bg-white text-black font-black rounded-xl">DONE</button>
          </div>
        </div>
      )}

      {/* CUSTOMER APP CHECKOUT MODAL */}
      {showCustomerCheckout && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md p-4 flex items-center justify-center animate-in fade-in print:hidden">
          <div className="bg-black/90 w-full max-w-md rounded-3xl border border-white/10 p-6 flex flex-col">
            <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
              <h4 className="text-xl font-black flex items-center gap-2"><ShoppingCart className="text-orange-500" /> Finalize Order</h4>
              <button onClick={() => setShowCustomerCheckout(false)} className="p-2 hover:bg-white/10 rounded-full"><X size={20} /></button>
            </div>

            <div className="space-y-3 mb-4 border-b border-white/10 pb-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Order Details ({orderType})</p>
              <input type="text" placeholder="* Your Name" value={customerCheckoutInfo.name} onChange={e => setCustomerCheckoutInfo({ ...customerCheckoutInfo, name: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-orange-500 text-sm" />
              <input type="tel" placeholder="* Your Phone Number" value={customerCheckoutInfo.phone} onChange={e => setCustomerCheckoutInfo({ ...customerCheckoutInfo, phone: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-orange-500 text-sm" />
              <input type="email" placeholder="Email Address (Optional)" value={customerCheckoutInfo.email} onChange={e => setCustomerCheckoutInfo({ ...customerCheckoutInfo, email: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-orange-500 text-sm" />
            </div>

            <div className="max-h-40 overflow-y-auto space-y-3 mb-6 pr-2 custom-scrollbar">
              {customerCart.length === 0 ? <p className="text-gray-500 text-center py-4 text-sm">Add some delicious items first!</p> :
                customerCart.map(item => (
                  <div key={item.id} className="flex justify-between items-center text-sm bg-white/5 p-2 rounded-xl">
                    <div className="flex items-center gap-2 w-2/3">
                      <button onClick={() => removeFromCart(item.id)} className="text-gray-600 hover:text-red-500 bg-black/40 p-1 rounded"><X size={14} /></button>
                      <span className="font-bold truncate">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-orange-400 font-bold">{item.qty}x</span>
                      <span className="font-black w-12 text-right">${(item.price * item.qty).toFixed(2)}</span>
                    </div>
                  </div>
                ))
              }
            </div>

            <div className="flex justify-between items-center mb-6 pt-4 border-t border-white/10 text-lg">
              <span className="text-gray-400 font-bold">Total</span>
              <span className="font-black">${customerCartTotal.toFixed(2)}</span>
            </div>

            <button onClick={submitCustomerAppOrder} className="w-full py-4 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl font-black hover:shadow-lg transition shadow-orange-600/20">PLACE {orderType.toUpperCase()} ORDER</button>
          </div>
        </div>
      )}

      {/* Admin Print Receipt Modal */}
      {receiptData && (
        <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-md p-4 flex items-center justify-center animate-in fade-in print:absolute print:bg-white print:text-black print:p-0">
          <div className="bg-white text-black w-full max-w-sm rounded-3xl p-8 flex flex-col shadow-2xl print:shadow-none print:w-full print:rounded-none">
            <div className="text-center mb-6 border-b border-dashed border-gray-300 pb-4">
              <h2 className="text-2xl font-black uppercase mb-1 flex items-center justify-center gap-2">
                {appSettings.logoImage && <img src={appSettings.logoImage} className="h-8 w-8 rounded-full object-cover border border-black" alt="Logo" />}
                {appSettings.logoText}<span className="font-light">{appSettings.logoSubText}</span>
              </h2>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Official Receipt</p>
              <p className="text-[10px] mt-2 font-mono text-gray-400">{receiptData.id}</p>
            </div>

            <div className="mb-4 text-sm font-bold">
              <p className="text-gray-500 text-xs uppercase mb-1">Customer</p>
              <p>{receiptData.customer.name}</p>
              <p className="text-gray-600 font-medium">{receiptData.customer.phone}</p>
              {receiptData.customer.email && <p className="text-gray-600 font-medium">{receiptData.customer.email}</p>}
            </div>

            <div className="space-y-2 mb-4 text-sm font-bold border-t border-b border-dashed border-gray-300 py-4">
              {receiptData.items.map((item, idx) => (
                <div key={idx} className="flex justify-between"><span className="text-gray-700">{item.qty}x {item.name}</span><span>${(item.price * item.qty).toFixed(2)}</span></div>
              ))}
            </div>

            <div className="space-y-1 mb-4 text-xs font-bold text-gray-500">
              <div className="flex justify-between"><span>Subtotal</span> <span>${receiptData.subtotal.toFixed(2)}</span></div>
              {receiptData.vipMemberUsed && <div className="flex justify-between text-green-600"><span>VIP Discount (10%)</span> <span>-${receiptData.memberDiscountAmount.toFixed(2)}</span></div>}
              {receiptData.manualDiscountPercent > 0 && <div className="flex justify-between text-orange-600"><span>Manual Discount ({receiptData.manualDiscountPercent}%)</span> <span>-${receiptData.manualDiscountAmount.toFixed(2)}</span></div>}
            </div>

            <div className="flex justify-between items-end mb-6 pt-2 border-t border-black/20">
              <span className="font-black text-sm uppercase">Total Paid</span>
              <span className="text-3xl font-black">${receiptData.finalTotal.toFixed(2)}</span>
            </div>
            <div className="flex gap-2 print:hidden mt-4">
              <button onClick={() => window.print()} className="flex-1 py-3 bg-black text-white font-black rounded-xl text-sm"><Printer size={16} className="inline mr-2" /> PRINT</button>
              <button onClick={() => setReceiptData(null)} className="py-3 px-4 bg-gray-200 text-black font-black rounded-xl text-sm">CLOSE</button>
            </div>
          </div>
        </div>
      )}

      {/* GLOBAL TOAST NOTIFICATION */}
      {notification && (
        <div className={`fixed top-24 md:bottom-12 md:top-auto right-4 md:right-12 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center z-[400] animate-in slide-in-from-right fade-in font-bold text-sm md:text-base print:hidden ${notification.type === 'error' ? 'bg-red-600' : 'bg-green-600'}`}>
          <Sparkles size={18} className="mr-3 shrink-0" /> {notification.msg}
        </div>
      )}
    </div>
  );
}