import { PairInfoResponse as AliceBobPairInfoResponse } from 'src/apis/alice-bob/types';
import { MOONPAY_ASSETS_BASE_URL } from 'src/apis/moonpay/consts';
import {
  CurrencyType as MoonPayCurrencyType,
  CryptoCurrency,
  FiatCurrency as MoonPayFiatCurrency,
  Currency
} from 'src/apis/moonpay/types';
import { UTORG_CRYPTO_ICONS_BASE_URL, UTORG_FIAT_ICONS_BASE_URL } from 'src/apis/utorg/consts';
import { CurrencyInfoType as UtorgCurrencyType, UtorgCurrencyInfo } from 'src/apis/utorg/types';
import { TopUpInputTypeEnum } from 'src/enums/top-up-input-type.enum';
import { toTokenSlug } from 'src/token/utils/token.utils';
import { isDefined } from 'src/utils/is-defined';

const knownUtorgFiatCurrenciesNames: Record<string, string> = {
  PHP: 'Philippine Peso',
  INR: 'Indian Rupee'
};

const aliceBobHryvnia = {
  name: 'Ukrainian Hryvnia',
  code: 'UAH',
  network: '',
  networkFullName: '',
  icon: '',
  precision: 2,
  type: TopUpInputTypeEnum.Fiat
};

const aliceBobTezos = {
  name: 'Tezos',
  code: 'XTZ',
  network: 'tezos',
  networkFullName: 'Tezos',
  icon: `${MOONPAY_ASSETS_BASE_URL}/widget/currencies/xtz.svg`,
  precision: 6,
  slug: 'tez',
  type: TopUpInputTypeEnum.Crypto
};

export const mapMoonPayProviderCurrencies = (currencies: Currency[]) => ({
  fiat: currencies
    .filter((currency): currency is MoonPayFiatCurrency => currency.type === MoonPayCurrencyType.Fiat)
    .map(({ name, code, minBuyAmount, maxBuyAmount, precision }) => ({
      name,
      code: code.toUpperCase(),
      codeToDisplay: code.toUpperCase().split('_')[0],
      network: '',
      networkFullName: '',
      icon: `${MOONPAY_ASSETS_BASE_URL}/widget/currencies/${code}.svg`,
      minAmount: minBuyAmount,
      maxAmount: maxBuyAmount,
      precision: Math.min(precision, 2), // Currencies like JOD have 3 decimals but Moonpay fails to process input with 3 decimals
      type: TopUpInputTypeEnum.Fiat
    })),
  crypto: currencies
    .filter(
      (currency): currency is CryptoCurrency =>
        currency.type === MoonPayCurrencyType.Crypto && currency.metadata.networkCode.toLowerCase() === 'tezos'
    )
    .map(({ name, code, precision, minBuyAmount, maxBuyAmount, metadata }) => ({
      name,
      code: code.toUpperCase(),
      codeToDisplay: code.toUpperCase().split('_')[0],
      network: 'tezos',
      networkFullName: 'Tezos',
      icon: `${MOONPAY_ASSETS_BASE_URL}/widget/currencies/${code}.svg`,
      minAmount: minBuyAmount ?? undefined,
      maxAmount: maxBuyAmount ?? undefined,
      precision,
      type: TopUpInputTypeEnum.Crypto,
      slug: isDefined(metadata.contractAddress)
        ? toTokenSlug(metadata.contractAddress, metadata.coinType ?? undefined)
        : ''
    }))
});

export const mapUtorgProviderCurrencies = (currencies: UtorgCurrencyInfo[]) => ({
  fiat: currencies
    .filter(({ type, depositMax }) => type === UtorgCurrencyType.FIAT && depositMax > 0)
    .map(({ display, symbol, depositMin, depositMax, precision }) => ({
      name: knownUtorgFiatCurrenciesNames[symbol] ?? '',
      code: symbol,
      codeToDisplay: display,
      network: '',
      networkFullName: '',
      icon: `${UTORG_FIAT_ICONS_BASE_URL}${symbol.slice(0, -1)}.svg`,
      precision,
      type: TopUpInputTypeEnum.Fiat,
      minAmount: depositMin,
      maxAmount: depositMax
    })),
  crypto: currencies
    .filter(({ chain, type, depositMax }) => type === UtorgCurrencyType.CRYPTO && depositMax > 0 && chain === 'TEZOS')
    .map(({ currency, display, precision }) => ({
      name: display,
      code: currency,
      codeToDisplay: display,
      network: 'tezos',
      networkFullName: 'Tezos',
      icon: `${UTORG_CRYPTO_ICONS_BASE_URL}/${currency}.svg`,
      precision,
      type: TopUpInputTypeEnum.Crypto,
      slug: '' // TODO: implement making correct slug as soon as any Tezos token is supported by Utorg
    }))
});

export const mapAliceBobProviderCurrencies = ({ minAmount, maxAmount }: AliceBobPairInfoResponse) => ({
  fiat: [
    {
      ...aliceBobHryvnia,
      minAmount: minAmount,
      maxAmount: maxAmount
    }
  ],
  crypto: [aliceBobTezos]
});