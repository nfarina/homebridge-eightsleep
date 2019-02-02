import {
  LoginResult,
  UserResult,
  DeviceResult,
  HeatingRequest,
  HeatingResult,
} from "./types";

const fetch = require("node-fetch");

const API_URL = "https://app-api.8slp.net/v1";

async function api<T>({
  method = "GET",
  path,
  body,
  token,
}: {
  method?: string;
  path: string;
  body?: Object;
  token?: string;
}): Promise<any> {
  const url = API_URL + "/" + path;

  const response = await fetch(url, {
    method,
    ...(body ? { body: JSON.stringify(body) } : null),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { "Session-Token": token } : null),
    },
  });

  if (!response.ok) {
    throw new Error(
      `Error from Eight API: ${response.status} ${response.statusText}`,
    );
  }

  return (await response.json()) as T;
}

export async function login({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<LoginResult> {
  return await api<LoginResult>({
    method: "POST",
    path: "login",
    body: { email, password },
  });
}

export async function getMe({ token }: { token: string }): Promise<UserResult> {
  return await api<UserResult>({ path: "users/me", token });
}

export async function getDevice({
  token,
  deviceId,
}: {
  token: string;
  deviceId: string;
}): Promise<DeviceResult> {
  return await api<DeviceResult>({ path: `devices/${deviceId}`, token });
}

export async function setHeating({
  token,
  deviceId,
  request,
}: {
  token: string;
  deviceId: string;
  request: HeatingRequest;
}): Promise<DeviceResult> {
  return await api<HeatingResult>({
    method: "PUT",
    path: `devices/${deviceId}`,
    token,
    body: request,
  });
}
