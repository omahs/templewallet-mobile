import { BigNumber } from 'bignumber.js';
import React, { FC } from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';

import { useCurrentFiatCurrencyMetadataSelector } from '../store/settings/settings-selectors';
import { bigIntClamp } from '../utils/big-number.utils';
import { formatAssetAmount } from '../utils/number.util';

interface Props {
  amount: BigNumber;
  isDollarValue?: boolean;
  showAllDecimalPlaces?: boolean;
  showMinusSign?: boolean;
  showPlusSign?: boolean;
  symbol?: string;
  style?: StyleProp<TextStyle>;
}

const MIN_POSITIVE_AMOUNT_VALUE = new BigNumber(0.01);
const MAX_NEGATIVE_AMOUNT_VALUE = new BigNumber(-0.01);

export const FormattedAmount: FC<Props> = ({
  amount,
  isDollarValue = false,
  showMinusSign = false,
  showPlusSign = false,
  showAllDecimalPlaces = false,
  symbol,
  style
}) => {
  const { symbol: fiatSymbol } = useCurrentFiatCurrencyMetadataSelector();
  const dollarAmount = amount.isZero()
    ? amount
    : amount.isPositive()
    ? bigIntClamp(amount, MIN_POSITIVE_AMOUNT_VALUE, new BigNumber(Infinity))
    : bigIntClamp(amount, new BigNumber(-Infinity), MAX_NEGATIVE_AMOUNT_VALUE).abs();

  const formattedAmount = isDollarValue
    ? formatAssetAmount(dollarAmount, 2, showAllDecimalPlaces)
    : formatAssetAmount(amount, undefined, showAllDecimalPlaces);

  const isLessThan = formattedAmount.includes('<');
  const formattedSymbol = symbol !== undefined ? ` ${symbol}` : '';

  return (
    <Text style={style}>
      {isDollarValue && !isLessThan && '≈ '}
      {showMinusSign && '- '}
      {showPlusSign && '+ '}
      {formattedAmount}
      {isDollarValue ? fiatSymbol : formattedSymbol}
    </Text>
  );
};
