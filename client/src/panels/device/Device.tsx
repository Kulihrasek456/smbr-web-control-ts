import { GridstackGrid, GridElement } from "../../common/GridstackGrid/GridstackGrid.tsx";
import { Temperature } from "../dashboard/Temperature.tsx";

export function Device() {
  return (
    <div style={{ padding: "20px" }}>
      <GridstackGrid>
          <Temperature id="a"></Temperature>

          <Temperature id="b"></Temperature>

          <Temperature id="c"></Temperature>
      </GridstackGrid>
    </div>
  );
}
