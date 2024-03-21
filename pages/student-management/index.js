import { useEffect, useState } from "react";
import Select from "react-select";
import Table from "react-bootstrap/Table";
import moment from "moment";
import { toast } from "sonner";
import { useSelector, useDispatch } from "react-redux";
import { change } from "../../store/slice";
import axiosInstance from "@/axios/axios";
import Image from "next/image";
import img from "../../public/class.svg";

const ClassManagement = ({ base64 }) => {
  const [selectboxData, setselectboxData] = useState("");
  const [selectboxData2, setselectboxData2] = useState("");
  const [pageCounter, setpageCounter] = useState(0);
  const [sessionData, setsessionData] = useState([]);
  const [options, setoptions] = useState([]);
  const [options2, setoptions2] = useState([]);
  const [associatedClasses, setassociatedClasses] = useState([]);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    father_name: "",
    mother_name: "",
    father_mobile_no: "",
    phone_no: "",
    date_of_birth: "",
    gender: "",
    religion: "",
    category: "",
    last_school_attended: "",
    address: "",
    class_id: "",
    session_id: "",
    aadhar_card_no: "",
  });

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

      const classes = associatedClasses.map((item) => ({
        value: item._id,
        label: item.name + " " + item.section,
      }));

      setoptions2(classes);
    } else if (!associatedClasses.length > 0 && pageCounter != 0) {
      setoptions2([]);
      setselectboxData2([]);
      toast.warning("There are no classes associated with this session.");
    }
  }, [associatedClasses]);

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
      const res = await axiosInstance.post("/class/api/getClassBySession", {
        sessionId: selectboxData,
      });
      console.log("classes", res.data.data);
      if (res.data.success) {
        console.log("class data", res.data.data);
        setassociatedClasses(res.data.data);
      }
    } catch (err) {
      toast.error(err.message);
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  async function handleStudentCreation(e) {
    e.preventDefault();

    try {
      console.log(formData);
      const keys = Object.keys(formData);
      const value = Object.values(formData);
      if (keys.length === value.length) {
        if (selectboxData != "") {
          const res = await axiosInstance.post("/student/api/postStudent", {
            formData,
            class_id: selectboxData2,
            session_id: selectboxData,
          });
          console.log(res);
          if (res.data.success) {
            toast.success("Student Added");
            setFormData({
              first_name: "",
              last_name: "",
              father_name: "",
              mother_name: "",
              father_mobile_no: "",
              phone_no: "",
              date_of_birth: "",
              gender: "",
              religion: "",
              category: "",
              last_school_attended: "",
              address: "",
              aadhar_card_no: "",
            });
          } else {
            toast.error("Something went wrong");
          }
        } else {
          toast.warning("Please select a class");
        }
      } else {
        toast.warning("Please fill out all the fields");
      }
    } catch (err) {
      console.log("error", err);
      if (err?.request?.response?.includes("E11000")) {
        toast.error("Student adhar already exists in system.");
      } else {
        toast.error(err.message);
      }
    }
  }
  return (
    <>
      <div className="main student-page">
        <div className="container">
          <div className="my-3 ">
            <h2 className="mb-2">STUDENT MANAGEMENT - ADD STUDENTS</h2>
          </div>
          <p>Select a session then a class to load all associated students.</p>
          <div className="my-3">
            {options.length ? (
              <Select
                className="shadow"
                options={options}
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
            {selectboxData2.length ? (
              <form className="pt-2  row g-3" onSubmit={handleStudentCreation}>
                <h2 className="mb-2">ADD STUDENT TO SELECTED CLASS</h2>
                <div className="col-md-6">
                  <input
                    className="form-control shadow"
                    type="text"
                    placeholder="First name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <input
                    className="form-control shadow"
                    type="text"
                    placeholder="Last name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <input
                    className="form-control shadow"
                    type="text"
                    placeholder="Father's name"
                    name="father_name"
                    value={formData.father_name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <input
                    className="form-control shadow"
                    type="text"
                    placeholder="Mother's name"
                    name="mother_name"
                    value={formData.mother_name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <input
                    className="form-control shadow"
                    type="text"
                    placeholder="Mobile Number"
                    name="father_mobile_no"
                    value={formData.father_mobile_no}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <input
                    className="form-control shadow"
                    type="text"
                    placeholder="Phone Number"
                    name="phone_no"
                    value={formData.phone_no}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <input
                    className="form-control shadow"
                    type="date"
                    placeholder="Date of Birth"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <select
                    className="form-control shadow"
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>
                      Select gender
                    </option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <select
                    className="form-control shadow"
                    id="religion"
                    name="religion"
                    value={formData.religion}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>
                      Select Religion
                    </option>
                    <option value="Hindu">Hindu</option>
                    <option value="Muslim">Muslim</option>
                    <option value="Sikh">Sikh</option>
                    <option value="Jain">Jain</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <select
                    className="form-control shadow"
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>
                      Select Category
                    </option>
                    <option value="General">General</option>
                    <option value="Obc">Obc</option>
                    <option value="Sc">Sc</option>
                    <option value="St">St</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <input
                    className="form-control shadow"
                    type="text"
                    placeholder="Last school attended"
                    name="last_school_attended"
                    value={formData.last_school_attended}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <input
                    className="form-control shadow"
                    type="text"
                    placeholder="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-6">
                  <input
                    className="form-control shadow"
                    type="text"
                    placeholder="Aadhar"
                    name="aadhar_card_no"
                    value={formData.aadhar_card_no}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-6">
                  <button type="submit" className="w-100 btn btn-warning col-6">
                    Submit
                  </button>
                </div>
              </form>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default ClassManagement;
