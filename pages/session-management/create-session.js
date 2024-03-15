import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "../../styles/session.module.css";
import Form from "react-bootstrap/Form";
import { toast } from "sonner";
import axiosInstance from "@/axios/axios";
import Table from "react-bootstrap/Table";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import { change } from "../../store/slice";
import Swal from "sweetalert2";
import { Popup } from "@/components/popups/SessionPopUp";

const DynamicSession = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [sessionData, setsessionData] = useState([]);
  const [pathname, setpathname] = useState("");
  const [sessionname, setSessionname] = useState("");
  const [date, setDate] = useState("");
  const [id, setid] = useState("");
  const [obj, setobj] = useState({});
  const [toggle, settoggle] = useState(false);

  useEffect(() => {
    getSession();
  }, []);
  // Event handler for sessionname input change
  const handleSessionnameChange = (e) => {
    setSessionname(e.target.value);
  };

  // Event handler for date input change
  const handleDateChange = (e) => {
    setDate(e.target.value);
  };
  useEffect(() => {
    setpathname(router.query.operation);
  }, [router.isReady]);

  // useEffect(() => {
  //   console.log("pathname", pathname);
  // }, [pathname]);

  async function createSession() {
    try {
      const formData = new FormData();
      formData.append("sessionName", sessionname);
      formData.append("date", date);
      const data = await axiosInstance.post(
        "/session/api/createSession",
        formData
      );

      // console.log("===>", data);
      if (data.data.success) {
        toast.success("Session created");
        getSession();
      } else {
        toast.warning("Something went wrong");
      }
    } catch (err) {
      toast.error(err);
    }
  }

  async function getSession() {
    try {
      const res = await axiosInstance.get("/session/api/getSessions");
      if (res?.data?.success) {
        setsessionData(res.data.data);
        console.log("sessions", res);
      }
    } catch (err) {
      toast.error(err.message);
    }
  }

  function deleteSession(id) {
    console.log(id);

    async function finallyDelete() {
      try {
        dispatch(change(true));
        const res = await axiosInstance.post("/session/api/deleteSession", {
          id: id,
        });
        if (res.data.success) {
          dispatch(change(false));
          toast.success("session deleted");
          getSession();
        } else {
          dispatch(change(false));
          toast.error("something went wrong");
        }
      } catch (err) {
        dispatch(change(false));
        toast.error(err.message);
      }
    }
    Swal.fire({
      title: "Warning",
      text: "Are you sure you want to delete the session. All the data and classes associated with the session will be lost.",
      showDenyButton: true,
      icon: "warning",

      confirmButtonText: "Yes Delete",
      denyButtonText: `Don't Delete`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        finallyDelete();
      } else if (result.isDenied) {
        toast.success("Cancelled");
      }
    });
  }

  async function updateSession(id, name) {
    console.log(id);
    console.log(name);
    settoggle(true);
    setid(id);
    setobj(name);
  }

  return (
    <>
      <Popup toggle={toggle} id={id} obj={obj} settoggle={settoggle} />
      <div className="main">
        <div className={`container py-4 ${styles.createSession}`}>
          <h2 className="mb-5">CREATE SESSIONS</h2>
          {/* <img
            className={styles.sessionImage}
            src="/session.svg"
            alt="picture of students in class"
          /> */}
          <Form className={styles.formStyle}>
            <Form.Group className="mb-3" controlId="formGroupSessionname">
              <Form.Control
                type="text"
                placeholder="Enter session name"
                value={sessionname}
                onChange={handleSessionnameChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGroupDate">
              <Form.Control
                type="date"
                placeholder="Enter date"
                value={date}
                onChange={handleDateChange}
              />
            </Form.Group>
            <button
              className="btn btn-sm btn-danger w-100"
              type="button"
              onClick={createSession}
            >
              Create Session
            </button>
          </Form>
        </div>
        <div className="container mt-5">
          <h2 className="mb-3">MANAGE SESSIONS</h2>
          <Table responsive>
            <thead>
              <tr>
                <th>No</th>
                <th>Session Name</th>
                <th>Date Created</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {sessionData.map((item, index) => (
                <tr key={item._id}>
                  <td>{index + 1}</td>
                  <td>{item.sessionName}</td>
                  <td>{moment(item.date).format("MMM Do YYYY")}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-secondary mx-1"
                      onClick={() => updateSession(item._id, item)}
                    >
                      Update
                    </button>
                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => deleteSession(item._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default DynamicSession;
