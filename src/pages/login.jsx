import { useState } from 'react';
import { Link } from "react-router-dom";
import { IoIosWarning } from 'react-icons/io';
import InputForm from '../components/inputForm';
import Button from '../components/button';
import Modal from '../components/modal';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, signInWithGoogle, regisNewUser } from '../firebase';
import GoogleButton from '../components/googleButton';


export default function Login() {
  const [isRegister, setIsRegister] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  function handleChangeMode(e){
    e.preventDefault();
    setIsRegister(!isRegister);
  }

  async function handleLoginSubmit(e) {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = "/todo";
    } catch (err) {
      document.getElementById('error_modal').showModal();
    }
  }

  async function handleRegisterSubmit(e){
    e.preventDefault();
    try {
      await regisNewUser(e, auth, email, password, username);
    }
    catch (err){
      document.getElementById('error_modal').showModal();
    }
  }

  async function handleGoogleSubmit(e){
    e.preventDefault();
    try{
      await signInWithGoogle(e);
    } catch (err){
      alert(err);
    }
  }

  return (
    <>
      <div className="flex justify-center items-center h-screen w-screen">
        <div style={{ borderColor: "#788CDE" }} className="border-t-8 rounded-sm bg-white p-9 shadow-2xl w-96">
          
            {isRegister ? (<>
              <form className='flex flex-col gap-4'>
              <h1 className="font-bold text-center block text-2xl">Sign Up</h1>
              <InputForm type={"email"} value={email} label={"Email Address"} onChange={(e) => setEmail(e.target.value)} />
            <InputForm type={"password"} value={password} label={"Password"} onChange={(e) => setPassword(e.target.value)} />
            <InputForm type={"text"} value={username} label={"Username"} onChange={(e) => setUsername(e.target.value)} />
            <Link to="/todo">
              <Button value="Sign up" handleSubmit={handleRegisterSubmit} />
            </Link>     
             <GoogleButton text = {'Sign up'} onClick ={handleGoogleSubmit} />
              <label className='flex justify-center gap-2'>Have an account?<button className='underline' onClick={handleChangeMode}>Login</button></label></form></>):(<>
                <form className='flex flex-col gap-4'>
              <h1 className="font-bold text-center block text-2xl">Log in</h1>
              <InputForm type={"email"} value={email} label={"Email Address"} onChange={(e) => setEmail(e.target.value)} />
            <InputForm type={"password"} value={password} label={"Password"} onChange={(e) => setPassword(e.target.value)} />
            <Link to="/todo">
              <Button value="Login" handleSubmit={handleLoginSubmit} />
            </Link>
            <GoogleButton text = {'Sign in'}onClick ={handleGoogleSubmit} />
            <label className='flex justify-center gap-2'>Don't have an account?<button className='underline' onClick={handleChangeMode}>Register now</button></label>
            </form></>)}
        </div>
      </div>

      <Modal id = "error_modal" title={"Error"} desc={"Invalid Credentials."} />
    </>
  );
}
