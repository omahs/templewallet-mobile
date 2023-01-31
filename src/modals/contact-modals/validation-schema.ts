import { object, SchemaOf, string } from 'yup';

import { makeRequiredErrorMessage } from '../../form/validation/messages';
import { AccountBaseInterface } from '../../interfaces/account.interface';
import {
  useContactsAddressesSelector,
  useContactsNamesSelector
} from '../../store/contact-book/contact-book-selectors';
import { isDefined } from '../../utils/is-defined';
import { isValidAddress } from '../../utils/tezos.util';

const baseValidationSchema = ({
  contactsNames,
  contactsAddresses
}: {
  contactsNames: Array<string>;
  contactsAddresses: Array<string>;
}) =>
  object().shape({
    name: string()
      .required('Invalid name. It should be: 1-16 characters, without special symbols')
      .notOneOf(contactsNames, 'Contact with the same names already exists')
      .min(1)
      .max(16),
    publicKeyHash: string()
      .required(makeRequiredErrorMessage('Address'))
      .notOneOf(contactsAddresses, 'Contact with the same address already exists')
      .test('is-valid-address', 'Invalid address', value => (isDefined(value) ? isValidAddress(value) : false))
  });

export const useAddContactFormValidationSchema = (): SchemaOf<AccountBaseInterface> => {
  const contactsNames = useContactsNamesSelector();
  const contactsAddresses = useContactsAddressesSelector();

  return baseValidationSchema({ contactsNames, contactsAddresses });
};

export const useEditContactFormValidationSchema = (editContactIndex: number): SchemaOf<AccountBaseInterface> => {
  const contactsNames = useContactsNamesSelector().filter((_, index) => editContactIndex !== index);
  const contactsAddresses = useContactsAddressesSelector().filter((_, index) => editContactIndex !== index);

  return baseValidationSchema({ contactsNames, contactsAddresses });
};
