/* ============================================================
   COMPONENT: Global Multi-Select Javascript
   
   A custom premium multi-select dropdown that enhances native HTML <select multiple>
   elements. Features checkbox toggles, search filtering, tag chips in the trigger,
   and a sticky actions footer. Fully synchronized with the original element.
   
   Angular Migration: Ready to be refactored into a custom Directive/Component.
   ============================================================ */

class GlobalMultiSelect {
  constructor(selectElement, options = {}) {
    if (!selectElement || selectElement.tagName !== 'SELECT' || !selectElement.multiple) {
      console.error('GlobalMultiSelect: Element must be a SELECT tag with "multiple" attribute', selectElement);
      return;
    }

    this.select = selectElement;
    this.options = {
      search: this.select.dataset.search !== 'false', // Default to true
      placeholder: this.select.dataset.placeholder || this.getPlaceholderText(),
      maxChips: parseInt(this.select.dataset.maxChips, 10) || 2, // Max chips to show before showing "X selected"
      ...options
    };

    // Store references
    this.container = null;
    this.trigger = null;
    this.labelContainer = null;
    this.chevron = null;
    this.dropdown = null;
    this.searchInput = null;
    this.optionsList = null;
    this.backdrop = null;
    this.activeOptionIndex = -1;
    this.visibleOptions = [];

    // Temporary selection state until "Done" is clicked
    this.tempSelections = [];

    // Initialize
    this.init();
  }

  getPlaceholderText() {
    return this.select.dataset.placeholder || 'Select options';
  }

  init() {
    // Hide native select
    this.select.style.display = 'none';

    // Create container
    this.container = document.createElement('div');
    this.container.className = 'global-multiselect-container';

    // Copy select's classes (excluding tailwind wrappers)
    const originalClasses = Array.from(this.select.classList).filter(c => 
      !c.startsWith('w-') && !c.startsWith('h-') && !c.startsWith('border') && 
      !c.startsWith('bg-') && !c.startsWith('rounded') && !c.startsWith('p-') && 
      !c.startsWith('pl-') && !c.startsWith('pr-') && !c.startsWith('text-')
    );
    if (originalClasses.length) {
      this.container.classList.add(...originalClasses);
    }

    // ID mapping
    if (this.select.id) {
      this.container.setAttribute('data-multiselect-for', this.select.id);
    }

    if (this.select.disabled) {
      this.container.classList.add('is-disabled');
    }

    // Mobile Backdrop
    this.backdrop = document.createElement('div');
    this.backdrop.className = 'global-multiselect-backdrop';
    this.container.appendChild(this.backdrop);

    // Build Trigger
    this.trigger = document.createElement('div');
    this.trigger.className = 'global-multiselect-trigger';
    this.trigger.setAttribute('tabindex', this.select.disabled ? '-1' : '0');
    this.trigger.setAttribute('role', 'combobox');
    this.trigger.setAttribute('aria-expanded', 'false');
    this.trigger.setAttribute('aria-haspopup', 'listbox');

    this.labelContainer = document.createElement('div');
    this.labelContainer.className = 'global-multiselect-label';
    
    this.chevron = document.createElement('i');
    this.chevron.className = 'fa-solid fa-chevron-down global-multiselect-chevron';

    this.trigger.appendChild(this.labelContainer);
    this.trigger.appendChild(this.chevron);
    this.container.appendChild(this.trigger);

    // Build Dropdown Panel
    this.dropdown = document.createElement('div');
    this.dropdown.className = 'global-multiselect-dropdown';

    // Search bar
    if (this.options.search) {
      const searchContainer = document.createElement('div');
      searchContainer.className = 'global-multiselect-search-container';

      const searchIcon = document.createElement('i');
      searchIcon.className = 'fa-solid fa-magnifying-glass search-icon';

      this.searchInput = document.createElement('input');
      this.searchInput.type = 'text';
      this.searchInput.className = 'global-multiselect-search';
      this.searchInput.placeholder = 'Search options...';
      this.searchInput.setAttribute('autocomplete', 'off');

      searchContainer.appendChild(searchIcon);
      searchContainer.appendChild(this.searchInput);
      this.dropdown.appendChild(searchContainer);
    }

    // Scrollable Options List
    this.optionsList = document.createElement('ul');
    this.optionsList.className = 'global-multiselect-options';
    this.optionsList.setAttribute('role', 'listbox');
    this.optionsList.setAttribute('aria-multiselectable', 'true');
    this.dropdown.appendChild(this.optionsList);

    // Sticky Actions Footer
    const footer = document.createElement('div');
    footer.className = 'global-multiselect-footer';

    const clearBtn = document.createElement('button');
    clearBtn.type = 'button';
    clearBtn.className = 'global-multiselect-clear';
    clearBtn.textContent = 'Clear All';

    const applyBtn = document.createElement('button');
    applyBtn.type = 'button';
    applyBtn.className = 'global-multiselect-apply';
    applyBtn.textContent = 'Done';

    footer.appendChild(clearBtn);
    footer.appendChild(applyBtn);
    this.dropdown.appendChild(footer);

    this.container.appendChild(this.dropdown);
    this.select.parentNode.insertBefore(this.container, this.select);

    // Read current selections to initialize state
    this.syncFromSelect();
    this.renderTrigger();
    this.renderOptions();

    // Bind Event Listeners
    this.bindEvents(clearBtn, applyBtn);
  }

  // Read actual selection values from native select element
  syncFromSelect() {
    this.tempSelections = Array.from(this.select.options)
      .filter(opt => opt.selected && opt.value)
      .map(opt => opt.value);
  }

  // Push temp selections back to original select and trigger change
  applySelection() {
    Array.from(this.select.options).forEach(opt => {
      opt.selected = this.tempSelections.includes(opt.value);
    });

    // Dispatch native change event
    const event = new Event('change', { bubbles: true });
    this.select.dispatchEvent(event);

    this.renderTrigger();
    this.renderOptions();
    this.closeDropdown();
  }

  // Reset temporary selections to currently active selection values
  cancelSelection() {
    this.syncFromSelect();
    this.renderOptions();
    this.closeDropdown();
  }

  // Uncheck everything
  clearAll() {
    this.tempSelections = [];
    this.optionsList.querySelectorAll('.global-multiselect-option').forEach((option) => {
      option.classList.remove('is-selected');
      option.setAttribute('aria-selected', 'false');
    });
  }

  // Draw custom chip elements in trigger button
  renderTrigger() {
    this.labelContainer.innerHTML = '';
    const activeOpts = Array.from(this.select.options).filter(opt => opt.selected && opt.value);

    if (activeOpts.length === 0) {
      const span = document.createElement('span');
      span.textContent = this.options.placeholder;
      span.className = 'is-placeholder';
      this.labelContainer.appendChild(span);
      return;
    }

    if (activeOpts.length > this.options.maxChips) {
      // Show compact counter
      const span = document.createElement('span');
      span.textContent = `${activeOpts.length} selected`;
      span.style.fontWeight = '500';
      this.labelContainer.appendChild(span);
      return;
    }

    // Render individual premium chip tags
    activeOpts.forEach(opt => {
      const chip = document.createElement('span');
      chip.className = 'global-multiselect-chip';
      
      const chipText = document.createElement('span');
      chipText.textContent = opt.textContent;
      chip.appendChild(chipText);

      const removeBtn = document.createElement('i');
      removeBtn.className = 'fa-solid fa-xmark global-multiselect-chip-remove';
      removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.removeOptionByValue(opt.value);
      });
      chip.appendChild(removeBtn);

      this.labelContainer.appendChild(chip);
    });
  }

  removeOptionByValue(val) {
    Array.from(this.select.options).forEach(opt => {
      if (opt.value === val) opt.selected = false;
    });

    // Dispatch change event
    const event = new Event('change', { bubbles: true });
    this.select.dispatchEvent(event);

    this.syncFromSelect();
    this.renderTrigger();
    this.renderOptions();
  }

  renderOptions() {
    this.optionsList.innerHTML = '';
    this.visibleOptions = [];

    Array.from(this.select.options).forEach((opt, idx) => {
      if (!opt.value) return; // Skip placeholder option

      const li = document.createElement('li');
      li.className = 'global-multiselect-option';
      li.setAttribute('data-value', opt.value);
      li.setAttribute('data-index', idx);
      li.setAttribute('role', 'option');

      const isChecked = this.tempSelections.includes(opt.value);
      if (isChecked) {
        li.classList.add('is-selected');
        li.setAttribute('aria-selected', 'true');
      }

      if (opt.disabled) {
        li.classList.add('is-disabled');
        li.setAttribute('aria-disabled', 'true');
      }

      // Checkbox container
      const checkbox = document.createElement('div');
      checkbox.className = 'global-multiselect-checkbox-custom';

      // Option label
      const label = document.createElement('span');
      label.className = 'global-multiselect-option-label';
      label.textContent = opt.textContent;

      li.appendChild(checkbox);
      li.appendChild(label);
      this.optionsList.appendChild(li);
      
      this.visibleOptions.push(li);
    });
  }

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

  toggleOptionElement(option) {
    const val = option.getAttribute('data-value');
    const idx = this.tempSelections.indexOf(val);

    if (idx > -1) {
      this.tempSelections.splice(idx, 1);
      option.classList.remove('is-selected');
      option.setAttribute('aria-selected', 'false');
    } else {
      this.tempSelections.push(val);
      option.classList.add('is-selected');
      option.setAttribute('aria-selected', 'true');
    }
  }

  bindEvents(clearBtn, applyBtn) {
    this.preventFocusScroll(this.trigger);
    this.preventFocusScroll(this.optionsList);

    // Toggle dropdown
    this.trigger.addEventListener('click', () => {
      if (this.select.disabled) return;
      this.toggleDropdown();
    });

    // Close on mobile backdrop click
    this.backdrop.addEventListener('click', () => {
      this.cancelSelection();
    });

    // Option checkbox click toggle (update in place to preserve list scroll)
    this.optionsList.addEventListener('click', (e) => {
      const option = e.target.closest('.global-multiselect-option');
      if (!option || option.classList.contains('is-disabled')) return;

      this.toggleOptionElement(option);

      if (this.searchInput) {
        this.focusWithoutScroll(this.searchInput);
      }
    });

    // Footer actions
    clearBtn.addEventListener('click', () => this.clearAll());
    applyBtn.addEventListener('click', () => this.applySelection());

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

    // Keyboard navigation
    this.trigger.addEventListener('keydown', (e) => this.handleKeyDown(e));
    if (this.searchInput) {
      this.searchInput.addEventListener('keydown', (e) => this.handleKeyDown(e));
    }

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (!this.container.contains(e.target)) {
        this.cancelSelection();
      }
    });

    // Sync with external resets/updates to native select
    const observer = new MutationObserver(() => {
      this.syncFromSelect();
      this.renderTrigger();
      this.renderOptions();
    });
    observer.observe(this.select, { attributes: true, childList: true, characterData: true });
  }

  toggleDropdown() {
    if (this.container.classList.contains('is-open')) {
      this.cancelSelection();
    } else {
      this.openDropdown();
    }
  }

  openDropdown() {
    // Close other dropdowns
    document.querySelectorAll('.global-select-container.is-open, .global-multiselect-container.is-open').forEach(el => {
      if (el !== this.container) el.classList.remove('is-open');
    });

    this.syncFromSelect();
    this.renderOptions();

    this.container.classList.add('is-open');
    this.trigger.setAttribute('aria-expanded', 'true');

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
    this.filterOptions(''); // Reset filter
  }

  filterOptions(query) {
    query = query.toLowerCase().trim();
    this.visibleOptions = [];

    const options = this.optionsList.querySelectorAll('.global-multiselect-option');
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
        if (isOpen) {
          if (this.activeOptionIndex >= 0 && this.activeOptionIndex < this.visibleOptions.length) {
            // Toggle currently highlighted option
            const opt = this.visibleOptions[this.activeOptionIndex];
            opt.click();
          } else {
            // Apply selections on Enter if no option is keyboard-active
            this.applySelection();
          }
          e.preventDefault();
        } else {
          this.openDropdown();
          e.preventDefault();
        }
        break;

      case ' ':
        if (!isOpen) {
          this.openDropdown();
          e.preventDefault();
        } else if (this.activeOptionIndex >= 0 && this.activeOptionIndex < this.visibleOptions.length) {
          const opt = this.visibleOptions[this.activeOptionIndex];
          opt.click();
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
          this.cancelSelection();
          e.preventDefault();
        }
        break;

      case 'Tab':
        if (isOpen) {
          this.applySelection();
        }
        break;
    }
  }

  updateActiveOption() {
    this.visibleOptions.forEach((opt, idx) => {
      opt.classList.toggle('is-active', idx === this.activeOptionIndex);
      if (idx === this.activeOptionIndex) {
        opt.style.backgroundColor = 'var(--ms-hover-bg)';
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
  static initAll(selector = 'select[multiple]:not([data-select-ignore])') {
    document.querySelectorAll(selector).forEach(sel => {
      // Check if already initialized
      if (!sel.closest('.global-multiselect-container')) {
        new GlobalMultiSelect(sel);
      }
    });
  }
}

// Auto-initialize on load
document.addEventListener('DOMContentLoaded', () => {
  GlobalMultiSelect.initAll();
});
