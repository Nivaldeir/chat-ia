import { BreadcrumbItem } from "@/@types/breadcrumb-item";
import { usePageMetadata } from "@/contexts/page-metada";
import { useEffect } from "react";

type Props = {
  title: string;
  subtitle?: string;
  description?: string;
  breadcrumb?: BreadcrumbItem[];
}
export function usePageHeaderInfo(props: Props) {
  const { setMetadata } = usePageMetadata();

  useEffect(() => {
    setMetadata(props);
  },[]);
}