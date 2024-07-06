const absenceSchema = {
  type: 'object',
  properties: {
    from: { type: 'Date' }, // Assuming ISO 8601 date strings
    till: { type: 'Date', nullable: true } // Optional field
  },
  required: ['from'],
  additionalProperties: false
}

export const ValidateProps = {
  user: {
    username: { type: 'string', minLength: 3, maxLength: 20 },
    name: { type: 'string', minLength: 1, maxLength: 50 },
    password: { type: 'string', minLength: 8 },
    email: { type: 'string', minLength: 1 },
    bio: { type: 'string', minLength: 0, maxLength: 160 },
    createdAt: { type: 'Date' },
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
  }
}
