import { API } from "homebridge";

import { MiLYWSD03MMCSensorPlatform } from "./platform.js";
import { PLATFORM_NAME } from "./settings.js";

/**
 * This method registers the platform with Homebridge
 */
export default (api: API) => {
  api.registerPlatform(PLATFORM_NAME, MiLYWSD03MMCSensorPlatform);
};
