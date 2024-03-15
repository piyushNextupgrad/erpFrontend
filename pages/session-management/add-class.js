import Select from "react-select";
import Table from "react-bootstrap/Table";
import moment from "moment";
import { toast } from "sonner";
import { useSelector, useDispatch } from "react-redux";
import { change } from "../../store/slice";
import Swal from "sweetalert2";

import { useState, useEffect } from "react";
import axios from "axios";
const AddClass = () => {
  const dispatch = useDispatch();
  const [sessionData, setsessionData] = useState([]);
  const [selectboxData, setselectboxData] = useState("");
  const [options, setoptions] = useState([]);
  const [associatedClasses, setassociatedClasses] = useState([]);

  //states for class form handling
  const [className, setClassName] = useState("");
  const [classNumber, setClassNumber] = useState("");
  const [classSection, setClassSection] = useState("");
  //

  useEffect(() => {
    getSession();
  }, []);

  useEffect(() => {
    if (sessionData.length) {
      sessionData.forEach((item) =>
        options.push({ value: item._id, label: item.sessionName })
      );
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

  async function getSession() {
    try {
      const res = await axios.get(
        process.env.NEXT_PUBLIC_SITE_URL + "/session/api/getSessions"
      );
      if (res?.data?.success) {
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

  async function handleFormSubmit(event) {
    event.preventDefault();
    if (className != "" && classNumber != "" && classSection != "") {
      if (selectboxData != "") {
        dispatch(change(true));
        const formData = new FormData();
        formData.append("name", className);
        formData.append("className", classNumber);
        formData.append("section", classSection);
        formData.append("session", selectboxData);
        const result = await axios.post(
          process.env.NEXT_PUBLIC_SITE_URL + "/class/api/createClass",
          formData
        );
        console.log(result);
        if (result.data.sucess) {
          dispatch(change(false));
          setClassName("");
          setClassNumber("");
          setClassSection("");
          getClassesInsideSession();
          toast.success("class created");
        }
      } else {
        dispatch(change(false));
        toast.error("Please select a session to add class in it.");
      }
    } else {
      dispatch(change(false));
      toast.error("all the fields are required.");
    }
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
        setassociatedClasses(res.data.data);
      }
    } catch (err) {
      toast.error(err.message);
    }
  }

  function deleteClass(id) {
    async function finallyDelete() {
      try {
        const res = await axios.post(
          process.env.NEXT_PUBLIC_SITE_URL + "/class/api/deleteClass",
          {
            id: id,
          }
        );
        if (res.data.success) {
          toast.success("class deleted");
          getClassesInsideSession();
        }
      } catch (err) {
        toast.error(err.message);
      }
    }

    Swal.fire({
      title: "Warning",
      text: "Are you sure you want to delete this class. All the data and students associated with the class will be lost.",
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
          <div className="my-5">
            <h2 className="mb-4">SELECT A SESSION</h2>
            <Select
              options={options}
              onChange={handleSelectboxChange}
              placeholder="Select a session"
            />
          </div>
          <div className=" mt-5">
            <h2 className="mb-5">ADD CLASS TO SELECTED SESSION</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="row">
                <div className="col-6">
                  <input
                    className="form-control my-2 "
                    type="text"
                    placeholder="Name of Class"
                    value={className}
                    required
                    onChange={(e) => setClassName(e.target.value)}
                  />
                </div>
                <div className="col-6">
                  <input
                    className="form-control my-2"
                    type="text"
                    placeholder="Class Number"
                    value={classNumber}
                    required
                    onChange={(e) => setClassNumber(e.target.value)}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-6">
                  <input
                    className="form-control my-2 "
                    type="text"
                    placeholder="Class Section"
                    value={classSection}
                    required
                    onChange={(e) => setClassSection(e.target.value)}
                  />
                </div>
                <div className="col-6">
                  <button
                    type="submit"
                    className="form-control btn btn-sms my-2 btn-warning "
                  >
                    Create
                  </button>
                </div>
              </div>
            </form>
          </div>
          <div className=" mt-5">
            <h2 className="mb-5">UPDATE OR REMOVE CLASSES</h2>
            <Table responsive>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Class Name</th>
                  <th>Class</th>
                  <th>Section</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {associatedClasses.length
                  ? associatedClasses.map((item, index) => (
                      <tr key={item._id}>
                        <td>{index + 1}</td>
                        <td>{item.name}</td>
                        <td>{item.className}</td>
                        <td>{item.section}</td>
                        <td>
                          <button className="btn btn-sm btn-secondary mx-1">
                            Update
                          </button>
                          <button
                            className="btn btn-sm btn-warning"
                            onClick={() => deleteClass(item._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  : null}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddClass;
