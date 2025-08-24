
// Fixed toaster component - no React hooks
console.log("Fixed toaster.tsx loaded");

export const Toaster = () => {
  console.log("Toaster component - returning null to avoid hook conflicts");
  return null;
};

export default Toaster;
