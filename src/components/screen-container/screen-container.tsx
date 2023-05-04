import React, { FC } from 'react';
import {
  KeyboardAvoidingView,
  KeyboardAvoidingViewProps,
  ScrollView,
  ScrollViewProps,
  StatusBar,
  StyleProp,
  View,
  ViewStyle
} from 'react-native';

import { isAndroid } from '../../config/system';
import { useHeaderHeight } from '../../hooks/use-header-height.hook';
import { TestIdProps } from '../../interfaces/test-id.props';
import { formatSize } from '../../styles/format-size';
import { conditionalStyle } from '../../utils/conditional-style';
import { isDefined } from '../../utils/is-defined';
import { setTestID } from '../../utils/test-id.utils';
import { ButtonsContainer } from '../button/buttons-container/buttons-container';
import { Divider } from '../divider/divider';
import { InsetSubstitute } from '../inset-substitute/inset-substitute';
import { useScreenContainerStyles } from './screen-container.styles';

interface Props extends TestIdProps {
  keyboardBehavior?: KeyboardAvoidingViewProps['behavior'];
  scrollViewRefreshControl?: ScrollViewProps['refreshControl'];
  isFullScreenMode?: boolean;
  fixedFooterContainer?: {
    cancelButton?: JSX.Element;
    submitButton?: JSX.Element;
  };
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

export const ScreenContainer: FC<Props> = ({
  keyboardBehavior = isAndroid ? 'height' : 'padding',
  scrollViewRefreshControl,
  isFullScreenMode = false,
  style,
  contentContainerStyle,
  fixedFooterContainer,
  children,
  testID
}) => {
  const styles = useScreenContainerStyles();
  const headerHeight = useHeaderHeight();
  const statusBarHeight = isAndroid ? StatusBar.currentHeight : 0;
  const keyboardVerticalOffset = headerHeight + (statusBarHeight ?? 0);

  const isCancelButtonExist = isDefined(fixedFooterContainer?.cancelButton);
  const isSubmitButtonExist = isDefined(fixedFooterContainer?.submitButton);

  return (
    <KeyboardAvoidingView
      style={[styles.scrollView, style]}
      keyboardVerticalOffset={keyboardVerticalOffset}
      behavior={keyboardBehavior}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollViewContentContainer,
          conditionalStyle(isFullScreenMode, styles.fullScreenMode),
          contentContainerStyle
        ]}
        keyboardShouldPersistTaps="handled"
        refreshControl={scrollViewRefreshControl}
        {...setTestID(testID)}
      >
        {children}
      </ScrollView>

      {isDefined(fixedFooterContainer) && (
        <View style={styles.fixedButtonContainer}>
          <ButtonsContainer>
            {isCancelButtonExist && fixedFooterContainer.cancelButton}
            {isCancelButtonExist && isSubmitButtonExist && <Divider size={formatSize(16)} />}
            {isSubmitButtonExist && fixedFooterContainer.submitButton}
          </ButtonsContainer>

          <InsetSubstitute type="bottom" />
        </View>
      )}
    </KeyboardAvoidingView>
  );
};
