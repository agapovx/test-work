import * as React from "react";

const BouncePreloader: React.SFC<{}> = () => {
  return (
    <div className="preloader-spinner">
      <div className="ps_bounce-one" />
      <div className="ps_bounce-two" />
    </div>
  );
};

export default BouncePreloader;
