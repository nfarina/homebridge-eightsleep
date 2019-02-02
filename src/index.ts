require("@babel/polyfill");
import callbackify from "./util/callbackify";
import * as api from "./util/api";
import { lock } from "./util/mutex";
import { HeatingRequest } from "./util/types";

let Service: any, Characteristic: any;

export default function(homebridge: any) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;

  homebridge.registerAccessory(
    "homebridge-eightsleep",
    "Eight Sleep",
    EightSleepAccessory,
  );
}

interface LoginData {
  token: string;
  retrieved: number; // Date we got the token.
  userId: string;
  deviceId: string;
}

class EightSleepAccessory {
  // From config.
  log: Function;
  name: string;
  left: string | undefined;
  right: string | undefined;
  device: string | undefined;
  heat_percent: number;
  heat_minutes: number;
  email: string;
  password: string;

  cachedLogin: LoginData | undefined;

  // Services exposed.
  heaterService: any;
  leftHeaterService: any;
  rightHeaterService: any;

  constructor(log: (args: any[]) => void, config: { [name: string]: any }) {
    this.log = log;
    this.name = config["name"];
    this.left = config["left"];
    this.right = config["right"];
    this.device = config["device"];
    this.heat_percent = Number(config["heat_percent"] || 90); // default 90%
    this.heat_minutes = Number(config["heat_minutes"] || 15); // default 15 mins
    this.email = config["email"];
    this.password = config["password"];

    const heaterService = new Service.Switch(this.name, "both sides");

    heaterService
      .getCharacteristic(Characteristic.On)
      .on("get", callbackify(this.getHeaterOn))
      .on("set", callbackify(this.setHeaterOn));

    this.heaterService = heaterService;

    if (this.left) {
      const leftHeaterService = new Service.Switch(this.left, "left side");

      leftHeaterService
        .getCharacteristic(Characteristic.On)
        .on("get", callbackify(this.getLeftHeaterOn))
        .on("set", callbackify(this.setLeftHeaterOn));

      this.leftHeaterService = leftHeaterService;
    }

    if (this.right) {
      const rightHeaterService = new Service.Switch(this.right, "right side");

      rightHeaterService
        .getCharacteristic(Characteristic.On)
        .on("get", callbackify(this.getRightHeaterOn))
        .on("set", callbackify(this.setRightHeaterOn));

      this.rightHeaterService = rightHeaterService;
    }
  }

  getServices() {
    const { heaterService, leftHeaterService, rightHeaterService } = this;
    return [
      heaterService,
      ...(leftHeaterService ? [leftHeaterService] : []),
      ...(rightHeaterService ? [rightHeaterService] : []),
    ];
  }

  //
  // Heater Switch (Both)
  //

  getHeaterOn = async () => {
    const { token, deviceId } = await this.getLogin();
    const device = await api.getDevice({ token, deviceId });
    const on = device.result.leftNowHeating || device.result.rightNowHeating;
    this.log("Either left or right heater on?", on);
    return on;
  };

  setHeaterOn = async (on: boolean) => {
    const { token, deviceId } = await this.getLogin();
    this.log("Set both left and right heaters to", on);
    const request: HeatingRequest = {
      leftTargetHeatingLevel: this.heat_percent,
      leftHeatingDuration: on ? this.heat_minutes * 60 : 0,
      rightTargetHeatingLevel: this.heat_percent,
      rightHeatingDuration: on ? this.heat_minutes * 60 : 0,
    };
    await api.setHeating({ token, deviceId, request });
  };

  //
  // Heater Switch (Left)
  //

  getLeftHeaterOn = async () => {
    const { token, deviceId } = await this.getLogin();
    const device = await api.getDevice({ token, deviceId });
    const on = device.result.leftNowHeating;
    this.log("Left heater on?", on);
    return on;
  };

  setLeftHeaterOn = async (on: boolean) => {
    const { token, deviceId } = await this.getLogin();
    this.log("Set left heater to", on);
    const request: HeatingRequest = {
      leftTargetHeatingLevel: this.heat_percent,
      leftHeatingDuration: on ? this.heat_minutes * 60 : 0,
    };
    await api.setHeating({ token, deviceId, request });
  };

  //
  // Heater Switch (Right)
  //

  getRightHeaterOn = async () => {
    const { token, deviceId } = await this.getLogin();
    const device = await api.getDevice({ token, deviceId });
    const on = device.result.rightNowHeating;
    this.log("Right heater on?", on);
    return on;
  };

  setRightHeaterOn = async (on: boolean) => {
    const { token, deviceId } = await this.getLogin();
    this.log("Set right heater to", on);
    const request: HeatingRequest = {
      rightTargetHeatingLevel: this.heat_percent,
      rightHeatingDuration: on ? this.heat_minutes * 60 : 0,
    };
    await api.setHeating({ token, deviceId, request });
  };

  //
  // General
  //

  getLogin = async (): Promise<LoginData> => {
    // Use a mutex to prevent multiple logins happening in parallel.
    const unlock = await lock("getLogin", 20000);

    try {
      const { email, password, device, cachedLogin } = this;

      // Return cached value if it's not too old.
      const TOMORROW = Date.now() + 1000 * 60 * 60 * 24;
      if (cachedLogin && cachedLogin.retrieved < TOMORROW) {
        return cachedLogin;
      }

      this.log("Logging into Eight with email/password…");
      const loginResult = await api.login({ email, password });
      const { token, userId } = loginResult.session;

      this.log("Retrieving user data…");
      const userResult = await api.getMe({ token });
      const { devices } = userResult.user;

      if (devices.length === 0) {
        throw new Error(
          "No Eight Sleep product found linked to this email/password!",
        );
      }

      if (devices.length > 1) {
        if (!device) {
          this.log(
            "More than one Eight product is linked to this account. Please pick one to assign to this HomeKit accessory, from the following list, and paste it into the `device` field in your config.json.",
            JSON.stringify(devices),
          );
          throw new Error("Device not configured.");
        }
      }

      const login = {
        token,
        retrieved: Date.now(),
        userId,
        deviceId: devices[0],
      };

      // Save it in memory for future API calls.
      this.cachedLogin = login;

      this.log("Got a login token.");
      return login;
    } finally {
      unlock();
    }
  };
}
