import {ReactNode} from "react"
import {Button, Card} from "react-bootstrap"
import Social from "../components/Social"
import automata32 from "../images/automata/automata3-2.png"
import automata11 from "../images/automata/automata1-1.png"
import automata21 from "../images/automata/automata2-1.png"

export interface CardIProps {
  logo: string,
  title: string,
  links: {
    discord: string | undefined,
    twitter: string | undefined,
    telegram: string | undefined,
    landingPage: string | undefined,
    prover: string | undefined,
  },
  chain: {
    name: string,
    contracts: {
      token: {
        name: string,
        address: string,
      },
      settlement: string,
      nft: string,
    }
  },
  stage: string[],
  exchangers: string[],
  screenshots: string[],
}

export function FeaturedLaunched(card: {props: CardIProps, children: ReactNode}) {
  return(
    <Card>
      <Card.Img variant="top" src={automata32} style={{border: "None"}}/>
      <Card.Body>
        <Card.Title>{card.props.title}</Card.Title>
          <Social></Social>
          <div>website: card.props.landingPage</div>
          <div>prover history: explorer.zkwasmhub.com</div>
          <div>delpoyed on: {card.props.chain.name} </div>
          <div>contract name: {card.props.chain.contracts.token.name} </div>
          <div>contract address: {card.props.chain.contracts.token.address} </div>
        <Card.Text>
          {card.children}
        </Card.Text>
        <Button variant="primary">Launch App</Button>
      </Card.Body>
  </Card>
  )
}

export function FeaturedTestnet(card: {props: CardIProps, children: ReactNode}) {
  return(
    <Card>
      <Card.Img variant="top" src={automata21} style={{border: "None"}}/>
      <Card.Body>
        <Card.Title>{card.props.title}</Card.Title>
          <Social></Social>
          <div>Website: {card.props.links.landingPage}</div>
          <div>Prover explorer: explorer.zkwasmhub.com</div>
          <div>Delpoyed on: {card.props.chain.name} </div>
          <div>Token name: {card.props.chain.contracts.token.name} </div>
          <div>Settlement contract: {card.props.chain.contracts.token.address} </div>
        <Card.Text>
          {card.children}
        </Card.Text>
        <Button variant="primary">Launch App</Button>
      </Card.Body>
  </Card>
  )
}

export function FeaturedComingSoon(card: {props: CardIProps, children: ReactNode}) {
  return(
    <Card>
      <Card.Img variant="top" src={automata11} style={{border: "None"}}/>
      <Card.Body>
        <Card.Title>{card.props.title}</Card.Title>
          <Social></Social>
          <div>website: card.props.landingPage</div>
        <Card.Text>
          {card.children}
        </Card.Text>
        <Button variant="primary">Donate</Button>
      </Card.Body>
  </Card>
  )
}
