import { useEffect, useState } from "react";
import Select from "react-select";
import Table from "react-bootstrap/Table";
import moment from "moment";
import { toast } from "sonner";
import { useSelector, useDispatch } from "react-redux";
import { change } from "../../store/slice";
import axios from "axios";
import Image from "next/image";

const ClassManagement = () => {
  const [selectboxData, setselectboxData] = useState("");
  const [selectboxData2, setselectboxData2] = useState("");
  const [sessionData, setsessionData] = useState([]);
  const [options, setoptions] = useState([]);
  const [options2, setoptions2] = useState([]);
  const [associatedClasses, setassociatedClasses] = useState([]);
  const [students, setstudents] = useState([]);
  useEffect(() => {
    getSession();
  }, []);

  useEffect(() => {
    if (sessionData.length) {
      const newOptions = sessionData.map((item) => ({
        value: item._id,
        label: item.sessionName,
      }));
      setoptions(newOptions);
    }
  }, [sessionData]);

  useEffect(() => {
    if (selectboxData !== "") {
      getClassesInsideSession();
    }
  }, [selectboxData]);

  useEffect(() => {
    if (associatedClasses.length) {
      setselectboxData2("");

      const classes = associatedClasses.map((item) => ({
        value: item._id,
        label: item.name + " " + item.section,
      }));

      setoptions2(classes);
    }
  }, [associatedClasses]);

  useEffect(() => {
    if (selectboxData2 != "") {
      fetchStudents();
    }
  }, [selectboxData2]);

  async function getSession() {
    try {
      const res = await axios.get(
        process.env.NEXT_PUBLIC_SITE_URL + "/session/api/getSessions"
      );
      if (res?.data?.success) {
        console.log("session data", res.data.data);
        setsessionData(res.data.data);

        console.log("sessions", res);
      }
    } catch (err) {
      toast.error(err.message);
    }
  }
  function handleSelectboxChange(e) {
    console.log("function hit", e.value);
    setselectboxData(e.value);
  }
  function handleSelectboxChange2(e) {
    console.log("function hit", e.value);
    setselectboxData2(e.value);
  }

  async function getClassesInsideSession() {
    try {
      const res = await axios.post(
        process.env.NEXT_PUBLIC_SITE_URL + "/class/api/getClassBySession",
        {
          sessionId: selectboxData,
        }
      );
      console.log("classes", res.data.data);
      if (res.data.success) {
        console.log("class data", res.data.data);
        setassociatedClasses(res.data.data);
      }
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function fetchStudents() {
    try {
      const res = await axios.post(
        process.env.NEXT_PUBLIC_SITE_URL +
          "/student/api/findStudentBySessionAndClass",
        {
          session_id: selectboxData,
          class_id: selectboxData2,
        }
      );
      console.log("students", res);
      if (res.data.success) {
        toast.success("students found");
        setstudents(res.data.data[0]);
      }
    } catch (err) {
      toast.warning(err.message);
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  function updateStudent(id) {
    console.log(id);
  }
  function deleteStudent(id) {
    console.log(id);
  }
  return (
    <>
      <div className="main">
        <div className="container">
          <div className="my-3">
            <h2 className="mb-2">STUDENT MANAGEMENT</h2>
          </div>
          <p>Select a session then a class to load all associated students.</p>
          <div className="my-3">
            {options.length ? (
              <Select
                options={options}
                onChange={handleSelectboxChange}
                placeholder="Select a session"
              />
            ) : null}
          </div>
          <div className="my-3">
            {options2.length ? (
              <Select
                options={options2}
                onChange={handleSelectboxChange2}
                placeholder="Select a class"
              />
            ) : null}

            {students?.all_students?.length > 0 ? (
              <>
                <h2 className=" mt-5 mb-1">STUDENTS </h2>
                <Table className="my-5" responsive>
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Name</th>
                      <th>Phone</th>
                      <th>Father's Name</th>
                      <th>Mother's Name</th>
                      <th>Date of Birth</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students?.all_students?.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>
                          {item.first_name} {item.last_name}
                        </td>
                        <td>{item.father_mobile_no}</td>
                        <td>{item.father_name}</td>
                        <td>{item.mother_name}</td>
                        <td>
                          {moment(item.date_of_birth).format("MMM Do YYYY")}
                        </td>
                        <td>
                          <button
                            className="btn mx-1  btn-danger "
                            onClick={() => updateStudent(item._id)}
                          >
                            Update
                          </button>
                          <button
                            className="btn mx-1  btn-warning "
                            onClick={() => deleteStudent(item._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </>
            ) : (
              <div className="text-center">
                <Image src="/cls2.svg" width={600} height={300} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ClassManagement;
