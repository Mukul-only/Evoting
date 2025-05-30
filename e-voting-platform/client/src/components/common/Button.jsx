import React from "react";

const Button = ({
  children,
  type = "button",
  onClick,
  variant = "primary", // 'primary', 'secondary', 'outline', 'danger'
  size = "md", // 'sm', 'md', 'lg'
  isLoading = false,
  disabled = false,
  className = "",
  fullWidth = false,
  ...props
}) => {
  const baseStyle =
    "font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition ease-in-out duration-150";

  let variantStyle = "";
  switch (variant) {
    case "primary":
      variantStyle =
        "bg-primary text-white hover:bg-indigo-700 focus:ring-indigo-500";
      break;
    case "secondary":
      variantStyle =
        "bg-secondary text-white hover:bg-emerald-700 focus:ring-emerald-500";
      break;
    case "outline":
      variantStyle =
        "border border-primary text-primary hover:bg-indigo-50 focus:ring-indigo-500";
      break;
    case "danger":
      variantStyle =
        "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500";
      break;
    default:
      variantStyle =
        "bg-primary text-white hover:bg-indigo-700 focus:ring-indigo-500";
  }

  let sizeStyle = "";
  switch (size) {
    case "sm":
      sizeStyle = "px-2.5 py-1.5 text-xs";
      break;
    case "md":
      sizeStyle = "px-4 py-2 text-sm";
      break;
    case "lg":
      sizeStyle = "px-6 py-3 text-base";
      break;
    default:
      sizeStyle = "px-4 py-2 text-sm";
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseStyle} ${variantStyle} ${sizeStyle} ${
        fullWidth ? "w-full" : ""
      } ${
        disabled || isLoading ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Processing...
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
