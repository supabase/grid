export const postAndWait = async (
  url: string,
  data: any,
  options = {},
  headers = {}
) => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...headers,
      },
      body: JSON.stringify(data),
      ...options,
    });
    console.log('postAndWait response', response);

    const json = await response.json();
    return json;
  } catch (error) {
    return { error };
  }
};
