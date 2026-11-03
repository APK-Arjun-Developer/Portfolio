import { createContext, useContext } from 'react';

/** Opens the contact dialog from anywhere: navbar, hero, footer. */
export const ContactContext = createContext<() => void>(() => {});
export const useOpenContact = () => useContext(ContactContext);
