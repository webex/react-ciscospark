import {
  lifecycle,
  compose
} from 'recompose';
import {createSelector} from 'reselect';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {setWrappedDisplayName} from '@webex/react-component-utils';
import {fetchCurrentUser} from '@webex/redux-module-users';

const getUsers = (state) => state.users;

const getCurrentUser = createSelector(
  [getUsers], (users) => {
    const currentUserId = users.get('currentUserId');

    return {
      currentUser: users.getIn(['byId', currentUserId])
    };
  }
);

function fetchUser(props) {
  const {spark, users} = props;

  if (spark &&
    spark.getIn(['status', 'registered']) &&
    !users.get('currentUserId')
  ) {
    /* eslint-disable no-warning-comments */
    // TODO rename sparkInstance to sdkInstance
    /* eslint-enable no-warning-comments */
    const sparkInstance = spark.get('spark');

    // pass on boolean to disable presence call conditionally
    props.fetchCurrentUser(sparkInstance, props.disablePresence);
  }
}

export default compose(
  setWrappedDisplayName('WithCurrentUser'),
  connect(
    getCurrentUser,
    (dispatch) => bindActionCreators({
      fetchCurrentUser
    }, dispatch)
  ),
  lifecycle({
    componentDidMount() {
      fetchUser(this.props);
    },
    componentWillReceiveProps(nextProps) {
      fetchUser(nextProps);
    }
  })
);
