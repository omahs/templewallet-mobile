import { gql } from '@apollo/client';

import { ADULT_CONTENT_TAGS } from './adult-tags';
import { ADULT_ATTRIBUTE_NAME } from './constants';

export const buildGetCollectiblesInfoQuery = (address: string) => gql`
  query MyQuery {
    fa(
      where: {
        _or: [
          { creator_address: { _eq: "${address}" } }
          { collaborators: { collaborator_address: { _eq: "${address}" } } }
          {
            tokens: {
              creators: { creator_address: { _eq: "${address}" }, verified: { _eq: true } }
            }
          }
        ]
      }
    ) {
      creator_address
      logo
      name
      contract
    }
    gallery(
      where: { curators: { curator_address: { _eq: "${address}" } }, max_items: { _gt: 0 } }
      order_by: { inserted_at: asc }
    ) {
      __typename
      name
      logo
      gallery_id
      tokens(limit: 1) {
        fa_contract
        __typename
      }
    }
  }
`;

export const buildGetHoldersInfoQuery = (address: string) => gql`
  query MyQuery {
    holder_by_pk(address: "${address}") {
      alias
      discord
      github
      logo
      twitter
      tzdomain
      website
    }
  }
`;

export const buildGetCollectiblesByCollectionQuery = (contract: string, offset: number) => gql`query MyQuery {
  token(
    where: {fa_contract: {_eq: "${contract}"}}
    limit: 10
    offset: ${offset}
    order_by: {token_id: asc}) {
    artifact_uri
    description
    display_uri
    decimals
    fa_contract
    highest_offer
    is_boolean_amount
    last_listed
    last_metadata_update
    lowest_ask
    metadata
    name
    thumbnail_uri  
    token_id
    supply
    symbol
    holders {
        holder_address
        quantity
      }
    offers_active(distinct_on: price_xtz) {
        buyer_address
        collection_offer
        price_xtz
        price
        bigmap_key
        marketplace_contract
        fa_contract
        currency_id
      }
    events(order_by: {timestamp: desc}) {
      event_type
      marketplace_event_type
      price_xtz
      price
      currency_id
      timestamp
    }
    listings_active {
      amount
      seller_address
    }
    fa {
      items
    }
  }
}`;

export const getCollectiblesByGalleryQuery = (address: string, offset: number) => gql`
query MyQuery {
  gallery(
    where: {curators: {curator_address: {_eq: "${address}"}}, max_items: {_gt: 0}}
    limit: 10
    offset: ${offset}
    order_by: {inserted_at: asc}
  ) {
    gallery_id
    tokens {
      token {
        artifact_uri
        display_uri
        decimals
        description
        fa_contract
        highest_offer
        is_boolean_amount
        last_listed
        last_metadata_update
        lowest_ask
        metadata
        name
        thumbnail_uri
        token_id
        supply
        symbol
        holders {
          holder_address
          quantity
        }
        offers_active(distinct_on: price_xtz) {
          buyer_address
          collection_offer
          price_xtz
          price
          bigmap_key
          marketplace_contract
          fa_contract
          currency_id
        }
        events(order_by: {timestamp: desc}) {
          event_type
          marketplace_event_type
          price_xtz
          price
          currency_id
          timestamp
        }
        listings_active {
          amount
          seller_address
        }
        fa {
          items
        }
      }
    }
  }
}
`;

export const buildGetCollectibleByAddressAndIdQuery = (address: string, tokenId: string) => gql`
  query MyQuery {
    token(where: { fa_contract: { _eq: "${address}" }, token_id: { _eq: "${tokenId}" } }) {
      description
      creators {
        holder {
          address
          tzdomain
        }
      }
      fa {
        name
        logo
        items
      }
      metadata
      artifact_uri
      name
      attributes {
        attribute {
          id
          name
          value
        }
      }
      timestamp
      royalties {
        decimals
        amount
      }
      supply
      galleries {
        gallery {
          items
          name
        }
      }
    }
  }
`;

export const buildGetFA2AttributeCountQuery = (ids: number[]) => gql`
  query MyQuery {
    fa2_attribute_count(where: { attribute_id: { _in: [${ids}] } }) {
      attribute_id
      tokens
    }
  }
`;

export const buildGetGalleryAttributeCountQuery = (ids: number[]) => gql`
  query MyQuery {
    gallery_attribute_count(where: { attribute_id: { _in: [${ids}] } }) {
      attribute_id
      tokens
    }
  }
`;

export const buildGetUserAdultCollectiblesQuery = (address: string) => {
  return gql`
    query MyQuery {
      token(
        where: {
          holders: { holder_address: { _eq: "${address}" } }
          _or: [
            { attributes: { attribute: { name: { _eq: "${ADULT_ATTRIBUTE_NAME}" } } } }
            { tags: { tag: { name: { _in: [${ADULT_CONTENT_TAGS}] } } } }
          ]
        }
      ) {
        fa_contract
        token_id
      }
    }
  `;
};
