import React, { useState } from "react";
import { selectUserState } from "../data/holdit/properties";
import {
  ResourceType,
} from "../data/holdit/models";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { sendTransaction } from "../games/request";
import { getWithdrawTransactionCommandArray } from "../games/rpc";
import { AccountSlice } from "zkwasm-minirollup-browser";
import { selectResource } from "../data/holdit/resources";
import { Alert, Modal, Button, InputGroup, Form, Spinner } from "react-bootstrap";
import { formatErrorMessage } from "../utils/errorMessage";

interface Props {
  isWithdraw: boolean;
  setResultModal: React.Dispatch<React.SetStateAction<boolean>>;
  setInfoMessage: React.Dispatch<React.SetStateAction<string>>;
  show: boolean;
  onClose: () => void;
}

export const WithdrawModal = ({
  isWithdraw,
  setResultModal,
  setInfoMessage,
  show,
  onClose
}: Props) => {
  const dispatch = useAppDispatch();
  const userState = useAppSelector(selectUserState);
  const l2account = useAppSelector(AccountSlice.selectL2Account);
  const l1account = useAppSelector(AccountSlice.selectL1Account);
  const [amount, setAmount] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const titaniumCount = useAppSelector(selectResource(ResourceType.Titanium));
  const [isExecuting, setIsExecuting] = useState(false);

  const withdraw = (amount: number) => {
    if(!l1account) {
      throw new Error("You have not yet obtained a mainchain account (Layer 1 account). Please click the 'CONNECT' button in the top right corner of the page to create an account on the mainchain to proceed with transactions.");
    }

    if(!l2account) {
      throw new Error("You have not yet obtained a sidechain account (Layer 2 account). Please click the 'LOGIN APPS' button in the top right corner of the page to create an account on the sidechain to proceed with transactions.");
    }

    dispatch(
      sendTransaction({
        cmd: getWithdrawTransactionCommandArray(
          BigInt(userState!.player!.nonce),
          BigInt(amount),
          l1account!
        ),
        prikey: l2account!.address,
      })
    ).then((action) => {
      if (sendTransaction.fulfilled.match(action)) {
        const current_balance = action.payload.player.data.balance;
        setResultModal(true);
        setInfoMessage("Withdraw Success: current balance is " +  current_balance);
        setIsExecuting(false);
        closeModal();
      } else if(sendTransaction.rejected.match(action)) {
        setErrorMessage("Withdraw Error: " +  action.payload);
        setIsExecuting(false);
      }
    })
  };

  const deposit = (amount: string) => {
    if(!l1account) {
      throw new Error("You have not yet obtained a mainchain account (Layer 1 account). Please click the 'CONNECT' button in the top right corner of the page to create an account on the mainchain to proceed with transactions.");
    }

    if(!l2account) {
      throw new Error("You have not yet obtained a sidechain account (Layer 2 account). Please click the 'LOGIN APPS' button in the top right corner of the page to create an account on the sidechain to proceed with transactions.");
    }

    dispatch(
      AccountSlice.depositAsync({
        tokenIndex: 0,
        amount: Number(BigInt(amount)),
        l2account: l2account!,
        l1account: l1account!,
      })
    ).then((action) => {
      if (AccountSlice.depositAsync.fulfilled.match(action)) {
        setInfoMessage("Deposit Success: " +  action.payload!.hash);
        setResultModal(true);
        setIsExecuting(false);
        closeModal();
      } else if (AccountSlice.depositAsync.rejected.match(action)) {
        if (action.error.message == null) {
          setErrorMessage("Deposit Failed: Unknown Error");
          setIsExecuting(false);
        } else if (action.error.message.startsWith("user rejected action")) {
          setErrorMessage("Deposit Failed: User rejected action");
          setIsExecuting(false);
        } else {
          setErrorMessage("Deposit Failed: " + action.error.message);
          setIsExecuting(false);
        }
      }
    });
  };

  const onConfirm = async () => {
    try {
      setErrorMessage("");

      if (!amount) {
        throw new Error("The amount is missing");
      }

      if (isWithdraw) {
        if (Number(amount) > titaniumCount) {
          setErrorMessage("Not Enough Titanium");
        } else {
          setErrorMessage("");
          setIsExecuting(true);
          withdraw(Number(amount));
        }
      } else {
        setIsExecuting(true);
        deposit(amount);
      }
    } catch (error) {
      const err = formatErrorMessage(error);
      setErrorMessage(`Error: ${err}`);
      setIsExecuting(false);
    }
  }

  const closeModal = () => {
    setAmount("");
    setErrorMessage("");
    onClose();
  }

  return (
    <Modal show={show} onHide={closeModal} backdrop="static" style={{ zIndex: 1051 }}>
      <Modal.Header closeButton>
        <Modal.Title>{isWithdraw ? "Withdraw" : "Deposit"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        <InputGroup className="mb-3">
          <Form.Control
            type="number"
            placeholder={"Please enter amount"}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0"
            required
          />
        </InputGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={closeModal}>
          Close
        </Button>
        <Button variant="primary" onClick={onConfirm} disabled={isExecuting}>
          {isExecuting ? <Spinner animation="border" size="sm" /> : "Confirm"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};