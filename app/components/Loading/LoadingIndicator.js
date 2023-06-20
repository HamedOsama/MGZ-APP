import React from 'react';
import * as Progress from 'react-native-progress';

const ProgressBar = (props) => {
  return (
    <Progress.Bar
      width={null}
      borderRadius={0}
      color="#57C696"
      height={props.height || 0}
      borderColor="white"
      style={{ backgroundColor: 'white', ...(props.styles || {}) }}
      {...props}
    />
  );
};

const LoadingIndicator = ({ loading }) => {
  if (loading) return <ProgressBar height={3} indeterminate indeterminateAnimationDuration={1200} />;

  return <ProgressBar progress={0} />;
};

export default LoadingIndicator;
