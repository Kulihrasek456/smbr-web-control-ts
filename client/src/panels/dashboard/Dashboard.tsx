import { GridstackGrid } from "../../common/GridstackGrid/GridstackGrid"
import { Control } from "./Control"
import { Temperature } from "./Temperature"

export function Dashboard() {
  return (
    <div style={{ padding: "20px", "overflow-x": "hidden", "overflow-y" : "scroll"}}>
      <GridstackGrid>
          <Temperature id="a"></Temperature>

          <Temperature id="b"></Temperature>

          <Temperature id="c"></Temperature>

          <Control id="te"></Control>
      </GridstackGrid>
    </div>
  )
}