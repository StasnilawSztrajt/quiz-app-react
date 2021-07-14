import React, {useLayoutEffect} from 'react'
import {useFormik} from 'formik'
import * as Yup from 'yup'
import { useHistory } from "react-router-dom";
import Cookies from 'universal-cookie';

const API_URL = 'http://localhost:1337'

const Dashboard = () =>{
  const history = useHistory();
  const cookies = new Cookies();

  useLayoutEffect(() => {
    if(cookies.get('jwt')){
      history.push('/dashboard')
    }
  }, []);


  const {handleSubmit, handleChange, values, touched, errors, handleBlur} = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      repeatPassword: ''
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .max(15, 'username must be shorted than 15')
        .min(6, 'username must be longer than 6 characters')
        .required('Required'),
      email: Yup.string()
        .max(20, 'email must be shortet than 20 char')
        .min(6, 'email must be longer than 6 characters')
        .required('Required'),
      password: Yup.string()
        .max(20, 'Passwsord must be shortet than 20 char')
        .min(6, 'Password should be longer tan 6 characters')
        .required('Required'),
      repeatPassword: Yup.string()
        .max(20, 'Password must be shortet than 20 char')
        .min(6, 'Password should be longer tan 6 characters')
        .required('Required')
    }),
    onSubmit: async ({username, email, password, repeatPassword}) =>{
      if(password !== repeatPassword) {
        return alert('password does not repeat')
      }

      const user = {
        username: username,
        email: email,
        password: password,
      }

      const registerResponse = await fetch(`${API_URL}/auth/local/register`, {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
      })

      const registerResponseJSON = await registerResponse.json();
      try{
        if(registerResponseJSON.message[0].messages[0].message === "Email already taken"){
          return console.log('Username already taken')
        }
        else{
          return console.log('Email already taken')
        }
      }
      catch(err){
        history.push('dashboard')
      }
    }
  })


  return(
    <form onSubmit={handleSubmit}>
      <input
        value={values.username}
        onChange={handleChange}
        onBlur={handleBlur}
        name="username"
        type="text"
        placeholder="enter username"
      />
      {touched.username && errors.username ? (
        <div>{errors.username}</div>
      ): null}
      <input
        value={values.email}
        onChange={handleChange}
        onBlur={handleBlur}
        name="email"
        type="email"
        placeholder="enter email"
      />
      {touched.email && errors.email ? (
        <div>{errors.email}</div>
      ): null}
      <input
        value={values.password}
        onChange={handleChange}
        onBlur={handleBlur}
        name="password"
        type="password"
        placeholder="enter passwsord"
      />
      {touched.passwsord && errors.passwsord ? (
        <div>{errors.passwsord}</div>
      ): null}
      <input
        value={values.repeatPassword}
        onChange={handleChange}
        onBlur={handleBlur}
        name="repeatPassword"
        type="password"
        placeholder="repeat password"
      />
      {touched.repeatPasswsord && errors.repeatPasswsord ? (
        <div>{errors.repeatPasswsord}</div>
      ): null}
      <input type="submit" val
      ue="register" />
    </form>
  )
}

export default Dashboard