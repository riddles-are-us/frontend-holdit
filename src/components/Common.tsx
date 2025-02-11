import React, { useState } from "react";
import ReactDOM from "react-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { sendTransaction } from "../request";
import { AccountSlice } from "zkwasm-minirollup-browser";
import { Alert, Modal, Button, InputGroup, Form, Spinner } from "react-bootstrap";
import {PlayerInfo, selectUserState} from "../data/state";
import {createWithdrawCommand} from "zkwasm-minirollup-rpc";
import {ModalIndicator, selectUIResponse, selectUIState, setUIResponse, setUIState} from "../data/ui";

interface Props {
  handleClose: () => void;
  balanceOf: (info: PlayerInfo) => number;
  lpanel: HTMLDivElement;
}

export const formatErrorMessage = (error: any): string => {
  const fullMessage = error.message || "Unknown error";
  const message = fullMessage.replace(/\([^)]*\)/g, "");
  if (message) {
    return message;

  } else {
    return fullMessage.Error;
  }
};

const CMD_WITHDRAW = 5n;

function getWithdrawTransactionCommandArray(nonce: bigint, amount: bigint, account: AccountSlice.L1AccountInfo): BigUint64Array {
  const address = account!.address.slice(2);
  const command = createWithdrawCommand(
          nonce,
          CMD_WITHDRAW,
          address,
          0n,
          amount
  );
  return command;
}

export const WithdrawModal = ({
  handleClose,
  balanceOf,
  lpanel
}: Props) => {

  const dispatch = useAppDispatch();
  const userState = useAppSelector(selectUserState);
  const uiState = useAppSelector(selectUIState);
  const lastResponse = useAppSelector(selectUIResponse);
  const l2account = useAppSelector(AccountSlice.selectL2Account);
  const l1account = useAppSelector(AccountSlice.selectL1Account);
  const [amount, setAmount] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);


  const handleResult = (msg: string) => {
    dispatch(setUIResponse(msg));
    dispatch(setUIState({modal: ModalIndicator.RESPONSE}));
  }


  const withdraw = (amount: number) => {
    dispatch(
      sendTransaction({
        cmd: getWithdrawTransactionCommandArray(
          BigInt(userState!.player!.nonce),
          BigInt(amount),
          l1account!
        ),
        prikey: l2account!.getPrivateKey(),
      })
    ).then((action) => {
      if (sendTransaction.fulfilled.match(action)) {
        handleResult("Withdraw successed");
        setIsExecuting(false);
        setErrorMessage("");
      } else if(sendTransaction.rejected.match(action)) {
        setErrorMessage("Withdraw Error: " +  action.payload);
        setIsExecuting(false);
      }
    })
  };

  const deposit = (amount: string) => {
    dispatch(
      AccountSlice.depositAsync({
        tokenIndex: 0,
        amount: Number(BigInt(amount)),
        l2account: l2account!,
        l1account: l1account!,
      })
    ).then((action) => {
      if (AccountSlice.depositAsync.fulfilled.match(action)) {
        setIsExecuting(false);
        handleResult("Deposit Success: " +  action.payload!.hash);
      } else if (AccountSlice.depositAsync.rejected.match(action)) {
        if (action.error.message == null) {
          setErrorMessage("Deposit Failed: Unknown Error");
        } else if (action.error.message.startsWith("user rejected action")) {
          setErrorMessage("Deposit Failed: User rejected action");
        } else {
          setErrorMessage("Deposit Failed: " + action.error.message);
        }
        setIsExecuting(false);
      }
    });
  };

  const onConfirm = async () => {
    try {
      setErrorMessage("");
      if (!amount) {
        throw new Error("The amount is missing");
      }

      if (uiState.modal == ModalIndicator.WITHDRAW) {
        if (Number(amount) > balanceOf(userState!.player!)) {
          setErrorMessage("Not Enough Balance");
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
    handleClose();
  }

  const proxyAddr = process.env.REACT_APP_DEPOSIT_CONTRACT!;
  const tokenAddr = process.env.REACT_APP_TOKEN_CONTRACT!;

  return (
    <>
    {uiState.modal == ModalIndicator.RESPONSE &&
      ReactDOM.createPortal(
      (<div style={{margin: "20px 40px 20px 20px"}}>
          {lastResponse}
      </div>),
      lpanel
    )}
    {(uiState.modal == ModalIndicator.WITHDRAW || uiState.modal == ModalIndicator.DEPOSIT) &&
      ReactDOM.createPortal(
      (<div style={{margin: "20px 40px 20px 20px"}}>
        <Modal.Header>
          <Modal.Title>{uiState.modal == ModalIndicator.WITHDRAW ? "Withdraw" : "Deposit"}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="mt-2">
          <Alert>Game contract {proxyAddr}</Alert>
          <Alert>Token contract {tokenAddr}</Alert>

          {uiState.modal == ModalIndicator.DEPOSIT &&
          <p> Please provide the amout you want to deposit:
            (there will be a small delay for the game server to notice your deposit)
          </p>
          }
          {uiState.modal == ModalIndicator.WITHDRAW &&
          <p> Please provide the amout you want to withdraw:
            (there will be a small delay for the withdraw to be settled through the game contract)
          </p>
          }
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
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={onConfirm} disabled={isExecuting}>
            {isExecuting ? <Spinner animation="border" size="sm" /> : "Confirm"}
          </Button>
        </Modal.Footer>
      </div>),
      lpanel
    )}
    </>
  );
};
