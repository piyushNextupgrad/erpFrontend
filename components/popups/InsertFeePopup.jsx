import { useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useState } from "react";
import { useMemo } from "react";
import axiosInstance from "@/axios/axios";
import { toast } from "sonner";
import Swal from "sweetalert2";

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
  const [fee, setFees] = useState([]);
  const [remainingMonths, setremainingMonths] = useState([]);
  const [totalFees, settotalFees] = useState(0);
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
  console.log("form type", formType);

  useEffect(() => {
    if (remainingMonths.length > 0) {
      console.log("rem months", remainingMonths);
      setFees(Array(remainingMonths.length).fill(null));
    }
  }, [remainingMonths]);

  useEffect(() => {
    console.log("fee", fee);
  }, [fee]);

  useEffect(() => {
    if (toggle == true) {
      const monthSlice = months.slice(fees.length, months.length);
      setremainingMonths(monthSlice);
      setShow(true);
    } else {
      setShow(false);
    }
  }, [toggle]);

  const handleClose = () => {
    setFees([]);
    setShow(false);
    settotalFees(0);
    settoggle(false);
  };
  const handleShow = () => setShow(true);

  function payFees(event) {
    event.preventDefault();
    Swal.fire({
      title: "Warning",
      text: "Are you sure you want to pay fees. Please verify once again as you wont be able to modify the fees record again and it will be permanent.",
      showDenyButton: true,
      icon: "warning",

      confirmButtonText: "Yes Pay",
      denyButtonText: `Don't Pay`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        finallyPay();
      } else if (result.isDenied) {
        toast.success("Cancelled");
      }
    });

    async function finallyPay() {
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
  }

  const handleFeeChange = (index, value, month) => {
    const updatedFees = [...fee];
    updatedFees[index] = { month: month, amount: value };
    setFees(updatedFees);
  };

  function getTotal(event) {
    event.preventDefault();
    if (fee.length) {
      let sum = 0;
      fee.forEach((item, index) => {
        if (item != null) {
          sum = sum + parseFloat(item.amount);
        }
      });
      if (sum) {
        settotalFees(sum);
      }
    }
  }

  async function payCustomFees() {
    console.log("custom fees form", fee);
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
            {studentName.first_name} {studentName.last_name}'s fee deposit
            {/* {months[fees.length]} fees deposit */}
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
          ) : (
            <>
              <form onSubmit={payCustomFees}>
                {console.log("remaining months length", remainingMonths)}
                {remainingMonths.map((item, index) => (
                  <div key={index} className="row customFeeForm">
                    <div className="col-3 my-2">{item}</div>
                    <div className="col-3 my-2">
                      <input
                        className="form-control"
                        type="number"
                        value={fee.length ? fee[index]?.amount : null}
                        onChange={(e) =>
                          handleFeeChange(index, e.target.value, item)
                        }
                        placeholder="Amount"
                      />
                    </div>
                  </div>
                ))}
                <div className="row ps-5 my-3">
                  <div className="col-4 ps-4">
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={getTotal}
                    >
                      Generate Total
                    </button>
                  </div>
                  <div className="col-6 ps-4">
                    <span>
                      Total - {totalFees} &nbsp;
                      <span>Rounded Off to - {Math.round(totalFees)}</span>
                    </span>
                  </div>
                </div>

                {totalFees != 0 ? (
                  <button
                    className="btn btn-sm my-3 w-100  btn-danger"
                    type="submit"
                  >
                    Pay
                  </button>
                ) : null}
              </form>
            </>
          )}
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
