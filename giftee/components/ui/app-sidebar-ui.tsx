"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

// These are components for the *content* of the sidebar, not the Sheet itself.
const SidebarContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex-1 overflow-y-auto p-4", className)} {...props} />
)
SidebarContent.displayName = "SidebarContent"

const SidebarGroup = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("space-y-2", className)} {...props} />
)
SidebarGroup.displayName = "SidebarGroup"

const SidebarGroupLabel = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h4 className={cn("mb-2 px-2 text-sm font-semibold text-gray-500", className)} {...props} />
)
SidebarGroupLabel.displayName = "SidebarGroupLabel"

const SidebarGroupContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("space-y-1", className)} {...props} />
)
SidebarGroupContent.displayName = "SidebarGroupContent"

const SidebarMenu = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <nav className={cn("space-y-1", className)} {...props} />
)
SidebarMenu.displayName = "SidebarMenu"

const SidebarMenuItem = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("", className)} {...props} />
)
SidebarMenuItem.displayName = "SidebarMenuItem"

interface SidebarMenuButtonProps extends React.ComponentProps<typeof Button> {
  isActive?: boolean
}

const SidebarMenuButton = React.forwardRef<HTMLButtonElement, SidebarMenuButtonProps>(
  ({ className, isActive, ...props }, ref) => (
    <Button
      ref={ref}
      variant="ghost"
      className={cn(
        "w-full justify-start px-4 py-2 text-base font-medium",
        isActive && "bg-accent text-accent-foreground",
        className,
      )}
      {...props}
    />
  ),
)
SidebarMenuButton.displayName = "SidebarMenuButton"

const SidebarRail = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("hidden sm:block w-16 bg-white border-r fixed inset-y-0 left-0 z-50", className)} {...props} />
)
SidebarRail.displayName = "SidebarRail"

const SidebarInput = React.forwardRef<React.ElementRef<typeof Input>, React.ComponentProps<typeof Input>>(
  ({ className, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        data-sidebar="input"
        className={cn(
          "h-8 w-full bg-background shadow-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
          className,
        )}
        {...props}
      />
    )
  },
)
SidebarInput.displayName = "SidebarInput"

const SidebarSeparator = React.forwardRef<React.ElementRef<typeof Separator>, React.ComponentProps<typeof Separator>>(
  ({ className, ...props }, ref) => {
    return (
      <Separator
        ref={ref}
        data-sidebar="separator"
        className={cn("mx-2 w-auto bg-sidebar-border", className)}
        {...props}
      />
    )
  },
)
SidebarSeparator.displayName = "SidebarSeparator"

export {
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
  SidebarInput,
  SidebarSeparator,
}
