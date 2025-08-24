// Replacement file to prevent cache errors
// This file exists only to satisfy any remaining cached imports

console.log("OLD toaster.tsx loaded - this should not happen!");

export const Toaster = () => {
  console.log("Toaster component called - redirecting to null");
  return null;
};

export default Toaster;