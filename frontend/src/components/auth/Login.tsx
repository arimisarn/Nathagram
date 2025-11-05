import { useMemo } from "react";
import { Link, Navigate } from "react-router-dom";
import { LockClosedIcon } from "@heroicons/react/solid";
import { Formik } from "formik";
import * as Yup from "yup";
import queryString from "query-string";
import routes from "../../routes";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { loginUser } from "../../redux/slice/auth";
import { LoginInterface } from "../../interfaces/auth";
import { requiredValidation } from "../../validation";
import Button from "../features/Button";
import AuthLoading from "../AuthLoading";

const Login = () => {
  const auth = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const parsedQueries: any = queryString.parse(window.location.search);

  const initialValues: LoginInterface = useMemo(
    () => ({
      username: "",
      password: "",
    }),
    []
  );

  if (auth.isLoading) return <AuthLoading />;
  if (auth.isAuthenticated) return <Navigate to={parsedQueries.next || "/"} />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-100 via-blue-100 to-yellow-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        <div className="bg-white rounded-2xl shadow-lg px-8 py-10">
          <h1 className="logo-font text-center text-5xl cursor-default font-extrabold text-gray-900 mb-4">
            Nathagram
          </h1>
          <p className="text-center text-gray-500 mb-6">
            Connectez-vous pour voir les photos et vidéos de vos amis.
          </p>

          <Formik
            initialValues={initialValues}
            validationSchema={Yup.object({
              username: Yup.string().required(requiredValidation.message),
              password: Yup.string().required(requiredValidation.message),
            })}
            onSubmit={(values) => dispatch(loginUser(values))}
          >
            {({
              values,
              errors,
              handleChange,
              handleSubmit,
              handleBlur,
              touched,
            }) => (
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      value={values.username}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Nom d'utilisateur"
                      className={`w-full px-4 py-2 rounded-lg border ${
                        touched.username && errors.username
                          ? "border-red-500"
                          : "border-gray-300"
                      } focus:outline-none focus:ring-2 focus:ring-purple-400 bg-gray-50`}
                    />
                    {touched.username && errors.username && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.username}
                      </p>
                    )}
                  </div>

                  <div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Mot de passe"
                      className={`w-full px-4 py-2 rounded-lg border ${
                        touched.password && errors.password
                          ? "border-red-500"
                          : "border-gray-300"
                      } focus:outline-none focus:ring-2 focus:ring-purple-400 bg-gray-50`}
                    />
                    {touched.password && errors.password && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.password}
                      </p>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  text="Se connecter"
                  symbol={
                    <LockClosedIcon className="h-5 w-5 text-white mr-2" />
                  }
                  loading={auth.loginLoading}
                  className="w-full flex justify-center items-center py-2 px-4 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg shadow-md transition-colors"
                />

                <div className="text-center">
                  <Link
                    to={routes.resetPassword}
                    className="text-gray-500 hover:text-gray-400 text-sm"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>
              </form>
            )}
          </Formik>
        </div>

        <div className="text-center">
          <p className="text-gray-600">
            Vous n'avez pas de compte ?{" "}
            <Link
              to={routes.register}
              className="text-purple-500 font-medium hover:text-purple-400"
            >
              Inscrivez-vous
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
