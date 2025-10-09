import * as React from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar"

export function AppSidebar({ children, ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      {children}
    </Sidebar>
  )
}
