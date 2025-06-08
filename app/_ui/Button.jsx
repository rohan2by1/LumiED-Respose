//app\_ui\Button.jsx
import React from "react";
import classNames from "classnames";

const Button = ({
  children,
  variant = "primary",
  fullWidth = true,
  className,
  disabled = false,
  ...props
}) => {
  const baseStyles =
    "rounded font-semibold transition duration-200 ease-in-out active:scale-95";
  const variants = {
    primary:
      "bg-brand-primary text-white border-brand-primary hover:text-brand-primary hover:bg-transparent border-2",
    secondary:
      "bg-transparent text-brand-dark border-brand-dark hover:bg-brand-dark hover:text-white border-2",
    tertiary:
      "bg-transparent text-brand-primary border-brand-primary hover:bg-brand-primary hover:text-white border-2",
  };

  const disabledStyles =
    "opacity-50 cursor-not-allowed pointer-events-none";

  return (
    <button
      className={classNames(
        baseStyles,
        variants[variant],
        { "w-full": fullWidth },
        { [disabledStyles]: disabled },
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
