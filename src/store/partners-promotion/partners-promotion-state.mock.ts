import { createEntity } from 'src/store/create-entity';

import type { PartnersPromotionState } from './partners-promotion-state';

export const mockPartnersPromotion = {
  body: '',
  campaign_type: '',
  copy: {
    headline: '',
    cta: '',
    content: ''
  },
  display_type: '',
  div_id: '',
  html: [],
  id: '',
  image: '',
  link: '',
  nonce: '',
  text: '',
  view_time_url: '',
  view_url: ''
};

export const mockPartnersPromotionState: PartnersPromotionState = {
  textPromotion: createEntity(mockPartnersPromotion),
  promotion: createEntity(mockPartnersPromotion),
  isEnabled: false
};
