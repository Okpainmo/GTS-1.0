import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import { db } from '../firebase/firebaseConfig';
import {
  doc,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  setDoc,
} from 'firebase/firestore';
import { Toaster, toast } from 'react-hot-toast';

function LoginPage() {
  const router = useRouter();

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });

  const logInUser = async (e) => {
    e.preventDefault();
    console.log(process.env.NEXT_PUBLIC_GTS_FIREBASE_API_KEY);

    console.log(loginForm);
    if (loginForm.email === '' || loginForm.password === '') {
      return toast.error('please fill in all fields', { duration: 3000 });
    }

    const toastId = toast.loading('logging in...');

    try {
      //  get all users from firebase

      const usersCollectionRef = collection(db, 'users');
      const usersCollection = await getDocs(usersCollectionRef);

      console.log(usersCollection.docs);

      const usersData = usersCollection.docs.map((each) => {
        return each.data();
      });

      console.log(usersData);

      if (usersCollection) {
        toast.success('login successful', {
          id: toastId,
          duration: 4000,
        });

        setTimeout(() => {
          router.push('/locate-motorist');
        }, 1000);
      }
    } catch (error) {
      console.log(error);
      toast.error(
        'login failed... please try again with correct credentials or check you network',
        {
          id: toastId,
          duration: 4000,
        }
      );
    }
  };

  return (
    <>
      <Head>
        <title>GTS 1.0 - log in</title>
      </Head>
      <Toaster />
      <main className='login-page pt-12 pb-16 my-20 sm:my-32 mx-3 px-3 rounded border sm:w-[400px] sm:mx-auto'>
        <div className='flex flex-col sm:px-3 gap-8'>
          {/* <Link href='/'> */}
          <div className='logo-wrapper text-purple-800 text-xl sm:text-3xl text-center'>
            <span className='font-bold poppins'>GTS-1.0/login</span>
            <p className='mt-2 text-[14px] w-full mx-auto leading-7 text-center'>
              <span className='text-black'>
                Please provide your user credentials to log in
              </span>
            </p>
          </div>
          {/* </Link> */}
          <form>
            <div className='input-group flex flex-col mb-6 text-[12px] sm:text-[14px]'>
              <label htmlFor='email'>Email</label>
              <input
                className='mt-2 px-3 py-2 border outline-none rounded'
                type='email'
                required
                placeholder='please input your username'
                value={loginForm.email}
                onChange={(e) => {
                  setLoginForm({
                    ...loginForm,
                    email: e.target.value,
                  });
                }}
                id='email'
              />
            </div>
            <div className='input-group flex flex-col mb-6 text-[12px] sm:text-[14px]'>
              <label htmlFor='username'>Password</label>
              <input
                className='mt-2 px-3 py-2 border outline-none rounded'
                type='password'
                required
                placeholder='please input your password'
                value={loginForm.password}
                onChange={(e) => {
                  setLoginForm({
                    ...loginForm,
                    password: e.target.value,
                  });
                }}
                id='password'
              />
            </div>
            <button
              type='button'
              onClick={logInUser}
              className='submit text-center bg-green-500 py-3 text-[12px] sm:text-[14px] text-white rounded w-full'
            >
              Submit
            </button>
            <p className='text-center text-[12px] sm:text-[14px] mt-4'>
              New to Journie?{' '}
              <Link href='/sign-up' className='underline text-purple-800'>
                sign-up instead
              </Link>{' '}
            </p>
          </form>
        </div>
      </main>
    </>
  );
}

export default LoginPage;
