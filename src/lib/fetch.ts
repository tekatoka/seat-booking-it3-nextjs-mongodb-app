// src/lib/fetch.js
export const fetcher = (
  ...args: [input: RequestInfo, init?: RequestInit]
): Promise<any> => {
  return fetch(...args).then(async res => {
    let payload
    try {
      if (res.status === 204) return null // 204 does not have body
      payload = await res.json()
    } catch (e) {
      // noop
    }
    if (res.ok) {
      return payload
    } else {
      const error = new Error(
        payload?.error?.message || 'Irgendwas ist schief gelaufen'
      )
      ;(error as any).response = payload
      throw error
    }
  })
}
