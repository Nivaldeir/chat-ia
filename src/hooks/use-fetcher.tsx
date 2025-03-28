"use client";

import { useEffect, useState } from "react";


type Output<T> = {
  data: T | undefined
  error: string | null
  isLoading: boolean
}


/**
 * A simple wrapper around fetch that throws an error if the response is not 200-299.
 * @param url The URL to fetch. Must be one of the ApiEndpoints enum.
 * @param body The request body to send. Optional.
 * @returns The JSON response.
 */

export function useFetcher<T = any>(url: string, options?: RequestInit): Output<T> {
  const [data, setData] = useState<T>()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          ...options,
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(Array.isArray(result) ? result[0].Message : result.message);
        }
        setData(result);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [url, options]);

  return { data, isLoading, error };
}
