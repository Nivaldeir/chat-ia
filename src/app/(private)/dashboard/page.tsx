'use client'
import { usePageHeaderInfo } from "@/hooks/use-page-info";
import Image from "next/image";


export default function Home() {
  usePageHeaderInfo({
    title: "Home",
    description: "Tela inicial",
    breadcrumb: [
      {
        label: "Home",
        href: "/",
      },
    ]
  });
  return (
    <div className="flex flex-col w-full items-center gap-4 size-full  justify-center">
      <Image
        height={300}
        width={300}
        quality={100}
        src="/TATICCA_LOGO_BICOLOR.png"
        alt="Logo TATICCA"
      />
      <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
        <li className="mb-2">
          Comece perguntando algo em{" "}
          <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
            modelos
          </code>
          .
        </li>
      </ol>
    </div>
  );
}
