import React, { useState } from 'react';
import { ConnectButton, LoginButton } from "../components/Connect";
import {
  MDBContainer,
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarToggler,
  MDBIcon,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBCollapse,
} from 'mdb-react-ui-kit';
import {AccountSlice} from "zkwasm-minirollup-browser";
import { useAppSelector } from "../../app/hooks";
import { WithdrawModal } from "../../modals/WithdrawModal";
import { ResultModal } from "../../modals/ResultModal";

export default function Nav() {
  const [withdrawModal, setWithdrawModal] = useState(false);
  const [isWithdraw, setIsWithdraw] = useState(false);
  const [resultModal, setResultModal] = useState(false);
  const [openBasic, setOpenBasic] = useState(false);
  const [infoMessage, setInfoMessage] = useState("");
  const l1account = useAppSelector(AccountSlice.selectL1Account);

  const onClickDeposit = () => {
    setWithdrawModal(true);
    setIsWithdraw(false);
  };

  const onClickWithdraw = () => {
    setWithdrawModal(true);
    setIsWithdraw(true);
  };

  return (
    <MDBNavbar expand='lg' light bgColor='light'>
      <MDBContainer fluid>
        <MDBNavbarBrand href='#'>Hold Firmly</MDBNavbarBrand>

        <MDBNavbarToggler
          aria-controls='navbarSupportedContent'
          aria-expanded='false'
          aria-label='Toggle navigation'
          onClick={() => setOpenBasic(!openBasic)}
        >
          <MDBIcon icon='bars' fas />
        </MDBNavbarToggler>

        <MDBCollapse navbar open={openBasic}>
          <MDBNavbarNav className='mr-auto mb-2 mb-lg-0'>
            <MDBNavbarItem>
              <MDBNavbarLink active aria-current='page' onClick={onClickDeposit}>
                Deposit
              </MDBNavbarLink>
            </MDBNavbarItem>
            <MDBNavbarItem>
              <MDBNavbarLink active aria-current='page' onClick={onClickWithdraw}>
                Withdraw
              </MDBNavbarLink>
            </MDBNavbarItem>
          </MDBNavbarNav>
        </MDBCollapse>
        <ConnectButton handleRestart={()=>{return;}}></ConnectButton>
        <LoginButton handleRestart={()=>{return;}}></LoginButton>
      </MDBContainer>
      <WithdrawModal
        isWithdraw={isWithdraw}
        setResultModal={setResultModal}
        setInfoMessage={setInfoMessage}
        show={withdrawModal}
        onClose={() => setWithdrawModal(false)}/>
      <ResultModal
        isWithdraw={isWithdraw}
        infoMessage={infoMessage}
        setInfoMessage={setInfoMessage}
        show={resultModal}
        onClose={() => setResultModal(false)}/>
    </MDBNavbar>
  );
}
