import { useState, useEffect } from "react";
import Error from "./Error";
import {
  Navbar,
  Nav,
  Card,
  Container,
  Row,
  Col,
  Button,
} from "react-bootstrap";

import { ethers } from "ethers";
import { COUNTER_ABI, COUNTER_ADDRESS } from "./contracts/config";

function Counter() {
  const [count, setCount] = useState("-");
  const [iserror, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  useEffect(() => {
    fetchCount();
  });

  // request access to the user's MetaMask account
  async function requestAccount() {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
    } catch (error) {
      setIsError(true);
      setErrorMessage(error.toString());
    }
  }

  // call the smart contract, read the current greeting value
  async function fetchCount() {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        COUNTER_ADDRESS,
        COUNTER_ABI,
        provider
      );
      try {
        const data = await contract.getCount();
        setCount(data.toString());
      } catch (err) {
        console.log("Error: ", err);
        setErrorMessage(err.toString());
      }
    }
  }

  // call the smart contract, send an update
  async function incrementCounter() {
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        COUNTER_ADDRESS,
        COUNTER_ABI,
        signer
      );
      const transaction = await contract.increment();
      await transaction.wait();
      fetchCount();
    }
  }

  async function decrementCounter() {
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        COUNTER_ADDRESS,
        COUNTER_ABI,
        signer
      );
      const transaction = await contract.decrement();
      await transaction.wait();
      fetchCount();
    }
  }

  return (
    <Container>
      {iserror && <Error message={errorMessage} />}
      <Navbar>
        <Container>
          <Navbar.Brand href="" className="justify-content-end"></Navbar.Brand>
          <Nav className="justify-content-end">
            <Nav.Item>
              <Button
                variant="secondary"
                onClick={requestAccount}
                disabled={
                  window.ethereum && window.ethereum.selectedAddress !== null
                }
              >
                Connect Wallet
              </Button>
            </Nav.Item>
          </Nav>
        </Container>
      </Navbar>
      <Card>
        <Container
          className="d-flex align-items-center justify-content-center"
          style={{ height: "400px" }}
        >
          <Row className="m-auto">
            <Col>
              <Button variant="dark" onClick={decrementCounter}>
                -
              </Button>
            </Col>
            <Col>
              <Button variant="info" size="lg" disabled>
                {count}
              </Button>
            </Col>
            <Col>
              <Button variant="dark" onClick={incrementCounter}>
                +
              </Button>
            </Col>
          </Row>
        </Container>
      </Card>
    </Container>
  );
}

export default Counter;
