import React from "react";
import { Alert, Modal, Button } from "react-bootstrap";
import "./style.scss";

interface Props {
  isWithdraw: boolean;
  infoMessage: string;
  setInfoMessage: React.Dispatch<React.SetStateAction<string>>;
  show: boolean;
  onClose: () => void;
}

export const ResultModal = ({ isWithdraw, infoMessage, setInfoMessage, show, onClose }: Props) => {
  const closeModal = () => {
    setInfoMessage("");
    onClose();
  }

  return (
    <Modal show={show} onHide={closeModal} backdrop="static" style={{ zIndex: 1051 }}>
      <Modal.Header closeButton>
        <Modal.Title>{isWithdraw ? "Withdraw" : "Deposit"} Result</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {infoMessage && <Alert variant="primary">{infoMessage}</Alert>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={closeModal}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};