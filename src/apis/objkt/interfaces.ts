import { ObjktTypeEnum } from 'src/enums/objkt-type.enum';
import { TzProfile } from 'src/interfaces/tzProfile.interface';
import { HolderAddress, Offer } from 'src/token/interfaces/token-metadata.interface';

import { AttributeInfo } from '../../interfaces/attribute.interface';
import { CollectibleInfo } from '../../interfaces/collectible-info.interface';
import { MarketPlaceEventEnum } from './enums';

export interface FA2AttributeCountQueryResponse {
  fa2_attribute_count: AttributeInfo[];
}
export interface GalleryAttributeCountQueryResponse {
  gallery_attribute_count: AttributeInfo[];
}

export interface CollectibleInfoQueryResponse {
  token: CollectibleInfo[];
}

export interface CollectibleResponse {
  artifact_uri: string;
  description: string;
  decimals: number;
  display_uri: string;
  fa_contract: string;
  highest_offer: number;
  last_listed: string;
  last_metadata_update: string;
  lowest_ask: number;
  metadata: string;
  name: string;
  thumbnail_uri: string;
  supply: number;
  symbol: string;
  token_id: string;
  holders: HolderAddress[];
  offers_active: Offer[];
  events: {
    marketplace_event_type: MarketPlaceEventEnum;
    price_xtz: number | null;
    price: number | null;
    currency_id: number;
  }[];
}

export interface QueryResponse {
  fa: {
    name: string;
    logo: string;
    creator_address: string;
    contract: string;
    tokens: { display_uri: string }[];
    __typename: ObjktTypeEnum;
  }[];
  gallery: { name: string; logo: string; tokens: { fa_contract: string }[]; __typename: ObjktTypeEnum }[];
}

export interface TzProfilesQueryResponse {
  holder_by_pk: TzProfile;
}

export interface CollectiblesByCollectionResponse {
  token: CollectibleResponse[];
}

export interface CollectiblesByGalleriesResponse {
  gallery: { tokens: CollectiblesByCollectionResponse[] }[];
}

export interface CurrencyInfo {
  symbol: string;
  decimals: number;
}