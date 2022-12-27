export interface AdvertisingPromotion {
  name: string;
  url: string;
  fullPageBannerUrl: string;
  fullPageLogoUrl: string;
  popupBannerUrl: string;
  popupLogoUrl: string;
  mobileBannerUrl: string;
  isExternalAd?: boolean;
}

export interface GetAdvertisingInfoResponse {
  data?: AdvertisingPromotion;
}
