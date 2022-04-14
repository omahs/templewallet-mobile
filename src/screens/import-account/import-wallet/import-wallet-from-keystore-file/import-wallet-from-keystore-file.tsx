import { validateMnemonic } from 'bip39';
import { Formik } from 'formik';
import React, { FC } from 'react';
import { Text, View } from 'react-native';
import { readFile } from 'react-native-fs';

import { ButtonLargePrimary } from '../../../../components/button/button-large/button-large-primary/button-large-primary';
import { Divider } from '../../../../components/divider/divider';
import { InsetSubstitute } from '../../../../components/inset-substitute/inset-substitute';
import { Label } from '../../../../components/label/label';
import {
  LETTERS_NUMBERS_MIXTURE_REGX,
  MIN_PASSWORD_LENGTH,
  SPECIAL_CHARACTER_REGX,
  UPPER_CASE_LOWER_CASE_MIXTURE_REGX
} from '../../../../config/security';
import { FormCheckbox } from '../../../../form/form-checkbox';
import { FormFileInput } from '../../../../form/form-file-input';
import { FormPasswordInput } from '../../../../form/form-password-input';
import { formatSize } from '../../../../styles/format-size';
import { showErrorToast } from '../../../../toast/toast.utils';
import { decryptSeedPhrase, KUKAI_VERSION_ERROR } from '../../../../utils/kukai.utils';
import { ImportWalletProps } from '../import-wallet';
import {
  ImportWalletFromKeystoreFileFormValues,
  importWalletFromKeystoreFileInitialValues,
  importWalletFromKeystoreFileValidationSchema
} from './import-wallet-from-keystore-file.form';
import { useImportWalletFromKeystoreFileStyles } from './import-wallet-from-keystore-file.styles';

const checkKukaiPasswordValid = (password: string): boolean =>
  password.length >= MIN_PASSWORD_LENGTH &&
  UPPER_CASE_LOWER_CASE_MIXTURE_REGX.test(password) &&
  LETTERS_NUMBERS_MIXTURE_REGX.test(password) &&
  SPECIAL_CHARACTER_REGX.test(password);

const TOO_WEAK_PASSWORD_ERROR =
  'The password is too weak. Please, set a new one according to the requirements of the application.';

export const ImportWalletFromKeystoreFile: FC<ImportWalletProps> = ({ onSubmit }) => {
  const styles = useImportWalletFromKeystoreFileStyles();

  const handleSubmit = async (values: ImportWalletFromKeystoreFileFormValues) => {
    try {
      if (values.shouldUseFilePasswordForExtension === true && !checkKukaiPasswordValid(values.password)) {
        throw new Error(TOO_WEAK_PASSWORD_ERROR);
      }
      const content = await readFile(values.keystoreFile.uri, 'utf8');
      const seedPhrase = await decryptSeedPhrase(content, values.password);
      if (!validateMnemonic(seedPhrase)) {
        throw new Error('Mnemonic not validated');
      }
      onSubmit({
        seedPhrase,
        password: values.shouldUseFilePasswordForExtension === true ? values.password : undefined
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      if (e.message === KUKAI_VERSION_ERROR) {
        showErrorToast({
          title: 'Cannot import',
          description: KUKAI_VERSION_ERROR
        });
      } else if (e.message === TOO_WEAK_PASSWORD_ERROR) {
        showErrorToast({
          title: 'Cannot import',
          description: TOO_WEAK_PASSWORD_ERROR
        });
      } else {
        showErrorToast({
          title: 'Wrong file or password',
          description: 'Please change one of them and try again'
        });
      }
    }
  };

  return (
    <Formik
      initialValues={importWalletFromKeystoreFileInitialValues}
      validationSchema={importWalletFromKeystoreFileValidationSchema}
      onSubmit={handleSubmit}
    >
      {({ isValid, submitForm, isSubmitting }) => (
        <>
          <View style={styles.seedPhraseInputContainer}>
            <View>
              <Label label="File" description="Import your wallet from an encrypted keystore file (.tez)." />
              <Divider size={formatSize(20)} />
              <FormFileInput name="keystoreFile" />
              <Divider size={formatSize(12)} />
              <Label label="File password" description="Please enter a password for keystore file" />
              <FormPasswordInput name="password" />
              <FormCheckbox name="shouldUseFilePasswordForExtension">
                <Text style={styles.checkboxText}>Use this password as App password</Text>
              </FormCheckbox>
            </View>
          </View>
          <Divider />

          <View>
            <ButtonLargePrimary title="Next" disabled={!isValid || isSubmitting} onPress={submitForm} />
            <InsetSubstitute type="bottom" />
          </View>
        </>
      )}
    </Formik>
  );
};
