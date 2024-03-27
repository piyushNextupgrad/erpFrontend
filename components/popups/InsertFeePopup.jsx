import { useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useState } from "react";
import { useMemo } from "react";
import axiosInstance from "@/axios/axios";
import { toast } from "sonner";

export function Popup({
  toggle,
  settoggle,
  setformType,
  formType,
  selectboxData,
  selectboxData2,
  fees,
  studentName,
  checkfeesStatus,
}) {
  const [newName, setnewName] = useState("");
  const [show, setShow] = useState(false);
  const [amount, setAmount] = useState("");
  const [months, setmonths] = useState([
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
  ]);

  //   useMemo(() => {
  //     setnewName(obj.sessionName);
  //   }, [obj.sessionName]);

  useEffect(() => {
    if (toggle == true) {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [toggle]);

  const handleClose = () => {
    setShow(false);

    settoggle(false);
  };
  const handleShow = () => setShow(true);

  async function payFees(event) {
    event.preventDefault();
    console.log("pay fee function hit");
    try {
      const res = await axiosInstance.post("/fee/api/insertFeeRecord", {
        classId: selectboxData2,
        studentId: studentName._id,
        sessionId: selectboxData,
        fees: { amount: amount, month: months[fees.length] },
      });
      if (res.data.success) {
        handleClose();
        toast.success("fee saved");
        setAmount("");
        checkfeesStatus(studentName._id);
      }
    } catch (err) {
      toast.error(err.message);
    }
  }
  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {studentName.first_name} {studentName.last_name}'s{" "}
            {months[fees.length]} fees deposit
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {formType == "initial" ? (
            <>
              <form onSubmit={payFees}>
                <input
                  className="form-control my-4"
                  type="text"
                  value="January"
                  disabled
                />
                <input
                  className="form-control my-2"
                  type="number"
                  placeholder="Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <button className="btn my-3 w-100  btn-danger" type="submit">
                  Pay
                </button>
                <button className="btn  w-100 btn-warning" type="reset">
                  Reset
                </button>
              </form>
            </>
          ) : formType === "mid-session" ? (
            <>
              <>
                <form onSubmit={payFees}>
                  <input
                    className="form-control my-4"
                    type="text"
                    value={months[fees.length]}
                    disabled
                  />
                  <input
                    className="form-control my-2"
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />

                  <button className="btn my-3 w-100  btn-danger" type="submit">
                    Pay
                  </button>
                  <button className="btn  w-100 btn-warning" type="reset">
                    Reset
                  </button>
                </form>
              </>
            </>
          ) : null}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
