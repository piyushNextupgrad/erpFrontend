import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { change } from "@/store/slice";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { toast } from "sonner";
import axiosInstance from "@/axios/axios";
import { useEffect } from "react";

const Login = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("adminTokenErpApplication");
    if (token) {
      router.push("/");
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Perform login logic using email and password
    console.log("Email:", email);
    console.log("Password:", password);
    try {
      dispatch(change(true));
      const res = await axiosInstance.post("/admin/api/login", {
        email: email,
        password: password,
      });
      if (res.data.success) {
        dispatch(change(false));
        toast.success("login successful");
        console.log(res);

        const token = res.data.token;
        localStorage.setItem("adminTokenErpApplication", token);
        localStorage.setItem("settings", res.data.setting.schoolName);
        router.push("/");
      } else {
        dispatch(change(false));
        toast.error("Login failed");
      }
    } catch (err) {
      dispatch(change(false));
      toast.error(err.message);
    }
  };

  return (
    <>
      <div className="main">
        <div className="container  ">
          <h2 className="mb-5  ">ADMIN LOGIN</h2>
          <Form className="" onSubmit={handleSubmit}>
            <Form.Group controlId="formEmail">
              <Form.Control
                className="my-4"
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formPassword">
              <Form.Control
                className="my-4"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Button className="w-100 mt-4" variant="danger" type="submit">
              Login
            </Button>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Login;
