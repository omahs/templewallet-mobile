import { packDataBytes } from '@taquito/michel-codec';
import { delay } from 'lodash-es';
import { useEffect, useMemo, useState } from 'react';
import { EMPTY, Subject, catchError, from, map, switchMap, tap } from 'rxjs';
import { delay as rxDelay } from 'rxjs/operators';

import { isDefined } from 'src/utils/is-defined';

import { fetchStableDiffusionGenerateArt, fetchStableDiffusionSignIn } from '../../apis/stable-diffusion';
import { ScreensEnum } from '../../navigator/enums/screens.enum';
import { useNavigation } from '../../navigator/hooks/use-navigation.hook';
import { CreateNftFormValues } from '../../screens/text-to-nft/generate-art/tabs/create/create.form';
import { Shelter } from '../../shelter/shelter';
import { useSelectedAccountSelector } from '../../store/wallet/wallet-selectors';
import { showErrorToast, showSuccessToast } from '../../toast/toast.utils';
import { isString } from '../../utils/is-string';

const timestamp = new Date().toISOString();
const message = `Tezos Signed Message: To authenticate on Temple NFT service and verify that I am the owner of the connected wallet, I am signing this message ${timestamp}.`;
const messageBytes = packDataBytes({ string: message }).bytes;

export const useSignMessage = (formValues: CreateNftFormValues) => {
  const { goBack, navigate } = useNavigation();

  const [isLoading, setIsLoading] = useState(false);

  const account = useSelectedAccountSelector();

  const [signature, setSignature] = useState<string>();
  const confirmRequest$ = useMemo(() => new Subject<string>(), []);

  useEffect(() => {
    const subscription = confirmRequest$
      .pipe(
        tap(() => setIsLoading(true)),
        switchMap(message =>
          Shelter.getSigner$(account.publicKeyHash).pipe(
            switchMap(signer => signer.sign(message)),
            map(sign => {
              showSuccessToast({ description: 'Successfully signed!' });

              return sign;
            })
          )
        ),
        catchError(err => {
          setIsLoading(false);

          showErrorToast({ description: err.message });

          return EMPTY;
        })
      )
      .subscribe(({ prefixSig }) => {
        setSignature(prefixSig);
      });

    return () => subscription.unsubscribe();
  }, [confirmRequest$, account.publicKeyHash]);

  useEffect(() => {
    if (isString(signature)) {
      from(fetchStableDiffusionSignIn({ timestamp, pk: account.publicKey, sig: signature }))
        .pipe(
          switchMap(accessToken =>
            from(fetchStableDiffusionGenerateArt({ accessToken, ...formValues })).pipe(
              // TODO: Remove this imitation of Generate art
              rxDelay(2000),
              map(order => order),
              tap(() => setIsLoading(false))
            )
          )
        )
        .subscribe(order => {
          if (isDefined(order)) {
            delay(() => navigate(ScreensEnum.Preview, { order }), 500);
            goBack();
          }
        });
    }
  }, [signature]);

  const signMessage = () => confirmRequest$.next(messageBytes);

  return { messagePreview: message, messageBytes, isLoading, signMessage };
};
