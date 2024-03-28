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
import { Popup } from "@/components/popups/InsertFeePopup";

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
  const [toggle, settoggle] = useState(false);
  const [togglePayFee, settogglePayFee] = useState(false);
  const [studentName, setstudentName] = useState("");
  const [formType, setformType] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [sessionName, setsessionName] = useState("");
  const [className, setclassName] = useState("");
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
    setsessionName(e.label);
  }
  function handleSelectboxChange2(e) {
    console.log("function hit 2", e.value);
    setselectboxData2(e.value);
    setclassName(e.label);
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
        setfees([]);
        settogglePayFee(false);
      } else {
        dispatch(change(false));
        setfees([]);
        settogglePayFee(false);
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
        setfees([]);
        settogglePayFee(false);
        dispatch(change(false));
      }
    } catch (err) {
      dispatch(change(false));
      toast.warning(err.message);
    }
  }

  async function checkfeesStatus(id) {
    console.log(id);
    const student = students.all_students.filter((item) => item._id == id);
    console.log("selected student", student);
    setstudentName(student[0]);
    setfees([]);
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
        settogglePayFee(false);
      } else {
        settogglePayFee(true);
        toast.warning("no fee records found");
      }
    } catch (err) {
      console.log(err);
    }
  }

  function triggerPopup(payment) {
    if (payment === "initial-payment") {
      settoggle(true);

      setformType("initial");
    } else if (payment === "custom") {
      settoggle(true);
      setformType("custom");
    } else {
      settoggle(true);
      setformType("mid-session");
    }
  }

  const handleCheckboxChange = (event, item) => {
    const isChecked = event.target.checked;

    if (isChecked) {
      setSelectedRows((prevSelectedRows) => [...prevSelectedRows, item]);
    } else {
      setSelectedRows((prevSelectedRows) =>
        prevSelectedRows.filter((data) => data._id !== item._id)
      );
    }
  };

  useEffect(() => {
    if (selectedRows.length) {
      console.log("selected data", selectedRows);
    }
  }, [selectedRows]);

  //   function generaterecipt() {
  //     const currentDate = new Date();
  //     if (selectedRows.length) {
  //       const section1 = `
  //       <p>Date : ${currentDate}</p>
  //       <p>Student Name : ${studentName.first_name} ${studentName.last_name}</p>
  //       <p>Father's Name : ${studentName.father_name}</p>
  //       <p>Contact : ${studentName.phone_no}</p>
  //     `;

  //       const bill = selectedRows.map(
  //         (item, index) =>
  //           `
  //         <p key=${index}>Month : ${item.month}</p>
  //         <p>Amount : ${item.amount}</p>
  //         <p>Status : Paid</p>
  //       `
  //       );

  //       const receiptContent = `
  //       <style>
  //       @import url("https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");
  // @import url("https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap");
  //       .printContainer{
  //         font-family: "Open Sans", sans-serif;
  //         font-size: 14px;

  //       }

  //       </style>
  //       <div class="printContainer">

  //         ${section1}
  //         ${bill}
  //       </div>
  //     `;

  //       const receiptWindow = window.open("", "_blank");
  //       receiptWindow.document.write(receiptContent);
  //       receiptWindow.document.close();

  //       receiptWindow.onload = () => {
  //         receiptWindow.print();
  //       };
  //     } else {
  //       toast.warning("please select some fee records first");
  //     }
  //   }

  function generaterecipt() {
    const currentDate = new Date();
    const schoolName = localStorage.getItem("settings");
    if (selectedRows.length) {
      const section1 = `
      <h3>${schoolName ? schoolName : null}</h3>
      <h4>Fee Recipt</h4>
      .....................................................
      <p>Date : ${moment(currentDate).format("MMM Do YYYY")}</p>
      <p>Student Name : ${studentName.first_name} ${studentName.last_name}</p>
      <p>Father's Name : ${studentName.father_name}</p>
      <p>Contact : ${studentName.phone_no}</p>
      <p>Session : ${sessionName}</p>
      <p>Class : ${className}</p>
      .....................................................
    `;

      const bill = selectedRows.map(
        (item, index) =>
          `
        <p key=${index}>Month : ${item.month}</p>
        <p>Amount : ${item.amount}</p>
        <p>Status : Paid</p>
        <p>Paid On : ${moment(item.createdAt).format("MMM Do YYYY")}</p>
      `
      );

      const receiptContent = `
      <style>
        @import url("https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");
        @import url("https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap");
        
        .printContainer {
          font-family: "Open Sans", sans-serif;
          font-size: 14px;
          display:grid;
          grid-template-columns:auto;
          justify-items:center;
        }

        @media print {
          @page {
            size: 8.5in 11in; /* Set page size for printing */
            margin: 0; /* Remove default margin */
          }

          .printContainer {
            padding: 10px; /* Add padding to content */
          }
        }
      </style>
      <div class="printContainer">
        ${section1}
        ${bill}
        .....................................................
      </div>
    `;

      const receiptWindow = window.open("", "_blank");
      receiptWindow.document.write(receiptContent);
      receiptWindow.document.close();

      receiptWindow.onload = () => {
        receiptWindow.print();
      };
      setSelectedRows([]);
    } else {
      toast.warning("Please select some fee records first");
    }
  }

  return (
    <>
      <Popup
        toggle={toggle}
        settoggle={settoggle}
        formType={formType}
        setformType={setformType}
        selectboxData={selectboxData}
        selectboxData2={selectboxData2}
        fees={fees}
        studentName={studentName}
        checkfeesStatus={checkfeesStatus}
      />
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
                <h2 className=" mt-5 mb-1">
                  FEE HISTORY - {studentName.first_name} {studentName.last_name}{" "}
                  <div className="text-end">
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={generaterecipt}
                    >
                      Generate Fee Recipt
                    </button>
                  </div>
                </h2>
                <Table className="my-5 shadow" responsive>
                  <thead>
                    <tr>
                      <th>Select</th>
                      <th>No</th>
                      <th>Month</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fees.map((item, index) => (
                      <tr key={index}>
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedRows.includes(item)}
                            onChange={(e) => handleCheckboxChange(e, item)}
                          />
                        </td>
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
            {fees.length && fees.length < 12 ? (
              <>
                <button
                  className=" w-25 btn btn-sm btn-danger"
                  onClick={() => triggerPopup("session-mid-payment")}
                >
                  Pay next month fees
                </button>
                <button
                  className=" w-25 btn btn-sm btn-danger  mx-3"
                  onClick={() => triggerPopup("custom")}
                >
                  Pay Custom Amount
                </button>
              </>
            ) : null}
            {togglePayFee ? (
              <>
                <h2 className=" mt-5 mb-1">
                  PAY {studentName.first_name}&nbsp;
                  {studentName.last_name}'s INITIAL FEES
                </h2>
                <button
                  className=" w-25 btn btn-sm btn-danger mt-3 mx-3"
                  onClick={() => triggerPopup("initial-payment")}
                >
                  Pay Fees
                </button>
                <button
                  className=" w-25 btn btn-sm btn-danger mt-3 mx-3"
                  onClick={() => triggerPopup("custom")}
                >
                  Pay Custom Amount
                </button>

                <form></form>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default ClassManagement;
