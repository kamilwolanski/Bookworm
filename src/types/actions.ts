export interface FieldError {
  field: string;
  message: string;
}

export interface ActionSuccess {
  isError: false;
  status?: 'success';
  httpStatus?: 200;
  message?: string;
}

export interface ActionError {
  isError: true;
  status:
    | 'unauthorized'
    | 'validation_error'
    | 'conflict'
    | 'not_found'
    | 'server_error'
    | 'forbidden'
    | 'unknown_error';
  httpStatus?: number; // np. 401, 422, 409, 500, itd.
  message?: string;
  fieldErrors?: FieldError[];
}

export type ActionResult = ActionSuccess | ActionError;

export interface Action {
  (currentState: unknown, formData: FormData): Promise<ActionResult>;
}
