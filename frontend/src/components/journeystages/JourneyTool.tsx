import React, { lazy, Suspense } from 'react';

interface JourneyToolProps {
  componentName: string;
}

const componentRegistry = {
  SymptomTracker: lazy(() => import('./SymptomTracker').then(module => ({ default: module.SymptomTracker }))),
  ConditionExplainer: lazy(() => import('./ConditionExplainer').then(module => ({ default: module.ConditionExplainer }))),
  PathologyTranslator: lazy(() => import('./PathologyTranslator').then(module => ({ default: module.PathologyTranslator }))),
  SecondOpinionGuide: lazy(() => import('./SecondOpinionGuide').then(module => ({ default: module.SecondOpinionGuide }))),
};

export const JourneyTool: React.FC<JourneyToolProps> = ({ componentName }) => {
  const Component = componentRegistry[componentName as keyof typeof componentRegistry];

  if (!Component) {
    return <div>Tool not found: {componentName}</div>;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Component />
    </Suspense>
  );
};
