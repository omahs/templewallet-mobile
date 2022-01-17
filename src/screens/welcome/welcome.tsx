import React from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';

import { ButtonLargePrimary } from '../../components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from '../../components/button/button-large/button-large-secondary/button-large-secondary';
import { ButtonSmallSecondary } from '../../components/button/button-small/button-small-secondary/button-small-secondary';
import { Divider } from '../../components/divider/divider';
import { Icon } from '../../components/icon/icon';
import { IconNameEnum } from '../../components/icon/icon-name.enum';
import { InsetSubstitute } from '../../components/inset-substitute/inset-substitute';
import { Quote } from '../../components/quote/quote';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { ScreensEnum } from '../../navigator/enums/screens.enum';
import { useNavigation } from '../../navigator/hooks/use-navigation.hook';
import { useAppLock } from '../../shelter/use-app-lock.hook';
import { useShelter } from '../../shelter/use-shelter.hook';
import { rootStateResetAction } from '../../store/root-state.actions';
import { formatSize } from '../../styles/format-size';
import { WelcomeSelectors } from './welcome.selectors';
import { useWelcomeStyles } from './welcome.styles';

export const Welcome = () => {
  const { navigate } = useNavigation();
  const styles = useWelcomeStyles();

  const { unlock } = useAppLock();

  const dispatch = useDispatch();
  const { importWallet } = useShelter();
  const fillStorage = () => {
    dispatch(rootStateResetAction.submit());
    const getEnv = (key: string): string => process.env[key] ?? '';

    const appPassword = getEnv('E2E_APP_PASSWORD');
    const seedPhrase = getEnv('E2E_SEED_PHRASE');
    importWallet({
      password: appPassword,
      seedPhrase: seedPhrase
    });
    unlock(appPassword);
    navigate(ScreensEnum.Wallet);
  };

  return (
    <ScreenContainer isFullScreenMode={true}>
      <View style={styles.imageView}>
        <InsetSubstitute />
        <Icon name={IconNameEnum.TempleLogoWithText} width={formatSize(208)} height={formatSize(64)} />
      </View>
      <Divider />
      <Quote
        quote="The only function of economic forecasting is to make astrology look more respectable."
        author="John Kenneth Galbraith"
      />
      <Divider />
      <View>
        <ButtonLargePrimary
          title="Create a new Wallet"
          iconName={IconNameEnum.PlusSquare}
          onPress={() => navigate(ScreensEnum.CreateAccount)}
          testID={WelcomeSelectors.CreateNewWalletButton}
        />
        <Divider size={formatSize(24)} />

        <View style={styles.buttonsContainer}>
          <View style={styles.buttonBox}>
            <ButtonLargeSecondary
              title="Import"
              iconName={IconNameEnum.DownloadCloud}
              onPress={() => navigate(ScreensEnum.ImportAccount)}
              testID={WelcomeSelectors.ImportExistingWalletButton}
            />
          </View>
          <View style={styles.buttonBox}>
            <ButtonLargeSecondary
              title="Sync"
              iconName={IconNameEnum.Link}
              onPress={() => navigate(ScreensEnum.SyncInstructions)}
            />
          </View>
        </View>
        {process.env.NODE_ENV === 'development' && (
          <View>
            <ButtonSmallSecondary title={'fill storage'} onPress={() => fillStorage()} testID="fillStorageButton" />
          </View>
        )}
        <InsetSubstitute type="bottom" />
      </View>
    </ScreenContainer>
  );
};
