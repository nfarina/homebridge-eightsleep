export interface LoginResult {
  session: {
    expirationDate: string; // Like "2019-02-16T07:02:13.446Z"
    userId: string; // Like "3aaa3142d7fc42048e5d8b215"
    token: string; // Like "d70e62b795384056b969e52ef17c305a-e1742f735e56cb2818fc6c454d945add"
  };
}

export type Feature = "warming";

export interface UserResult {
  user: {
    userId: string; // Like "3aaa3142d7fc42048e5d8b215648d"
    email: string; // Like "bob@bob.com"
    firstName: string;
    lastName: string;
    gender: "M" | "F";
    dob: string; // Like "1982-04-11T00:00:00.000Z"
    zip: number; // Like 11111
    devices: string[]; // Like ["36003a001951353434373"]
    emailVerified: boolean;
    sharingMetricsTo: string[]; // Like ["5fb527f74778438c8a8174a16"],
    sharingMetricsFrom: string[]; // Like [],
    timezone: string; // Like "America/Los_Angeles",
    notifications: {
      weeklyReportEmail: boolean;
      sessionProcessed: boolean;
    };
    features: Feature[]; // Like ["warming"]
  };
}

export interface HeatingRequest {
  leftTargetHeatingLevel?: number; // Like 90
  leftHeatingDuration?: number; // Like 0
  rightTargetHeatingLevel?: number; // Like 80
  rightHeatingDuration?: number; // Like 90
}

export interface HeatingResult {
  message: string;
  device: DeviceStatus;
}

export interface DeviceResult {
  result: DeviceStatus;
}

export interface DeviceStatus {
  deviceId: string; // Like "36003a001951353434373"
  ownerId: string; // Like "3aaa3142d7fc42048e5d8b2156"
  leftUserId: string; // Like "5fb527f74778438c8a8174a16"
  leftHeatingLevel: number; // Like 10
  leftTargetHeatingLevel: number; // Like 88
  leftNowHeating: boolean; // Like false
  leftHeatingDuration: number; // Like 0
  leftPresenceStart: number; // Like 0
  leftPresenceEnd: number; // Like 0
  leftSchedule: {
    enabled: boolean; // Like false
    daysUTC: {
      sunday: boolean; // Like true
      monday: boolean; // Like true
      tuesday: boolean; // Like true
      wednesday: boolean; // Like true
      thursday: boolean; // Like true
      friday: boolean; // Like true
      saturday: boolean; // Like true
    };
    startUTCHour: number; // Like 5
    startUTCMinute: number; // Like 0
    durationSeconds: number; // Like 90
  };
  rightUserId: string; // Like "3aaa3142d7fc42048e5d8"
  rightHeatingLevel: number; // Like 10
  rightTargetHeatingLevel: number; // Like 80
  rightNowHeating: boolean; // Like false
  rightHeatingDuration: number; // Like 0
  rightPresenceStart: number; // Like 1453821703
  rightPresenceEnd: number; // Like 1453821803
  rightSchedule: {
    enabled: boolean; // Like false
    daysUTC: {
      sunday: boolean; // Like true
      monday: boolean; // Like true
      tuesday: boolean; // Like true
      wednesday: boolean; // Like true
      thursday: boolean; // Like true
      friday: boolean; // Like true
      saturday: boolean; // Like true
    };
    startUTCHour: number; // Like 5
    startUTCMinute: number; // Like 0
    durationSeconds: number; // Like 180
  };
  ledBrightnessLevel: number; // Like 30
  sensorInfo: {
    label: string; // Like "20003-0202-A02-00000A9A"
    partNumber: string; // Like "20003"
    sku: string; // Like "0002"
    hwRevision: string; // Like "B01"
    serialNumber: string; // Like "00000E9C"
    lastConnected: string; // Like "2019-02-02T06:49:25.550Z"
    skuName: string; // Like "king"
    connected: boolean; // Like true
  };
  hubInfo: string; // Like "20001-0001-A04-30020A57"
  mattressInfo: {
    firstUsedDate: number | null; // Like null
    eightMattress: boolean; // Like false
    brand: string; // Like "IKEA
  };
  firmwareVersion: string; // Like "2.0.6.0"
  lastHeard: string; // Like "2019-02-02T06:49:40.652Z"
  online: boolean; // Like true
}
