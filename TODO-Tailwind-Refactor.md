# Tailwind CSS Refactor Progress

## Current Scope: Home.vue + Components (HeroSection, CategoriesSection, StatsSection, Login, Register)

### [x] 1. Global Tailwind Setup

- [x] Uncomment/enable tailwind.config.js content paths
- [x] Replace index.css with Tailwind directives + Inter font
- [ ] Test: `cd gawt_frontend/gawt_frontend && npm run dev` (no errors)

### [x] 2. Convert Home.vue

- [x] Remove entire <style scoped>
- [x] Convert navbar, buttons, item grid/cards, badges, spinners, empty/loading states to Tailwind
- [ ] Test responsive hover states, modals open/close

- [ ] Remove entire <style scoped>
- [ ] Convert navbar, buttons, item grid/cards, badges, spinners, empty/loading states to Tailwind
- [ ] Test responsive hover states, modals open/close

### [ ] 3. Convert HeroSection.vue

- [ ] Remove <style>
- [ ] Hero gradient, title gradient-text, ping dot, buttons

### [ ] 4. Convert CategoriesSection.vue

- [ ] Remove <style>
- [ ] Responsive grid, dynamic icon bg-gradient via Tailwind arbitrary

### [ ] 5. Convert StatsSection.vue

- [ ] Remove <style>
- [ ] Stats grid, gradient numbers

### [ ] 6. Convert Login.vue & Register.vue

- [ ] Remove custom CSS, enhance Tailwind shadows/rings

### [ ] 7. Test Home Page

- [ ] Full page responsive (mobile/tablet/desktop)
- [ ] Navbar sticky, item cards hover, modals, loading states
- [ ] No CSS conflicts, functionality intact (login/register, fetch items)

### [ ] Next Phase: Marketplace.vue + rest (after approval)

**Completed Steps: 0/7**
