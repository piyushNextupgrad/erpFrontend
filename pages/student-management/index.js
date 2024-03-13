import { useEffect, useState } from "react";
import Select from "react-select";
import Table from "react-bootstrap/Table";
import moment from "moment";
import { toast } from "sonner";
import { useSelector, useDispatch } from "react-redux";
import { change } from "../../store/slice";
import axios from "axios";
const ClassManagement = () => {
  const [selectboxData, setselectboxData] = useState("");
  const [selectboxData2, setselectboxData2] = useState("");
  const [sessionData, setsessionData] = useState([]);
  const [options, setoptions] = useState([]);
  const [options2, setoptions2] = useState([]);
  const [associatedClasses, setassociatedClasses] = useState([]);

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
      // const filteredData = sessionData.filter(
      //   (item) => item._id == selectboxData
      // );
      // console.log("filteredData", filteredData);
      // setassociatedClasses(filteredData);
      getClassesInsideSession();
    }
  }, [selectboxData]);

  useEffect(() => {
    if (associatedClasses.length) {
      const classes = associatedClasses.map((item) => ({
        value: item._id,
        label: item.name,
      }));

      setoptions2(classes);
    }
  }, [associatedClasses]);

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
          </div>
        </div>
      </div>
    </>
  );
};

export default ClassManagement;
