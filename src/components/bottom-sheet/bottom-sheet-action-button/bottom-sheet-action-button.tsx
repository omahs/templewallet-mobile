import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React, { FC } from 'react';
import { Text, TouchableWithoutFeedbackProps } from 'react-native';

import { TestIdProps } from 'src/interfaces/test-id.props';
import { setTestID } from 'src/utils/test-id.utils';

import { useBottomSheetActionButtonStyles } from './bottom-sheet-action-button.styles';

interface Props extends Pick<TouchableWithoutFeedbackProps, 'style' | 'onPress' | 'disabled'>, TestIdProps {
  title: string;
}

export const BottomSheetActionButton: FC<Props> = ({ title, disabled, style, onPress, testID }) => {
  const styles = useBottomSheetActionButtonStyles();

  return (
    <TouchableOpacity
      disabled={disabled}
      style={[styles.container, Boolean(disabled) ? styles.disabled : undefined, style]}
      onPress={onPress}
      {...setTestID(testID)}
    >
      <Text style={[styles.title, Boolean(disabled) ? styles.disabledTitle : undefined]}>{title}</Text>
    </TouchableOpacity>
  );
};
