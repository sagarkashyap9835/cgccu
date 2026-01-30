


// import React, { useContext, useState, useEffect } from 'react';
// import { AppContext } from './Appcontext';
// import axios from "axios";
// import { toast, ToastContainer } from 'react-toastify';
// import { useNavigate } from 'react-router-dom';
// import 'react-toastify/dist/ReactToastify.css';
// import { GoogleLogin } from '@react-oauth/google';

// const Login = () => {
//   const navigate = useNavigate();
//   const { backendUrl, token, setToken } = useContext(AppContext);

//   const [state, setState] = useState('Sign Up'); // Sign Up / Login toggle
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   // Handle form submission
//   const onSubmitHandler = async (event) => {
//     event.preventDefault();

//     try {
//       if (state === 'Sign Up') {
//         const { data } = await axios.post(`${backendUrl}/api/user/register`, { name, email, password });
//         if (data.success) {
//           toast.success(data.message);
//           localStorage.setItem('token', data.token);
//           setToken(data.token);
//         }
//       } else {
//         const { data } = await axios.post(`${backendUrl}/api/user/login`, { email, password });
//         if (data.success) {
//           toast.success(data.message);
//           localStorage.setItem('token', data.token);
//           setToken(data.token);
//         }
//       }
//     } catch (error) {
//       console.error(error); // For debugging

//       // Check backend response
//       if (error.response && error.response.data && error.response.data.message) {
//         toast.error(error.response.data.message);
//       } else {
//         toast.error(error.message || "Something went wrong");
//       }
//     }
//   };

//   const signInWithGoogle = async (credentialResponse) => {
//     try {
//       const { data } = await axios.post(`${backendUrl}/api/user/google-login`, {
//         token: credentialResponse.credential,
//       });

//       if (data.success) {
//         toast.success(data.message);
//         localStorage.setItem('token', data.token);
//         setToken(data.token);
//       }
//     } catch (error) {
//       console.error(error);

//       if (error.response && error.response.data && error.response.data.message) {
//         toast.error(error.response.data.message);
//       } else {
//         toast.error(error.message || "Something went wrong");
//       }
//     }
//   };

//   // Redirect if already logged in
//   useEffect(() => {
//     if (token) navigate('/');
//   }, [token, navigate]);

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
//       <form
//         onSubmit={onSubmitHandler}
//         className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md"
//       >
//         <h2 className="text-2xl font-bold mb-1 text-center">
//           {state === 'Sign Up' ? 'Create Account' : 'Login'}
//         </h2>
//         <p className="text-gray-500 text-sm mb-6 text-center">
//           Please {state === 'Sign Up' ? 'create an account' : 'login'} to order electrical appliances
//         </p>

//         {/* Full Name for Sign Up */}
//         {state === 'Sign Up' && (
//           <div className="mb-4">
//             <label className="block text-gray-700 mb-1 text-[16px] font-medium">Full Name</label>
//             <input
//               type="text"
//               className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               required
//             />
//           </div>
//         )}

//         {/* Email */}
//         <div className="mb-4">
//           <label className="block text-gray-700 mb-1 text-[16px] font-medium">Email</label>
//           <input
//             type="email"
//             className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//         </div>

//         {/* Password */}
//         <div className="mb-6">
//           <label className="block text-gray-700 mb-1 text-[16px] font-medium">Password</label>
//           <input
//             type="password"
//             className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
//             placeholder="Password must be at least 8 characters"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </div>

//         {/* Submit Button */}
//         <button
//           type="submit"
//           className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
//         >
//           {state === 'Sign Up' ? 'Create Account' : 'Login'}
//         </button>

//         {/* Toggle Sign Up / Login */}
//         <p className="text-sm text-center mt-4 text-gray-600">
//           {state === 'Sign Up' ? (
//             <>
//               Already have an account?{' '}
//               <span className="text-blue-600 cursor-pointer" onClick={() => setState('Login')}>
//                 Login here
//               </span>
//             </>
//           ) : (
//             <>
//               Don't have an account?{' '}
//               <span className="text-blue-600 cursor-pointer" onClick={() => setState('Sign Up')}>
//                 Create an account
//               </span>
//             </>
//           )}
//         </p>
//       </form>

//       <GoogleLogin
//     onSuccess={(credentialResponse) => {
//       signInWithGoogle(credentialResponse);
//     }}
//     onError={() => {
//       console.log("Login Failed");
//     }}
//   />

//       {/* Toast container */}
//       <ToastContainer position="top-center" autoClose={2000} theme="colored" />
//     </div>
//   );
// };

// export default Login;


import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from './Appcontext';
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const navigate = useNavigate();
  const { backendUrl, token, setToken } = useContext(AppContext);

  const [state, setState] = useState('Sign Up');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const endpoint = state === 'Sign Up' ? '/api/user/register' : '/api/user/login';
      const payload = state === 'Sign Up' ? { name, email, password } : { email, password };

      const { data } = await axios.post(backendUrl + endpoint, payload);
      if (data.success) {
        toast.success(data.message);
        localStorage.setItem('token', data.token);
        setToken(data.token);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Jab token update hoga, user automatically home '/' par chala jayega
  useEffect(() => {
    if (token) navigate('/');
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <form onSubmit={onSubmitHandler}>
          <h2 className="text-2xl font-bold mb-1 text-center">
            {state === 'Sign Up' ? 'Create Account' : 'Login'}
          </h2>
          <p className="text-gray-500 text-sm mb-6 text-center">
            Please {state === 'Sign Up' ? 'create an account' : 'login'} to order electrical appliances
          </p>

          {state === 'Sign Up' && (
            <div className="mb-4">
              <label className="block text-gray-700 mb-1 font-medium">Full Name</label>
              <input type="text" className="w-full px-4 py-2 border rounded-lg focus:ring" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-700 mb-1 font-medium">Email</label>
            <input type="email" className="w-full px-4 py-2 border rounded-lg focus:ring" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-1 font-medium">Password</label>
            <input type="password" placeholder="Min. 8 characters" className="w-full px-4 py-2 border rounded-lg focus:ring" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
            {state === 'Sign Up' ? 'Create Account' : 'Login'}
          </button>
        </form>

        <div className="flex items-center my-4">
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        <p className="text-sm text-center text-gray-600">
          {state === 'Sign Up' ? "Already have an account?" : "Don't have an account?"}
          <span className="text-blue-600 cursor-pointer ml-1" onClick={() => setState(state === 'Sign Up' ? 'Login' : 'Sign Up')}>
            {state === 'Sign Up' ? 'Login here' : 'Create an account'}
          </span>
        </p>
      </div>
      <ToastContainer position="top-center" autoClose={2000} theme="colored" />
    </div>
  );
};

export default Login;
