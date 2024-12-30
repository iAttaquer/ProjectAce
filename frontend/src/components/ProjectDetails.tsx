"use client";

import { useProject } from "@/hooks/projectContext";

export default function ProjectDetails() {
  const { project, loading } = useProject();

  return(
    <div className="w-4/5 mr-3 mb-3 flex ">

      <div className="card card-compact font-semibold justify-center w-full h-fit p-3 bg-base-100 bg-opacity-40 shadow-xl mb-4 rounded-lg">
        <h3>{project?.name}</h3>
      </div>
    </div>
  );
};