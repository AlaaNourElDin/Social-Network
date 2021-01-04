import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getProfile } from '../../actions/profile';
import Spinner from '../layout/spinner';

const Dashboard = ({
  getProfile,
  auth: { user },
  profile: { profile, loading }
}) => {
  useEffect(() => {
    getProfile();
  }, []);

  return loading && profile === null ? (
    <Spinner style={{ justifyContent: 'center', alignItems: 'center' }} />
  ) : (
    <Fragment>
      <h1 className='large text-primary'>Dashboard</h1>
      <p className='lead'>
        <i className='fas fa-user'></i> Welcome {user && user.name}
      </p>
      {profile !== null ? (
        <Fragment>
          <div className='dash-buttons'>
            <a href='create-profile.html' className='btn btn-light'>
              <i className='fas fa-user-circle text-primary'></i> Edit Profile
            </a>
            <a href='add-experience.html' className='btn btn-light'>
              <i className='fab fa-black-tie text-primary'></i> Add Experience
            </a>
            <a href='add-education.html' className='btn btn-light'>
              <i className='fas fa-graduation-cap text-primary'></i> Add
              Education
            </a>
          </div>
        </Fragment>
      ) : (
        <Fragment>
          <p>You don't have a profile , please add some info</p>
          <Link to='createProfile' className='btn btn-primary my-1'>
            Create Profile
          </Link>
        </Fragment>
      )}
    </Fragment>
  );
};

Dashboard.propTypes = {
  getProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile
});

export default connect(mapStateToProps, { getProfile })(Dashboard);
