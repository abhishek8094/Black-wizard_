'use client';
import { createContext, useContext, useReducer } from 'react';

const CartContext = createContext();

const loadCartFromLocalStorage = () => {
  if (typeof window !== 'undefined') {
    const storedCart = localStorage.getItem('cartItems');
    return storedCart ? JSON.parse(storedCart) : [];
  }
  return [];
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItem = state.items.find(item => 
        item.id === action.payload.id && item.size === action.payload.size
      );
      
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id && item.size === action.payload.size
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        };
      }
      
      return {
        ...state,
        items: [...state.items, action.payload],
      };
      
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(item => 
          !(item.id === action.payload.id && item.size === action.payload.size)
        ),
      };
      
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id && item.size === action.payload.size
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
      
    case 'CLEAR_CART':
      return { items: [] };
      
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: loadCartFromLocalStorage() });

  const addToCart = (product, size, quantity = 1) => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: { ...product, size, quantity },
    });
    
    // Update localStorage after state update
    const updatedItems = state.items.find(item => 
      item.id === product.id && item.size === size
    ) 
      ? state.items.map(item =>
          item.id === product.id && item.size === size
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      : [...state.items, { ...product, size, quantity }];
    
    localStorage.setItem('cartItems', JSON.stringify(updatedItems));
  };

  const removeFromCart = (id, size) => {
    dispatch({
      type: 'REMOVE_FROM_CART',
      payload: { id, size },
    });
    
    const updatedItems = state.items.filter(item => 
      !(item.id === id && item.size === size)
    );
    localStorage.setItem('cartItems', JSON.stringify(updatedItems));
  };

  const updateQuantity = (id, size, quantity) => {
    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: { id, size, quantity },
    });
    
    const updatedItems = state.items.map(item =>
      item.id === id && item.size === size
        ? { ...item, quantity }
        : item
    );
    localStorage.setItem('cartItems', JSON.stringify(updatedItems));
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    localStorage.removeItem('cartItems');
  };

  const getTotalPrice = () => {
    return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getTotalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
