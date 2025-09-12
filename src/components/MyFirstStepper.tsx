'use client';

import { Button } from './ui/button';
import { defineStepper } from '@/components/ui/Stepper';

const { Stepper } = defineStepper(
  { id: 'step-1', title: 'Step 1', description: 'Step 1 description' },
  { id: 'step-2', title: 'Step 2', description: 'Step 2 description' },
  { id: 'step-3', title: 'Step 3', description: 'Step 3 description' }
);

export function MyFirstStepper() {
  return (
    <Stepper.Provider className="space-y-4">
      {({ methods }) => (
        <>
          <Stepper.Navigation>
            {methods.all.map((step) => (
              // eslint-disable-next-line react/jsx-key
              <Stepper.Step of={step.id} onClick={() => methods.goTo(step.id)}>
                <Stepper.Title>{step.title}</Stepper.Title>
              </Stepper.Step>
            ))}
          </Stepper.Navigation>
          {methods.switch({
            'step-1': (step: { id: string }) => <Content id={step.id} />,
            'step-2': (step: { id: string }) => <Content id={step.id} />,
            'step-3': (step: { id: string }) => <Content id={step.id} />,
          })}
          <Stepper.Controls>
            {!methods.isLast && (
              <Button
                type="button"
                variant="secondary"
                onClick={methods.prev}
                disabled={methods.isFirst}
              >
                Previous
              </Button>
            )}
            <Button onClick={methods.isLast ? methods.reset : methods.next}>
              {methods.isLast ? 'Reset' : 'Next'}
            </Button>
          </Stepper.Controls>
        </>
      )}
    </Stepper.Provider>
  );
}

const Content = ({ id }: { id: string }) => {
  return (
    <Stepper.Panel className="h-[200px] content-center rounded border bg-slate-50 p-8">
      <p className="text-xl font-normal">Content for {id}</p>
    </Stepper.Panel>
  );
};
