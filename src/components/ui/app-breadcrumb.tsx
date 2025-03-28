"use client";

import React from "react";
import Link from "next/link";
import { usePageMetadata } from "@/contexts/page-metada";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "./breadcrumb";

export const AppBreadcrumb: React.FC = () => {
  const { metadata } = usePageMetadata();
  const items = metadata.breadcrumb || [];

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => (
          <React.Fragment key={item.href || index}>
            <BreadcrumbItem className="hidden md:block">
              {item.href ? (
                <Link href={item.href}>{item.label}</Link>
              ) : (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {index < items.length - 1 && (
              <BreadcrumbSeparator className="hidden md:block" />
            )}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};