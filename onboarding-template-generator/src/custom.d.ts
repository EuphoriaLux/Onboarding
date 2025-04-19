// src/custom.d.ts

// Tell TypeScript that importing .svg files returns the path (string)
// This is common when using file-loader or url-loader with Webpack
declare module '*.svg' {
  const content: string;
  export default content;
}

// If using @svgr/webpack to import SVGs as React components, use this instead:
// declare module '*.svg' {
//   import * as React from 'react';
//   export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
//   const src: string;
//   export default src;
// }
