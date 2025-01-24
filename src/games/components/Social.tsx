import React from 'react';
import { MDBIcon } from 'mdb-react-ui-kit';
export default function Social() {
  return (
    <div>
      <a href='' className='me-4 text-reset'>
        <i className = "fa fa-globe" />
      </a>
      <a href='' className='me-4 text-reset'>
        <MDBIcon fab icon="twitter" />
      </a>
      <a href='' className='me-4 text-reset'>
        <i className = "fab fa-discord" />
      </a>
      <a href='' className='me-4 text-reset'>
        <MDBIcon fab icon="github" />
      </a>
    </div>
  );
}



