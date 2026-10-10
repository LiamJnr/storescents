class UIStore {
  constructor() {
    this.state = {
      isCartOpen: false,
      isMenuOpen: false,
      isSearchOpen: false
    };
    this.listeners = new Set();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach(fn => fn(this.state));
  }

  openCart() {
    this.state.isCartOpen = true;
    this.state.isMenuOpen = false;
    this.state.isSearchOpen = false;
    this.notify();
  }

  closeCart() {
    this.state.isCartOpen = false;
    this.notify();
  }

  toggleCart() {
    this.state.isCartOpen = !this.state.isCartOpen;
    if (this.state.isCartOpen) {
      this.state.isMenuOpen = false;
      this.state.isSearchOpen = false;
    }
    this.notify();
  }

  openMenu() {
    this.state.isMenuOpen = true;
    this.state.isCartOpen = false;
    this.state.isSearchOpen = false;
    this.notify();
  }

  closeMenu() {
    this.state.isMenuOpen = false;
    this.notify();
  }

  toggleMenu() {
    this.state.isMenuOpen = !this.state.isMenuOpen;
    if (this.state.isMenuOpen) {
      this.state.isCartOpen = false;
      this.state.isSearchOpen = false;
    }
    this.notify();
  }

  openSearch() {
    this.state.isSearchOpen = true;
    this.state.isCartOpen = false;
    this.state.isMenuOpen = false;
    this.notify();
  }

  closeSearch() {
    this.state.isSearchOpen = false;
    this.notify();
  }

  closeAllDrawers() {
    this.state.isCartOpen = false;
    this.state.isMenuOpen = false;
    this.state.isSearchOpen = false;
    this.notify();
  }
}

export const uiStore = new UIStore();
