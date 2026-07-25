import * as React from "react";

interface SchoolTownMap3DProps {
  activeId?: string | null;
  onActiveChange?: (id: string | null) => void;
  fallback?: React.ReactNode;
}

declare const SchoolTownMap3D: React.FC<SchoolTownMap3DProps>;
export default SchoolTownMap3D;
