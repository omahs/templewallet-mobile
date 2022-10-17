import React, { FC } from 'react';
import { Path, Svg } from 'react-native-svg';

interface Props {
  isNotification?: boolean;
  color?: string;
}

export const NewsIcon: FC<Props> = ({ isNotification = false, color = '#FF5B00' }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" accessibilityRole="image">
    {isNotification ? (
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M22.25 6.56992V3.375V3.37355H22.25C22.2487 2.94334 22.0773 2.53111 21.7731 2.22691C21.4689 1.92271 21.0567 1.75125 20.6265 1.75L20.625 1.75V1.75H19.2389C18.899 2.01638 18.6211 2.3581 18.4301 2.75H20.6242C20.7899 2.75065 20.9488 2.81678 21.066 2.93402C21.1832 3.05125 21.2494 3.21006 21.25 3.37583V6.84636C21.606 6.8155 21.9434 6.71934 22.25 6.56992ZM22.25 7.80081V19.875L22.25 19.8765C22.2481 20.5054 21.9975 21.108 21.5527 21.5527C21.108 21.9975 20.5054 22.2481 19.8765 22.25L19.875 22.25H4.5C3.77065 22.25 3.07118 21.9603 2.55546 21.4445C2.03973 20.9288 1.75 20.2293 1.75 19.5V7.125C1.75 6.69402 1.92121 6.2807 2.22595 5.97595C2.5307 5.67121 2.94402 5.5 3.375 5.5H6.25V3.375L6.25 3.37355C6.25125 2.94334 6.4227 2.53111 6.72691 2.22691C7.03111 1.92271 7.44334 1.75125 7.87355 1.75H7.875H17.6923C17.484 2.05564 17.317 2.39164 17.1992 2.75H7.87583C7.71006 2.75065 7.55125 2.81678 7.43401 2.93402C7.31677 3.05126 7.25063 3.21009 7.25 3.37589V6V19.4934V19.5C7.25 20.1413 7.026 20.7595 6.62133 21.25L19.8735 21.25L19.8741 21.25C20.2386 21.2488 20.5879 21.1034 20.8456 20.8456C21.1034 20.5879 21.2487 20.2387 21.25 19.8742V7.99232C21.5972 7.97091 21.9324 7.90521 22.25 7.80081ZM19.5 7.70924V9C19.5 9.19891 19.421 9.38968 19.2803 9.53033C19.1397 9.67098 18.9489 9.75 18.75 9.75H15.75C15.5511 9.75 15.3603 9.67098 15.2197 9.53033C15.079 9.38968 15 9.19891 15 9V6C15 5.80109 15.079 5.61032 15.2197 5.46967C15.3603 5.32902 15.5511 5.25 15.75 5.25H17.1992C17.317 5.60836 17.484 5.94436 17.6923 6.25H16V8.75H18.5V7.12269C18.8008 7.36381 19.1372 7.56237 19.5 7.70924ZM18.4301 5.25H18.75C18.9489 5.25 19.1397 5.32902 19.2803 5.46967C19.421 5.61032 19.5 5.80109 19.5 6V6.43219C19.0408 6.14837 18.6679 5.73812 18.4301 5.25ZM6.25 19.4934V6.5H3.375C3.20924 6.5 3.05027 6.56585 2.93306 6.68306C2.81585 6.80027 2.75 6.95924 2.75 7.125V19.5C2.75 19.9641 2.93437 20.4093 3.26256 20.7374C3.59075 21.0656 4.03587 21.25 4.5 21.25C4.96413 21.25 5.40925 21.0656 5.73744 20.7374C6.06563 20.4093 6.25 19.9641 6.25 19.5V19.4934ZM12.75 5.5C13.0261 5.5 13.25 5.72386 13.25 6C13.25 6.27614 13.0261 6.5 12.75 6.5H9.75C9.47386 6.5 9.25 6.27614 9.25 6C9.25 5.72386 9.47386 5.5 9.75 5.5H12.75ZM12.75 8.5C13.0261 8.5 13.25 8.72386 13.25 9C13.25 9.27614 13.0261 9.5 12.75 9.5H9.75C9.47386 9.5 9.25 9.27614 9.25 9C9.25 8.72386 9.47386 8.5 9.75 8.5H12.75ZM18.75 11.5C19.0261 11.5 19.25 11.7239 19.25 12C19.25 12.2761 19.0261 12.5 18.75 12.5H9.75C9.47386 12.5 9.25 12.2761 9.25 12C9.25 11.7239 9.47386 11.5 9.75 11.5H18.75ZM18.75 14.5C19.0261 14.5 19.25 14.7239 19.25 15C19.25 15.2761 19.0261 15.5 18.75 15.5H9.75C9.47386 15.5 9.25 15.2761 9.25 15C9.25 14.7239 9.47386 14.5 9.75 14.5H18.75ZM18.75 17.5C19.0261 17.5 19.25 17.7239 19.25 18C19.25 18.2761 19.0261 18.5 18.75 18.5H9.75C9.47386 18.5 9.25 18.2761 9.25 18C9.25 17.7239 9.47386 17.5 9.75 17.5H18.75Z"
        fill={color}
      />
    ) : (
      <>
        <Path
          d="M6.75 19.4934V3.375C6.75087 3.0769 6.86967 2.79125 7.08046 2.58046C7.29125 2.36967 7.5769 2.25087 7.875 2.25H20.625C20.9231 2.25087 21.2087 2.36967 21.4195 2.58046C21.6303 2.79125 21.7491 3.0769 21.75 3.375V19.875C21.7485 20.3718 21.5505 20.8479 21.1992 21.1992C20.8479 21.5505 20.3718 21.7485 19.875 21.75H4.5"
          stroke={color}
          strokeLinejoin="round"
        />
        <Path
          d="M4.5 21.75C5.09674 21.75 5.66903 21.5129 6.09099 21.091C6.51295 20.669 6.75 20.0967 6.75 19.5V6H3.375C3.07663 6 2.79048 6.11853 2.57951 6.3295C2.36853 6.54048 2.25 6.82663 2.25 7.125V19.5C2.25 20.0967 2.48705 20.669 2.90901 21.091C3.33097 21.5129 3.90326 21.75 4.5 21.75Z"
          stroke={color}
          strokeLinejoin="round"
        />
        <Path
          d="M18.75 18H9.75M12.75 6H9.75H12.75ZM12.75 9H9.75H12.75ZM18.75 12H9.75H18.75ZM18.75 15H9.75H18.75Z"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M15.75 9.25H18.75C18.8163 9.25 18.8799 9.22366 18.9268 9.17678L19.2803 9.53033L18.9268 9.17678C18.9737 9.12989 19 9.0663 19 9V6C19 5.9337 18.9737 5.87011 18.9268 5.82322C18.8799 5.77634 18.8163 5.75 18.75 5.75H15.75C15.6837 5.75 15.6201 5.77634 15.5732 5.82322L15.2197 5.46967L15.5732 5.82322C15.5263 5.87011 15.5 5.9337 15.5 6V9C15.5 9.0663 15.5263 9.12989 15.5732 9.17678L15.2197 9.53033L15.5732 9.17678C15.6201 9.22366 15.6837 9.25 15.75 9.25Z"
          stroke={color}
        />
      </>
    )}
    {isNotification && (
      <Path
        d="M24 4C24 5.65685 22.6569 7 21 7C19.3431 7 18 5.65685 18 4C18 2.34315 19.3431 1 21 1C22.6569 1 24 2.34315 24 4Z"
        fill="#FF3B30"
      />
    )}
  </Svg>
);

<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path
    d="M6.75 19.4934V3.375C6.75087 3.0769 6.86967 2.79125 7.08046 2.58046C7.29125 2.36967 7.5769 2.25087 7.875 2.25H20.625C20.9231 2.25087 21.2087 2.36967 21.4195 2.58046C21.6303 2.79125 21.7491 3.0769 21.75 3.375V19.875C21.7485 20.3718 21.5505 20.8479 21.1992 21.1992C20.8479 21.5505 20.3718 21.7485 19.875 21.75H4.5"
    stroke="#FF5B00"
    stroke-linejoin="round"
  />
  <path
    d="M4.5 21.75C5.09674 21.75 5.66903 21.5129 6.09099 21.091C6.51295 20.669 6.75 20.0967 6.75 19.5V6H3.375C3.07663 6 2.79048 6.11853 2.57951 6.3295C2.36853 6.54048 2.25 6.82663 2.25 7.125V19.5C2.25 20.0967 2.48705 20.669 2.90901 21.091C3.33097 21.5129 3.90326 21.75 4.5 21.75Z"
    stroke="#FF5B00"
    stroke-linejoin="round"
  />
  <path
    d="M18.75 18H9.75M12.75 6H9.75H12.75ZM12.75 9H9.75H12.75ZM18.75 12H9.75H18.75ZM18.75 15H9.75H18.75Z"
    stroke="#FF5B00"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
  <path
    d="M15.75 9.25H18.75C18.8163 9.25 18.8799 9.22366 18.9268 9.17678L19.2803 9.53033L18.9268 9.17678C18.9737 9.12989 19 9.0663 19 9V6C19 5.9337 18.9737 5.87011 18.9268 5.82322C18.8799 5.77634 18.8163 5.75 18.75 5.75H15.75C15.6837 5.75 15.6201 5.77634 15.5732 5.82322L15.2197 5.46967L15.5732 5.82322C15.5263 5.87011 15.5 5.9337 15.5 6V9C15.5 9.0663 15.5263 9.12989 15.5732 9.17678L15.2197 9.53033L15.5732 9.17678C15.6201 9.22366 15.6837 9.25 15.75 9.25Z"
    stroke="#FF5B00"
  />
</svg>;
