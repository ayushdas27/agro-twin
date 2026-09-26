/**
 * AGRO-TWIN — UI & Profile Integration Script
 * Connects the page DOM to AgroTwinState for dynamic user profile,
 * top-right avatar, dropdown, and session management.
 */

(function () {
  function renderAvatar(initials, sizeClass = 'w-8 h-8 text-xs') {
    return `<div class="${sizeClass} rounded-full bg-[#1e3a2f] text-white flex items-center justify-center font-bold tracking-tight ring-1 ring-[#c1c8c3] select-none">${initials}</div>`;
  }

  function initHeaderAndProfile() {
    const user = window.AgroTwinState ? window.AgroTwinState.getCurrentUser() : null;

    // If not logged in and not on login page, redirect to login
    const isLoginPage = window.location.pathname.includes('agro_twin_sign_in_with_google');
    if (!user || !user.name) {
      if (!isLoginPage && !window.IS_AGRO_TWIN_SPA) {
        window.location.href = '../agro_twin_sign_in_with_google/code.html';
        return;
      }
      return;
    }

    const fullName = user.name;
    const firstName = user.firstName || fullName.split(/\s+/)[0];
    const phone = user.phone;
    const initials = user.initials || window.AgroTwinState.getInitials(fullName);

    // 1. Update Greetings
    const greetingUserName = document.getElementById('greetingUserName');
    if (greetingUserName) {
      greetingUserName.textContent = firstName;
    }
    const greetingHeadline = document.getElementById('greetingHeadline');
    if (greetingHeadline && user.isReturning) {
      greetingHeadline.innerHTML = `Welcome back, <span id="greetingUserName" class="">${firstName}</span>`;
    }

    // 2. Locate or normalize Top-Right Profile container
    const header = document.querySelector('header');
    if (!header) return;

    // Find profile trigger or create standard dynamic profile
    let profileContainer = document.getElementById('googleProfileContainer') || document.getElementById('agroTwinProfileContainer');
    
    // If header has the static "Ayush R." block (found in simulator, farm_health, my_farm)
    const staticProfiles = header.querySelectorAll('.flex.items-center.gap-space-sm, .flex.items-center.gap-3');
    staticProfiles.forEach(el => {
      if (el.textContent.includes('Ayush') || el.textContent.includes('Farm Manager') || el.querySelector('img[src*="googleusercontent"]')) {
        el.id = 'agroTwinProfileContainer';
        profileContainer = el;
      }
    });

    if (profileContainer) {
      profileContainer.className = 'relative select-none';
      profileContainer.innerHTML = `
        <button id="profileDropdownTrigger" type="button" aria-haspopup="true" aria-expanded="false" class="flex items-center gap-2.5 cursor-pointer p-1 rounded-lg hover:bg-surface-container transition-colors focus:outline-none">
          <div class="flex flex-col text-right hidden sm:flex">
            <span class="font-label-lg text-label-lg font-bold text-on-surface leading-tight" id="headerProfileFirstName">${firstName}</span>
            <span class="font-label-sm text-[11px] text-on-surface-variant leading-tight" id="headerProfilePhone">${phone}</span>
          </div>
          ${renderAvatar(initials, 'w-8 h-8 text-xs')}
          <span class="material-symbols-outlined text-sm text-on-surface-variant">expand_more</span>
        </button>

        <!-- Dynamic Dropdown Menu -->
        <div id="profileDropdownMenu" class="hidden absolute right-0 top-full mt-2 w-72 bg-surface-container-lowest rounded-xl border border-outline-variant shadow-xl z-50 p-space-sm flex flex-col gap-1.5">
          <div class="p-space-sm rounded-lg bg-surface-container-low flex items-center gap-3">
            ${renderAvatar(initials, 'w-10 h-10 text-sm')}
            <div class="flex flex-col min-w-0 flex-1">
              <span class="font-label-lg text-label-lg font-bold text-on-surface truncate" id="menuFullName">${fullName}</span>
              <span class="font-label-sm text-label-sm text-on-surface-variant truncate font-mono" id="menuPhone">${phone}</span>
              <span class="font-label-sm text-[10px] text-secondary font-medium mt-0.5">Farm Manager · Active Session</span>
            </div>
          </div>

          <div class="h-px bg-outline-variant my-1"></div>

          <nav class="flex flex-col gap-0.5 text-on-surface">
            <a href="#" id="menuProfileLink" class="flex items-center gap-2 px-space-sm py-1.5 rounded-lg hover:bg-surface-container transition-colors text-on-surface">
              <span class="material-symbols-outlined text-lg text-on-surface-variant">person</span>
              <span class="font-label-md text-label-md">Profile</span>
            </a>
            <a href="#" id="menuSettingsLink" class="flex items-center gap-2 px-space-sm py-1.5 rounded-lg hover:bg-surface-container transition-colors text-on-surface">
              <span class="material-symbols-outlined text-lg text-on-surface-variant">settings</span>
              <span class="font-label-md text-label-md">Settings</span>
            </a>
          </nav>

          <div class="h-px bg-outline-variant my-1"></div>

          <button type="button" id="appSignOutBtn" class="flex items-center gap-2 px-space-sm py-2 rounded-lg text-error hover:bg-error-container/30 transition-colors w-full text-left font-semibold">
            <span class="material-symbols-outlined text-lg">logout</span>
            <span class="font-label-md text-label-md">Sign out</span>
          </button>
        </div>
      `;

      // Wire Dropdown Interactions
      const trigger = document.getElementById('profileDropdownTrigger');
      const menu = document.getElementById('profileDropdownMenu');
      const signOutBtn = document.getElementById('appSignOutBtn');

      if (trigger && menu) {
        trigger.addEventListener('click', function (e) {
          e.stopPropagation();
          menu.classList.toggle('hidden');
          trigger.setAttribute('aria-expanded', !menu.classList.contains('hidden'));
        });

        document.addEventListener('click', function (e) {
          if (!menu.contains(e.target) && !trigger.contains(e.target)) {
            menu.classList.add('hidden');
            trigger.setAttribute('aria-expanded', 'false');
          }
        });
      }

      if (signOutBtn) {
        signOutBtn.addEventListener('click', function () {
          if (window.AgroTwinState) {
            window.AgroTwinState.clearSession();
          }
          if (window.IS_AGRO_TWIN_SPA && typeof window.showLoginView === 'function') {
            window.showLoginView();
          } else {
            window.location.href = '../agro_twin_sign_in_with_google/code.html';
          }
        });
      }
    }

    // 3. Connect navigation links
    wireNavigationLinks();
  }

  function wireNavigationLinks() {
    // Only rewires if in multi-page mode (not single-page app)
    if (window.IS_AGRO_TWIN_SPA) return;

    const navLinks = document.querySelectorAll('aside nav a[data-path]');
    navLinks.forEach(link => {
      const path = link.getAttribute('data-path');
      if (path === 'overview') {
        link.href = '../farm_overview/code.html';
      } else if (path === 'my-farm') {
        link.href = '../my_farm/code.html';
      } else if (path === 'farm-health') {
        link.href = '../farm_health/code.html';
      } else if (path === 'what-if-simulator') {
        link.href = '../what_if_simulator/code.html';
      }
    });
  }

  // Auto-init on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeaderAndProfile);
  } else {
    initHeaderAndProfile();
  }

  window.AgroTwinUI = {
    initHeaderAndProfile,
    renderAvatar
  };
})();
