import { ActionError } from '@/types/actions';

export function unauthorizedResponse(): ActionError {
  return {
    isError: true,
    status: 'unauthorized',
    httpStatus: 401,
    message: 'Musisz być zalogowany',
  };
}

export function serverErrorResponse(): ActionError {
  return {
    isError: true,
    status: 'server_error',
    httpStatus: 500,
    message: 'Wystąpił błąd serwera przy zapisie danych.',
  };
}

export function forbiddenResponse(message = 'Brak dostępu'): ActionError {
  return {
    isError: true,
    status: 'forbidden',
    httpStatus: 403,
    message,
  };
}

export function notFoundResponse(entity = 'element'): ActionError {
  return {
    isError: true,
    status: 'not_found',
    httpStatus: 404,
    message: `Nie znaleziono ${entity}`,
  };
}
