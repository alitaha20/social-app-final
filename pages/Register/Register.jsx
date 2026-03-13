import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Eye } from "iconsax-reactjs";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import * as z from "zod";

const schema = z
  .object({
    name: z.string().min(3).max(10),
    username: z.string("zod: error ").min(5).max(10),
    email: z.email(),
    dateOfBirth: z.string(),
    gender: z.enum(["male", "female"]),
        password: z
      .string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d\s]).{8,}$/,
        "it must (A), more than 8 ch , and specail ch",
      ),
    rePassword: z
      .string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d\s]).{8,}$/,
        "password not matched",
      )
  })
  .refine(
    (valus) => {
      if (valus.password === valus.rePassword) {
        return true;
      }

      return false;
    },
    {
      Error: "that not matched ",
      path: ["rePassword"],
    },
  );

export default function Register() {
  const [show, setShow] = useState(false);
  const [messageError, setMessageError] = useState();
  const [messageScuss, setMessageScuss] = useState();

  const router = useNavigate();

  function hnadelpass() {
    setShow(!show);
  }

  const { handleSubmit, register, formState } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      username: "",
      email: " ",
      password: "",
      rePassword: "",
      dateOfBirth: "",
      gender: " ",
    },
  });

  async function sendDataTo(values) {

    console.log(values)
    try {
      const {data} = await axios(`${import.meta.env.VITE_API_URL}/users/signup`, {
        method: "POST",
        data: values,
      });

      setMessageScuss(data?.message);

      setTimeout(() => {
        router("/Login");
      }, 2000);
    } catch (error) {
      setMessageError(error.response.data.message);
    }
  }

  return (
    <>
      <div className=" bg-slate-500 flex justify-center items-center w-2/ h-2/6 ">

        <div className=" card p-9 bg-white text-center rounded-2xl shadow-2xl ">
          <h1 className=" font-semibold text-xl text-blue-500">
            
            creat a new account
          </h1>
          <p className="my-2">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Corrupti.
          </p>
          <form className="text-start" onSubmit={handleSubmit(sendDataTo)}>
            {/* name */}
            <div>
              <label className="text-lg" htmlFor="name">
                {" "}
                name
              </label>
              <input
                className="input"
                {...register("name")}
                type="text"
                name="name"
                id="name"
                placeholder="name"
              />

              {formState.errors.name && (
                <p className="text-red-600 font-bold">
                  {formState.errors.name.message}
                </p>
              )}
            </div>

                        {/* username */}
            <div>
              <label className="text-lg" htmlFor="username">
                {" "}
                Username
              </label>
              <input
                className="input"
                {...register("username")}
                type="text"
                name="username"
                id="username"
                placeholder="username"
              />

              {formState.errors.username && (
                <p className="text-red-600 font-bold">
                  {formState.errors.username.message}
                </p>
              )}
            </div>
            {/* email */}
            <div>
              <label className="text-lg" htmlFor="email">
                {" "}
                email
              </label>
              <input
                className="input"
                {...register("email")}
                type="email"
                name="email"
                id="email"
                placeholder="email"
              />
              {formState.errors.email && (
                <p className="text-red-600 font-bold">
                  {formState.errors.email.message}
                </p>
              )}
            </div>
            {/* password */}
            <div>
              <label className="text-lg" htmlFor="password">
                {" "}
                password
              </label>
              <div className="relative">
                <input
                  className="input "
                  {...register("password")}
                  type={show ? "text" : "password"}
                  name="password"
                  id="password"
                  placeholder="password"
                />
                {formState.errors.password && (
                  <p className="text-red-600 font-bold">
                    {formState.errors.password.message}
                  </p>
                )}
                <Eye
                  className="absolute end-2 top-[50%] translate-y-[-50%] cursor-pointer"
                  onClick={hnadelpass}
                />
              </div>
            </div>
            {/* confirmpassword */}
            <div>
              <label className="text-lg" htmlFor="confirmpassword">
                {" "}
                confirmpassword
              </label>
              <input
                className="input "
                {...register("rePassword")}
                type="password"
                name="rePassword"
                id="rePassword"
                placeholder="rePassword"
              />
              {formState.errors.rePassword && (
                <p className="text-red-600 font-bold">
                  {formState.errors.rePassword.message}
                </p>
              )}
            </div>
            {/* brithday */}
            <div>
              <label className="text-lg" htmlFor="dateOfBirth">
                {" "}
                brithday
              </label>
              <input
                className="input"
                {...register("dateOfBirth")}
                type="date"
                name="dateOfBirth"
                id="dateOfBirth"
                placeholder="brithday"
              />
            </div>
            {/* gender  */}
            <div className=" mt-4 ">
              <h3>Gender</h3>
              <label htmlFor="gender"> female</label>
              <input
                {...register("gender")}
                className="mx-2"
                type="radio"
                name="gender"
                id="gender"
                value={"female"}
              />

              <label htmlFor="gender">male</label>
              <input
                {...register("gender")}
                className=" ms-2"
                type="radio"
                name="gender"
                id="gender"
                value={"male"}
              />
            </div>

            <p className=" text-red-600 font-semibold"> {messageError}</p>
            <p className=" text-green-600 font-semibold"> {messageScuss}</p>

            <button className="btn"> creat accoutn </button>
          </form>
          <p className=" mt-4">
            {" "}
            you have already acc ?{" "}
            <Link className="text-blue-600" to={"/login"}>
              {" "}
              login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
