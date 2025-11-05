import { useMemo, useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { UserAddIcon } from "@heroicons/react/solid";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import routes from "../../routes";
import { Toast } from "../../utils/messages";
import requests from "../../utils/requests";
import { useAppSelector } from "../../redux/store";
import { formikSetError } from "../../utils/setError";
import { RegisterInterface } from "../../interfaces/auth";
import { requiredValidation, emailValidation } from "../../validation";
import {
  usernameValidation,
  passwordValidation,
} from "../../validation/register";
import Button from "../features/Button";
import AuthLoading from "../AuthLoading";

const Register = () => {
  const navigate = useNavigate();
  const auth = useAppSelector((state) => state.auth);
  const [registerLoading, setRegisterLoading] = useState<boolean>(false);

  const initialValues: RegisterInterface = useMemo(
    () => ({
      username: "",
      email: "",
      password: "",
      confirm_password: "",
    }),
    []
  );

  if (auth.isLoading) return <AuthLoading />;

  if (auth.isAuthenticated) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-100 via-blue-100 to-yellow-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        <div className="bg-white rounded-2xl shadow-lg px-8 py-10">
          <h1 className="logo-font mb-6 text-center text-5xl font-extrabold text-gray-900 cursor-default">
            Nathagram
          </h1>

          <p className="text-center text-gray-500 mb-6">
            Inscrivez-vous pour voir les photos et vidéos de vos amis.
          </p>

          <Formik
            initialValues={initialValues}
            validationSchema={Yup.object({
              username: Yup.string()
                .required(requiredValidation.message)
                .max(
                  usernameValidation.maxLength,
                  usernameValidation.maxLengthMessage
                ),
              email: Yup.string()
                .email(emailValidation.message)
                .required(requiredValidation.message),
              password: Yup.string()
                .required(requiredValidation.message)
                .min(
                  passwordValidation.minLength,
                  passwordValidation.minLengthMessage
                ),
              confirm_password: Yup.string()
                .required(requiredValidation.message)
                .oneOf(
                  [Yup.ref("password"), null],
                  passwordValidation.notMatchMessage
                ),
            })}
            onSubmit={async (values, { setFieldError }) => {
              try {
                setRegisterLoading(true);
                await axios.post(requests.register, values);
                Toast.fire({
                  title: "Inscription réussie !",
                  text: "Redirection vers la page de connexion...",
                  icon: "success",
                  timer: 2000,
                }).then(() => navigate("/login"));
              } catch (e: any) {
                const { response } = e;
                if (response?.status === 400) {
                  formikSetError(response, setFieldError);
                } else {
                  Toast.fire({
                    title: "Échec de l'inscription !",
                    text: "Une erreur est survenue, veuillez réessayer.",
                    icon: "error",
                    timer: 2000,
                  });
                }
              } finally {
                setRegisterLoading(false);
              }
            }}
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
                      id="email"
                      name="email"
                      type="email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Email"
                      className={`w-full px-4 py-2 rounded-lg border ${
                        touched.email && errors.email
                          ? "border-red-500"
                          : "border-gray-300"
                      } focus:outline-none focus:ring-2 focus:ring-purple-400 bg-gray-50`}
                    />
                    {touched.email && errors.email && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.email}
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

                  <div>
                    <input
                      id="confirm_password"
                      name="confirm_password"
                      type="password"
                      value={values.confirm_password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Confirmez le mot de passe"
                      className={`w-full px-4 py-2 rounded-lg border ${
                        touched.confirm_password && errors.confirm_password
                          ? "border-red-500"
                          : "border-gray-300"
                      } focus:outline-none focus:ring-2 focus:ring-purple-400 bg-gray-50`}
                    />
                    {touched.confirm_password && errors.confirm_password && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.confirm_password}
                      </p>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  text="S'inscrire"
                  symbol={<UserAddIcon className="h-5 w-5 text-white mr-2" />}
                  loading={registerLoading}
                  className="w-full flex justify-center items-center py-2 px-4 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg shadow-md transition-colors"
                />

                <p className="text-xs text-gray-400 text-center">
                  En vous inscrivant, vous acceptez nos Conditions d'utilisation
                  et notre Politique de confidentialité.
                </p>
              </form>
            )}
          </Formik>
        </div>

        <div className="text-center">
          <p className="text-gray-600">
            Vous avez déjà un compte ?{" "}
            <Link
              to={routes.login}
              className="text-purple-500 font-medium hover:text-purple-400"
            >
              Connectez-vous
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
