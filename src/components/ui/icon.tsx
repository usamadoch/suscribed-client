import { LucideIcon, LucideProps } from "lucide-react";
import { twMerge } from "tailwind-merge";

export interface IconProps extends Omit<LucideProps, "ref"> {
  icon: LucideIcon;
}

export function Icon({
  icon: IconComponent,
  size = 20,
  strokeWidth = 1.75,
  color = "currentColor",
  className,
  ...props
}: IconProps) {
  return (
    <IconComponent
      size={size}
      strokeWidth={strokeWidth}
      color={color}
      className={twMerge("fill-none", className)}
      {...props}
    />
  );
}
