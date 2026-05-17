import { CreditCard } from "lucide-react";
import React from "react";

const BillingPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-6">
      <div className="w-full max-w-md rounded-2xl border bg-card p-10 shadow-sm shadow-black/50 text-center">
        
        <div className="flex justify-center mb-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
            <CreditCard className="h-7 w-7 text-blue-600" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-foreground">
          Billing
        </h1>

        <p className="mt-3 text-muted-foreground">
          Billing and subscription management for <span className="font-semibold text-blue-600">VoxHire</span> will be available soon.
        </p>

        <p className="mt-2 text-sm text-muted-foreground">
          We're working on adding secure payments and plans.
        </p>

      </div>
    </div>
  );
};

export default BillingPage;