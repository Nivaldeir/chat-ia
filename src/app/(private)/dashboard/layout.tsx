"use client"
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import TransitionProvider from "@/components/transaction";
import { AppBreadcrumb } from "@/components/ui/app-breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { PageMetadataProvider } from "@/contexts/page-metada";
import { AppProgressBar } from "next-nprogress-bar";


export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <PageMetadataProvider>
        {/* <SidebarProvider> */}
        <AppSidebar />
        <SidebarInset className='overflow-y-auto'>
          <header className="flex h-16 w-full justify-between pr-4 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <AppBreadcrumb />
            </div>
          </header>
          <TransitionProvider>
            <main className="h-[calc(100vh-70px)] flex w-full">
              {children}
              <AppProgressBar
                height="4px"
                color="#063B89"
                options={{ showSpinner: false }}
                shallowRouting
              />
            </main>
          </TransitionProvider>
        </SidebarInset>
        {/* </SidebarProvider> */}
      </PageMetadataProvider>
    </SidebarProvider>

  );
}
