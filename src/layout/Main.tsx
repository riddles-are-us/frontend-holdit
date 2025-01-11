/* eslint-disable */
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import { FeaturedLaunched, FeaturedComingSoon, FeaturedTestnet } from "../components/Featured";
import "./style.scss";
import {Container, Row, Col} from "react-bootstrap";
import Footer from "../components/Foot";
import Nav from "../components/Nav";
import Banner from "../components/Banner";

const memeDisco = {
  logo: "test.png",
  title: "MemeDisco",
  links: {
    discord: "testdiscord",
    twitter: "testdiscord",
    telegram: "testdiscord",
    prover: "https://explorer.zkwasmhub.com/task/677790b57893e0306e5ad35c",
    landingPage: "landingpage.html",
  },
  chain: {
    name: "BSC",
    contracts: {
      token: {
        name: "MMD",
        address: "0xfffffffffffffff13124151515",
      },
      settlement: "0xfffffffffffffff13124151515",
      nft: "NA"
    },
  },
  stage: ["launched", "listed"],
  exchangers: ["mexc", "bitmart"],
  screenshots: ["screenshot1.png"],
}

export function Main() {
  return (
    <>
      <Nav/>
      <Container>
      <Row className="mt-5">
      <Banner></Banner>
      </Row>
      <Row className="mt-5">Ready to play</Row>
      <Row>
      <Col>
      <FeaturedLaunched props = {memeDisco}>
        description here
      </FeaturedLaunched>
      </Col>
      <Col>
      <FeaturedLaunched props = {memeDisco}>
        description here
      </FeaturedLaunched>
      </Col>
      <Col>
      <FeaturedLaunched props = {memeDisco}>
        description here
      </FeaturedLaunched>
      </Col>
      </Row>
      <Row className="mt-5">Testnet and launch soon</Row>
      <Row>
      <Col>
      <FeaturedTestnet props = {memeDisco}>
        description here
      </FeaturedTestnet>
      </Col>
      <Col>
      <FeaturedTestnet props = {memeDisco}>
        description here
      </FeaturedTestnet>
      </Col>
      </Row>
      <Row className="mt-5">Kick start</Row>
      <Row>
      <Col>
      <FeaturedComingSoon props = {memeDisco}>
        description here
      </FeaturedComingSoon>
      </Col>
      <Col>
      <FeaturedComingSoon props = {memeDisco}>
        description here
      </FeaturedComingSoon>
      </Col>
      <Col>
      <FeaturedComingSoon props = {memeDisco}>
        description here
      </FeaturedComingSoon>
      </Col>
      <Col>
      <FeaturedComingSoon props = {memeDisco}>
        description here
      </FeaturedComingSoon>
      </Col>
      </Row>
      </Container>
      <Footer/>
    </>
  );
}
