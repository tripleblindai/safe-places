import React from "react";
import "./_empty.scss";
import classNames from "classnames";

const Empty = ({ button, className, children, icon, kind, title }) => {
  const emptyClasses = classNames(
    {
      empty: true,
      "empty--large": kind === "large",
      "empty--section": kind === "section"
    },
    className
  );

  return (
    <div className={emptyClasses}>
      <div className="empty__icon">{icon}</div>
      <div className="empty__text">
        {title && <h2>{title}</h2>}
        <p>{children}</p>
      </div>
      <div className="empty__button">{button}</div>
    </div>
  );
};

export default Empty;
