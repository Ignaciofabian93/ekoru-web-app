import api from "./client";

export type ContactPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export type ContactResponse = { success: boolean };

export async function SendContactMessage(payload: ContactPayload) {
  const { data } = await api.post<ContactResponse>("/contact", payload);
  return data;
}
