export function ok(res, data, message = 'Success') {
  return res.json({ success: true, message, data });
}

export function created(res, data, message = 'Created') {
  return res.status(201).json({ success: true, message, data });
}

export function fail(res, statusCode, message) {
  return res.status(statusCode).json({ success: false, message });
}

