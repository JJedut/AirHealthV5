# AirHealthV5

<img width="1919" height="945" alt="Zrzut ekranu 2026-08-09 165109" src="https://github.com/user-attachments/assets/23df4bf5-8079-4d00-a7d5-2c7bca0f5b62" />
<img width="1919" height="946" alt="Zrzut ekranu 2026-08-09 165126" src="https://github.com/user-attachments/assets/dfb6acb0-69f0-4eeb-bc76-53317541764d" />

AirHealthV5 is a full-stack air quality monitoring platform. IoT devices push sensor readings (temperature, humidity, particulate matter, CO2, etc.) to a REST API, and users can view live readings, historical charts, and configure per-sensor warning/critical thresholds through an Angular web dashboard.

The solution is split into two projects that share a single Visual Studio solution file:

- **`AirHealthV5.Server`** – ASP.NET Core 8 Web API (backend)
- **`airhealthv5.client`** – Angular 18 single-page application (frontend)

## Features

- **User accounts & authentication** — registration/login with JWT bearer tokens, plus an admin account seeded on startup.
- **Device management** — register, list, and delete devices tied to a user account.
- **API keys** — generate and revoke per-device API keys used to authenticate sensor data ingestion.
- **Sensor data ingestion** — devices POST arbitrary sensor readings (stored as a flexible `sensor name → value` map) with a timestamp.
- **Dashboard & charts** — view the latest reading per device, browse historical readings in a table, and visualize trends on charts.
- **Configurable thresholds** — set min/max and critical min/max values per sensor type, used to flag readings that are out of a healthy range.
- **Custom sensor ordering** — persist a user's preferred display order for a device's sensors.

## Tech stack

**Backend**
- ASP.NET Core 8 (Web API)
- Entity Framework Core 8 + SQL Server
- MediatR (CQRS-style commands/queries)
- JWT Bearer authentication
- Swagger / OpenAPI (available in development)

**Frontend**
- Angular 18
- Angular Material & Taiga UI component libraries
- Bootstrap 5
- RxJS

## API overview

All endpoints are prefixed with `/api`.

| Controller | Method & Route | Description |
|---|---|---|
| Auth | `POST /api/Auth/login` | Authenticate a user and issue a JWT |
| Auth | `POST /api/Auth/register` | Register a new user |
| Device | `POST /api/Device/Add` | Register a new device |
| Device | `GET /api/Device/GetDevicesByUserId` | List devices for a user |
| Device | `GET /api/Device/GetDeviceById` | Get a single device |
| Device | `DELETE /api/Device/DeleteDevice` | Remove a device |
| Device | `GET /api/Device/GetSensorOrderByUserId/{userId}` | Get saved sensor display order |
| Device | `POST /api/Device/SaveSensorOrder` | Save sensor display order |
| Device | `POST /api/Device/Thresholds` | Set sensor thresholds for a device |
| Device | `GET /api/Device/GetThresholdsByDeviceId/{deviceId}` | Get thresholds for a device |
| SensorData | `POST /api/SensorData` | Ingest a new sensor reading from a device |
| SensorData | `GET /api/SensorData/GetSensorDataChart` | Get chart-ready historical data |
| SensorData | `GET /api/SensorData/GetSensorDataTable` | Get tabular historical data |
| SensorData | `GET /api/SensorData/GetLatestSensorReading` | Get the most recent reading for a device |
| User | `PUT /api/User/UpdateUser` | Update user profile |
| User | `DELETE /api/User/DeleteUser` | Delete a user |
| User | `POST /api/User/GenerateApiKey` | Generate a new device API key |
| User | `GET /api/User/ApiKeys` | List a user's API keys |
| User | `DELETE /api/User/DeleteDeviceApiKey` | Revoke a device API key |

Interactive API documentation (Swagger UI) is available at `/swagger` when running the server in the `Development` environment.
