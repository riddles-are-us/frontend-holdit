import React, {useEffect, useState} from 'react';
import {Col, Container, Row} from 'react-bootstrap';
import ReactDOM from 'react-dom';
import {AccountSlice} from 'zkwasm-minirollup-browser';
import {useAppDispatch, useAppSelector} from '../app/hooks';
import {selectUserState} from '../data/state';
import {selectHistory, getHistory, selectUIState, ModalIndicator} from '../data/ui';

export default function BetHistory(properties: {lpanel: HTMLDivElement}) {
  const l2account = useAppSelector(AccountSlice.selectL2Account);
  const history = useAppSelector(selectHistory);
  const userState = useAppSelector(selectUserState);
  const uiState = useAppSelector(selectUIState);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (l2account) {
      dispatch(getHistory(l2account!.getPrivateKey()));
    }
  }, [l2account, userState]);

  useEffect(() => {
    if (l2account) {
      dispatch(getHistory(l2account!.getPrivateKey()));
    }
  }, [l2account]);

  function content() {
    return (
    <>
      <h4>Your game history</h4>
       <Container fluid className="p-3">
         <Row className="bg-light font-weight-bold">
           <Col>Round </Col>
           <Col>Betting Amount</Col>
           <Col>Checkout Amount</Col>
         </Row>
        {history.map((item, index) => (
         <Row className="border">
           <Col>{item.round}</Col>
           <Col>{item.bet}</Col>
           <Col>{item.checkout}</Col>
         </Row>
        ))}
       </Container>
    </>
    )
  }

  return (
    <>
      {uiState.modal == ModalIndicator.HISTORY &&
      ReactDOM.createPortal(
        content(),
        properties.lpanel
      )}
    </>
  );
}
