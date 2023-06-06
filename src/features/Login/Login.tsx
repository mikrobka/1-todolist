import React from 'react'
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {useFormik} from "formik";







export const Login = () => {


    type FormikErrorType = {
        email?: string
        password?: string
        rememberMe?: boolean
    }

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            rememberMe: false
        },
        onSubmit: values => {
            alert(JSON.stringify(values, null, 2));
        },
        validate: (values) => {
            const errors: FormikErrorType = {}

            if (!values.email) {
                errors.email = 'Required'
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
                errors.email = 'Invalid email address'
            }

            if (!values.password) {
                errors.password = 'Required'
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.password)) {
                errors.password = 'Invalid password '
            }

            return errors
        }
    });




    return <Grid container justifyContent={'center'}>
        <Grid item justifyContent={'center'}>
            <form onSubmit={formik.handleSubmit}>
                <FormControl>
                    <FormLabel>
                        <p>To log in get registered
                            <a href={'https://social-network.samuraijs.com/'}
                               target={'_blank'} rel="noreferrer"> here
                            </a>
                        </p>
                        <p>or use common test account credentials:</p>
                        <p>Email: free@samuraijs.com</p>
                        <p>Password: free</p>
                    </FormLabel>
                    <FormGroup>
                        <TextField
                            label="Email"
                            name="email"
                            margin="normal"
                            value={formik.values.email}
                            onChange={formik.handleChange}/>
                        {formik.errors.email ? <div style={{color:'red'}}>{formik.errors.email}</div> : null}
                        <TextField
                            label="Password"
                            name="password"
                            type="password"
                            value={formik.values.password}
                            margin="normal"
                            onChange={formik.handleChange}
                        />
                        {formik.errors.password ? <div style={{color:'red'}}>{formik.errors.password}</div> : null}

                        <FormControlLabel label={'Remember me'} control={<Checkbox name={'rememberMe'} checked={formik.values.rememberMe} onChange={formik.handleChange}/>}/>
                        <Button type={'submit'} variant={'contained'} color={'primary'}>
                            Login
                        </Button>
                    </FormGroup>
                </FormControl>
            </form>
        </Grid>
    </Grid>
}


