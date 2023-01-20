import { useSelector } from '../selector';

export const useContactsSelector = () => useSelector(state => state.contactBook.contacts);
export const useContactsAddressesSelector = () =>
  useSelector(state => state.contactBook.contacts.map(({ publicKeyHash }) => publicKeyHash));
export const useContactCandidatePkhSelector = () => useSelector(state => state.contactBook.contactCandidatePkh);
export const useBlacklistedAddressesSelector = () => useSelector(state => state.contactBook.ignoredAddresses);
