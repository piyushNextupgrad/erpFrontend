import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "../../styles/session.module.css";
import Form from "react-bootstrap/Form";
import { toast } from "sonner";
import axios from "axios";
import Table from "react-bootstrap/Table";
import moment from "moment";

const DynamicSession = () => {
  const router = useRouter();
  const [sessionData, setsessionData] = useState([]);
  const [pathname, setpathname] = useState("");
  const [sessionname, setSessionname] = useState("");
  const [date, setDate] = useState("");

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
      const data = await axios.post(
        process.env.NEXT_PUBLIC_SITE_URL + "/session/api/createSession",
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
    const res = await axios.get(
      process.env.NEXT_PUBLIC_SITE_URL + "/session/api/getSessions"
    );
    if (res?.data?.success) {
      setsessionData(res.data.data);
      console.log("sessions", res);
    }
  }

  return (
    <>
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
              <Form.Label>Session Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter session name"
                value={sessionname}
                onChange={handleSessionnameChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGroupDate">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                placeholder="Enter date"
                value={date}
                onChange={handleDateChange}
              />
            </Form.Group>
            <button
              className="btn btn-sm btn-warning"
              type="button"
              onClick={createSession}
            >
              Create Session
            </button>
          </Form>
        </div>
        <div className="container mt-5">
          <h2 className="mb-5">MANAGE SESSIONS</h2>
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
                    <button className="btn btn-sm btn-secondary mx-1">
                      Update
                    </button>
                    <button className="btn btn-sm btn-warning">Delete</button>
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
