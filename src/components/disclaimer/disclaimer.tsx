import React, { FC } from 'react';
import { Text } from 'react-native';

import { AttentionMessage } from '../attention-message/attention-message';
import { useDisclaimerStyles } from './disclaimer.styles';

interface Props {
  texts: Array<string>;
  title?: string;
}

export const Disclaimer: FC<Props> = ({ title, texts }) => {
  const styles = useDisclaimerStyles();

  return (
    <AttentionMessage title={title}>
      {texts.map(text => (
        <Text key={text} style={styles.description}>
          {text}
        </Text>
      ))}
    </AttentionMessage>
  );
};
