import { gql } from '@apollo/client';

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
      mime
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
