const state = {
  isAuthenticated: false,
  dashboardStats: {
    goalPercent: 75,
    steps: 8432,
    kcal: 482,
    mins: 45
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const navButtons = document.querySelectorAll('.nav-button');
  const sections = document.querySelectorAll('.page-section');
  const topAppBar = document.getElementById('top-app-bar');
  const bottomNav = document.getElementById('bottom-nav');

  const activeClassList = ['bg-[#f3ffca]', 'text-[#0e0e0e]', 'rounded-full', 'scale-110'];
  const inactiveClassList = ['text-[#adaaaa]', 'scale-95', 'hover:text-white'];
  
  function switchTab(targetId) {
    sections.forEach(sec => {
      if (sec.id === `view-${targetId}`) {
        sec.classList.remove('hidden');
        setTimeout(() => sec.style.opacity = '1', 10);
      } else {
        sec.style.opacity = '0';
        setTimeout(() => sec.classList.add('hidden'), 300);
      }
    });

    if (targetId === 'login') {
      if (topAppBar) topAppBar.classList.add('hidden');
      if (bottomNav) bottomNav.classList.add('hidden');
    } else {
      if (topAppBar) topAppBar.classList.remove('hidden');
      if (bottomNav) bottomNav.classList.remove('hidden');
    }

    navButtons.forEach(btn => {
      const icon = btn.querySelector('.nav-icon');
      if (btn.dataset.target === targetId) {
        btn.classList.add(...activeClassList);
        btn.classList.remove(...inactiveClassList);
        icon.classList.add('filled');
      } else {
        btn.classList.add(...inactiveClassList);
        btn.classList.remove(...activeClassList);
        icon.classList.remove('filled');
      }
    });

    if (targetId === 'dashboard') {
      animateDashboard();
    }
  }

  navButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = btn.dataset.target;
      switchTab(target);
      window.history.pushState(null, '', `#${target}`);
    });
  });

  /* DASHBOARD ANIMATIONS */
  function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      obj.innerHTML = Math.floor(easeOut * (end - start) + start).toLocaleString();
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        obj.innerHTML = end.toLocaleString();
      }
    };
    window.requestAnimationFrame(step);
  }

  let dashboardAnimated = false;
  function animateDashboard() {
    if (dashboardAnimated) return;
    dashboardAnimated = true;
    
    setTimeout(() => {
      const ring = document.getElementById('daily-goal-ring');
      if (ring) {
        ring.style.transition = 'stroke-dashoffset 1.5s ease-out';
        ring.style.strokeDashoffset = '70.6';
      }
      
      const stepsBar = document.getElementById('steps-bar');
      if (stepsBar) {
        stepsBar.style.width = '84%';
      }
    }, 100);
    
    const goalText = document.getElementById('daily-goal-text');
    const stepsText = document.getElementById('steps-text');
    const kcalText = document.getElementById('kcal-text');
    const minsText = document.getElementById('mins-text');
    
    if (goalText) animateValue(goalText, 0, state.dashboardStats.goalPercent, 1500);
    if (stepsText) animateValue(stepsText, 0, state.dashboardStats.steps, 1500);
    if (kcalText) animateValue(kcalText, 0, state.dashboardStats.kcal, 1500);
    if (minsText) animateValue(minsText, 0, state.dashboardStats.mins, 1500);
  }

  /* WORKOUT LIBRARY LOGIC */
  const searchInput = document.getElementById('workout-search');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const workoutCards = document.querySelectorAll('.workout-card');

  function filterWorkouts() {
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    const activeFilterBtn = document.querySelector('.filter-btn.bg-primary');
    const activeCategory = activeFilterBtn ? activeFilterBtn.dataset.category : 'ALL';
    
    let visibleCount = 0;

    workoutCards.forEach(card => {
      const title = card.dataset.title.toLowerCase();
      const category = card.dataset.category;
      
      const matchesSearch = title.includes(searchTerm);
      const matchesCategory = activeCategory === 'ALL' || category === activeCategory;
      
      if (matchesSearch && matchesCategory) {
        card.style.display = 'block';
        setTimeout(() => card.style.opacity = '1', 10);
        visibleCount++;
      } else {
        card.style.opacity = '0';
        setTimeout(() => card.style.display = 'none', 300);
      }
    });

    const countEl = document.getElementById('workout-count');
    if (countEl) countEl.innerText = visibleCount;
  }

  if (searchInput) {
    searchInput.addEventListener('input', filterWorkouts);
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('bg-primary', 'text-[#4a5e00]');
        b.classList.add('bg-surface-container-high', 'text-on-surface-variant');
      });
      btn.classList.add('bg-primary', 'text-[#4a5e00]');
      btn.classList.remove('bg-surface-container-high', 'text-on-surface-variant');
      filterWorkouts();
    });
  });

  /* TOAST NOTIFICATIONS */
  const startBtns = document.querySelectorAll('.start-workout-btn');
  const toastContainer = document.getElementById('toast-container');

  function showToast(message) {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'bg-[#cafd00] text-[#4a5e00] px-6 py-3 rounded-xl shadow-[0_20px_40px_rgba(202,253,0,0.15)] flex items-center gap-3 transform transition-all duration-300 translate-y-[-20px] opacity-0 font-label font-bold tracking-wide text-sm';
    toast.innerHTML = `<span class="material-symbols-outlined filled">bolt</span> ${message}`;
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.remove('translate-y-[-20px]', 'opacity-0');
    }, 10);

    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-[-20px]');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  startBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = e.target.closest('.workout-card');
      const title = card ? card.dataset.title : 'Workout';
      showToast(`Initiating ${title.toUpperCase()}... Timer started.`);
    });
  });

  /* LOGIN LOGIC */
  const loginForm = document.getElementById('login-form');
  const loginBtn = document.getElementById('login-btn');

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btnText = loginBtn.querySelector('.btn-text');
      const btnIcon = loginBtn.querySelector('.btn-icon');
      
      // Simulate loading state
      btnText.innerText = 'AUTHENTICATING...';
      btnIcon.innerText = 'hourglass_empty';
      loginBtn.classList.add('animate-pulse');

      setTimeout(() => {
        state.isAuthenticated = true;
        
        // Revert button state
        btnText.innerText = 'Log In';
        btnIcon.innerText = 'arrow_forward';
        loginBtn.classList.remove('animate-pulse');
        
        switchTab('dashboard');
        window.history.pushState(null, '', '#dashboard');
      }, 1200);
    });
  }

  const initHash = window.location.hash.substring(1);
  if (!state.isAuthenticated) {
    switchTab('login');
  } else if (['dashboard', 'workouts', 'profile'].includes(initHash)) {
    switchTab(initHash);
  } else {
    switchTab('dashboard');
  }
});

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(registration => {
      console.log('ServiceWorker registration successful');
    }).catch(err => {
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}
