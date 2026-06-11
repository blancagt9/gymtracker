exports.handler = async (event) => {
  const CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: CORS, body: '' };
  }

  if (!event.body) {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'No body' }) };
  }

  let parsed;
  try {
    parsed = JSON.parse(event.body);
  } catch(e) {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Invalid JSON: ' + e.message }) };
  }

  const { url, method, body } = parsed;
  const TOKEN = 'ntn_t68999643854yfCRksN6Xc6EsobMZeVqOKrmXtvQLqg7p9';

  try {
    const fetchOptions = {
      method: method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
        'Authorization': 'Bearer ' + TOKEN
      }
    };
    if (body && method !== 'GET') {
      fetchOptions.body = JSON.stringify(body);
    }

    const res = await fetch(url, fetchOptions);
    const text = await res.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch(e) {
      return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: 'Notion returned non-JSON: ' + text.slice(0, 200) }) };
    }

    return {
      statusCode: res.status,
      headers: { ...CORS, 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    };
  } catch(e) {
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: e.message }) };
  }
};
