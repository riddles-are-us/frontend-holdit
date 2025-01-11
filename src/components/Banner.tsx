import React from 'react';
import { MDBCarousel, MDBCarouselItem, MDBCarouselCaption } from 'mdb-react-ui-kit';
import kickstart from '../images/kickstart.png';
import host from '../images/host.png';

export default function Banner() {
  return (
    <MDBCarousel showIndicators showControls fade>
      <MDBCarouselItem itemId={1}>
        <img src={host} className='d-block w-100' alt='...' style={{height:"200px"}} />
        <MDBCarouselCaption>
          <h5 style={{color:"#333"}}>move browser application on chain</h5>
          <p style={{color:"#333"}}> Transform offchain application to a fully trustless ZKWASM rollup.</p>
        </MDBCarouselCaption>
      </MDBCarouselItem>
      <MDBCarouselItem itemId={2}>
        <img src={kickstart} className='d-block w-100' alt='...' style={{height:"200px"}} />
        <MDBCarouselCaption>
          <h5 style={{color:"#333"}}>kick starting small projects</h5>
          <p style={{color:"#333"}}>There is no idea to small to start, start it now, start it trustlessly.</p>
        </MDBCarouselCaption>
      </MDBCarouselItem>
    </MDBCarousel>
  );
}
