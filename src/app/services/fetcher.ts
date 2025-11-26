export const fetcher = async <T>(
  input: RequestInfo,
  init?: RequestInit
): Promise<T> => {
  try {
    const response = await fetch(input, init);
    const body = await response.json();

    if (!response.ok) {
      const err = new Error(body.error);
      throw err;
    }

    return body;
  } catch (err) {
    throw err;
  }
};
