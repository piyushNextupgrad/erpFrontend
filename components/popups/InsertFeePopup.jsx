import { useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useState } from "react";
import { useMemo } from "react";

export function Popup({ toggle, settoggle }) {
  const [newName, setnewName] = useState("");
  const [show, setShow] = useState(false);

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
  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Update session</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Type the new name for session</p>
          {/* <form>
            <input
              value={newName}
              type="text"
              placeholder="sesion name"
              className="form-control"
            />
          </form> */}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="danger">Update</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
