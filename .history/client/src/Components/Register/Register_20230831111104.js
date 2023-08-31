import React from 'react';
import styles from './Register.module.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


function Register() {
  const navigate = useNavigate();
  const [check, setCheck]=useState(true)
  const [user, setUser]=useState({
    name:'',
    email:'',
    password:'',
  });
  const handleChange =(event)=>{
    setUser({
      ...user,
      [event.target.name]:event.target.value
    });
  };
  const register=(event)=>{
    event.preventDefault();
    axios.post('http://localhost:4000/register', user)
    .then(res=>{
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', res.data.name);
      const tokenData=localStorage.getItem('token');
      if(tokenData!=='undefined'){
        setCheck(true);
        navigate('/recording')
      }
      else{
        setCheck(false);
      }
    })
  }
  return (
    <div className={styles.container}>
      <h1>REGISTER TO CONTINUE</h1>
      <div className={styles.registerContainer}>
        <form style={{ width:'100%', display:'flex', flexDirection:'column'}}>

            <div style={{marginBottom:'1rem', width:'70%', display:'flex', justifyContent:'space-between'}}>
              <label htmlFor="name">Name :</label>
              <input type="text" name='name' value={user.name} onChange={handleChange}  placeholder='Name' style={{width:'60%',marginLeft:'2rem' }} />
            </div>

            <div style={{marginBottom:'1rem', width:'70%', display:'flex', justifyContent:'space-between'}}>
              <label htmlFor="email">Email :</label>
              <input type="email" name='email' value={user.email} onChange={handleChange}  placeholder='Email' style={{width:'60%',marginLeft:'2rem' }} />
            </div>
            
            <div style={{marginBottom:'1rem', width:'70%', display:'flex', justifyContent:'space-between'}}>
              <label htmlFor="password">Password :</label>
              <input type="password" name='password' value={user.password} onChange={handleChange}  placeholder='Password' style={{width:'60%',marginLeft:'2rem' }} />
            </div>

            <span style={{marginBottom:'1.5rem'}}>Already have an account?<button style={{background:'none', color:'#36416A', fontSize:'medium', marginLeft:0, padding:0, width:'4rem', cursor:'pointer', border:'none', textDecoration:'underline'}} onClick={()=>{navigate('/')}}>Log In</button> </span>

            <div>
              <button className={styles.button} onClick={register} type='submit'> Register</button>
            </div>
            {
              !check && (<p>Account already exist, Please login</p>)
            }
        </form>
        
      </div>
    </div>
  )
}

export default Register