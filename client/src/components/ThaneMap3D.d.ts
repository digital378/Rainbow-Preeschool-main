import React from "react";

export interface ThaneMap3DProps {
  activeId?: string | null;
  onActiveChange?: (id: string | null) => void;
  fallback?: React.ReactNode;
}

export declare const CENTRES: Array<{
  id: string;
  name: string;
  pos: [number, number, number];
}>;

declare const ThaneMap3D: React.FC<ThaneMap3DProps>;
export default ThaneMap3D;
