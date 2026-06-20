import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { SectionFallback } from './SectionFallback/SectionFallback';
import { SectionErrorFallback } from './SectionErrorFallback/SectionErrorFallback';
import { ErrorBoundary } from 'react-error-boundary';
import { Suspense } from 'react';

interface SectionWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  resetKeys?: unknown[];
}

const SectionWrapper = ({ children, fallback = <SectionFallback />, resetKeys }: SectionWrapperProps) => {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary onReset={reset} FallbackComponent={SectionErrorFallback} {...(resetKeys ? { resetKeys } : {})}>
          <Suspense fallback={fallback}>{children}</Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
};

export default SectionWrapper;
