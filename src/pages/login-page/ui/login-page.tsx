import { axiosInstance, routes } from '@/shared'
import { SESSION_STORAGE } from '@/shared/types/storage'
import CloseIcon from '@mui/icons-material/Close'
import { IconButton, Snackbar, SnackbarCloseReason } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useFormik } from 'formik'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { validationSchema, ValidationSchemaType } from '../lib/validationSchema'
import { Card, SignInContainer } from './Containers'

export default function LogInPage() {
  const navigate = useNavigate()

  const [isSnackBarOpen, setIsSnackBarOpen] = useState(false)

  const handleSubmit = async ({ email, password }: ValidationSchemaType) => {
    try {
      await axiosInstance.post('login', {
        email,
        password,
      })

      // placeholder in order not to implemet auth flow
      sessionStorage.setItem(SESSION_STORAGE.IS_LOGGED_IN, 'true')
      navigate(routes.MAP, { replace: true })
    } catch (e) {
      console.error(e)
      setIsSnackBarOpen(true)
    }
  }

  const handleSnackBarClose = (
    _: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === 'clickaway') {
      return
    }

    setIsSnackBarOpen(false)
  }

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: handleSubmit,
  })

  const action = (
    <IconButton
      size="small"
      aria-label="close"
      color="inherit"
      onClick={handleSnackBarClose}
    >
      <CloseIcon fontSize="small" />
    </IconButton>
  )

  return (
    <Box>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            Log in
          </Typography>
          <Box
            component="form"
            onSubmit={formik.handleSubmit}
            noValidate
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              gap: 2,
            }}
          >
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                id="email"
                type="email"
                name="email"
                placeholder="your@email.com"
                autoComplete="email"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={formik.errors.email ? 'error' : 'primary'}
                sx={{ ariaLabel: 'email' }}
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
            </FormControl>
            <FormControl>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <FormLabel htmlFor="password">Password</FormLabel>
              </Box>
              <TextField
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="current-password"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={formik.errors.password ? 'error' : 'primary'}
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
              />
            </FormControl>
            <Button type="submit" fullWidth variant="contained">
              Sign in
            </Button>
          </Box>
        </Card>
      </SignInContainer>
      <Snackbar
        open={isSnackBarOpen}
        autoHideDuration={6000}
        onClose={handleSnackBarClose}
        message="Invalid user or password"
        action={action}
      />
    </Box>
  )
}
