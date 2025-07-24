import { FCIcon } from '@/shared/types/components';

export const ChevronDownIcon: FCIcon = ({ ...props }) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.44453 10.7614L3 6.15212L4.11094 5L8 9.03325L11.8891 5L13 6.15212L8.55547 10.7614C8.40813 10.9142 8.20833 11 8 11C7.79167 11 7.59187 10.9142 7.44453 10.7614Z"
        fill="currentColor"
      />
    </svg>
  );
};
