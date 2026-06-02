import { createIconComponent, createIconStylesComponent } from "../../common/web-components/Icon/Icon";

const fontNameToCode = {
    "keyboard_arrow_down": "\ue313",
    "add": "\ue145",
    "add_circle": "\ue147",
    "keyboard_arrow_right": "\ue315",
    "play_arrow": "\ue037",
    "pause": "\ue034",
    "clock_loader_10": "\uf726",
    "pause_circle": "\ue1a2",
    "stop_circle": "\uef71",
    "arrow_back_ios_new": "\ue2ea",
    "arrow_forward_ios": "\ue5e1",
    "delete": "\ue872",
    "upload": "\uf09b",
    "share_windows": "\uf613",
    "autorenew": "\ue863",
    "open_with": "\ue89f",
    "image_arrow_up": "\uf317",
    "upload_file": "\ue9fc",
    "devices_off": "\uf7a5",
    "water_full": "\uf6d6",
    "water_lux": "\uf874",
    "wb_incandescent": "\ue42e",
    "wb_twilight": "\ue1c6",
    "mode_heat": "\uf16a",
    "circle": "\uef4a",
    "refresh": "\ue5d5",
    "error": "\ue000",
    "home": "\ue88a",
    "science": "\uea4b",
    "build": "\ue869",
    "terminal": "\ueb8e"
} as const;

export type Icons = keyof typeof fontNameToCode

export const Icon = createIconComponent<Icons, typeof fontNameToCode>(fontNameToCode);
export const IconStyles = createIconStylesComponent<Icons, typeof fontNameToCode>(fontNameToCode);
