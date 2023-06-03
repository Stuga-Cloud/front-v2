"use client";
import { ValidStepper, PendingStepper, ActiveStepper } from "@/components/project/stepper";

export default function Database({children}: {children: React.ReactNode}) {
  console.log('children', children)
    return (
    <div className="flex flex-row space-between">
      <div className="z-10 flex w-2/5 flex-col items-center justify-center">
          <div className="mt-10 w-4/5">
              <ol className="space-y-4 w-72">
                <ValidStepper text="Gestion des clefs" index={1} />
                <ActiveStepper text="Gestion des users" index={2}/>
                <PendingStepper text="Gestion des token" index={3}/>
              </ol>
          </div>
      </div>
      <div className="z-20 w-3/5">{ children }</div>
    </div>
  );
}

