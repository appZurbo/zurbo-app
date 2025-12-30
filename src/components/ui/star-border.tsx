
import { cn } from "@/lib/utils";
import { ElementType, ComponentPropsWithoutRef, forwardRef } from "react";

interface StarBorderProps<T extends ElementType> {
  as?: T;
  color?: string;
  speed?: string;
  className?: string;
  children: React.ReactNode;
}

const StarBorderComponent = forwardRef<any, StarBorderProps<any> & Omit<ComponentPropsWithoutRef<any>, keyof StarBorderProps<any>>>(
  function StarBorderComponent({
    as,
    className,
    color,
    speed = "6s",
    children,
    ...props
  }, ref) {
    const Component = as || "button";
    const defaultColor = color || "hsl(var(--foreground))";
    
    return (
      <Component 
        ref={ref}
        className={cn("relative inline-block py-[1px] overflow-hidden rounded-[20px]", className)} 
        {...props}
      >
        <div 
          className={cn(
            "absolute w-[300%] h-[50%] bottom-[-11px] right-[-250%] rounded-full animate-star-movement-bottom z-0",
            "opacity-20 dark:opacity-70"
          )} 
          style={{
            background: `radial-gradient(circle, ${defaultColor}, transparent 10%)`,
            animationDuration: speed
          }} 
        />
        <div 
          className={cn(
            "absolute w-[300%] h-[50%] top-[-10px] left-[-250%] rounded-full animate-star-movement-top z-0",
            "opacity-20 dark:opacity-70"
          )} 
          style={{
            background: `radial-gradient(circle, ${defaultColor}, transparent 10%)`,
            animationDuration: speed
          }} 
        />
        <div className="relative z-10 px-6 py-3 bg-white rounded-[20px] border">
          {children}
        </div>
      </Component>
    );
  }
);

export function StarBorder<T extends ElementType = "button">(props: StarBorderProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof StarBorderProps<T>>) {
  return <StarBorderComponent {...props} />;
}
