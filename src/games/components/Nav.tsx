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
  MDBBtn,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
  MDBCollapse,
} from 'mdb-react-ui-kit';
import {AccountSlice} from "zkwasm-minirollup-browser";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  selectIsLoading,
  setUIState,
  UIState,
} from "../../data/holdit/properties";

export default function Nav() {
  const [depositModal, setDepositModal] = useState(false);
  const [withdrawModal, setWithdrawModal] = useState(false);
  const [openBasic, setOpenBasic] = useState(false);
  const l1account = useAppSelector(AccountSlice.selectL1Account);
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectIsLoading);
  
  //const isLoading = uiState == UIState.Loading;

  const onClickWithdraw = () => {
    if (!isLoading) {
      dispatch(setUIState(UIState.WithdrawPopup));
    }
  };

  const onClickDeposit = () => {
    if (!isLoading) {
      dispatch(setUIState(UIState.DepositPopup));
    }
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
    </MDBNavbar>
  );
}
