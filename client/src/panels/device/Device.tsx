import { GridstackGrid, GridElement } from "../../common/GridstackGrid/GridstackGrid.tsx";
import { Temperature } from "../dashboard/Temperature.tsx";

export function Device() {
  return (
    <div style={{ padding: "20px" }}>
      <GridstackGrid>
        <GridElement id="w1" x={0} y={0} w={4} h={2}>
          <Temperature></Temperature>
        </GridElement>

        <GridElement id="w2" x={4} y={0} w={2} h={2}>
          <Temperature></Temperature>
        </GridElement>

        <GridElement id="w3" x={0} y={2} w={6} h={2}>
          <Temperature></Temperature>
        </GridElement>
      </GridstackGrid>
    </div>
  );
}
