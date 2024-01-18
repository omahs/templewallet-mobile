import { mnemonicToSeedSync } from 'bip39';
import { FormikProvider, useFormik } from 'formik';
import React from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';

import { AndroidKeyboardDisclaimer } from 'src/components/android-keyboard-disclaimer/android-keyboard-disclaimer';
import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from 'src/components/button/button-large/button-large-secondary/button-large-secondary';
import { ButtonsContainer } from 'src/components/button/buttons-container/buttons-container';
import { ButtonsFloatingContainer } from 'src/components/button/buttons-floating-container/buttons-floating-container';
import { Divider } from 'src/components/divider/divider';
import { InsetSubstitute } from 'src/components/inset-substitute/inset-substitute';
import { Label } from 'src/components/label/label';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { FormMnemonicInput } from 'src/form/form-mnemonic-input';
import { FormPasswordInput } from 'src/form/form-password-input';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { useShelter } from 'src/shelter/use-shelter.hook';
import { showLoaderAction } from 'src/store/settings/settings-actions';
import { useAccountsListSelector } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { isString } from 'src/utils/is-string';
import { seedToPrivateKey } from 'src/utils/keys.util';

import { useImportAccountFromSeedStyles } from './import-account-from-seed.styles';
import { ImportAccountSeedDerivationPathForm } from './import-account-seed-derivation-path.form';
import {
  importAccountSeedInitialValues,
  importAccountSeedValidationSchema,
  ImportAccountSeedValues
} from './import-account-seed.form';
import { ImportAccountSeedSelectors } from './import-account-seed.selectors';

export const ImportAccountSeed = () => {
  const dispatch = useDispatch();
  const styles = useImportAccountFromSeedStyles();
  const { goBack } = useNavigation();
  const { createImportedAccount } = useShelter();
  const accountsIndex = useAccountsListSelector().length + 1;

  const onSubmit = (values: ImportAccountSeedValues) => {
    dispatch(showLoaderAction());

    setTimeout(() => {
      const seed = mnemonicToSeedSync(values.seedPhrase, values.password);
      const privateKey = seedToPrivateKey(seed, isString(values.derivationPath) ? values.derivationPath : undefined);

      createImportedAccount({
        name: `Account ${accountsIndex}`,
        privateKey
      });

      goBack();
    }, 0);
  };

  const formik = useFormik({
    initialValues: importAccountSeedInitialValues,
    validationSchema: importAccountSeedValidationSchema,
    onSubmit
  });

  return (
    <FormikProvider value={formik}>
      <ScreenContainer>
        <View>
          <Divider size={formatSize(12)} />
          <View style={styles.seedPhraseInputContainer}>
            <Label label="Seed phrase" description="Mnemonic. Your secret 12 - 24 words phrase." />
            <FormMnemonicInput name="seedPhrase" testID={ImportAccountSeedSelectors.seedPhraseInput} />
          </View>
          <AndroidKeyboardDisclaimer />
          <Divider size={formatSize(12)} />
          <Label
            label="Derivation"
            isOptional
            description="By default derivation isn't used. Click on 'Custom derivation path' to add it."
          />
          <ImportAccountSeedDerivationPathForm formValues={formik.values} />
          <Divider size={formatSize(12)} />
          <Label
            label="Password"
            isOptional
            description={'That is NOT a wallet password.\nUsed for additional mnemonic derivation.'}
          />
          <FormPasswordInput name="password" testID={ImportAccountSeedSelectors.passwordInput} />
          <Divider size={formatSize(12)} />
        </View>
      </ScreenContainer>
      <ButtonsFloatingContainer>
        <ButtonsContainer style={styles.buttonsContainer}>
          <View style={styles.buttonBox}>
            <ButtonLargeSecondary title="Back" onPress={goBack} testID={ImportAccountSeedSelectors.backButton} />
          </View>
          <View style={styles.buttonBox}>
            <ButtonLargePrimary
              title="Import"
              disabled={!formik.isValid}
              onPress={formik.submitForm}
              testID={ImportAccountSeedSelectors.importButton}
            />
          </View>
        </ButtonsContainer>
        <InsetSubstitute type="bottom" />
      </ButtonsFloatingContainer>
    </FormikProvider>
  );
};
