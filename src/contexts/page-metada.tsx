// contexts/PageMetadataContext.tsx
"use client";

import { BreadcrumbItem } from "@/@types/breadcrumb-item";
import { Metadata } from "next";
import { createContext, useContext, ReactNode, useState } from "react";

type PageMetadata = {
  subtitle?: string;
  breadcrumb?: BreadcrumbItem[];
} & Metadata;

type PageMetadataContextType = {
  metadata: PageMetadata;
  setMetadata: (metadata: PageMetadata) => void;
};

const PageMetadataContext = createContext<PageMetadataContextType | undefined>(
  undefined,
);

export function PageMetadataProvider({ children }: { children: ReactNode }) {
  const [metadata, setMetadata] = useState<PageMetadata>({});
  return (
    <PageMetadataContext.Provider value={{ metadata, setMetadata }}>
      {children}
    </PageMetadataContext.Provider>
  );
}

export function usePageMetadata() {
  const context = useContext(PageMetadataContext);
  if (!context)
    throw new Error("usePageMetadata must be used within PageMetadataProvider");
  return context;
}