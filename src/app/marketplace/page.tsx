import React, { Suspense } from "react";
import MarketplaceContent from "./marketplace-content";

const page = () => {
  return (
    <Suspense fallback={<div>Loading.....</div>}>
      <MarketplaceContent />
    </Suspense>
  );
};

export default page;
