import PropTypes from "prop-types";
import { cn } from "@/lib/utils";

export const MailIcon = ({ className }) => {
  return (
    <svg
      className={cn("h-8 w-8", className)}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 30 24"
      fill="none"
    >
      <path
        d="M27 0H3C1.35 0 0.015 1.35 0.015 3L0 21C0 22.65 1.35 24 3 24H27C28.65 24 30 22.65 30 21V3C30 1.35 28.65 0 27 0ZM27 6L15 13.5L3 6V3L15 10.5L27 3V6Z"
        fill="#6967A6"
      />
    </svg>
  );
};
MailIcon.propTypes = {
  className: PropTypes.string,
};

export const StarIcon = ({ className }) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 23 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-8 w-8 fill-current", className)}
    >
      <path
        id="Star 5"
        d="M11.5 0L15.5557 5.91778L22.4371 7.9463L18.0623 13.6322L18.2595 20.8037L11.5 18.4L4.74047 20.8037L4.93771 13.6322L0.56285 7.9463L7.44428 5.91778L11.5 0Z"
        fill="#ECECEC"
      />
    </svg>
  );
};
StarIcon.propTypes = {
  className: PropTypes.string,
};

export const StarIconFill = ({ className, color }) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 23 21"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-8 w-8", className)}
    >
      <path
        id="Star 4"
        d="M11.5 0L15.5557 5.91778L22.4371 7.9463L18.0623 13.6322L18.2595 20.8037L11.5 18.4L4.74047 20.8037L4.93771 13.6322L0.56285 7.9463L7.44428 5.91778L11.5 0Z"
        fill={color}
      />
    </svg>
  );
};
StarIconFill.propTypes = {
  className: PropTypes.string,
  color: PropTypes.string,
};

export const UserIcon = ({ className }) => {
  return (
    <svg
      width="695"
      height="781"
      viewBox="0 0 670 756"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("fill-current", className)}
    >
      <g opacity="0.5">
        <path
          d="M245.467 433.462V434.665C245.136 460.098 223.751 479.223 181.311 492.04C232.449 529.231 283.59 558.985 334.728 558.985C385.866 558.985 437.007 529.231 488.145 492.04C445.994 479.208 424.608 460.055 423.989 434.578C423.989 430.037 424.023 423.588 424.053 411.479C424.053 409.556 424.058 407.587 424.067 405.571C427.116 406.001 426.857 405.727 424.067 404.952C424.151 373.1 424.288 330.268 424.477 286.74C464.455 234.921 449.769 174.171 437.242 175.685C421.886 177.557 288.823 51.2863 263.3 44.8121C237.777 38.3379 172.943 59.2389 161.785 117.468C150.628 175.696 145.964 322.469 188.285 381.066C200.327 397.741 219.295 404.264 245.188 400.634C245.225 412.821 245.297 419.66 245.467 433.462Z"
          fill="white"
          fillOpacity="0.26"
        />
        <path
          d="M245.468 400.592C306.834 393.618 345.886 367.119 345.886 367.119C345.886 367.119 303.654 423.234 245.468 434.065V400.592Z"
          fill="#EFEFEF"
          fillOpacity="0.26"
        />
        <path
          d="M444.91 287.621C464.129 241.401 541.144 147.267 474.756 88.6894C452.441 -20.0973 329.15 -8.05541 246.862 17.0492C191.557 33.9223 149.791 67.2584 140.865 42.1538C85.0768 88.6894 113.016 134.204 149.791 147.267C183.169 159.122 239.61 170.977 335.582 159.819C352.726 157.825 349.136 210.33 358.296 216.006C372.039 224.522 382.706 170.977 420.385 187.055C458.065 203.133 435.705 277.683 395.258 277.683C381.311 277.683 374.338 316.028 411.995 334.16C439.331 347.593 432.422 317.655 444.91 287.621Z"
          fill="#63A9C7"
          fillOpacity="0.49"
        />
        <path
          d="M627.615 577.184C654.171 631.178 669.456 755.705 669.456 755.705H0C0 755.705 15.2915 631.164 41.841 577.184C68.3906 523.203 223.431 473.136 223.431 473.136C253.314 534.484 417.317 534.484 445.944 473.117C445.944 473.117 601.06 523.189 627.615 577.184Z"
          fill="#8FC5DD"
          fillOpacity="0.26"
        />
      </g>
    </svg>
  );
};
UserIcon.propTypes = {
  className: PropTypes.string,
};
