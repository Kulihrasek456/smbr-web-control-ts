
export const moduleTypes = [
  "core",
  "sensor",
  "pump",
  "control",
  "undefined"
] as const;

export const moduleInstances  = [
  "Undefined",
  "Exclusive",
  "All",
  "Reserved",
  "Instance_1",
  "Instance_2",
  "Instance_3",
  "Instance_4",
  "Instance_5",
  "Instance_6",
  "Instance_7",
  "Instance_8",
  "Instance_9",
  "Instance_10",
  "Instance_11",
  "Instance_12"
] as const;

export type moduleTypesType = typeof moduleTypes[number]
export type moduleInstancesType = typeof moduleInstances[number]

export type Module = {
  readonly type: moduleTypesType;
  readonly instance: moduleInstancesType;
  readonly uid: string;
}