import React, { useState, useMemo, useEffect } from 'react';
import {
  ShoppingCart, Plus, Minus, BarChart3, Video,
  Sparkles, ChevronRight, ChevronLeft, Calendar, Upload,
  Utensils, Calculator, Check, X, User,
  PackagePlus, Trash2, TrendingUp, DollarSign, Printer,
  ArrowUp, Save, ShoppingBag, Search, BellRing, ClipboardList
} from 'lucide-react';

import bgVideo from './assets/Burger_and_Cola_Assembly_Video.mp4';

// --- DATA: INITIAL MENU ---
const initialMenuData = [
  // BURGERS 
  { id: 'b1', name: "The Crown Burger", price: 18.99, category: "Burgers", details: "Wagyu beef, truffle aioli.", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800" },
  { id: 'b2', name: "Spicy Volcano Burger", price: 16.99, category: "Burgers", details: "Double patty, habanero cheese.", image: "https://images.unsplash.com/photo-1594212887874-9276d4001d94?q=80&w=800" },
  { id: 'b3', name: "BBQ Bacon Beast", price: 15.99, category: "Burgers", details: "Applewood bacon, crispy onions.", image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?q=80&w=800" },
  { id: 'b4', name: "Classic Cheeseburger", price: 12.99, category: "Burgers", details: "Angus beef, cheddar, pickles.", image: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?q=80&w=800" },
  { id: 'b5', name: "Mushroom Swiss Melt", price: 14.99, category: "Burgers", details: "Sauteed shiitake, melted swiss.", image: "https://images.unsplash.com/photo-1598182126872-946dbb13fc97?q=80&w=800" },
  // PIZZA 
  { id: 'p1', name: "Truffle Mushroom Pizza", price: 24.99, category: "Pizza", details: "Wild mushrooms, white truffle oil.", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800" },
  { id: 'p2', name: "Pepperoni Passion", price: 19.99, category: "Pizza", details: "Double pepperoni, mozzarella.", image: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?q=80&w=800" },
  { id: 'p3', name: "Classic Margherita", price: 17.99, category: "Pizza", details: "San Marzano tomatoes, fresh basil.", image: "https://images.unsplash.com/photo-1595854341625-f33ee10dbf94?q=80&w=800" },
  { id: 'p4', name: "BBQ Chicken Pizza", price: 21.99, category: "Pizza", details: "Red onions, bacon, smoky BBQ base.", image: "https://images.unsplash.com/photo-1593560704563-f176a2eb61db?q=80&w=800" },
  { id: 'p5', name: "Veggie Supreme", price: 18.99, category: "Pizza", details: "Bell peppers, olives, onions, feta.", image: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?q=80&w=800" },
  // SNACKS 
  { id: 's1', name: "Loaded Cheese Fries", price: 8.99, category: "Snacks", details: "Melted cheddar, bacon bits, jalapenos.", image: "https://images.unsplash.com/photo-1576107232684-1279f390859f?q=80&w=800" },
  { id: 's2', name: "Chicken Wings (12)", price: 15.99, category: "Snacks", details: "Choose Buffalo, BBQ, or Lemon Pepper.", image: "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?q=80&w=800" },
  { id: 's3', name: "Crispy Onion Rings", price: 7.99, category: "Snacks", details: "Beer-battered rings with dynamic dip.", image: "https://images.unsplash.com/photo-1625943553852-781c1ff7b293?q=80&w=800" },
  { id: 's4', name: "Mozzarella Sticks", price: 9.99, category: "Snacks", details: "Melted cheese with marinara dip.", image: "https://images.unsplash.com/photo-1531749668029-2db88e4276c7?q=80&w=800" },
  { id: 's5', name: "Garlic Butter Prawns", price: 14.99, category: "Snacks", details: "Pan-seared prawns in garlic sauce.", image: "https://images.unsplash.com/photo-1559742811-822873691df8?q=80&w=800" },
  // BEVERAGES 
  { id: 'v1', name: "Classic Cola", price: 3.50, category: "Beverages", details: "Refreshing classic soft drink.", image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=800" },
  { id: 'v2', name: "Mango Smoothie", price: 5.99, category: "Beverages", details: "Fresh mango, yogurt, honey blend.", image: "https://images.unsplash.com/photo-1525059337994-6f2a1311b4d4?q=80&w=800" },
  { id: 'v3', name: "Iced Caramel Coffee", price: 6.50, category: "Beverages", details: "Cold brew, vanilla, caramel drizzle.", image: "https://images.unsplash.com/photo-1593902307137-b95610850b55?q=80&w=800" },
  { id: 'v4', name: "Fresh Lemonade", price: 4.50, category: "Beverages", details: "House-made classic lemonade.", image: "https://images.unsplash.com/photo-1621263760334-a0833777771f?q=80&w=800" },
  { id: 'v5', name: "Matcha Green Tea", price: 5.99, category: "Beverages", details: "Authentic japanese matcha latte.", image: "https://images.unsplash.com/photo-1582298701918-09acb37340fb?q=80&w=800" },
  // DIPS 
  { id: 'd1', name: "Garlic Mayo Dip", price: 1.50, category: "Dips", details: "Creamy garlic confit aioli.", image: "https://images.unsplash.com/photo-1590165482129-1b8b27698780?q=80&w=800" },
  { id: 'd2', name: "Bourbon BBQ Sauce", price: 1.50, category: "Dips", details: "House smoky BBQ reduction.", image: "https://images.unsplash.com/photo-1625943553852-781c1ff7b293?q=80&w=800" },
  { id: 'd3', name: "Spicy Sriracha Mayo", price: 1.50, category: "Dips", details: "Creamy mayo with a spicy kick.", image: "https://images.unsplash.com/photo-1623354898114-16a50355a159?q=80&w=800" },
  { id: 'd4', name: "Creamy Ranch", price: 1.50, category: "Dips", details: "Classic buttermilk ranch.", image: "https://images.unsplash.com/photo-1604168600858-a5b7d91d0e80?q=80&w=800" },
  { id: 'd5', name: "Fresh Guacamole", price: 2.99, category: "Dips", details: "Vibrant mexican avocado dip.", image: "https://images.unsplash.com/photo-1625943553852-781c1ff7b293?q=80&w=800" },
  // COMBOS 
  { id: 'c1', name: "Family Royalty Feast", price: 89.99, category: "Combos", details: "1 Burger, 1 Pizza, Fries, Wings, Colas.", image: "https://images.unsplash.com/photo-1563216336-1e663a8a37f5?q=80&w=800" },
  { id: 'c2', name: "Couples Ultimate Night", price: 45.99, category: "Combos", details: "Any 2 Burgers, onion rings, 2 Smoothies.", image: "https://images.unsplash.com/photo-1593560704563-f176a2eb61db?q=80&w=800" },
  { id: 'c3', name: "Solo Power Meal", price: 22.99, category: "Combos", details: "1 Burger, Loaded Fries, 1 Cola.", image: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800" },
  { id: 'c4', name: "Game Day Platter", price: 69.99, category: "Combos", details: "2 Pizzas, 24 Wings, 2 Large Fries.", image: "https://images.unsplash.com/photo-1616016142171-8b9a117b6be2?q=80&w=800" },
  { id: 'c5', name: "Kids Mini Combo", price: 12.99, category: "Combos", details: "Mini Cheeseburger, small fries, juice.", image: "https://images.unsplash.com/photo-1550130983-662f55811c7f?q=80&w=800" },
];

const categoryList = ["All", "Burgers", "Pizza", "Snacks", "Beverages", "Dips", "Combos"];
const eventTypes = ["Table Reservation", "Birthday Party", "Corporate Event", "Wedding", "Farewell", "Other"];

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [notification, setNotification] = useState(null);
  const [showScrollFAB, setShowScrollFAB] = useState(false);

  // Core System State
  const [menuItems, setMenuItems] = useState(initialMenuData);
  const [allOrders, setAllOrders] = useState([]);
  const [customerRecords, setCustomerRecords] = useState([]);

  // Customer Ordering State
  const [orderType, setOrderType] = useState('Delivery');
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [customerCart, setCustomerCart] = useState([]);
  const [itemQuantities, setItemQuantities] = useState({});
  const [showCustomerCheckout, setShowCustomerCheckout] = useState(false);
  const [customerCheckoutInfo, setCustomerCheckoutInfo] = useState({ name: '', phone: '', email: '' });

  // Booking State
  const [bookingData, setBookingData] = useState({ type: 'Table Reservation', guests: 2, date: '', description: '', menuType: 'Standard Menu', selectedMenuItems: [] });
  const [showMenuModal, setShowMenuModal] = useState(false);

  // Admin Panel State
  const [adminTab, setAdminTab] = useState('pos');
  const [posCart, setPosCart] = useState([]);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [vipMembership, setVipMembership] = useState(false);
  const [posCustomerInfo, setPosCustomerInfo] = useState({ name: '', phone: '', email: '' });
  const [receiptData, setReceiptData] = useState(null);
  const [newItemForm, setNewItemForm] = useState({ name: '', price: '', category: 'Burgers', details: '', image: null });
  const [videoSource, setVideoSource] = useState(bgVideo);

  useEffect(() => {
    const handleScroll = () => setShowScrollFAB(window.scrollY > 200);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const showNotification = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) { setVideoSource(URL.createObjectURL(file)); showNotification("Site Branding Updated!"); }
  };

  // --- MENU MANAGER ---
  const handleItemImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) setNewItemForm({ ...newItemForm, image: URL.createObjectURL(file) });
  };

  const addMenuItem = () => {
    if (!newItemForm.name || !newItemForm.price || !newItemForm.image) return showNotification("Missing Name, Price, or Image!", "error");
    const id = newItemForm.name.toLowerCase().replace(/ /g, '-') + Date.now();
    setMenuItems(prev => [{ ...newItemForm, id, price: parseFloat(newItemForm.price) }, ...prev]);
    setNewItemForm({ name: '', price: '', category: 'Burgers', details: '', image: null });
    showNotification("Item added to draft!");
  };

  const deleteMenuItem = (id, name) => {
    if (window.confirm(`Delete '${name}'?`)) {
      setMenuItems(prev => prev.filter(item => item.id !== id));
      showNotification(`Item deleted!`);
    }
  };

  // --- CART LOGIC WITH QUANTITY CONTROL ---
  const updateItemQty = (id, delta) => {
    setItemQuantities(prev => {
      const current = prev[id] || 1;
      const next = current + delta;
      return { ...prev, [id]: next > 0 ? next : 1 }; // Minimum 1
    });
  };

  const addToCart = (item, qtyToAdd = 1, cartType = 'customer') => {
    const targetCart = cartType === 'customer' ? customerCart : posCart;
    const setTargetCart = cartType === 'customer' ? setCustomerCart : setPosCart;

    setTargetCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + qtyToAdd } : i);
      } else {
        return [...prev, { ...item, qty: qtyToAdd }];
      }
    });

    if (cartType === 'customer') {
      showNotification(`Added ${qtyToAdd}x ${item.name}!`);
      setItemQuantities(prev => ({ ...prev, [item.id]: 1 })); // Reset local qty
    }
  };

  const changeQty = (id, delta, cartType = 'customer') => {
    const setTargetCart = cartType === 'customer' ? setCustomerCart : setPosCart;
    setTargetCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.qty + delta;
        return newQty > 0 ? { ...item, qty: newQty } : item;
      }
      return item;
    }));
  };

  const removeFromCart = (id, cartType = 'customer') => {
    const setTargetCart = cartType === 'customer' ? setCustomerCart : setPosCart;
    setTargetCart(prev => prev.filter(item => item.id !== id));
  };

  const customerCartTotal = useMemo(() => customerCart.reduce((sum, item) => sum + (item.price * item.qty), 0), [customerCart]);

  // --- BULLETPROOF CUSTOMER PROFILE SAVER ---
  const saveToCustomerRecords = (customerInfo, orderData, isVIP = false) => {
    setCustomerRecords(prevRecords => {
      const existingIdx = prevRecords.findIndex(c => c.phone === customerInfo.phone);
      const orderSummary = {
        id: orderData.id,
        date: orderData.timestamp.toLocaleDateString() + ' ' + orderData.timestamp.toLocaleTimeString(),
        items: orderData.items,
        total: orderData.finalTotal
      };

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
        return [{
          ...customerInfo,
          isVIP: isVIP,
          totalOrders: 1,
          totalSpent: orderData.finalTotal,
          orderHistory: [orderSummary]
        }, ...prevRecords];
      }
    });
  };

  // --- ORDER SUBMISSION LOGIC ---
  const submitCustomerAppOrder = () => {
    if (!customerCheckoutInfo.name || !customerCheckoutInfo.phone) return showNotification("Please enter your Name and Phone Number!", "error");

    const newOrder = {
      id: `APP-${Math.floor(100000 + Math.random() * 900000)}`,
      timestamp: new Date(),
      customer: customerCheckoutInfo,
      items: customerCart,
      orderType: orderType,
      source: 'Customer App',
      status: 'Pending Kitchen',
      finalTotal: customerCartTotal
    };

    setAllOrders(prev => [newOrder, ...prev]);
    saveToCustomerRecords(customerCheckoutInfo, newOrder);

    setShowCustomerCheckout(false);
    setCustomerCart([]);
    setCustomerCheckoutInfo({ name: '', phone: '', email: '' });
    showNotification(`Order Sent! We are preparing your ${orderType}.`);
  };

  const processPOSOrderPayment = () => {
    if (!posCustomerInfo.name || !posCustomerInfo.phone) return showNotification("Missing Customer Name or Phone!", "error");
    if (posCart.length === 0) return showNotification("Cart is empty!", "error");

    const newOrder = {
      id: `POS-${Math.floor(100000 + Math.random() * 900000)}`,
      timestamp: new Date(),
      customer: posCustomerInfo,
      items: posCart,
      orderType: 'Walk-in (POS)',
      source: 'Admin POS',
      status: 'Pending Kitchen',
      subtotal: posSubtotal,
      vipMemberUsed: vipMembership,
      memberDiscountAmount,
      manualDiscountPercent: discountPercent,
      manualDiscountAmount,
      finalTotal: posFinalTotal
    };

    setAllOrders(prev => [newOrder, ...prev]);
    saveToCustomerRecords(posCustomerInfo, newOrder, vipMembership);

    setReceiptData(newOrder);
    setPosCart([]);
    setDiscountPercent(0);
    setVipMembership(false);
    setPosCustomerInfo({ name: '', phone: '', email: '' });
    showNotification("Payment Saved! Added to Live Orders.");
  };

  const markOrderAsReady = (orderId, customerName) => {
    setAllOrders(prev => prev.map(order => order.id === orderId ? { ...order, status: 'Ready to Serve' } : order));
    showNotification(`🔔 ORDER READY: ${customerName}'s order is ready!`, 'success');
  };

  // --- ADMIN POS MATH ---
  const posSubtotal = useMemo(() => posCart.reduce((sum, item) => sum + (item.price * item.qty), 0), [posCart]);
  const memberDiscountAmount = useMemo(() => vipMembership ? posSubtotal * 0.10 : 0, [vipMembership, posSubtotal]);
  const remainingTotalAfterMember = posSubtotal - memberDiscountAmount;
  const manualDiscountAmount = useMemo(() => remainingTotalAfterMember * (discountPercent / 100), [remainingTotalAfterMember, discountPercent]);
  const posFinalTotal = remainingTotalAfterMember - manualDiscountAmount;

  // --- ADMIN DASHBOARD MATH ---
  const { totalSellDay, totalSellMonth, topSellingItem } = useMemo(() => {
    const today = new Date().toDateString();
    const currentMonth = new Date().getMonth();
    let daySum = 0, monthSum = 0;
    const itemCounts = {};

    allOrders.forEach(order => {
      const date = new Date(order.timestamp);
      if (date.toDateString() === today) daySum += order.finalTotal;
      if (date.getMonth() === currentMonth) monthSum += order.finalTotal;
      order.items.forEach(item => itemCounts[item.name] = (itemCounts[item.name] || 0) + item.qty);
    });

    let topItem = "None", maxCount = 0;
    Object.entries(itemCounts).forEach(([name, count]) => {
      if (count > maxCount) { maxCount = count; topItem = name; }
    });

    return { totalSellDay: daySum, totalSellMonth: monthSum, topSellingItem: topItem };
  }, [allOrders]);

  const filteredCustomerMenu = useMemo(() => {
    let result = activeCategory === 'All' ? menuItems : menuItems.filter(i => i.category === activeCategory);
    if (searchQuery) result = result.filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return result;
  }, [menuItems, activeCategory, searchQuery]);

  return (
    <div className="min-h-screen font-sans text-white bg-black selection:bg-orange-500/30 overflow-x-hidden print:bg-white print:text-black">

      {/* BACKGROUND VIDEO (MAXIMUM CLARITY - Opacity 100 on video, Opacity 65 on overlay) */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none print:hidden">
        <video key={videoSource} autoPlay loop muted playsInline preload="auto" className="w-full h-full object-cover opacity-100 scale-105">
          <source src={videoSource} type="video/mp4" />
        </video>
        {/* Lighter gradient so video is exceptionally clear (Darkness dropped exactly to 65%) */}
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
              <div className="cursor-pointer" onClick={() => setCurrentView('home')}>
                <span className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600 tracking-tighter uppercase">STOMAK<span className="text-white font-light lowercase">Solution</span></span>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              {['home', 'menu', 'book', 'admin'].map(view => (
                <button key={view} onClick={() => setCurrentView(view)} className={`text-sm font-bold uppercase tracking-widest transition-colors ${currentView === view ? 'text-orange-500' : 'text-gray-400 hover:text-white'}`}>{view}</button>
              ))}
              <button onClick={() => setShowCustomerCheckout(true)} className="relative p-3 text-gray-300 bg-white/5 rounded-full hover:bg-white/10 transition">
                <ShoppingCart size={18} />
                {customerCart.length > 0 && <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-black rounded-full h-5 w-5 flex items-center justify-center">{customerCart.length}</span>}
              </button>
            </div>

            <div className="md:hidden flex items-center">
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
            <div className="h-[75vh] flex flex-col items-start justify-center animate-in fade-in slide-in-from-left-8 duration-1000">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tighter mb-8 text-shadow-xl">
                TASTE <span className="text-yellow-400">THE</span><br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600">FUTURE.</span>
              </h1>
              <div className="flex flex-wrap gap-4 w-full md:w-auto">
                <button onClick={() => setCurrentView('menu')} className="w-full md:w-auto px-10 py-5 bg-gradient-to-r from-orange-600 to-red-600 rounded-full font-black text-lg hover:scale-105 transition-transform shadow-orange-500/20 shadow-2xl">START ORDER</button>
                <button onClick={() => setCurrentView('book')} className="w-full md:w-auto justify-center px-10 py-5 bg-black/40 backdrop-blur-md rounded-full font-black text-lg border border-white/20 hover:bg-white/10 transition flex items-center gap-2">RESERVE TABLE <ChevronRight size={18} /></button>
                <button onClick={() => setCurrentView('admin')} className="md:hidden w-full px-10 py-5 bg-black/50 backdrop-blur border border-white/10 rounded-full font-black text-lg text-gray-400">ADMIN PANEL</button>
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
                    <div key={item.id} className="bg-black/40 backdrop-blur-md rounded-3xl p-5 md:p-6 border border-white/10 hover:border-orange-500/50 transition duration-300 flex flex-col sm:flex-row gap-4 md:gap-5 overflow-hidden shadow-2xl">
                      <div className="w-full sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden shrink-0 h-48">
                        <img src={item.image} className="w-full h-full object-cover hover:scale-110 transition duration-500" />
                      </div>
                      <div className="flex flex-col flex-1">
                        <p className="text-[10px] md:text-xs text-orange-400 font-bold mb-1 uppercase tracking-wider">{item.category}</p>
                        <h3 className="text-lg md:text-xl font-bold mb-1 leading-tight">{item.name}</h3>
                        <p className="text-xs text-gray-400 mb-4 flex-1 line-clamp-2">{item.details}</p>

                        {/* CUSTOMER MENU QUANTITY SELECTOR */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-auto pt-3 border-t border-white/10 gap-3">
                          <span className="text-xl md:text-2xl font-black">${item.price.toFixed(2)}</span>

                          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                            <div className="flex items-center bg-white/5 border border-white/10 rounded-full h-8 md:h-10 px-1">
                              <button onClick={() => updateItemQty(item.id, -1)} className="w-8 flex items-center justify-center hover:text-orange-500"><Minus size={14} /></button>
                              <span className="w-4 text-center text-xs md:text-sm font-bold">{itemQuantities[item.id] || 1}</span>
                              <button onClick={() => updateItemQty(item.id, 1)} className="w-8 flex items-center justify-center hover:text-orange-500"><Plus size={14} /></button>
                            </div>
                            <button onClick={() => addToCart(item, itemQuantities[item.id] || 1, 'customer')} className="h-8 md:h-10 px-4 md:px-5 bg-orange-600 rounded-full flex items-center justify-center hover:bg-orange-500 transition font-bold text-xs md:text-sm shadow-lg tracking-wider">ADD</button>
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
            <div className="max-w-4xl mx-auto bg-black/60 p-6 md:p-10 rounded-3xl md:rounded-[40px] border border-white/10 backdrop-blur-xl animate-in slide-in-from-bottom-10 flex flex-col lg:flex-row gap-8">
              <div className="flex-1 space-y-6">
                <h2 className="text-3xl md:text-4xl font-black mb-6 flex items-center gap-3"><Calendar className="text-orange-500" /> Book Event</h2>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">Event Type</label>
                  <select className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-orange-500 transition font-medium appearance-none" value={bookingData.type} onChange={e => setBookingData({ ...bookingData, type: e.target.value })}>
                    {eventTypes.map(t => <option key={t} value={t} className="bg-gray-900">{t}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div><label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">Date & Time</label><input type="datetime-local" value={bookingData.date} onChange={e => setBookingData({ ...bookingData, date: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-orange-500 transition [color-scheme:dark]" /></div>
                  <div><label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">Guests</label><input type="number" min="1" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-orange-500 transition" value={bookingData.guests} onChange={e => setBookingData({ ...bookingData, guests: e.target.value })} /></div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">Description / Custom Requests</label>
                  <textarea rows="4" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-orange-500 transition resize-none" placeholder="Describe how you want to customize your menu or event..."></textarea>
                </div>
                <button onClick={() => { showNotification("Reservation Request Submitted Successfully!"); setBookingData({ type: 'Table Reservation', guests: 2, date: '', description: '', menuType: 'Standard Menu', selectedMenuItems: [] }); }} className="w-full py-5 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl font-black text-xl hover:scale-[1.02] transition shadow-xl mt-4">SUBMIT REQUEST</button>
              </div>
              <div className="w-full lg:w-72 bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col shrink-0">
                <label className="block text-xs font-bold text-gray-500 mb-3 uppercase tracking-widest">Standard Menu Selection</label>
                <button onClick={() => setShowMenuModal(true)} className="w-full text-left py-4 px-5 rounded-xl border border-white/20 bg-black/30 hover:border-orange-500 transition text-sm font-medium text-gray-300">Choose from Restaurant Menu...</button>
                {bookingData.selectedMenuItems.length > 0 && (
                  <div className="mt-5 space-y-2 text-xs text-gray-400 overflow-y-auto max-h-48 pr-2">
                    {bookingData.selectedMenuItems.map(item => <p key={item.id}>• {item.name}</p>)}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ADMIN */}
          {currentView === 'admin' && (
            <div className="flex flex-col lg:flex-row gap-6 md:gap-8 min-h-[75vh]">

              {/* Admin Nav */}
              <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 lg:w-64 shrink-0 selection:bg-none hide-scrollbar">
                <button onClick={() => setAdminTab('dashboard')} className={`flex items-center gap-3 px-5 py-4 rounded-2xl font-bold whitespace-nowrap transition-all ${adminTab === 'dashboard' ? 'bg-white text-black shadow-lg' : 'text-gray-400 bg-black/40 border border-white/10 hover:bg-white/5'}`}><BarChart3 size={18} /> Dashboard</button>
                <button onClick={() => setAdminTab('orders')} className={`flex items-center gap-3 px-5 py-4 rounded-2xl font-bold whitespace-nowrap transition-all ${adminTab === 'orders' ? 'bg-white text-black shadow-lg' : 'text-gray-400 bg-black/40 border border-white/10 hover:bg-white/5'}`}><ClipboardList size={18} /> Live Orders</button>
                <button onClick={() => setAdminTab('pos')} className={`flex items-center gap-3 px-5 py-4 rounded-2xl font-bold whitespace-nowrap transition-all ${adminTab === 'pos' ? 'bg-white text-black shadow-lg' : 'text-gray-400 bg-black/40 border border-white/10 hover:bg-white/5'}`}><Calculator size={18} /> Point of Sale</button>
                <button onClick={() => setAdminTab('menuManager')} className={`flex items-center gap-3 px-5 py-4 rounded-2xl font-bold whitespace-nowrap transition-all ${adminTab === 'menuManager' ? 'bg-white text-black shadow-lg' : 'text-gray-400 bg-black/40 border border-white/10 hover:bg-white/5'}`}><PackagePlus size={18} /> Menu Manager</button>
                <button onClick={() => setAdminTab('records')} className={`flex items-center gap-3 px-5 py-4 rounded-2xl font-bold whitespace-nowrap transition-all ${adminTab === 'records' ? 'bg-white text-black shadow-lg' : 'text-gray-400 bg-black/40 border border-white/10 hover:bg-white/5'}`}><User size={18} /> Customers</button>
                <button onClick={() => setAdminTab('branding')} className={`flex items-center gap-3 px-5 py-4 rounded-2xl font-bold whitespace-nowrap transition-all ${adminTab === 'branding' ? 'bg-white text-black shadow-lg' : 'text-gray-400 bg-black/40 border border-white/10 hover:bg-white/5'}`}><Video size={18} /> Branding</button>
              </div>

              {/* Admin Content Area */}
              <div className="flex-1 bg-black/80 backdrop-blur-xl border border-white/10 rounded-3xl md:rounded-[40px] p-5 md:p-8 flex flex-col h-[70vh] lg:h-auto overflow-hidden">

                {adminTab === 'dashboard' && (
                  <div className="space-y-6 md:space-y-10 overflow-y-auto pr-2">
                    <h3 className="text-2xl md:text-3xl font-black mb-4">Admin Dashboard</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                      <div className="bg-white/5 p-5 md:p-6 rounded-3xl border border-white/10 flex items-center gap-4">
                        <div className="p-3 md:p-4 rounded-full bg-green-500/20 text-green-400"><DollarSign size={24} /></div>
                        <div><p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Daily Sell</p><p className="text-2xl md:text-4xl font-black">${totalSellDay.toFixed(2)}</p></div>
                      </div>
                      <div className="bg-white/5 p-5 md:p-6 rounded-3xl border border-white/10 flex items-center gap-4">
                        <div className="p-3 md:p-4 rounded-full bg-orange-500/20 text-orange-400"><TrendingUp size={24} /></div>
                        <div><p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Top Item</p><p className="text-xl md:text-3xl font-black line-clamp-1">{topSellingItem}</p></div>
                      </div>
                      <div className="bg-white/5 p-5 md:p-6 rounded-3xl border border-white/10 flex items-center gap-4">
                        <div className="p-3 md:p-4 rounded-full bg-yellow-500/20 text-yellow-400"><Calendar size={24} /></div>
                        <div><p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Monthly Sell</p><p className="text-2xl md:text-4xl font-black">${totalSellMonth.toFixed(2)}</p></div>
                      </div>
                    </div>
                  </div>
                )}

                {adminTab === 'orders' && (
                  <div className="flex-1 overflow-hidden flex flex-col">
                    <h3 className="text-2xl md:text-3xl font-black mb-6 flex items-center gap-3"><ClipboardList className="text-orange-500" /> Live Orders Tracking</h3>
                    <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                      {allOrders.length === 0 ? <p className="text-gray-500 text-center py-20 font-bold">No orders received yet today.</p> :
                        allOrders.map(order => (
                          <div key={order.id} className={`p-5 rounded-2xl border ${order.status === 'Ready to Serve' ? 'bg-green-900/20 border-green-500/50' : 'bg-white/5 border-white/10'}`}>
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

                {adminTab === 'pos' && (
                  <div className="flex flex-col lg:flex-row gap-6 h-full">
                    <div className="flex-1 overflow-y-auto pr-2 md:pr-4 space-y-3">
                      <h3 className="text-lg md:text-xl font-black mb-4 flex items-center gap-3"><ShoppingCart size={18} /> Tap to Add</h3>
                      {menuItems.map(item => (
                        <div key={item.id} onClick={() => addToCart(item, 1, 'pos')} className="flex items-center gap-3 md:gap-4 bg-white/5 p-3 rounded-2xl cursor-pointer hover:bg-orange-500/20 border border-transparent transition">
                          <img src={item.image} className="w-12 h-12 md:w-16 md:h-16 rounded-xl object-cover" />
                          <div className="flex-1"><h4 className="font-bold text-sm md:text-base leading-tight">{item.name}</h4><p className="text-[10px] md:text-xs text-gray-400">{item.category}</p></div>
                          <p className="text-base md:text-xl font-black text-orange-400">${item.price.toFixed(2)}</p><Plus className="text-gray-500 hidden md:block" />
                        </div>
                      ))}
                    </div>

                    <div className="w-full lg:w-[350px] bg-black/50 rounded-3xl p-5 flex flex-col border border-white/10 shrink-0 h-96 lg:h-auto">
                      <h3 className="text-lg font-black mb-4 flex items-center justify-between">Billing Cart <span className="bg-orange-600 text-xs px-2 py-1 rounded-md">{posCart.length}</span></h3>

                      <div className="space-y-2 mb-4 border-b border-white/10 pb-4">
                        <input type="text" placeholder="* Customer Name" value={posCustomerInfo.name} onChange={e => setPosCustomerInfo({ ...posCustomerInfo, name: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-orange-500 text-sm" />
                        <input type="tel" placeholder="* Phone Number" value={posCustomerInfo.phone} onChange={e => setPosCustomerInfo({ ...posCustomerInfo, phone: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-orange-500 text-sm" />
                        <input type="email" placeholder="Email (Optional)" value={posCustomerInfo.email} onChange={e => setPosCustomerInfo({ ...posCustomerInfo, email: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-orange-500 text-sm" />
                      </div>

                      <div className="flex-1 overflow-y-auto space-y-3 mb-4 border-b border-white/10 pb-4">
                        {posCart.length === 0 ? <p className="text-gray-500 text-center text-sm mt-4">Cart is empty</p> :
                          posCart.map((item, idx) => (
                            <div key={idx} className="flex gap-2 text-xs md:text-sm items-center text-white">
                              <div className="flex-1 font-bold truncate pr-2">{item.name}</div>
                              <div className="flex items-center gap-1">
                                <button onClick={() => changeQty(item.id, -1, 'pos')} className="p-1 hover:text-orange-500"><Minus size={12} /></button>
                                <span className="text-orange-400 font-bold w-4 text-center">{item.qty}</span>
                                <button onClick={() => changeQty(item.id, 1, 'pos')} className="p-1 hover:text-orange-500"><Plus size={12} /></button>
                              </div>
                              <span className="font-black w-12 text-right">${(item.price * item.qty).toFixed(2)}</span>
                            </div>
                          ))
                        }
                      </div>

                      <div className="space-y-2 mb-4 selection:bg-none">
                        <label className="flex items-center gap-2 cursor-pointer p-2 bg-white/5 rounded-xl hover:bg-white/10 transition" onClick={(e) => { e.preventDefault(); setVipMembership(!vipMembership); }}>
                          <div className={`w-5 h-5 rounded flex items-center justify-center border transition ${vipMembership ? 'bg-orange-600 border-orange-600' : 'border-gray-500'}`}>
                            {vipMembership && <Check size={12} className="text-white" />}
                          </div>
                          <span className="font-bold text-xs text-gray-300">VIP Member Card (-10%)</span>
                        </label>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-gray-500 uppercase block w-1/2">Manual Dis. (%)</span>
                          <input type="number" min="0" max="100" value={discountPercent} onChange={e => setDiscountPercent(e.target.value)} className="w-16 bg-black/50 border border-white/10 rounded-lg p-2 text-center text-xs text-white outline-none focus:border-orange-500" />
                        </div>
                      </div>

                      <div className="flex justify-between items-end mb-4 pt-2 border-t border-white/10">
                        <span className="text-gray-400 font-bold text-sm">Total</span>
                        <span className="text-3xl font-black text-white">${posFinalTotal.toFixed(2)}</span>
                      </div>
                      <button onClick={processPOSOrderPayment} className="w-full py-3 bg-white text-black rounded-xl font-black text-sm md:text-base hover:bg-gray-200 transition">CHARGE & PRINT</button>
                    </div>
                  </div>
                )}

                {/* --- MENU MANAGER --- */}
                {adminTab === 'menuManager' && (
                  <div className="flex-1 overflow-hidden flex flex-col space-y-6">
                    <h3 className="text-xl md:text-2xl font-black flex items-center gap-3"><PackagePlus className="text-orange-500" /> Menu Manager</h3>
                    <div className="bg-white/5 p-4 md:p-6 rounded-3xl border border-white/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
                      <div><input type="text" placeholder="Name" value={newItemForm.name} onChange={e => setNewItemForm({ ...newItemForm, name: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white" /></div>
                      <div><input type="number" placeholder="Price ($)" value={newItemForm.price} onChange={e => setNewItemForm({ ...newItemForm, price: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white" /></div>
                      <div>
                        <select className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white appearance-none" value={newItemForm.category} onChange={e => setNewItemForm({ ...newItemForm, category: e.target.value })}>
                          {categoryList.filter(c => c !== "All").map(cat => <option key={cat} value={cat}>{cat}</option>)}
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

                    <div className="flex-1 overflow-x-auto overflow-y-auto">
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
                    <div className="pt-4 border-t border-white/10 flex justify-end">
                      <button onClick={() => showNotification("Menu Saved!")} className="py-3 px-8 bg-green-600 rounded-xl font-black flex items-center gap-2 hover:bg-green-500 transition"><Save size={18} /> SAVE ALL CHANGES</button>
                    </div>
                  </div>
                )}

                {/* --- CUSTOMER RECORDS (RICH PROFILES) --- */}
                {adminTab === 'records' && (
                  <div className="flex-1 overflow-auto">
                    <h3 className="text-2xl md:text-3xl font-black mb-6 flex items-center gap-3"><User className="text-orange-500" /> Customer Profiles ({customerRecords.length})</h3>
                    {customerRecords.length === 0 ? (
                      <div className="text-sm text-gray-400 text-center mt-10 border border-dashed border-white/10 p-10 rounded-2xl">
                        Profiles and Order Histories will populate here automatically after checkout.
                      </div>
                    ) : (
                      <div className="space-y-4 pr-2">
                        {customerRecords.map((c, i) => (
                          <div key={i} className="bg-white/5 rounded-3xl p-5 border border-white/10 flex flex-col">
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

                {adminTab === 'branding' && (
                  <div className="flex-1"><h3 className="text-2xl font-black mb-6">Site Branding</h3>
                    <label className="inline-flex items-center gap-2 px-6 py-4 bg-orange-600 rounded-2xl font-black cursor-pointer hover:bg-orange-500">
                      <Upload size={20} /> UPLOAD NEW BG MP4
                      <input type="file" accept="video/mp4" className="hidden" onChange={handleVideoUpload} />
                    </label>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* --- QUICK ACTIONS (FABs) --- */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-[100] print:hidden">
        {currentView === 'menu' && customerCart.length > 0 && (
          <button onClick={() => setShowCustomerCheckout(true)} className="w-14 h-14 bg-orange-600 text-white rounded-full flex items-center justify-center shadow-2xl shadow-orange-600/40 hover:scale-110 transition-transform relative">
            <ShoppingBag size={24} />
            <span className="absolute -top-1 -right-1 bg-white text-black text-xs font-black rounded-full h-6 w-6 flex items-center justify-center border-2 border-orange-600">{customerCart.length}</span>
          </button>
        )}
        {showScrollFAB && (
          <button onClick={scrollToTop} className="w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full flex items-center justify-center shadow-xl hover:bg-white/20 transition-all">
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
            <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
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

            <div className="max-h-40 overflow-y-auto space-y-3 mb-6 pr-2">
              {customerCart.length === 0 ? <p className="text-gray-500 text-center py-4 text-sm">Add some delicious items first!</p> :
                customerCart.map(item => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2 w-2/3">
                      <button onClick={() => removeFromCart(item.id)} className="text-gray-600 hover:text-red-500"><X size={14} /></button>
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

            <button onClick={submitCustomerAppOrder} className="w-full py-4 bg-orange-600 rounded-xl font-black hover:bg-orange-500 transition shadow-lg">PLACE {orderType.toUpperCase()} ORDER</button>
          </div>
        </div>
      )}

      {/* Admin Print Receipt Modal */}
      {receiptData && (
        <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-md p-4 flex items-center justify-center animate-in fade-in print:absolute print:bg-white print:text-black print:p-0">
          <div className="bg-white text-black w-full max-w-sm rounded-3xl p-8 flex flex-col shadow-2xl print:shadow-none print:w-full print:rounded-none">
            <div className="text-center mb-6 border-b border-dashed border-gray-300 pb-4">
              <h2 className="text-2xl font-black uppercase mb-1">STOMAK<span className="font-light">Solution</span></h2>
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