import { Farm } from 'src/apis/quipuswap-staking/types';
import { AccountInterface, AccountBaseInterface } from 'src/interfaces/account.interface';
import { ConfirmationModalParams } from 'src/modals/confirmation-modal/confirmation-modal.params';
import { TokenMetadataInterface } from 'src/token/interfaces/token-metadata.interface';
import { TokenInterface } from 'src/token/interfaces/token.interface';

export enum ModalsEnum {
  Receive = 'Receive',
  Send = 'Send',
  AddAsset = 'AddAsset',
  RenameAccount = 'RenameAccount',
  SelectBaker = 'SelectBaker',
  Confirmation = 'Confirmation',
  RevealSeedPhrase = 'RevealSeedPhrase',
  RevealPrivateKey = 'RevealPrivateKey',
  EnableBiometryPassword = 'EnableBiometryPassword',
  ImportAccount = 'ImportAccount',
  CollectibleModal = 'CollectibleModal',
  AddCustomRpc = 'AddCustomRpc',
  EditCustomRpc = 'EditCustomRpc',
  RemoveLiquidity = 'RemoveLiquidity',
  AddLiquidity = 'AddLiquidity',
  AddContact = 'AddContact',
  EditContact = 'EditContact',
  ManageFarmingPool = 'ManageFarmingPool',
  Newsletter = 'Newsletter'
}

export type ModalsParamList = {
  [ModalsEnum.Receive]: { token: TokenMetadataInterface };
  [ModalsEnum.Send]: { token: TokenMetadataInterface; receiverPublicKeyHash?: string };
  [ModalsEnum.AddAsset]: undefined;
  [ModalsEnum.RenameAccount]: { account: AccountInterface };
  [ModalsEnum.SelectBaker]: undefined;
  [ModalsEnum.Confirmation]: ConfirmationModalParams;
  [ModalsEnum.RevealSeedPhrase]: { account?: AccountInterface };
  [ModalsEnum.RevealPrivateKey]: { account: AccountInterface };
  [ModalsEnum.EnableBiometryPassword]: undefined;
  [ModalsEnum.ImportAccount]: undefined;
  [ModalsEnum.CollectibleModal]: { collectible: TokenInterface };
  [ModalsEnum.AddCustomRpc]: undefined;
  [ModalsEnum.EditCustomRpc]: { url: string };
  [ModalsEnum.RemoveLiquidity]: {
    lpContractAddress: string;
    aToken: TokenInterface;
    bToken: TokenInterface;
  };
  [ModalsEnum.AddLiquidity]: {
    lpContractAddress: string;
    aToken: TokenInterface;
    bToken: TokenInterface;
  };
  [ModalsEnum.AddContact]: AccountBaseInterface | undefined;
  [ModalsEnum.EditContact]: { contact: AccountBaseInterface; index: number };
<<<<<<< HEAD
  [ModalsEnum.ManageFarmingPool]: Pick<Farm, 'id' | 'contractAddress'>;
=======
  [ModalsEnum.Newsletter]: undefined;
>>>>>>> 77354374b9f5234561fe2228d04e7a257e836a8b
};
