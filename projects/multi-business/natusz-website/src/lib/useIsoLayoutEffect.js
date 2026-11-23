import { useEffect, useLayoutEffect } from "react";

// useLayoutEffect in the browser, useEffect while the pages are pre-rendered.
export const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
