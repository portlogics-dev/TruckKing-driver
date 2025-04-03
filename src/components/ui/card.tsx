import type { TextRef, ViewRef } from "@rn-primitives/types";
import * as React from "react";
import { Text, type TextProps, View, type ViewProps } from "react-native";

import { TextClassContext } from "@/components/ui/text";
import { cn } from "@/lib/utils/cn";

const CardRoot = React.forwardRef<ViewRef, ViewProps>(
  ({ className, ...props }, ref) => (
    <View
      ref={ref}
      className={cn(
        "rounded-lg bg-card shadow-sm shadow-foreground/25",
        className
      )}
      {...props}
    />
  )
);
CardRoot.displayName = "Card";

const CardHeader = React.forwardRef<ViewRef, ViewProps>(
  ({ className, ...props }, ref) => (
    <View
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-4", className)}
      {...props}
    />
  )
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<TextRef, TextProps>(
  ({ className, ...props }, ref) => (
    <Text
      role="heading"
      aria-level={3}
      ref={ref}
      className={cn(
        "text-xl text-card-foreground font-semibold leading-none tracking-tight",
        className
      )}
      {...props}
    />
  )
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<TextRef, TextProps>(
  ({ className, ...props }, ref) => (
    <Text
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<ViewRef, ViewProps>(
  ({ className, ...props }, ref) => (
    <TextClassContext.Provider value="text-card-foreground">
      <View ref={ref} className={cn("p-4", className)} {...props} />
    </TextClassContext.Provider>
  )
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<ViewRef, ViewProps>(
  ({ className, ...props }, ref) => (
    <View
      ref={ref}
      className={cn("flex flex-row items-center p-4 pt-0", className)}
      {...props}
    />
  )
);
CardFooter.displayName = "CardFooter";

const Card = Object.assign(CardRoot, {
  Content: CardContent,
  Description: CardDescription,
  Footer: CardFooter,
  Header: CardHeader,
  Title: CardTitle,
});

export { Card };
