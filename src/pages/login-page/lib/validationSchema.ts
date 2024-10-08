import * as yup from 'yup'

const MIN_PASSWORD_LENGTH = 6

export type ValidationSchemaType = yup.InferType<typeof validationSchema>

export const validationSchema = yup.object({
  email: yup
    .string()
    .email('Enter a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .min(
      MIN_PASSWORD_LENGTH,
      ({ min }) => `Password should be of minimum ${min} characters length`,
    )
    .required('Password is required'),
})
