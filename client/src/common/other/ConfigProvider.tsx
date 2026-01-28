import { createSignal } from "solid-js";

export type ConfigValue = number | string | undefined | Record<string, any>[];

export type ConfigTree = Record<string, ConfigValue>;

const [config, setConfig] = createSignal<ConfigTree>({});

export function getArray(key: string): Record<string, any>[] {
  const val = config()[key];
  return Array.isArray(val) ? val : [];
}

export function setValue(key: string, value: ConfigValue) {
  setConfig(prev => ({ ...prev, [key]: value }));
}

export function pushToArray(key: string, item: Record<string, any>) {
  const arr = getArray(key);
  setValue(key, [...arr, item]);
}

export { config, setConfig };
