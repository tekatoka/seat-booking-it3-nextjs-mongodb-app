import { NextApiRequest, NextApiResponse } from 'next'

export const ncOpts = {
  onError(err: any, req: NextApiRequest, res: NextApiResponse) {
    console.error(err)

    // Ensure err.status is a number and is within the HTTP status code range
    res.statusCode =
      typeof err.status === 'number' && err.status >= 100 && err.status < 600
        ? err.status
        : 500

    // Send a JSON response with the error message
    res.json({ message: err.message || 'An unexpected error occurred' })
  }
}
