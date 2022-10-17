import React, { FC } from 'react';
import { Path, Svg } from 'react-native-svg';

interface Props {
  isNotification?: boolean;
  color?: string;
}

export const NotificationIcon: FC<Props> = ({ isNotification = false, color = '#FF5B00' }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" accessibilityRole="image">
    {isNotification ? (
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.5082 1.42062C13.0174 1.30809 12.5117 1.25 12.0001 1.25C10.2098 1.25 8.49296 1.96116 7.22709 3.22703C5.96122 4.4929 5.25006 6.20979 5.25006 8C5.25006 11.3895 4.52476 13.5135 3.84164 14.7659C3.49904 15.394 3.16298 15.8104 2.92434 16.0623C2.80483 16.1885 2.70925 16.2739 2.64883 16.3242C2.61861 16.3494 2.59716 16.3658 2.58589 16.3742L2.57726 16.3805C2.30703 16.5649 2.18726 16.9036 2.28224 17.2173C2.37801 17.5337 2.66956 17.75 3.00006 17.75H21.0001C21.3306 17.75 21.6221 17.5337 21.7179 17.2173C21.8129 16.9036 21.6931 16.5649 21.4229 16.3805L21.4142 16.3742C21.403 16.3658 21.3815 16.3494 21.3513 16.3242C21.2909 16.2739 21.1953 16.1885 21.0758 16.0623C20.8371 15.8104 20.5011 15.394 20.1585 14.7659C19.4754 13.5135 18.7501 11.3895 18.7501 8C18.7501 7.9415 18.7493 7.88308 18.7478 7.82476C18.3516 7.93886 17.9329 8 17.5 8C17.4161 8 17.3328 7.99771 17.2501 7.99318C17.2501 7.99545 17.2501 7.99772 17.2501 8C17.2501 11.6105 18.0248 13.9865 18.8416 15.4841C18.9987 15.7721 19.1568 16.0265 19.3102 16.25H4.68988C4.84336 16.0265 5.0014 15.7721 5.15848 15.4841C5.97536 13.9865 6.75006 11.6105 6.75006 8C6.75006 6.60761 7.30318 5.27226 8.28775 4.28769C9.27231 3.30312 10.6077 2.75 12.0001 2.75C12.3539 2.75 12.7042 2.78573 13.0459 2.85519C13.1192 2.34426 13.2783 1.86104 13.5082 1.42062ZM18.6207 6.68449C18.3623 5.38417 17.7243 4.17826 16.773 3.22703C16.1447 2.59869 15.4052 2.10702 14.6008 1.77116C14.3462 2.19724 14.1828 2.68415 14.1377 3.20491C14.7189 3.46401 15.2537 3.82904 15.7124 4.28769C16.4222 4.99755 16.9078 5.88977 17.1235 6.85424C17.2471 6.86796 17.3727 6.875 17.5 6.875C17.8928 6.875 18.27 6.80788 18.6207 6.68449Z"
        fill={color}
      />
    ) : (
      <Path
        d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    )}
    <Path
      d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {isNotification && (
      <Path
        d="M20.875 3.5C20.875 5.36396 19.364 6.875 17.5 6.875C15.636 6.875 14.125 5.36396 14.125 3.5C14.125 1.63604 15.636 0.125 17.5 0.125C19.364 0.125 20.875 1.63604 20.875 3.5Z"
        fill="#FF3B30"
      />
    )}
  </Svg>
);
