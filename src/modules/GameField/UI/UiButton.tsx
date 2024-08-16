import { FC } from "react";
import styled from "styled-components";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  size?: "small" | "medium";
  variant?: "contained" | "outlined" | "warning";
  color?: string;
}

const StyledButton = styled.button<{
  $size: Props["size"];
  $variant: Props["variant"];
  $disabled?: boolean;
  $color?: string;
}>`
  cursor: pointer;
  font-size: ${(props) => (props.$size === "small" ? "14px" : "25px")};
  color: ${(props) =>
    props.$color
      ? props.$color
      : props.$variant === "contained"
      ? "#fff"
      : "#2d77af"};
  background-color: ${(props) =>
    props.$disabled
      ? "gray"
      : props.$variant === "contained"
      ? "#0f64a3"
      : props.$variant === "warning"
      ? "#e63f31"
      : "transparent"};
  border-color: #2d77af;
  font-weight: 600;
  padding: ${(props) => (props.$size === "small" ? "8px 20px" : "10px 30px;")};
  border-radius: 8px;
  width: 100%;
`;

const UiButton: FC<Props> = ({
  children,
  size = "medium",
  variant = "contained",
  color,
  ...props
}) => {
  return (
    <StyledButton
      $size={size}
      {...props}
      $variant={variant}
      $disabled={props.disabled}
      $color={color}
    >
      {children}
    </StyledButton>
  );
};

export { UiButton };
