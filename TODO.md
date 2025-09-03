# TODO: Fix Cart and Wishlist Persistence on Browser Refresh

## Information Gathered
- Cart and wishlist slices manually load initial state from localStorage but do not save updates back.
- Redux store uses redux-persist to persist slices including cart and wishlist.
- Manual localStorage loading conflicts with redux-persist, causing persistence issues.
- Navbar uses Redux selectors to display cart and wishlist counts.

## Plan
- Remove manual localStorage loading from cartSlice and wishlistSlice initialState.
- Rely on redux-persist for persistence and rehydration.
- Ensure Navbar counts update correctly after refresh.

## Dependent Files to Edit
- [x] src/app/redux/slices/cartSlice.js - Removed manual localStorage loading
- [x] src/app/redux/slices/wishlistSlice.js - Removed manual localStorage loading

## Followup Steps
- [ ] Test adding items to cart and wishlist.
- [ ] Refresh browser and verify items persist.
- [ ] Check Navbar counts are maintained.
