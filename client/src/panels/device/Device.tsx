import { GridstackGrid, GridElement } from "../../common/GridstackGrid/GridstackGrid.tsx";
import { Control } from "../dashboard/Control.tsx";
import { Temperature } from "../dashboard/Temperature.tsx";
import { DeviceInformation } from "./DeviceInformation.tsx";
import { ModuleListDisplay } from "./ModuleList.tsx";
import { ServiceStatus } from "./ServiceStatus.tsx";

export function Device() {
  return (
    <div style={{ padding: "8px" }}>
      <GridstackGrid>
          <ModuleListDisplay id="moduleList"></ModuleListDisplay>
          <ServiceStatus id="serviceStatus"></ServiceStatus>
          <DeviceInformation id="deviceInformation"></DeviceInformation>
      </GridstackGrid>
    </div>
  );
}
