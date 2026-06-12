# Documentação da API Atom (Hora Marcada)

Este documento descreve detalhadamente os endpoints, parâmetros e estruturas de dados da API Java do sistema ATOM, baseando-se na especificação Swagger (`swagger.json`).

---

## 1. Autorização
Gerenciamento de autenticação e registro de profissionais.

### POST `/api/auth/register`
**Resumo:** Registrar novo barbeiro.
- **Corpo da Requisição (JSON):** `RegisterRequest`
  - `name` (string, minLength: 1): Nome completo do profissional.
  - `email` (string, minLength: 1): E-mail único para acesso.
  - `password` (string, min 6 caracteres): Senha de acesso.
- **Resposta (200 OK):** `AuthResponse`
  - Retorna o token JWT e dados do barbeiro recém-criado.

### POST `/api/auth/login`
**Resumo:** Login de Barbeiro.
- **Corpo da Requisição (JSON):** `LoginRequest`
  - `email` (string): E-mail cadastrado.
  - `password` (string): Senha cadastrada.
- **Resposta (200 OK):** `AuthResponse`
  - `token` (string): Token JWT para ser usado no header `Authorization: Bearer <token>`.
  - `tokenType` (string): Geralmente "Bearer".
  - `barberId` (number): ID único do barbeiro.
  - `name` (string): Nome do profissional.
  - `email` (string): E-mail do profissional.

---

## 2. Tipos de Serviço
Gerenciamento dos serviços oferecidos pela barbearia (Corte, Barba, etc).

### GET `/api/service-types`
**Resumo:** Lista todos os tipos de serviço.
- **Resposta (200 OK):** Array de `ServiceTypeResponse`.

### POST `/api/service-types`
**Resumo:** Cria um novo tipo de serviço.
- **Corpo da Requisição (JSON):** `ServiceTypeRequest`
  - `name` (string): Nome do serviço.
  - `description` (string): Descrição detalhada.
  - `price` (number, min: 0): Valor do serviço.
  - `durationInMinutes` (integer, min: 1): Duração estimada em minutos.
- **Resposta (200 OK):** `ServiceTypeResponse`.

### GET `/api/service-types/active`
**Resumo:** Lista todos os tipos de serviço ativos.
- **Resposta (200 OK):** Array de `ServiceTypeResponse`. Útil para o fluxo de agendamento do cliente.

### GET `/api/service-types/{id}`
**Resumo:** Busca um tipo de serviço pelo ID.
- **Parâmetros:** `id` (path, integer).
- **Resposta (200 OK):** `ServiceTypeResponse`.

### PUT `/api/service-types/{id}`
**Resumo:** Atualiza um tipo de serviço pelo ID.
- **Parâmetros:** `id` (path, integer).
- **Corpo da Requisição (JSON):** `ServiceTypeRequest`.
- **Resposta (200 OK):** `ServiceTypeResponse`.

### DELETE `/api/service-types/{id}`
**Resumo:** Desativa um tipo de serviço pelo ID.
- **Parâmetros:** `id` (path, integer).
- **Resposta (200 OK):** Confirmação de desativação.

---

## 3. Agendamentos
Gerenciamento de reservas de serviços.

### GET `/api/appointments`
**Resumo:** Lista todos os agendamentos.
- **Resposta (200 OK):** Array de `AppointmentResponse`.

### POST `/api/appointments`
**Resumo:** Cria um novo agendamento.
- **Corpo da Requisição (JSON):** `AppointmentRequest`
  - `customerName` (string): Nome do cliente.
  - `customerPhone` (string): WhatsApp/Telefone do cliente.
  - `serviceTypeId` (number): ID do tipo de serviço.
  - `appointmentDate` (string, formato `YYYY-MM-DD`): Data da reserva.
  - `appointmentTime` (string, formato `HH:MM`): Horário da reserva.
- **Resposta (200 OK):** `AppointmentResponse`.

### GET `/api/appointments/date`
**Resumo:** Busca agendamentos por data.
- **Parâmetros:** `date` (query, string, format: date).
- **Resposta (200 OK):** Array de `AppointmentResponse`.

### GET `/api/appointments/date/scheduled`
**Resumo:** Busca agendamentos marcados (SCHEDULED) por data.
- **Parâmetros:** `date` (query, string, format: date).
- **Resposta (200 OK):** Array de `AppointmentResponse`.

### PATCH `/api/appointments/{id}/complete`
**Resumo:** Conclui um agendamento pelo ID.
- **Parâmetros:** `id` (path, integer).
- **Resposta (200 OK):** `AppointmentResponse` com status `COMPLETED`.

### PATCH `/api/appointments/{id}/cancel`
**Resumo:** Cancela um agendamento pelo ID.
- **Parâmetros:** `id` (path, integer).
- **Resposta (200 OK):** `AppointmentResponse` com status `CANCELLED`.

---

## 4. Horários
Consulta de disponibilidade e agenda do profissional.

### GET `/api/barber/schedule`
**Resumo:** Retorna a agenda completa do barbeiro para uma data específica.
- **Parâmetros:** 
  - `date` (query, string): Data desejada.
  - `status` (query, enum: `SCHEDULED`, `CANCELLED`, `COMPLETED`): Filtro opcional por status.
- **Resposta (200 OK):** `BarberScheduleResponse`
  - `date`: Data consultada.
  - `totalAppointments`: Total de atendimentos no dia.
  - `scheduledAppointments`: Contagem de agendados.
  - `cancelledAppointments`: Contagem de cancelados.
  - `completedAppointments`: Contagem de concluídos.
  - `appointments`: Lista detalhada (`AppointmentResponse[]`).

### GET `/api/appointments/available-times`
**Resumo:** Retorna os horários disponíveis (vagos) para agendamento.
- **Parâmetros:** 
  - `date` (query, string): Data desejada.
  - `serviceTypeId` (query, integer): ID do serviço (influencia na duração e blocos vagos).
- **Resposta (200 OK):** Array de `AvailableTimeResponse`
  - `time` (string): Horário (ex: "09:00").
  - `available` (boolean): Se está livre para reserva.

---

## 5. Schemas Detalhados (Data Models)

### `AuthResponse`
- `token` (string): Token de acesso JWT.
- `tokenType` (string): Tipo do token (ex: "Bearer").
- `barberId` (int64): ID do barbeiro autenticado.
- `name` (string): Nome do profissional.
- `email` (string): E-mail de login.

### `ServiceTypeResponse`
- `id` (int64): Identificador único.
- `name` (string): Nome do serviço.
- `description` (string): Descrição curta.
- `price` (number): Valor monetário.
- `durationInMinutes` (int32): Tempo de execução em minutos.
- `active` (boolean): Status de visibilidade.
- `createdAt`/`updatedAt` (date-time): Timestamps de criação e atualização.

### `AppointmentResponse`
- `id` (int64): Identificador único do agendamento.
- `customerName` (string): Nome do cliente.
- `customerPhone` (string): WhatsApp/Telefone para contato.
- `appointmentDate` (date): Data reservada (YYYY-MM-DD).
- `appointmentTime` (string): Horário reservado (HH:MM).
- `status` (enum): `SCHEDULED`, `CANCELLED`, `COMPLETED`.
- `serviceTypeId` (int64): ID do serviço vinculado.
- `serviceTypeName` (string): Nome por extenso do serviço.
- `servicePrice` (number): Preço cobrado.
- `serviceDurationInMinutes` (int32): Duração do serviço em minutos.

### `BarberScheduleResponse`
- `date` (date): Data da agenda consultada.
- `totalAppointments` (int32): Soma de todos os atendimentos no dia.
- `scheduledAppointments` (int32): Total com status `SCHEDULED`.
- `cancelledAppointments` (int32): Total com status `CANCELLED`.
- `completedAppointments` (int32): Total com status `COMPLETED`.
- `appointments` (array): Lista de objetos `AppointmentResponse`.

### `AvailableTimeResponse`
- `time` (string): Horário sugerido (ex: "10:30").
- `available` (boolean): Indica se o bloco está livre para nova reserva.
