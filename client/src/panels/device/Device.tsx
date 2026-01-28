import { GridstackGrid, GridElement } from "../../common/GridstackGrid/GridstackGrid.tsx";
import { Control } from "../dashboard/Control.tsx";
import { Temperature } from "../dashboard/Temperature.tsx";

export function Device() {
  return (
    <div style={{ padding: "20px" }}>
      <GridstackGrid>
          <Temperature id="a"></Temperature>

          <Temperature id="b"></Temperature>

          <Temperature id="c"></Temperature>

          <Control id="te"></Control>
      </GridstackGrid>
    </div>
  );
}
