import { useEffect, useState } from "react";
import Select from "react-select";
import Table from "react-bootstrap/Table";
import moment from "moment";
import { toast } from "sonner";
import { useSelector, useDispatch } from "react-redux";
import { change } from "../../store/slice";
import axiosInstance from "@/axios/axios";

import Swal from "sweetalert2";

const ClassManagement = () => {
  const dispatch = useDispatch();
  const [selectboxData, setselectboxData] = useState("");
  const [selectboxData2, setselectboxData2] = useState("");
  const [selectboxDataMigrate, setselectboxDataMigrate] = useState("");
  const [pageCounter, setpageCounter] = useState(0);
  const [sessionData, setsessionData] = useState([]);
  const [sessionData2, setsessionData2] = useState([]);
  const [options, setoptions] = useState([]);
  const [options2, setoptions2] = useState([]);
  const [options3, setoptions3] = useState([]);
  const [associatedClasses, setassociatedClasses] = useState([]);
  const [students, setstudents] = useState({});
  const [migratedStudent, setmigratedStudent] = useState([]);

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
      setoptions3(newOptions);
    }
  }, [sessionData]);

  useEffect(() => {
    if (selectboxData != "") {
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

  useEffect(() => {
    console.log("Migrate select box", selectboxDataMigrate);
  }, [selectboxDataMigrate]);

  async function getSession() {
    try {
      const res = await axiosInstance.get("/session/api/getSessions");
      if (res?.data?.success) {
        console.log("session data", res.data.data);
        setsessionData(res.data.data);
        setsessionData2(res.data.data);
        setpageCounter(1);

        console.log("sessions", res);
      }
    } catch (err) {
      toast.error(err.message);
    }
  }
  function handleSelectboxChange(e) {
    console.log("function hit 1", e.value);
    setselectboxData(e.value);
  }
  function handleSelectboxChangeForMigration(e) {
    console.log("function hit 2", e.value);
    setselectboxDataMigrate(e.value);
  }
  function handleSelectboxChange2(e) {
    console.log("function hit 3", e.value);
    setselectboxData2(e.value);
  }

  async function getClassesInsideSession() {
    try {
      dispatch(change(true));
      const res = await axiosInstance.post("/class/api/getClassBySession", {
        sessionId: selectboxData,
      });

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
      const res = await axiosInstance.post(
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
        setstudents({});
        dispatch(change(false));
        toast.warning("no students found");
      }
    } catch (err) {
      dispatch(change(false));
      toast.warning(err.message);
    }
  }

  function filterStudents(item) {
    const filteredStudent = migratedStudent.filter(
      (stu) => stu._id !== item._id
    );

    setmigratedStudent(filteredStudent);
  }

  async function migrateStudents() {
    console.log("migrate selectbox", selectboxDataMigrate);
    const migratedStudentsIdArr = migratedStudent.map((item) => item._id);
    console.log("migrated students", migratedStudentsIdArr);
    console.log("class_id", selectboxData2);

    if (selectboxDataMigrate == "") {
      toast.error("Please select a session to migrate the class");
    } else {
      if (migratedStudent.length) {
        const classObj = associatedClasses.filter(
          (item, index) => item._id == selectboxData2
        );
        console.log("classObj", classObj);

        try {
          dispatch(change(true));
          const res = await axiosInstance.post("/class/api/migrateClass", {
            sessionId: selectboxDataMigrate,
            students: migratedStudentsIdArr,
            classId: selectboxData2,
            classInfo: classObj,
          });
          console.log("migrate APi result", res);
          if (res.data.success) {
            dispatch(change(false));
            toast.success("class migrated to new session");
          } else {
            dispatch(change(false));
            toast.success(
              "Class already exists for selected session. Cannot migrate please check the selected session."
            );
          }
        } catch (err) {
          dispatch(change(false));
          toast.error(err.message);
        }
      } else {
        toast.error("Please select students to migrate into new session");
      }
    }
  }
  return (
    <>
      <div className="main">
        <div className="container">
          <div className="my-3">
            <h2 className="mb-2">STUDENT MANAGEMENT - MIGRATE STUDENTS</h2>
          </div>
          <p>
            Create a new session first in which you want to migrate students.
            Select an existing session and a class to load all associated
            students. Migrate students from left to right column. Press save
            button to migrate.
          </p>
          <div className="my-3">
            {options.length ? (
              <Select
                options={options}
                className="shadow"
                onChange={handleSelectboxChange}
                placeholder="Select a session"
              />
            ) : null}
          </div>
          <div className="my-3">
            {options2.length ? (
              <Select
                className="shadow"
                options={options2}
                onChange={handleSelectboxChange2}
                placeholder="Select a class"
              />
            ) : null}
          </div>
          <h2 className=" mt-5 mb-1 heading-section-migratePage">
            <span className="fs-3">
              STUDENTS IN{" "}
              {Object.keys(students).length
                ? Object.keys(students).includes("section")
                  ? `${students.name} ${students.section}`
                  : null
                : null}{" "}
            </span>
            <span className="innerSpan w-50">
              {students?.all_students?.length ? (
                <>
                  <span className="fs-3">MIGRATE TO </span>
                  <Select
                    options={options3}
                    className="shadow w-50"
                    onChange={handleSelectboxChangeForMigration}
                    placeholder="Select a session"
                  />
                </>
              ) : null}
            </span>
          </h2>
        </div>
        <div className="tables-sidebyside">
          <>
            <Table className="my-5 shadow " responsive>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Name</th>

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

                    <td>{item.father_name}</td>
                    <td>{item.mother_name}</td>
                    <td>{moment(item.date_of_birth).format("MMM Do YYYY")}</td>
                    <td>
                      <button
                        className="btn mx-1  btn-warning "
                        onClick={() => {
                          setmigratedStudent([...migratedStudent, item]);
                        }}
                      >
                        Migrate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>

          <>
            <Table className="my-5 shadow" responsive>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Name</th>

                  <th>Father's Name</th>
                  <th>Mother's Name</th>
                  <th>Date of Birth</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {migratedStudent?.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      {item.first_name} {item.last_name}
                    </td>

                    <td>{item.father_name}</td>
                    <td>{item.mother_name}</td>
                    <td>{moment(item.date_of_birth).format("MMM Do YYYY")}</td>
                    <td>
                      <button
                        className="btn mx-1  btn-danger "
                        onClick={() => filterStudents(item)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        </div>
        <div className="w-100 px-5">
          {migratedStudent.length ? (
            <button
              className="w-25 mx-5 btn btn-success float-end"
              onClick={migrateStudents}
            >
              Migrate Students
            </button>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default ClassManagement;
