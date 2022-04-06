import React from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { useFormik } from "formik";
import { Types } from "../redux/constants/types";
import baseApi from "../apis/baseApi";

const validate = (values) => {
  const errors = {};

  if (!values.email) {
    errors.email = "Required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = "Invalid email address";
  }

  if (!values.password) {
    errors.password = "Required";
  } else if (
    !/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/.test(
      values.password
    )
  ) {
    errors.password = "Must include one number and a special character";
  }

  return errors;
};

function Signin() {
  const history = useHistory();
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      responseError: "",
    },
    validate,
    onSubmit: async (values) => {
      try {
        const res = await baseApi.post("api/auth/login", values);
        if (res.data.refreshToken) {
          dispatch({ type: Types.VALID_USER, payload: res.data });
          history.push("/my-account");
        }
      } catch (err) {
        formik.errors.responseError = err.response.data;
        console.error(err.response);
      }
    },
  });

  return (
    <div className="container-fluid">
      <div className="row vh-100">
        <div className="col-md-5 px-0">
          <aside className="bg-form px-3 py-2">
            <h2 className="meal-subtitle font-weight-bold text-light">
              Pizzaaaaaa ? Pizzalicious...
            </h2>
            <img
              src="/favicon.ico"
              alt="logo"
              style={{
                height: "300px",
              }}
            />
            <h3 className="section-title font-weight-bold text-light">
              Order now!
            </h3>
          </aside>
        </div>
        <div className="col-md-7 align-self-md-center">
          <form className="user-form px-3 py-2" onSubmit={formik.handleSubmit}>
            <h3 className="section-title font-weight-bold">
              Sign in to Delivery App
            </h3>
            {formik.errors.responseError ? (
              <small className="text-danger text-center">
                {formik.errors.responseError}
              </small>
            ) : null}
            <hr />
            <div className="form-row">
              <div className="form-group col-md-12">
                <label htmlFor="inputEmail">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="inputEmail"
                  name="email"
                  placeholder="Valid email only"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                />
                {formik.errors.email ? (
                  <small className="text-danger">{formik.errors.email}</small>
                ) : null}
              </div>
              <div className="form-group col-md-12">
                <label htmlFor="inputPassword">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="inputPassword"
                  name="password"
                  placeholder="6+ characters"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                />
                {formik.errors.password ? (
                  <small className="text-danger">
                    {formik.errors.password}
                  </small>
                ) : null}
              </div>
            </div>
            <div className="w-100">
              <button type="submit" className="btn btn-success">
                Get in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signin;