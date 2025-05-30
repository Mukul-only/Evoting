import React from "react";

const Input = React.forwardRef(
  (
    {
      type = "text",
      label,
      name,
      placeholder,
      error,
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={name}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
        )}
        <input
          type={type}
          name={name}
          id={name}
          ref={ref}
          placeholder={placeholder}
          className={`mt-1 block w-full px-3 py-2 border ${
            error ? "border-red-500" : "border-gray-300"
          } rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-red-600">{error.message || error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
