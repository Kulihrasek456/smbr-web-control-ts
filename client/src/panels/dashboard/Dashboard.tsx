import { Show } from "solid-js"
import { GridstackGrid } from "../../common/GridstackGrid/GridstackGrid"
import { countInstancesOfType, useModuleListValue } from "../../common/other/ModuleListProvider"
import { Control } from "./Control"
import { KinematicFluorometer } from "./KineticFluorometer"
import { LEDPanel } from "./LedPanel"
import { QuickLaunch } from "./QuickLaunch"
import { Temperature } from "./Temperature"
import { TransSpectrophotometer } from "./TransmissiveSpectrophotometer"

export function Dashboard() {
  const moduleListCntxt = useModuleListValue();


  return (
    <div style={{ padding: "8px", "overflow-x": "hidden", "overflow-y" : "scroll"}}>
      <GridstackGrid>
          <Temperature id="temperature"></Temperature>

          <Show when={countInstancesOfType(moduleListCntxt?.state(),"sensor","Exclusive") > 0}>
            <TransSpectrophotometer id="transmissive spectrophotometer"></TransSpectrophotometer>
            <KinematicFluorometer id="kinematic fluorometer"></KinematicFluorometer>
          </Show>

          <Show when={countInstancesOfType(moduleListCntxt?.state(),"control","Exclusive") > 0}>
            <LEDPanel id="led panel"></LEDPanel>
            <Control id="control"></Control>
          </Show>
          
          <Show when={countInstancesOfType(moduleListCntxt?.state(),"core","Exclusive") > 0}>
            <QuickLaunch id="quick launch"></QuickLaunch>
          </Show>

      </GridstackGrid>
    </div>
  )
}