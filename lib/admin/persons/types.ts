import { Person } from "@prisma/client";

export type PersonOption = { value: string; label: string };

export type CreatePersonData = Omit<
  Person,
  | "id"
  | "createdAt"
  | "updatedAt"
  | "sortName_search"
  | "name_search"
  | "aliasesSearch"
>;
export type UpdatePersonData = Omit<
  Person,
  | "createdAt"
  | "updatedAt"
  | "sortName_search"
  | "name_search"
  | "aliasesSearch"
>;
