import { apiMessageSimple } from "../../apiMessages/apiMessage"
import { Widget } from "../common/Widget"
import { Temperature } from "./Temperature"

export function Dashboard() {
  return (
    <Temperature id="temp1"></Temperature>
  )
}