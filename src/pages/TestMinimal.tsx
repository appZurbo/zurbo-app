// Minimal test component to isolate React import issues
import React from 'react';

console.log("TestMinimal: React object is:", React);
console.log("TestMinimal: useState is:", React.useState);

const TestMinimal = () => {
  console.log("TestMinimal component rendering");
  return <div>Test works</div>;
};

export default TestMinimal;