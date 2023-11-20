import { ReactElement, ReactNode } from 'react';

export const If = ({ condition, children }: { condition: boolean; children: ReactElement }) => {
  if (condition) return children;
  return null;
};
