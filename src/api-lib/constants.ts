const absenceSchema = {
  type: 'object',
  properties: {
    from: { type: 'string', format: 'Date' }, // ISO 8601 date strings
    till: { type: 'string', format: 'Date', nullable: true } // Optional field
  },
  required: ['from'],
  additionalProperties: false
}

const bookingSchema = {
  type: 'object',
  properties: {
    user: { type: 'string' },
    workingPlace: { type: 'string' }
  },
  required: ['user', 'workingPlace']
}

export const ValidateProps = {
  user: {
    username: { type: 'string', minLength: 3, maxLength: 20 },
    name: { type: 'string', minLength: 1, maxLength: 50 },
    password: { type: 'string', minLength: 8 },
    email: { type: 'string', minLength: 1 },
    bio: { type: 'string', minLength: 0, maxLength: 160 },
    createdAt: { type: 'string', format: 'Date' },
    isAdmin: { type: 'boolean' },
    absences: {
      type: 'array',
      items: absenceSchema
    }
  },
  post: {
    content: { type: 'string', minLength: 1, maxLength: 280 }
  },
  comment: {
    content: { type: 'string', minLength: 1, maxLength: 280 }
  },
  workingPlace: {
    name: { type: 'string', minLength: 3, maxLength: 20 },
    displayName: { type: 'string', minLength: 3, maxLength: 20 },
    pcName: { type: 'string', minLength: 4, maxLength: 50 },
    createdAt: { type: 'string', format: 'Date' }
  },
  dayBooking: {
    // date: { type: 'string', format: 'Date' },
    // bookings: {
    //   type: 'array',
    //   items: bookingSchema
    // }
  }
}
