import React, { Fragment } from 'react';
import spinner from '../../img/spinner.gif';

export default () => {
  return (
    <Fragment>
      <img
        src={spinner}
        style={{
          width: '200px',
          margin: 'auto',
          display: 'bloack',
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          alignItems: 'center',
          justifyContent: 'center'
        }}
        alt='Loading...'
      />
    </Fragment>
  );
};
