"use client";

import { createContext } from "react";

export interface PageRendererContextValue {
  isEditable: boolean;
}

export const PageRendererContext = createContext<PageRendererContextValue>({
  isEditable: false,
});
