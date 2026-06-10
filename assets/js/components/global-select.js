/* ============================================================
   COMPONENT: Global Single Select Javascript
   
   A premium, keyboard-accessible custom select system that enhances 
   native HTML <select> elements. Maintains synchronization with the 
   original element to ensure compatibility with existing JS logic.
   
   Angular Migration: Ready to be refactored into a custom Directive/Component.
   ============================================================ */

class GlobalSelect {
  constructor(selectElement, options = {}) {
    if (!selectElement || selectElement.tagName !== 'SELECT') {
      console.error('GlobalSelect: Element must be a SELECT tag', selectElement);
      return;
    }

    this.select = selectElement;
    this.options = {
      search: this.select.dataset.search !== 'false', // Default to true unless data-search="false"
      placeholder: this.select.dataset.placeholder || this.getPlaceholderText(),
      ...options
    };

    // Store references
    this.container = null;
    this.trigger = null;
    this.label = null;
    this.chevron = null;
    this.dropdown = null;
    this.searchInput = null;
    this.optionsList = null;
    this.activeOptionIndex = -1;
    this.visibleOptions = [];

    // Initialize
    this.init();
  }

  // Get fallback placeholder
  getPlaceholderText() {
    const firstOption = this.select.querySelector('option');
    if (firstOption && (!firstOption.value || firstOption.disabled)) {
      return firstOption.textContent;
    }
    return 'Select an option';
  }

  init() {
    // Hide native select
    this.select.style.display = 'none';

    // Create container
    this.container = document.createElement('div');
    this.container.className = 'global-select-container';
    
    // Copy select's classes (excluding tailwind border/bg wrappers)
    const originalClasses = Array.from(this.select.classList).filter(c => 
      !c.startsWith('w-') && !c.startsWith('h-') && !c.startsWith('border') && 
      !c.startsWith('bg-') && !c.startsWith('rounded') && !c.startsWith('p-') && 
      !c.startsWith('pl-') && !c.startsWith('pr-') && !c.startsWith('text-')
    );
    if (originalClasses.length) {
      this.container.classList.add(...originalClasses);
    }
    
    // Retain ID on container or store data attribute
    if (this.select.id) {
      this.container.setAttribute('data-select-for', this.select.id);
    }

    if (this.select.disabled) {
      this.container.classList.add('is-disabled');
    }

    // Build Custom Trigger
    this.trigger = document.createElement('div');
    this.trigger.className = 'global-select-trigger';
    this.trigger.setAttribute('tabindex', this.select.disabled ? '-1' : '0');
    this.trigger.setAttribute('role', 'combobox');
    this.trigger.setAttribute('aria-expanded', 'false');
    this.trigger.setAttribute('aria-haspopup', 'listbox');

    this.label = document.createElement('span');
    this.label.className = 'global-select-label';
    this.updateTriggerLabel();

    this.chevron = document.createElement('i');
    this.chevron.className = 'fa-solid fa-chevron-down global-select-chevron';

    this.trigger.appendChild(this.label);
    this.trigger.appendChild(this.chevron);
    this.container.appendChild(this.trigger);

    // Build Dropdown Panel
    this.dropdown = document.createElement('div');
    this.dropdown.className = 'global-select-dropdown';

    // Search bar (if enabled)
    const itemsCount = this.select.querySelectorAll('option:not([disabled])').length;
    if (this.options.search && itemsCount > 4) {
      const searchContainer = document.createElement('div');
      searchContainer.className = 'global-select-search-container';
      
      const searchIcon = document.createElement('i');
      searchIcon.className = 'fa-solid fa-magnifying-glass search-icon';
      
      this.searchInput = document.createElement('input');
      this.searchInput.type = 'text';
      this.searchInput.className = 'global-select-search';
      this.searchInput.placeholder = 'Search...';
      this.searchInput.setAttribute('autocomplete', 'off');
      
      searchContainer.appendChild(searchIcon);
      searchContainer.appendChild(this.searchInput);
      this.dropdown.appendChild(searchContainer);
    }

    // Options List
    this.optionsList = document.createElement('ul');
    this.optionsList.className = 'global-select-options';
    this.optionsList.setAttribute('role', 'listbox');
    this.renderOptions();
    this.dropdown.appendChild(this.optionsList);

    this.container.appendChild(this.dropdown);
    this.select.parentNode.insertBefore(this.container, this.select);

    // Bind Event Listeners
    this.bindEvents();
  }

  // Update trigger text with current selection or placeholder
  updateTriggerLabel() {
    const selectedOption = this.select.options[this.select.selectedIndex];
    if (selectedOption && selectedOption.value && !selectedOption.disabled) {
      this.label.textContent = selectedOption.textContent;
      this.label.classList.remove('is-placeholder');
    } else {
      this.label.textContent = this.options.placeholder;
      this.label.classList.add('is-placeholder');
    }
  }

  // Populate options dynamically from original select options
  renderOptions() {
    this.optionsList.innerHTML = '';
    this.visibleOptions = [];

    Array.from(this.select.options).forEach((opt, idx) => {
      // Skip empty placeholder option if it is disabled
      if (!opt.value && opt.disabled) return;

      const li = document.createElement('li');
      li.className = 'global-select-option';
      li.setAttribute('data-value', opt.value);
      li.setAttribute('data-index', idx);
      li.setAttribute('role', 'option');
      li.textContent = opt.textContent;

      if (opt.disabled) {
        li.classList.add('is-disabled');
        li.setAttribute('aria-disabled', 'true');
      }

      if (opt.selected && opt.value) {
        li.classList.add('is-selected');
        li.setAttribute('aria-selected', 'true');
      }

      this.optionsList.appendChild(li);
      this.visibleOptions.push(li);
    });
  }

  // Prevent browser focus-scroll on mouse interaction (keeps keyboard focus intact)
  preventFocusScroll(element) {
    element.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return;
      e.preventDefault();
    });
  }

  focusWithoutScroll(element) {
    if (!element) return;
    element.focus({ preventScroll: true });
  }

  // Scroll within the options panel only — never the page
  scrollOptionIntoView(optionElement, { center = false } = {}) {
    if (!optionElement) return;
    const container = this.optionsList;
    const optionTop = optionElement.offsetTop;
    const optionBottom = optionTop + optionElement.offsetHeight;
    const viewTop = container.scrollTop;
    const viewBottom = viewTop + container.clientHeight;

    if (center) {
      container.scrollTop = optionTop - (container.clientHeight / 2) + (optionElement.offsetHeight / 2);
    } else if (optionTop < viewTop) {
      container.scrollTop = optionTop;
    } else if (optionBottom > viewBottom) {
      container.scrollTop = optionBottom - container.clientHeight;
    }
  }

  bindEvents() {
    this.preventFocusScroll(this.trigger);
    this.preventFocusScroll(this.optionsList);

    // Toggle dropdown on trigger click
    this.trigger.addEventListener('click', () => {
      if (this.select.disabled) return;
      this.toggleDropdown();
    });

    // Option selection
    this.optionsList.addEventListener('click', (e) => {
      const option = e.target.closest('.global-select-option');
      if (!option || option.classList.contains('is-disabled')) return;
      this.selectOption(option);
    });

    // Search filter input event
    if (this.searchInput) {
      this.preventFocusScroll(this.searchInput);
      this.searchInput.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return;
        e.preventDefault();
        this.focusWithoutScroll(this.searchInput);
      });
      this.searchInput.addEventListener('input', () => {
        this.filterOptions(this.searchInput.value);
      });
    }

    // Keyboard navigation on trigger
    this.trigger.addEventListener('keydown', (e) => this.handleKeyDown(e));
    if (this.searchInput) {
      this.searchInput.addEventListener('keydown', (e) => this.handleKeyDown(e));
    }

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (!this.container.contains(e.target)) {
        this.closeDropdown();
      }
    });

    // Sync with external updates to native select (like value resetting)
    const observer = new MutationObserver(() => {
      this.updateTriggerLabel();
      this.renderOptions();
    });
    observer.observe(this.select, { attributes: true, childList: true, characterData: true });
    
    // Add value setter interceptor to original select
    const self = this;
    const originalValueProp = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value');
    if (originalValueProp) {
      Object.defineProperty(this.select, 'value', {
        get() {
          return originalValueProp.get.call(this);
        },
        set(val) {
          originalValueProp.set.call(this, val);
          self.updateTriggerLabel();
          self.renderOptions();
        }
      });
    }
  }

  toggleDropdown() {
    if (this.container.classList.contains('is-open')) {
      this.closeDropdown();
    } else {
      this.openDropdown();
    }
  }

  openDropdown() {
    // Close other dropdowns
    document.querySelectorAll('.global-select-container.is-open').forEach(el => {
      if (el !== this.container) el.classList.remove('is-open');
    });

    this.container.classList.add('is-open');
    this.trigger.setAttribute('aria-expanded', 'true');
    
    // Scroll selected option into view (options panel only)
    const selected = this.optionsList.querySelector('.global-select-option.is-selected');
    this.scrollOptionIntoView(selected, { center: true });

    // Autofocus search without scrolling the page
    if (this.searchInput) {
      requestAnimationFrame(() => this.focusWithoutScroll(this.searchInput));
    }
    
    this.activeOptionIndex = -1;
    this.updateActiveOption();
  }

  closeDropdown() {
    this.container.classList.remove('is-open');
    this.trigger.setAttribute('aria-expanded', 'false');
    if (this.searchInput) this.searchInput.value = '';
    this.filterOptions(''); // Reset search
  }

  selectOption(optionElement) {
    const idx = parseInt(optionElement.getAttribute('data-index'), 10);
    this.select.selectedIndex = idx;
    
    // Trigger standard native change event
    const event = new Event('change', { bubbles: true });
    this.select.dispatchEvent(event);

    this.updateTriggerLabel();
    this.renderOptions();
    this.closeDropdown();
  }

  filterOptions(query) {
    query = query.toLowerCase().trim();
    this.visibleOptions = [];

    const options = this.optionsList.querySelectorAll('.global-select-option');
    options.forEach(opt => {
      const text = opt.textContent.toLowerCase();
      if (text.includes(query)) {
        opt.style.display = '';
        this.visibleOptions.push(opt);
      } else {
        opt.style.display = 'none';
      }
    });

    this.activeOptionIndex = -1;
    this.updateActiveOption();
  }

  handleKeyDown(e) {
    if (this.select.disabled) return;

    const isOpen = this.container.classList.contains('is-open');

    switch (e.key) {
      case 'Enter':
      case ' ':
        if (!isOpen) {
          this.openDropdown();
          e.preventDefault();
        } else if (this.activeOptionIndex >= 0 && this.activeOptionIndex < this.visibleOptions.length) {
          this.selectOption(this.visibleOptions[this.activeOptionIndex]);
          e.preventDefault();
        } else {
          this.closeDropdown();
          e.preventDefault();
        }
        break;

      case 'ArrowDown':
        if (!isOpen) {
          this.openDropdown();
        } else if (this.visibleOptions.length > 0) {
          this.activeOptionIndex = (this.activeOptionIndex + 1) % this.visibleOptions.length;
          this.updateActiveOption();
          this.scrollActiveOptionIntoView();
        }
        e.preventDefault();
        break;

      case 'ArrowUp':
        if (isOpen && this.visibleOptions.length > 0) {
          if (this.activeOptionIndex <= 0) {
            this.activeOptionIndex = this.visibleOptions.length - 1;
          } else {
            this.activeOptionIndex--;
          }
          this.updateActiveOption();
          this.scrollActiveOptionIntoView();
        }
        e.preventDefault();
        break;

      case 'Escape':
        if (isOpen) {
          this.closeDropdown();
          e.preventDefault();
        }
        break;

      case 'Tab':
        if (isOpen) {
          this.closeDropdown();
        }
        break;
    }
  }

  updateActiveOption() {
    this.visibleOptions.forEach((opt, idx) => {
      opt.classList.toggle('is-active', idx === this.activeOptionIndex);
      // Give basic visual border focus/background to keyboard-highlighted element
      if (idx === this.activeOptionIndex) {
        opt.style.backgroundColor = 'var(--select-hover-bg)';
      } else {
        opt.style.backgroundColor = '';
      }
    });
  }

  scrollActiveOptionIntoView() {
    if (this.activeOptionIndex >= 0 && this.activeOptionIndex < this.visibleOptions.length) {
      this.scrollOptionIntoView(this.visibleOptions[this.activeOptionIndex]);
    }
  }

  // Global static initializer
  static initAll(selector = 'select:not([multiple]):not([data-select-ignore])') {
    document.querySelectorAll(selector).forEach(sel => {
      // Check if already initialized
      if (!sel.closest('.global-select-container')) {
        new GlobalSelect(sel);
      }
    });
  }
}

// Auto-initialize on load
document.addEventListener('DOMContentLoaded', () => {
  GlobalSelect.initAll();
});
