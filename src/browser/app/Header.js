// @flow
import type { State, User } from '../../common/types';
import React from 'react';
import linksMessages from '../../common/app/linksMessages';
import { Box } from '../../common/components';
import { FormattedMessage } from 'react-intl';
import { Link } from '../components';
import { compose } from 'ramda';
import { connect } from 'react-redux';

const HeaderLink = ({ to, message, ...props }) => (
  <FormattedMessage {...message}>
    {message => (
      <Link
        backgroundColor="primary"
        bold
        color="white"
        paddingHorizontal={0.5}
        paddingVertical={0.5}
        to={to}
        {...props}
      >
        {message}
      </Link>
    )}
  </FormattedMessage>
);

type HeaderProps = {
  viewer: ?User,
};

const Header = ({ viewer }: HeaderProps) => (
  <Box
    backgroundColor="primary"
    flexWrap="wrap"
    flexDirection="row"
    marginVertical={0.5}
    paddingHorizontal={0.5}
  >
    <HeaderLink exact to="/" message={linksMessages.home} />
    <HeaderLink to="/heroes" message={linksMessages.heroes} />
    <HeaderLink to="/heroes-broken" message={linksMessages.heroesBroken} />
    {!viewer && <HeaderLink to="/signin" message={linksMessages.signIn} />}
  </Box>
);

export default compose(
  connect((state: State) => ({ viewer: state.users.viewer })),
)(Header);
