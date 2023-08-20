import { BigNumber } from 'bignumber.js';
import React, { FC, useMemo } from 'react';
import { Text } from 'react-native';

import { useSelectedBakerSelector } from '../../store/baking/baking-selectors';
import { TEZ_TOKEN_SLUG } from '../../token/data/tokens-metadata';
import { TokenInterface } from '../../token/interfaces/token.interface';
import { getTokenSlug } from '../../token/utils/token.utils';
import { getDelegateText } from '../../utils/get-delegate-text.util';
import { isDefined } from '../../utils/is-defined';
import { DelegateTagContainer } from './components/delegate-tag-container/delegate-tag-container';
import { DelegateTagWithIcon } from './components/delegate-tag-with-icon/delegate-tag-with-icon';
import { useDelegateTagStyles } from './delegate-tag.styles';

interface Props {
  token: TokenInterface;
  apy?: number;
}

const DECIMAL_VALUE = 2;

export const DelegateTag: FC<Props> = ({ apy, token }) => {
  const styles = useDelegateTagStyles();
  const [, isBakerSelected] = useSelectedBakerSelector();

  const tokenSlug = getTokenSlug(token);

  const isTezosToken = tokenSlug === TEZ_TOKEN_SLUG;

  const label = getDelegateText(token);

  const apyRateValue = useMemo(
    () => new BigNumber(apy ?? 0).decimalPlaces(DECIMAL_VALUE).toFixed(DECIMAL_VALUE),
    [apy]
  );

  const apyValue = useMemo(() => <Text style={styles.text}>{`${label}: ${apyRateValue}%`}</Text>, [apy]);

  const regularToken = useMemo(() => isDefined(apy) && apy > 0 && apyValue, [apy, apyValue]);

  const tag = useMemo(() => {
    if (!isTezosToken) {
      return regularToken;
    }

    if (isBakerSelected) {
      return apyValue;
    }

    return <DelegateTagWithIcon style={styles.text} />;
  }, [isBakerSelected, isTezosToken, regularToken, apyValue]);

  return <DelegateTagContainer token={token}>{tag}</DelegateTagContainer>;
};
