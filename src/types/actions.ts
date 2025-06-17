export interface FieldError {
  field: string;
  message: string;
}

export interface ActionSuccess<TDataType> {
  isError: false;
  status?: 'success';
  httpStatus?: 200;
  message?: string;
  data?: TDataType;
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
    | 'unknown_error'
    | 'cloudinary_error';
  httpStatus?: number; // np. 401, 422, 409, 500, itd.
  message?: string;
  fieldErrors?: FieldError[];
}

export type ActionResult<TDataType = void> =
  | ActionSuccess<TDataType>
  | ActionError;

export interface Action<TArgs extends unknown[] = [], TDataType = void> {
  (...args: TArgs): Promise<ActionResult<TDataType>>;
}
