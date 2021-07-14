import React, { useLayoutEffect } from 'react'
import {useFormik} from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import Cookies from 'universal-cookie';
import { useHistory } from "react-router-dom";

const API_URL = 'http://localhost:1337'

const Login = () =>{
  const history = useHistory();
  const cookies = new Cookies();

  useLayoutEffect(() => {
    if(cookies.get('jwt')){
      history.push('/dashboard')
    }
  }, []);

  const {handleSubmit, handleChange, values, touched, errors, handleBlur} = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: Yup.object({
      email: Yup.string().max(20, 'email must be shortet than 20 char').required('Required'),
      password: Yup.string().min(6, 'Password should be longer tan 6 characters').required()
    }),
    onSubmit: async ({email, password}) =>{
      await axios.post(`${API_URL}/auth/local`, {
        identifier: email,
        password: password
      })
      .then(res =>{
        cookies.set('jwt', res.data.jwt, { time: '7d', path: '/' })
        cookies.set('user', res.data.user, { time: '7d', path: '/' })
        history.push('/dashboard')
      })
      .catch(err =>{
        console.log(err)
      })
    }
  })

  return(
    <form onSubmit={handleSubmit}>
      <input
        value={values.email}
        onChange={handleChange}
        onBlur={handleBlur}
        type="text"
        name="email"
        placeholder="enter email"
      />
      {touched.email && errors.email ? (
        <div>{errors.email}</div>
      ): null}
      <input
        value={values.password}
        onChange={handleChange}
        onBlur={handleBlur}
        type="password"
        name="password"
        placeholder="enter password"
      />
      {touched.password && errors.password ? (
        <div>{errors.password}</div>
      ): null}
      <input type="submit" value="login" />
    </form>
  )
}

export default Login