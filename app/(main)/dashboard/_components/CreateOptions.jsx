import React from "react";
import Link from "next/link";
import { PhoneIcon, Video } from "lucide-react";

const CreateOptions = () => {
  return (
    <div className="grid grid-cols-2 gap-5">
      <Link
        href="/dashboard/create-interview"
        className="bg-white border border-gray-200 rounded-lg p-5 cursor-pointer hover:shadow-md transition"
      >
        <Video className="p-3 text-primary bg-blue-50 rounded-lg h-14 w-14" />
        <h2 className="font-bold mt-3">Create New Interview</h2>
        <p className="text-gray-500">
          Create AI interviews & schedule them with candidates
        </p>
      </Link>

      <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition">
        <PhoneIcon className="p-3 text-primary bg-blue-50 rounded-lg h-14 w-14" />
        <h2 className="font-bold mt-3">Create Screening Call</h2>
        <p className="text-gray-500">
          Schedule phone screening call with candidates
        </p>
      </div>
    </div>
  );
};

export default CreateOptions;
