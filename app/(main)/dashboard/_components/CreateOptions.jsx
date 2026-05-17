import React from "react";
import Link from "next/link";
import { PhoneIcon, Video } from "lucide-react";

const CreateOptions = () => {
  return (
    <div className="grid grid-cols-2 gap-5">
      <Link
        href="/dashboard/create-interview"
        className="bg-card border border-white/5 rounded-xl p-6 cursor-pointer hover:shadow-[0_0_20px_rgba(37,99,235,0.15)] transition-all hover:-translate-y-1"
      >
        <Video className="p-3 text-blue-400 bg-gradient-to-br from-blue-900/40 to-blue-600/10 rounded-lg h-14 w-14 border border-blue-500/20" />
        <h2 className="font-bold mt-4 text-foreground">Create New Interview</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Create AI interviews & schedule them with candidates
        </p>
      </Link>

      <div className="bg-card border border-white/5 rounded-xl p-6 cursor-pointer hover:shadow-[0_0_20px_rgba(37,99,235,0.15)] transition-all hover:-translate-y-1">
        <PhoneIcon className="p-3 text-emerald-400 bg-gradient-to-br from-emerald-900/40 to-emerald-600/10 rounded-lg h-14 w-14 border border-emerald-500/20" />
        <h2 className="font-bold mt-4 text-foreground">Create Screening Call</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Schedule phone screening call with candidates
        </p>
      </div>
    </div>
  );
};

export default CreateOptions;
