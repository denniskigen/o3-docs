import * as React from "react";

function NavLogo(props) {
  return (
    <svg
      viewBox="0 0 36 36"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="OpenMRS logo"
      focusable="false"
      fillRule="evenodd"
      clipRule="evenodd"
      strokeLinejoin="round"
      strokeMiterlimit={2}
      height="32px"
      width="32px"
      {...props}
    >
      <path
        d="M9.592 9.606A11.433 11.433 0 0117.7 6.249a11.429 11.429 0 018.092 3.342l.008-7.636A17.633 17.633 0 0017.701 0c-2.92 0-5.69.794-8.118 2.046l.009 7.56z"
        fill="#f26521"
        fillRule="nonzero"
      />
      <path
        d="M25.801 25.811a11.428 11.428 0 01-8.107 3.358A11.435 11.435 0 019.6 25.827l-.01 7.636a17.658 17.658 0 008.103 1.956c2.919 0 5.674-.706 8.101-1.956l.006-7.652z"
        fill="#efa715"
        fillRule="nonzero"
      />
      <path
        d="M9.608 25.821a11.429 11.429 0 01-3.359-8.107c0-3.16 1.278-6.019 3.343-8.093l-7.637-.008A17.65 17.65 0 000 17.714c0 2.92.707 5.674 1.958 8.102l7.65.005z"
        fill="#5b57a6"
        fillRule="nonzero"
      />
      <path
        d="M25.797 9.59a11.429 11.429 0 013.358 8.11c0 3.158-1.277 6.018-3.343 8.09l7.637.01a17.638 17.638 0 001.956-8.1c0-2.92-.705-5.675-1.957-8.104l-7.651-.005z"
        fill="#009283"
        fillRule="nonzero"
      />
    </svg>
  );
}

export default NavLogo;
