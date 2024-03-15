import { useEffect, useState } from "react";
import Select from "react-select";
import Table from "react-bootstrap/Table";
import moment from "moment";
import { toast } from "sonner";
import { useSelector, useDispatch } from "react-redux";
import { change } from "../../store/slice";
import axios from "axios";
import Image from "next/image";
import Swal from "sweetalert2";

const ClassManagement = () => {
  const dispatch = useDispatch();
  const [selectboxData, setselectboxData] = useState("");
  const [selectboxData2, setselectboxData2] = useState("");
  const [pageCounter, setpageCounter] = useState(0);
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
    if (associatedClasses.length > 0) {
      setselectboxData2("");
      setstudents({ all_students: [] });

      const classes = associatedClasses.map((item) => ({
        value: item._id,
        label: item.name + " " + item.section,
      }));

      setoptions2(classes);
    } else if (!associatedClasses.length > 0 && pageCounter != 0) {
      setoptions2([]);
      setstudents({ all_students: [] });
      toast.warning("There are no classes associated with this session.");
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
        setpageCounter(1);

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
      dispatch(change(true));
      const res = await axios.post(
        process.env.NEXT_PUBLIC_SITE_URL + "/class/api/getClassBySession",
        {
          sessionId: selectboxData,
        }
      );

      if (res.data.success) {
        dispatch(change(false));
        console.log("class data", res.data.data);
        setassociatedClasses(res.data.data);
      } else {
        dispatch(change(false));
      }
    } catch (err) {
      dispatch(change(false));
      toast.error(err.message);
    }
  }

  async function fetchStudents() {
    try {
      dispatch(change(true));
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
        dispatch(change(false));
        toast.success("students found");
        setstudents(res.data.data[0]);
      } else {
        dispatch(change(false));
      }
    } catch (err) {
      dispatch(change(false));
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
    async function finallyDelete() {
      try {
        dispatch(change(true));
        const res = await axios.post(
          process.env.NEXT_PUBLIC_SITE_URL + "/student/api/deleteStudent",
          {
            id: id,
          }
        );
        if (res.data.success) {
          dispatch(change(false));
          fetchStudents();
          toast.success("student deleted");
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
      text: "Are you sure you want to delete this student. All the data associated with this student will be lost.",
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
  return (
    <>
      <div className="main">
        <div className="container">
          <div className="my-3">
            <h2 className="mb-2">
              STUDENT MANAGEMENT - UPDATE AND DELETE STUDENTS
            </h2>
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
