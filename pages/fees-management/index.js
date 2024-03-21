import { useEffect, useState } from "react";
import Select from "react-select";
import Table from "react-bootstrap/Table";
import moment from "moment";
import { toast } from "sonner";
import { useSelector, useDispatch } from "react-redux";
import { change } from "../../store/slice";
import axiosInstance from "@/axios/axios";
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
  //
  const [fees, setfees] = useState([]);
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
      const res = await axiosInstance.get("/session/api/getSessions");
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
    console.log("function hit 1", e.value);
    setselectboxData(e.value);
  }
  function handleSelectboxChange2(e) {
    console.log("function hit 2", e.value);
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

        setstudents(res.data.data[0]);
        if (res.data.data[0]?.all_students.length) {
          toast.success("students found");
        }
      } else {
        setstudents({});
        toast.warning("no students found");
        dispatch(change(false));
      }
    } catch (err) {
      dispatch(change(false));
      toast.warning(err.message);
    }
  }

  async function checkfeesStatus(id) {
    console.log(id);
    try {
      const res = await axiosInstance.post("/fee/api/findSingleFeeRecord", {
        studentId: id,
        sessionId: selectboxData,
        classId: selectboxData2,
      });
      console.log("fee record", res);
      if (res.data.success) {
        toast.success("fee records found");
        setfees(res.data.data[0].fees);
      } else {
        toast.warning("no fee records found");
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <div className="main">
        <div className="container">
          <div className="my-3">
            <h2 className="mb-2">FEES MANAGEMENT - VIEW OR PAY FEES</h2>
          </div>
          <p>Select a session then a class to load all associated students.</p>
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

            {students?.all_students?.length > 0 ? (
              <>
                <h2 className=" mt-5 mb-1">STUDENTS </h2>
                <Table className="my-5 shadow" responsive>
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
                    {students?.all_students?.sort().map((item, index) => (
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
                            onClick={() => checkfeesStatus(item._id)}
                          >
                            Check fees Status
                          </button>
                          {/* <button
                            className="btn mx-1  btn-warning "
                            onClick={() => deleteStudent(item._id)}
                          >
                            Delete
                          </button> */}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </>
            ) : null}
            {fees?.length ? (
              <>
                <h2 className=" mt-5 mb-1">FEE HISTORY </h2>
                <Table className="my-5 shadow" responsive>
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Month</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fees.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.month}</td>
                        <td>{item.amount}</td>
                        <td>Paid</td>

                        {/* <td>
                          <button
                            className="btn mx-1  btn-danger "
                            onClick={() => checkfeesStatus(item._id)}
                          >
                            Check fees Status
                          </button>
                       
                        </td> */}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default ClassManagement;
